const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/properties
// @desc    Get all properties with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      area,
      type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      status,
      listingType,
      amenities,
      featured,
      section,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (area) filter['location.area'] = new RegExp(area, 'i');
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (listingType) filter.listingType = listingType;
    if (featured) filter.featured = featured === 'true';
    if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
    
    // Section targeting filter
    if (section) {
      filter[`sections.${section}`] = true;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Area range
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }

    // Amenities
    if (amenities) {
      const amenityList = amenities.split(',');
      filter.amenities = { $in: amenityList };
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const properties = await Property.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/properties/featured
// @desc    Get featured properties
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const properties = await Property.find({ 'sections.featured': true, isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/properties/section/:sectionName
// @desc    Get properties by section (buy, rent, newProjects, commercial, homepage)
// @access  Public
router.get('/section/:sectionName', async (req, res) => {
  try {
    const { sectionName } = req.params;
    const { limit = 12 } = req.query;
    
    const validSections = ['homepage', 'buy', 'rent', 'newProjects', 'commercial', 'featured', 'premium', 'trending'];
    
    if (!validSections.includes(sectionName)) {
      return res.status(400).json({ success: false, message: 'Invalid section name' });
    }
    
    const properties = await Property.find({ 
      [`sections.${sectionName}`]: true, 
      isActive: true 
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: properties,
      section: sectionName
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/properties/cities
// @desc    Get all cities with property count
// @access  Public
router.get('/meta/cities', async (req, res) => {
  try {
    const cities = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: cities.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/properties/ai-match
// @desc    AI-powered property matching based on user preferences
// @access  Public
router.get('/ai-match', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, propertyType } = req.query;
    
    const filter = { isActive: true };
    
    // City filter
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Bedrooms filter
    if (bedrooms) {
      const bedroomValues = bedrooms.split(',').map(b => parseInt(b.trim()));
      filter.bedrooms = { $in: bedroomValues };
    }
    
    // Property type filter
    if (propertyType) {
      const types = propertyType.split(',').map(t => new RegExp(t.trim(), 'i'));
      filter.propertyType = { $in: types };
    }
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: properties,
      count: properties.length,
      filters: { city, minPrice, maxPrice, bedrooms, propertyType }
    });
  } catch (error) {
    console.error('AI match error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment view count
    property.analytics.views += 1;
    property.analytics.lastViewed = new Date();
    await property.save();

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      createdBy: req.user.id
    });

    await property.save();

    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Error creating property:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property (soft delete)
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Delete all files in the unit folder from DigitalOcean Spaces
    try {
      const { listKeysInFolder } = require('../config/digitalocean-list');
      const { deleteMultipleFromSpaces } = require('../config/digitalocean');
      // Use property._id as the unit folder name
      const folder = `properties/${property._id}`;
      const keys = await listKeysInFolder(folder);
      if (keys.length > 0) {
        await deleteMultipleFromSpaces(keys);
      }
    } catch (err) {
      console.error('Error deleting property folder from Spaces:', err);
    }

    res.json({
      success: true,
      message: 'Property and all unit images deleted from storage.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/properties/:id/interest
// @desc    Register interest in property
// @access  Public
router.post('/:id/interest', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.analytics.leads += 1;
    await property.save();

    res.json({
      success: true,
      message: 'Interest registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

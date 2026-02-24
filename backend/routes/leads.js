const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Property = require('../models/Property');
const Customer = require('../models/Customer');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/leads
// @desc    Get all leads with filters
// @access  Private (Admin/Agent)
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      source,
      startDate,
      endDate,
      search
    } = req.query;

    const filter = {};

    // Agents can only see their assigned leads
    if (req.user.role === 'agent') {
      filter.assignedTo = req.user.id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo && req.user.role !== 'agent') filter.assignedTo = assignedTo;
    if (source) filter.source = source;

    // Date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Search by name, email, or phone
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const leads = await Lead.find(filter)
      .populate('property', 'title images location price')
      .populate('assignedTo', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Lead.countDocuments(filter);

    // Get status counts for dashboard
    const statusCounts = await Lead.aggregate([
      { $match: req.user.role === 'agent' ? { assignedTo: req.user._id } : {} },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: leads,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leads/dashboard
// @desc    Get leads dashboard stats
// @access  Private (Admin)
router.get('/stats/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    const [
      totalLeads,
      newLeads,
      convertedLeads,
      recentLeads,
      leadsBySource,
      leadsByStatus
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'converted' }),
      Lead.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        convertedLeads,
        recentLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0,
        leadsBySource,
        leadsByStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leads/:id
// @desc    Get single lead
// @access  Private (Admin/Agent)
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('property')
      .populate('assignedTo', 'name email phone')
      .populate('notes.createdBy', 'name');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check if agent has access
    if (req.user.role === 'agent' && lead.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/leads
// @desc    Create new lead
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, propertyId, message, source, budget, requirements } = req.body;

    let property = null;
    
    // Only validate property if propertyId is provided
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }
    }

    const lead = new Lead({
      name,
      email,
      phone,
      property: propertyId || undefined,
      message,
      source: source || 'website',
      budget,
      requirements
    });

    await lead.save();

    // Update property lead count only if property exists
    if (property) {
      property.analytics.leads += 1;
      await property.save();
    }

    // Automatically create customer record from lead
    try {
      await Customer.findOrCreateCustomer({
        name,
        email,
        phone,
        source: source || 'website',
        notes: property 
          ? `Property: ${property.title}. Lead message: ${message || 'No message provided'}`
          : `Contact form inquiry. Message: ${message || 'No message provided'}`
      });
      console.log('Customer record created from lead:', { name, email, phone });
    } catch (customerError) {
      console.error('Error creating customer from lead:', customerError);
    }

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Thank you for your interest! Our team will contact you soon.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private (Admin/Agent)
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check if agent has access
    if (req.user.role === 'agent' && lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leads/:id/status
// @desc    Update lead status
// @access  Private (Admin/Agent)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check if agent has access
    if (req.user.role === 'agent' && lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    lead.status = status;

    if (status === 'converted') {
      lead.convertedAt = new Date();
    }

    if (note) {
      lead.notes.push({
        text: `Status changed to ${status}. ${note}`,
        createdBy: req.user.id
      });
    }

    await lead.save();

    res.json({
      success: true,
      data: lead,
      message: 'Status updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/leads/:id/notes
// @desc    Add note to lead
// @access  Private (Admin/Agent)
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { text } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check if agent has access
    if (req.user.role === 'agent' && lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    lead.notes.push({
      text,
      createdBy: req.user.id
    });

    await lead.save();

    res.json({
      success: true,
      data: lead,
      message: 'Note added successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete lead
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

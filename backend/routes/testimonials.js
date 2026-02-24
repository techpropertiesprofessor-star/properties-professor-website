const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { featured, limit } = req.query;
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    let testimonials = Testimonial.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      testimonials = testimonials.limit(parseInt(limit));
    }
    
    const result = await testimonials;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/testimonials/featured
// @desc    Get featured testimonials for public display
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/testimonials/:id
// @desc    Get testimonial by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/testimonials
// @desc    Create a new testimonial
// @access  Private (should add auth middleware)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      propertyType,
      rating,
      review,
      image,
      videoUrl,
      isVideoTestimonial,
      featured,
      verified
    } = req.body;
    
    const testimonial = new Testimonial({
      name,
      location,
      propertyType,
      rating,
      review,
      image,
      videoUrl,
      isVideoTestimonial,
      featured,
      verified
    });
    
    const savedTestimonial = await testimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update a testimonial
// @access  Private (should add auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedTestimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial
// @access  Private (should add auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/testimonials/stats
// @desc    Get testimonial statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Testimonial.countDocuments();
    const featured = await Testimonial.countDocuments({ featured: true });
    const videoCount = await Testimonial.countDocuments({ isVideoTestimonial: true });
    
    const avgRatingResult = await Testimonial.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;
    
    res.json({
      total,
      featured,
      videoCount,
      avgRating: avgRating.toFixed(1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

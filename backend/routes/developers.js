const express = require('express');
const router = express.Router();
const Developer = require('../models/Developer');

// @route   GET /api/developers
// @desc    Get all developers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { featured, limit, search } = req.query;
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    let developers = Developer.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      developers = developers.limit(parseInt(limit));
    }
    
    const result = await developers;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/developers/:id
// @desc    Get developer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    res.json(developer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/developers
// @desc    Create a new developer
// @access  Private (should add auth middleware)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      location,
      projectsCount,
      established,
      specialization,
      featured,
      reraRegistered,
      website,
      rating
    } = req.body;
    
    const developer = new Developer({
      name,
      logo,
      description,
      location,
      projectsCount,
      established,
      specialization,
      featured,
      reraRegistered,
      website,
      rating
    });
    
    const savedDeveloper = await developer.save();
    res.status(201).json(savedDeveloper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/developers/:id
// @desc    Update a developer
// @access  Private (should add auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    const updatedDeveloper = await Developer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedDeveloper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/developers/:id
// @desc    Delete a developer
// @access  Private (should add auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    await Developer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Developer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/developers/:id/toggle-featured
// @desc    Toggle featured status
// @access  Private (should add auth middleware)
router.patch('/:id/toggle-featured', async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id);
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    developer.featured = !developer.featured;
    await developer.save();
    
    res.json(developer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/developers/stats/summary
// @desc    Get developer statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Developer.countDocuments();
    const featured = await Developer.countDocuments({ featured: true });
    const reraRegistered = await Developer.countDocuments({ reraRegistered: true });
    
    const totalProjectsResult = await Developer.aggregate([
      { $group: { _id: null, totalProjects: { $sum: '$projectsCount' } } }
    ]);
    
    const totalProjects = totalProjectsResult.length > 0 ? totalProjectsResult[0].totalProjects : 0;
    
    res.json({
      total,
      featured,
      reraRegistered,
      totalProjects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

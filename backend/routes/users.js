const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
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

// @route   GET /api/users/saved-properties
// @desc    Get user's saved properties
// @access  Private
router.get('/saved-properties', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedProperties')
      .select('savedProperties');

    res.json({
      success: true,
      data: user.savedProperties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/save-property/:id
// @desc    Save/unsave property
// @access  Private
router.post('/save-property/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.id;

    const index = user.savedProperties.indexOf(propertyId);
    let message;

    if (index === -1) {
      user.savedProperties.push(propertyId);
      message = 'Property saved successfully';
    } else {
      user.savedProperties.splice(index, 1);
      message = 'Property removed from saved list';
    }

    await user.save();

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/search-history
// @desc    Add search to history
// @access  Private
router.post('/search-history', auth, async (req, res) => {
  try {
    const { query } = req.body;

    const user = await User.findById(req.user.id);
    user.searchHistory.push({ query });

    // Keep only last 20 searches
    if (user.searchHistory.length > 20) {
      user.searchHistory = user.searchHistory.slice(-20);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Search saved'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/agents
// @desc    Get all agents
// @access  Public
router.get('/agents/list', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true })
      .select('name email phone avatar agentProfile')
      .sort({ 'agentProfile.rating': -1 });

    res.json({
      success: true,
      data: agents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

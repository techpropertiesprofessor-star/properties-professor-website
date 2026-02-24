const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// @route   GET /api/settings
// @desc    Get site settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get the first (and only) settings document
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update site settings
// @access  Private (should add auth middleware)
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create new one
    if (!settings) {
      settings = new Settings(req.body);
      await settings.save();
      return res.json(settings);
    }
    
    // Update existing settings
    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/settings/company
// @desc    Update company information only
// @access  Private (should add auth middleware)
router.patch('/company', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.company = { ...settings.company, ...req.body };
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/settings/contact
// @desc    Update contact information only
// @access  Private (should add auth middleware)
router.patch('/contact', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.contact = { ...settings.contact, ...req.body };
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/settings/social
// @desc    Update social media links only
// @access  Private (should add auth middleware)
router.patch('/social', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.social = { ...settings.social, ...req.body };
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/settings/features
// @desc    Update feature toggles only
// @access  Private (should add auth middleware)
router.patch('/features', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    settings.features = { ...settings.features, ...req.body };
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

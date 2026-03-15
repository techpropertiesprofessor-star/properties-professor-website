const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const { auth } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pp_secret_key', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user'
    });

    // Automatically add to Customer Data tracker
    try {
      await Customer.findOrCreateCustomer({
        name,
        email,
        phone,
        source: 'website',
        sourceDetails: 'User Registration'
      });
    } catch (err) {
      console.error('Failed to augment customer table:', err);
    }

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Sign in or register with Google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    // Verify Google token using Google's tokeninfo endpoint (no extra package needed)
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    
    if (!googleRes.ok) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const googleUser = await googleRes.json();
    const { sub: googleId, email, name, picture } = googleUser;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account must have an email' });
    }

    // Check if user already exists with this Google ID or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // If user exists with email but not Google ID, link the Google account
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar) {
          user.avatar = picture;
        }
      }
      // Update last login
      user.lastLogin = new Date();
      user.loginCount += 1;
      await user.save();
    } else {
      // Create new user from Google data
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        authProvider: 'google',
        avatar: picture || '',
        isVerified: true,
        role: 'user'
      });

      // Automatically log inside Customer Data Table
      try {
        await Customer.findOrCreateCustomer({
          name: name || email.split('@')[0],
          email,
          source: 'website',
          sourceDetails: 'Google Sign-In Account Creation'
        });
      } catch (err) {
        console.error('Failed to log Google user to customer table:', err);
      }
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || picture,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedProperties', 'title images location price type');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, preferences, notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, preferences, notifications },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

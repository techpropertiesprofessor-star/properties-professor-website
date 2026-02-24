const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const auth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pp_secret_key');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is deactivated' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin only
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

// Agent or Admin
const agentOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager' || req.user.role === 'agent')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized' });
  }
};

module.exports = { auth, adminOnly, agentOrAdmin };

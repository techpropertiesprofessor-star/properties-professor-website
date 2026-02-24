const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  company: {
    name: {
      type: String,
      default: 'Properties Professor'
    },
    tagline: {
      type: String,
      default: 'Your Trusted Real Estate Partner'
    },
    description: {
      type: String,
      default: 'Leading real estate platform in India'
    },
    logo: {
      type: String,
      default: '/logo.png'
    }
  },
  contact: {
    phone: {
      type: String,
      default: '+91 91563 01600'
    },
    email: {
      type: String,
      default: 'propertiesproffer@gmail.com'
    },
    tollFree: {
      type: String,
      default: '1800 123 4567'
    },
    address: {
      type: String,
      default: 'Office No. 123, Real Estate Plaza'
    },
    city: {
      type: String,
      default: 'Pune'
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    pincode: {
      type: String,
      default: '411001'
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Pune,Maharashtra'
    }
  },
  social: {
    instagram: {
      type: String,
      default: 'https://www.instagram.com/propertiesprofessor'
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/company/properties-professor'
    },
    facebook: {
      type: String,
      default: 'https://www.facebook.com/profile.php?id=61586274812766'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/propertiespro'
    },
    youtube: {
      type: String,
      default: 'https://youtube.com/@propertiesprofessor'
    }
  },
  features: {
    enableAIMatcher: {
      type: Boolean,
      default: true
    },
    enableVirtualTours: {
      type: Boolean,
      default: true
    },
    enableNRIServices: {
      type: Boolean,
      default: true
    },
    enableFinancialCalculator: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);

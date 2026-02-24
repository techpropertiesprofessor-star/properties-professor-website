const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    default: '🏢'
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  projectsCount: {
    type: Number,
    default: 0
  },
  established: {
    type: String,
    required: true
  },
  specialization: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  reraRegistered: {
    type: Boolean,
    default: false
  },
  website: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Developer', developerSchema);

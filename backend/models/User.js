const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'agent', 'manager', 'SUPER_ADMIN'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  searchHistory: [{
    query: { type: Object },
    timestamp: { type: Date, default: Date.now }
  }],
  preferences: {
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 50000000 }
    },
    locations: [{ type: String }],
    propertyTypes: [{ type: String }],
    bedrooms: [{ type: Number }],
    amenities: [{ type: String }],
    lifestyle: [{ type: String }]
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  // For agents
  agentProfile: {
    licenseNumber: { type: String },
    experience: { type: Number, default: 0 },
    specialization: [{ type: String }],
    languages: [{ type: String }],
    bio: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalDeals: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 }
  },
  assignedLeads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

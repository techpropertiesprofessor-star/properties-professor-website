const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: false
  },
  leadType: {
    type: String,
    enum: ['property', 'foreign_investor', 'nri_inquiry', 'general'],
    default: 'property'
  },
  investmentInterest: {
    type: String
  },
  investmentAmount: {
    type: String
  },
  investmentTimeline: {
    type: String
  },
  opportunityTitle: {
    type: String
  },
  sectors: [{
    type: String
  }],
  message: {
    type: String,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'site_visit_scheduled', 'negotiating', 'converted', 'lost', 'on_hold'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'referral', 'social_media', 'google_ads', 'facebook_ads', 'walk_in', 'phone_inquiry', 'nri_portal', 'contact_page', 'other'],
    default: 'website'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  requirements: {
    propertyType: [{ type: String }],
    location: [{ type: String }],
    bedrooms: { type: Number },
    area: { type: Number },
    possession: { type: String }
  },
  notes: [{
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  activities: [{
    type: { type: String, enum: ['call', 'email', 'sms', 'whatsapp', 'meeting', 'site_visit', 'follow_up'] },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  nextFollowUp: {
    type: Date
  },
  convertedAt: {
    type: Date
  },
  convertedValue: {
    type: Number
  },
  isNRI: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: 'India'
  },
  timezone: {
    type: String
  },
  preferredContactTime: {
    type: String
  }
}, {
  timestamps: true
});

// Index for queries
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ nextFollowUp: 1 });

module.exports = mongoose.model('Lead', leadSchema);

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  source: {
    type: String,
    enum: [
      'newsletter',
      'contact_form',
      'contact_page',
      'website',
      'property_inquiry',
      'nri_inquiry',
      'site_visit',
      'callback_request',
      'emi_calculator',
      'ai_matcher',
      'chat',
      'manual',
      'other'
    ],
    default: 'other'
  },
  sourceDetails: {
    type: String,
    default: ''
  },
  // Additional optional fields
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: 'India'
  },
  interestedIn: {
    type: String,
    default: ''
  },
  budget: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'not_interested', 'converted', 'inactive'],
    default: 'new'
  },
  notes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  // Consent and compliance
  marketingConsent: {
    type: Boolean,
    default: true
  },
  // Tracking
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastContactedAt: {
    type: Date
  }
});

// Index for searching
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ name: 'text', email: 'text' });
customerSchema.index({ source: 1, status: 1 });
customerSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find or create customer
customerSchema.statics.findOrCreateCustomer = async function(data) {
  const { email, phone, name } = data;
  
  // Try to find existing customer by email or phone
  let customer = null;
  
  if (email) {
    customer = await this.findOne({ email: email.toLowerCase() });
  }
  
  if (!customer && phone) {
    customer = await this.findOne({ phone });
  }
  
  if (customer) {
    // Update existing customer with new info
    if (name && !customer.name) customer.name = name;
    if (email && !customer.email) customer.email = email;
    if (phone && !customer.phone) customer.phone = phone;
    if (data.source && customer.source === 'other') customer.source = data.source;
    if (data.sourceDetails) customer.sourceDetails = data.sourceDetails;
    if (data.city) customer.city = data.city;
    if (data.country) customer.country = data.country;
    if (data.interestedIn) customer.interestedIn = data.interestedIn;
    if (data.budget) customer.budget = data.budget;
    if (data.message) customer.message = data.message;
    if (data.notes) {
      // Append notes instead of replacing
      customer.notes = customer.notes ? `${customer.notes}\n---\n${data.notes}` : data.notes;
    }
    
    await customer.save();
    return { customer, isNew: false };
  }
  
  // Create new customer
  customer = new this(data);
  await customer.save();
  return { customer, isNew: true };
};

module.exports = mongoose.model('Customer', customerSchema);

const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String
  }],
  category: {
    type: String,
    required: true,
    enum: [
      'market-trends',
      'policy-updates',
      'investment',
      'luxury-properties',
      'affordable-housing',
      'commercial',
      'nri',
      'interior-design',
      'legal',
      'general'
    ],
    default: 'general'
  },
  tags: [{
    type: String
  }],
  author: {
    name: { type: String, required: true },
    avatar: { type: String },
    designation: { type: String }
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: 70
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  relatedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  relatedCities: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
newsSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ isFeatured: 1, publishedAt: -1 });
newsSchema.index({ isPublished: 1, publishedAt: -1 });

// Pre-save middleware to generate slug
newsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('News', newsSchema);

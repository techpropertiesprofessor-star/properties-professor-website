const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['apartment', 'villa', 'penthouse', 'plot', 'commercial', 'studio']
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'sold', 'under_construction', 'reserved'],
    default: 'available'
  },
  listingType: {
    type: String,
    enum: ['sale', 'rent'],
    default: 'sale'
  },
  // Section targeting for website display
  sections: {
    homepage: { type: Boolean, default: false },
    buy: { type: Boolean, default: true },
    rent: { type: Boolean, default: false },
    newProjects: { type: Boolean, default: false },
    commercial: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    trending: { type: Boolean, default: false }
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  pricePerSqft: {
    type: Number,
    min: 0
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0, 'Area cannot be negative']
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 0
  },
  balconies: {
    type: Number,
    min: 0,
    default: 0
  },
  parking: {
    type: Number,
    min: 0,
    default: 0
  },
  floor: {
    type: Number,
    min: 0
  },
  totalFloors: {
    type: Number,
    min: 0
  },
  furnishing: {
    type: String,
    enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
    default: 'unfurnished'
  },
  ageOfProperty: {
    type: Number,
    min: 0,
    default: 0
  },
  location: {
    city: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String },
    pincode: { type: String },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  amenities: [{
    type: String,
    enum: [
      'gym', 'swimming-pool', 'clubhouse', 'parking', 'security', 'lift',
      'power-backup', 'water-supply', 'gas-pipeline', 'garden', 'play-area',
      'jogging-track', 'community-hall', 'indoor-games', 'outdoor-games',
      'library', 'theatre', 'spa', 'wifi', 'intercom', 'fire-safety',
      'rainwater-harvesting', 'solar-power', 'smart-home', 'modular-kitchen',
      'ac', 'tv', 'fridge', 'washing-machine', 'geyser', 'wardrobe', 'bed',
      'sofa', 'dining-table', 'ro', 'microwave', 'chimney', 'water-purifier',
      'fan', 'light'
    ]
  }],
  images: [{
    url: { type: String, required: true },
    caption: { type: String },
    isMain: { type: Boolean, default: false }
  }],
  videos: [{
    url: { type: String },
    caption: { type: String }
  }],
  virtualTour: {
    url: { type: String },
    type: { type: String, enum: ['3d', 'video', 'vr'] }
  },
  developer: {
    name: { type: String, required: true },
    trustScore: { type: Number, min: 0, max: 100, default: 80 },
    logo: { type: String },
    description: { type: String },
    completedProjects: { type: Number, default: 0 },
    ongoingProjects: { type: Number, default: 0 },
    since: { type: Number }
  },
  neighborhood: {
    safetyScore: { type: Number, min: 0, max: 100, default: 80 },
    schoolRating: { type: Number, min: 0, max: 10, default: 7 },
    connectivity: { type: Number, min: 0, max: 100, default: 75 },
    lifestyle: [{ type: String }],
    nearby: {
      schools: [{ name: String, distance: Number, rating: Number }],
      hospitals: [{ name: String, distance: Number }],
      malls: [{ name: String, distance: Number }],
      metro: [{ name: String, distance: Number }],
      restaurants: [{ name: String, distance: Number }]
    }
  },
  construction: {
    startDate: { type: Date },
    completionDate: { type: Date },
    possessionDate: { type: Date },
    currentStage: { type: String },
    reraNumber: { type: String },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  },
  financial: {
    maintenance: { type: Number, default: 0 },
    propertyTax: { type: Number, default: 0 },
    registrationCharges: { type: Number, default: 0 },
    stampDuty: { type: Number, default: 0 },
    maintenanceCharges: { type: String, enum: ['include', 'separate'], default: 'include' },
    keyLocation: { type: String },
    availabilityDate: { type: String }
  },
  blockchain: {
    verified: { type: Boolean, default: false },
    tokenId: { type: String },
    verificationDate: { type: Date }
  },
  analytics: {
    views: { type: Number, default: 0 },
    leads: { type: Number, default: 0 },
    shortlists: { type: Number, default: 0 },
    lastViewed: { type: Date }
  },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for price in words
propertySchema.virtual('priceInWords').get(function() {
  const price = this.price;
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
});

// Index for search
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text', 'location.area': 'text' });
propertySchema.index({ price: 1, 'location.city': 1, type: 1 });
propertySchema.index({ featured: 1, createdAt: -1 });

module.exports = mongoose.model('Property', propertySchema);

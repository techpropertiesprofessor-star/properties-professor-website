export interface Property {
  _id: string;
  title: string;
  description: string;
  type: 'apartment' | 'villa' | 'penthouse' | 'plot' | 'commercial' | 'studio';
  status: 'available' | 'sold' | 'under_construction' | 'reserved';
  listingType: 'sale' | 'rent';
  price: number;
  priceInWords?: string;
  pricePerSqft?: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  balconies?: number;
  parking?: number;
  floor?: number;
  totalFloors?: number;
  furnishing: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  ageOfProperty?: number;
  location: {
    city: string;
    area: string;
    address: string;
    landmark?: string;
    pincode?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  images: {
    url: string;
    caption?: string;
    isMain?: boolean;
  }[];
  videos?: {
    url: string;
    caption?: string;
  }[];
  virtualTour?: {
    url: string;
    type: '3d' | 'video' | 'vr';
  };
  developer: {
    name: string;
    trustScore: number;
    logo?: string;
    description?: string;
    completedProjects?: number;
    ongoingProjects?: number;
    since?: number;
  };
  neighborhood: {
    safetyScore: number;
    schoolRating: number;
    connectivity: number;
    lifestyle: string[];
    nearby?: {
      schools: { name: string; distance: number; rating?: number }[];
      hospitals: { name: string; distance: number }[];
      malls: { name: string; distance: number }[];
      metro: { name: string; distance: number }[];
      restaurants: { name: string; distance: number }[];
    };
  };
  construction?: {
    startDate?: string;
    completionDate?: string;
    possessionDate?: string;
    currentStage?: string;
    reraNumber?: string;
    progress?: number;
  };
  financial?: {
    maintenance?: number;
    propertyTax?: number;
    registrationCharges?: number;
    stampDuty?: number;
    maintenanceCharges?: string;
    keyLocation?: string;
    availabilityDate?: string;
  };
  blockchain?: {
    verified: boolean;
    tokenId?: string;
    verificationDate?: string;
  };
  analytics?: {
    views: number;
    leads: number;
    shortlists?: number;
    lastViewed?: string;
  };
  tags?: string[];
  featured?: boolean;
  premium?: boolean;
  sections?: {
    homepage?: boolean;
    buy?: boolean;
    rent?: boolean;
    newProjects?: boolean;
    commercial?: boolean;
    featured?: boolean;
    premium?: boolean;
    trending?: boolean;
  };
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  property: Property | string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'site_visit_scheduled' | 'negotiating' | 'converted' | 'lost' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  requirements?: {
    propertyType?: string[];
    location?: string[];
    bedrooms?: number;
    area?: number;
    possession?: string;
  };
  notes?: {
    text: string;
    createdBy: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }[];
  activities?: {
    type: string;
    description?: string;
    createdBy?: string;
    createdAt: string;
  }[];
  nextFollowUp?: string;
  convertedAt?: string;
  convertedValue?: number;
  isNRI?: boolean;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'agent' | 'manager';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  savedProperties?: Property[];
  preferences?: {
    budget: { min: number; max: number };
    locations: string[];
    propertyTypes: string[];
    bedrooms?: number[];
    amenities?: string[];
    lifestyle?: string[];
  };
  notifications?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  agentProfile?: {
    licenseNumber?: string;
    experience: number;
    specialization: string[];
    languages: string[];
    bio?: string;
    rating: number;
    totalDeals: number;
    totalValue: number;
  };
  createdAt?: string;
}

export interface DashboardStats {
  overview: {
    totalProperties: number;
    activeProperties: number;
    featuredProperties: number;
    totalLeads: number;
    newLeadsThisMonth: number;
    leadTrend: number;
    convertedLeads: number;
    conversionRate: string;
    totalUsers: number;
    newUsersThisMonth: number;
  };
  charts: {
    propertiesByCity: { _id: string; count: number }[];
    propertiesByType: { _id: string; count: number }[];
    leadsByStatus: { _id: string; count: number }[];
  };
  recent: {
    properties: Property[];
    topViewed: Property[];
  };
}

export interface SearchFilters {
  city?: string;
  area?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  status?: string;
  listingType?: 'sale' | 'rent';
  amenities?: string[];
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

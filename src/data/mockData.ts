import type { Property, Lead, DashboardStats, User } from '@/types';

export const mockProperties: Property[] = [
  {
    _id: '1',
    title: 'Luxury 3BHK Apartment in Bandra West',
    description: 'Experience premium living in the heart of Mumbai\'s most coveted neighborhood. This stunning 3BHK apartment offers panoramic sea views, world-class amenities, and unmatched connectivity. Features include Italian marble flooring, modular kitchen, smart home automation, and 24/7 concierge service.',
    type: 'apartment',
    status: 'available',
    listingType: 'sale',
    price: 85000000,
    pricePerSqft: 42500,
    area: 2000,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: 2,
    floor: 15,
    totalFloors: 25,
    furnishing: 'fully-furnished',
    ageOfProperty: 2,
    location: {
      city: 'Mumbai',
      area: 'Bandra West',
      address: 'Bandra West, Near Pali Hill',
      landmark: 'Lilavati Hospital',
      pincode: '400050',
      coordinates: { lat: 19.0596, lng: 72.8295 }
    },
    amenities: ['gym', 'swimming-pool', 'clubhouse', 'parking', 'security', 'lift', 'power-backup', 'gas-pipeline', 'smart-home', 'modular-kitchen'],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', caption: 'Living Room', isMain: true },
      { url: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800', caption: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', caption: 'Bedroom' }
    ],
    developer: {
      name: 'Lodha Group',
      trustScore: 95,
      logo: 'https://via.placeholder.com/100',
      description: 'India\'s largest real estate developer',
      completedProjects: 150,
      ongoingProjects: 25,
      since: 1980
    },
    neighborhood: {
      safetyScore: 92,
      schoolRating: 8.5,
      connectivity: 95,
      lifestyle: ['Premium', 'Cosmopolitan', 'Nightlife', 'Shopping'],
      nearby: {
        schools: [{ name: 'Dhirubhai Ambani School', distance: 1.2, rating: 9.2 }],
        hospitals: [{ name: 'Lilavati Hospital', distance: 0.5 }],
        malls: [{ name: 'Linking Road', distance: 0.8 }],
        metro: [{ name: 'Bandra Station', distance: 1.5 }],
        restaurants: [{ name: 'Hakkasan', distance: 0.3 }]
      }
    },
    construction: {
      startDate: '2019-01-01',
      completionDate: '2022-06-01',
      possessionDate: '2022-08-01',
      currentStage: 'Ready to Move',
      reraNumber: 'P51900012345',
      progress: 100
    },
    analytics: { views: 1250, leads: 45, shortlists: 89 },
    tags: ['Sea View', 'Premium', 'Smart Home', 'Ready to Move'],
    featured: true,
    premium: true,
    sections: {
      homepage: true,
      buy: true,
      featured: true,
      premium: true
    },
    displayOrder: 1,
    blockchain: { verified: true, tokenId: 'EST001', verificationDate: '2023-01-15' },
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Modern Villa with Private Pool in Whitefield',
    description: 'Stunning 4-bedroom villa in Bangalore\'s IT hub. This contemporary home features a private swimming pool, landscaped garden, home theater, and smart automation throughout. Perfect for families seeking luxury and convenience.',
    type: 'villa',
    status: 'available',
    listingType: 'sale',
    price: 45000000,
    pricePerSqft: 18000,
    area: 2500,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    parking: 3,
    floor: 0,
    totalFloors: 2,
    furnishing: 'semi-furnished',
    ageOfProperty: 1,
    location: {
      city: 'Bangalore',
      area: 'Whitefield',
      address: 'Whitefield Main Road',
      landmark: 'ITPL',
      pincode: '560066',
      coordinates: { lat: 12.9698, lng: 77.7499 }
    },
    amenities: ['swimming-pool', 'gym', 'clubhouse', 'parking', 'security', 'garden', 'power-backup', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', caption: 'Exterior View', isMain: true },
      { url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800', caption: 'Pool Area' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', caption: 'Living Area' }
    ],
    developer: {
      name: 'Prestige Group',
      trustScore: 92,
      completedProjects: 250,
      ongoingProjects: 40,
      since: 1986
    },
    neighborhood: {
      safetyScore: 88,
      schoolRating: 8.0,
      connectivity: 85,
      lifestyle: ['IT Hub', 'Family-friendly', 'Modern'],
      nearby: {
        schools: [{ name: 'Inventure Academy', distance: 2.5, rating: 8.8 }],
        hospitals: [{ name: 'Columbia Asia', distance: 1.8 }],
        malls: [{ name: 'Phoenix Marketcity', distance: 3.0 }],
        metro: [{ name: 'Whitefield Metro', distance: 2.0 }],
        restaurants: [{ name: 'The Fatty Bao', distance: 1.5 }]
      }
    },
    construction: {
      completionDate: '2023-03-01',
      possessionDate: '2023-05-01',
      currentStage: 'Ready to Move',
      reraNumber: 'PRM/KA/123456/2022',
      progress: 100
    },
    analytics: { views: 890, leads: 32, shortlists: 56 },
    tags: ['Private Pool', 'Villa', 'IT Hub', 'Garden'],
    featured: true,
    premium: true,
    blockchain: { verified: true, tokenId: 'EST002' },
    createdAt: '2023-02-20T10:00:00Z'
  },
  {
    _id: '3',
    title: 'Spacious 2BHK in DLF Cyber City',
    description: 'Well-designed 2BHK apartment in Gurgaon\'s prime location. Close to major corporate offices, metro connectivity, and excellent social infrastructure. Ideal for working professionals and small families.',
    type: 'apartment',
    status: 'available',
    listingType: 'sale',
    price: 18000000,
    pricePerSqft: 15000,
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    parking: 1,
    floor: 8,
    totalFloors: 20,
    furnishing: 'unfurnished',
    ageOfProperty: 3,
    location: {
      city: 'Gurgaon',
      area: 'DLF Cyber City',
      address: 'DLF Phase 3',
      landmark: 'Cyber Hub',
      pincode: '122002',
      coordinates: { lat: 28.4950, lng: 77.0895 }
    },
    amenities: ['gym', 'clubhouse', 'parking', 'security', 'lift', 'power-backup', 'gas-pipeline'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800', caption: 'Living Room', isMain: true },
      { url: 'https://images.unsplash.com/photo-1556912173-3db996ea0622?w=800', caption: 'Kitchen' }
    ],
    developer: {
      name: 'DLF Limited',
      trustScore: 90,
      completedProjects: 300,
      ongoingProjects: 50,
      since: 1946
    },
    neighborhood: {
      safetyScore: 90,
      schoolRating: 8.2,
      connectivity: 95,
      lifestyle: ['Corporate', 'Modern', 'Nightlife'],
      nearby: {
        schools: [{ name: 'Heritage School', distance: 3.0, rating: 8.5 }],
        hospitals: [{ name: 'Medanta', distance: 4.0 }],
        malls: [{ name: 'Cyber Hub', distance: 0.5 }],
        metro: [{ name: 'Cyber City Metro', distance: 0.8 }],
        restaurants: [{ name: 'Farzi Cafe', distance: 0.3 }]
      }
    },
    construction: {
      completionDate: '2020-12-01',
      currentStage: 'Ready to Move',
      reraNumber: 'HRERA2020GUR1234',
      progress: 100
    },
    analytics: { views: 2100, leads: 78, shortlists: 134 },
    tags: ['Corporate Hub', 'Metro Connected', 'Investment'],
    featured: true,
    premium: false,
    blockchain: { verified: true, tokenId: 'EST003' },
    createdAt: '2023-03-10T10:00:00Z'
  },
  {
    _id: '4',
    title: 'Penthouse with Terrace Garden in Koregaon Park',
    description: 'Exclusive penthouse in Pune\'s most upscale neighborhood. Features a private terrace garden, jacuzzi, and stunning city views. Minutes from Osho Ashram and top restaurants.',
    type: 'penthouse',
    status: 'available',
    listingType: 'sale',
    price: 65000000,
    pricePerSqft: 32500,
    area: 2000,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: 2,
    floor: 18,
    totalFloors: 18,
    furnishing: 'fully-furnished',
    ageOfProperty: 1,
    location: {
      city: 'Pune',
      area: 'Koregaon Park',
      address: 'Koregaon Park Annexe',
      landmark: 'Osho Ashram',
      pincode: '411001',
      coordinates: { lat: 18.5362, lng: 73.8939 }
    },
    amenities: ['gym', 'swimming-pool', 'clubhouse', 'parking', 'security', 'lift', 'power-backup', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Terrace View', isMain: true },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Living Area' }
    ],
    developer: {
      name: 'Kolte-Patil Developers',
      trustScore: 88,
      completedProjects: 80,
      ongoingProjects: 15,
      since: 1991
    },
    neighborhood: {
      safetyScore: 90,
      schoolRating: 8.5,
      connectivity: 82,
      lifestyle: ['Upscale', 'Bohemian', 'Foodie Paradise'],
      nearby: {
        schools: [{ name: 'Symbiosis School', distance: 2.0, rating: 9.0 }],
        hospitals: [{ name: 'Ruby Hall Clinic', distance: 1.5 }],
        malls: [{ name: 'Seasons Mall', distance: 3.5 }],
        metro: [{ name: 'Kalyani Nagar Metro', distance: 2.0 }],
        restaurants: [{ name: 'Malaka Spice', distance: 0.5 }]
      }
    },
    construction: {
      completionDate: '2023-06-01',
      currentStage: 'Ready to Move',
      reraNumber: 'P52100045678',
      progress: 100
    },
    analytics: { views: 650, leads: 28, shortlists: 42 },
    tags: ['Penthouse', 'Terrace Garden', 'Luxury', 'Koregaon Park'],
    featured: true,
    premium: true,
    blockchain: { verified: true, tokenId: 'EST004' },
    createdAt: '2023-04-05T10:00:00Z'
  },
  {
    _id: '5',
    title: 'Beachfront Villa in Candolim, Goa',
    description: 'Stunning beachfront property with direct access to Candolim Beach. This Portuguese-inspired villa features 4 bedrooms, private pool, and breathtaking ocean views. Perfect holiday home or vacation rental investment.',
    type: 'villa',
    status: 'available',
    listingType: 'sale',
    price: 120000000,
    pricePerSqft: 40000,
    area: 3000,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 4,
    parking: 3,
    floor: 0,
    totalFloors: 2,
    furnishing: 'fully-furnished',
    ageOfProperty: 0,
    location: {
      city: 'Goa',
      area: 'Candolim',
      address: 'Candolim Beach Road',
      landmark: 'Candolim Beach',
      pincode: '403515',
      coordinates: { lat: 15.5125, lng: 73.7697 }
    },
    amenities: ['swimming-pool', 'garden', 'parking', 'security', 'power-backup', 'wifi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', caption: 'Beachfront View', isMain: true },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', caption: 'Pool Area' }
    ],
    developer: {
      name: 'Acron Developers',
      trustScore: 85,
      completedProjects: 25,
      ongoingProjects: 5,
      since: 2000
    },
    neighborhood: {
      safetyScore: 85,
      schoolRating: 7.0,
      connectivity: 70,
      lifestyle: ['Beach Life', 'Tourism', 'Relaxed'],
      nearby: {
        schools: [{ name: 'Sharada Mandir', distance: 5.0, rating: 7.5 }],
        hospitals: [{ name: 'Manipal Hospital', distance: 8.0 }],
        malls: [{ name: 'Calangute Mall', distance: 3.0 }],
        metro: [],
        restaurants: [{ name: 'Fisherman\'s Wharf', distance: 1.0 }]
      }
    },
    construction: {
      completionDate: '2024-01-01',
      possessionDate: '2024-03-01',
      currentStage: 'Under Construction',
      reraNumber: 'GOA2023CAND123',
      progress: 85
    },
    analytics: { views: 450, leads: 18, shortlists: 32 },
    tags: ['Beachfront', 'Goa', 'Holiday Home', 'Investment'],
    featured: true,
    premium: true,
    blockchain: { verified: true, tokenId: 'EST005' },
    createdAt: '2023-05-15T10:00:00Z'
  },
  {
    _id: '6',
    title: 'Smart Home Apartment in Gachibowli',
    description: 'Tech-enabled 3BHK apartment in Hyderabad\'s IT corridor. Features IoT devices, automated lighting, voice-controlled appliances, and energy-efficient design. Perfect for tech-savvy professionals.',
    type: 'apartment',
    status: 'available',
    listingType: 'sale',
    price: 12000000,
    pricePerSqft: 12000,
    area: 1000,
    bedrooms: 3,
    bathrooms: 2,
    balconies: 1,
    parking: 1,
    floor: 12,
    totalFloors: 22,
    furnishing: 'fully-furnished',
    ageOfProperty: 0,
    location: {
      city: 'Hyderabad',
      area: 'Gachibowli',
      address: 'Gachibowli Financial District',
      landmark: 'Waverock Building',
      pincode: '500032',
      coordinates: { lat: 17.4289, lng: 78.3533 }
    },
    amenities: ['gym', 'swimming-pool', 'clubhouse', 'parking', 'security', 'lift', 'power-backup', 'smart-home', 'wifi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Smart Living Room', isMain: true },
      { url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800', caption: 'Tech Kitchen' }
    ],
    developer: {
      name: 'My Home Constructions',
      trustScore: 87,
      completedProjects: 60,
      ongoingProjects: 12,
      since: 1981
    },
    neighborhood: {
      safetyScore: 88,
      schoolRating: 8.0,
      connectivity: 90,
      lifestyle: ['Tech Hub', 'Modern', 'Professional'],
      nearby: {
        schools: [{ name: 'Chirec International', distance: 3.0, rating: 8.8 }],
        hospitals: [{ name: 'Continental Hospital', distance: 2.5 }],
        malls: [{ name: 'Inorbit Mall', distance: 4.0 }],
        metro: [{ name: 'Raidurg Metro', distance: 3.0 }],
        restaurants: [{ name: 'B-Dubs', distance: 1.0 }]
      }
    },
    construction: {
      completionDate: '2024-06-01',
      possessionDate: '2024-08-01',
      currentStage: 'Under Construction',
      reraNumber: 'TSRERAHYD12345',
      progress: 70
    },
    analytics: { views: 780, leads: 35, shortlists: 67 },
    tags: ['Smart Home', 'Tech Hub', 'IT Corridor', 'IoT'],
    featured: true,
    premium: false,
    blockchain: { verified: true, tokenId: 'EST006' },
    createdAt: '2023-06-20T10:00:00Z'
  }
];

export const mockLeads: Lead[] = [
  {
    _id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    property: mockProperties[0],
    message: 'Interested in scheduling a site visit this weekend. Please call to confirm.',
    status: 'contacted',
    priority: 'high',
    source: 'website',
    budget: { min: 80000000, max: 100000000 },
    requirements: {
      propertyType: ['apartment'],
      location: ['Mumbai'],
      bedrooms: 3
    },
    notes: [
      {
        text: 'Called customer, interested in 3BHK options',
        createdBy: { _id: '1', name: 'Agent Kumar' },
        createdAt: '2024-01-15T10:00:00Z'
      }
    ],
    nextFollowUp: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 87654 32109',
    property: mockProperties[1],
    message: 'Looking for a villa in Bangalore. Please share more details.',
    status: 'new',
    priority: 'medium',
    source: 'google_ads',
    budget: { min: 40000000, max: 60000000 },
    requirements: {
      propertyType: ['villa'],
      location: ['Bangalore'],
      bedrooms: 4
    },
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    _id: '3',
    name: 'Amit Gupta',
    email: 'amit.gupta@email.com',
    phone: '+91 76543 21098',
    property: mockProperties[2],
    message: 'NRI investor looking for properties in Gurgaon. Need complete documentation.',
    status: 'qualified',
    priority: 'high',
    source: 'referral',
    isNRI: true,
    country: 'USA',
    budget: { min: 15000000, max: 25000000 },
    requirements: {
      propertyType: ['apartment'],
      location: ['Gurgaon'],
      bedrooms: 2
    },
    notes: [
      {
        text: 'NRI from USA, looking for investment property',
        createdBy: { _id: '2', name: 'Agent Singh' },
        createdAt: '2024-01-14T11:00:00Z'
      }
    ],
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T11:00:00Z'
  },
  {
    _id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 65432 10987',
    property: mockProperties[3],
    message: 'Interested in the penthouse. Can we discuss the price?',
    status: 'negotiating',
    priority: 'urgent',
    source: 'website',
    budget: { min: 60000000, max: 70000000 },
    requirements: {
      propertyType: ['penthouse'],
      location: ['Pune'],
      bedrooms: 3
    },
    notes: [
      {
        text: 'Customer negotiating on price, willing to pay 6.2 Cr',
        createdBy: { _id: '1', name: 'Agent Kumar' },
        createdAt: '2024-01-13T16:00:00Z'
      }
    ],
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T16:00:00Z'
  },
  {
    _id: '5',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@email.com',
    phone: '+91 54321 09876',
    property: mockProperties[4],
    message: 'Looking for a holiday home in Goa. Is this available for immediate possession?',
    status: 'site_visit_scheduled',
    priority: 'medium',
    source: 'facebook_ads',
    budget: { min: 100000000, max: 150000000 },
    requirements: {
      propertyType: ['villa'],
      location: ['Goa'],
      bedrooms: 4
    },
    notes: [
      {
        text: 'Site visit scheduled for Jan 25th',
        createdBy: { _id: '3', name: 'Agent Desai' },
        createdAt: '2024-01-17T10:00:00Z'
      }
    ],
    nextFollowUp: '2024-01-25T11:00:00Z',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  overview: {
    totalProperties: 156,
    activeProperties: 142,
    featuredProperties: 24,
    totalLeads: 892,
    newLeadsThisMonth: 127,
    leadTrend: 15.3,
    convertedLeads: 156,
    conversionRate: '17.5',
    totalUsers: 2340,
    newUsersThisMonth: 189
  },
  charts: {
    propertiesByCity: [
      { _id: 'Mumbai', count: 45 },
      { _id: 'Bangalore', count: 38 },
      { _id: 'Gurgaon', count: 28 },
      { _id: 'Pune', count: 22 },
      { _id: 'Hyderabad', count: 15 },
      { _id: 'Chennai', count: 8 }
    ],
    propertiesByType: [
      { _id: 'apartment', count: 89 },
      { _id: 'villa', count: 32 },
      { _id: 'penthouse', count: 18 },
      { _id: 'plot', count: 12 },
      { _id: 'commercial', count: 5 }
    ],
    leadsByStatus: [
      { _id: 'new', count: 156 },
      { _id: 'contacted', count: 234 },
      { _id: 'qualified', count: 189 },
      { _id: 'site_visit_scheduled', count: 98 },
      { _id: 'negotiating', count: 59 },
      { _id: 'converted', count: 156 }
    ]
  },
  recent: {
    properties: mockProperties.slice(0, 5),
    topViewed: [mockProperties[2], mockProperties[0], mockProperties[5], mockProperties[1], mockProperties[3]]
  }
};

export const mockUser: User = {
  _id: '1',
  name: 'Admin User',
  email: 'admin@propertiesprofessor.com',
  role: 'admin',
  phone: '+91 98765 43210',
  isActive: true,
  isVerified: true,
  notifications: {
    email: true,
    sms: true,
    whatsapp: true,
    push: true
  },
  createdAt: '2023-01-01T00:00:00Z'
};

export const cities = [
  'Mumbai', 'Bangalore', 'Gurgaon', 'Pune', 'Hyderabad', 
  'Chennai', 'Delhi', 'Noida', 'Kolkata', 'Ahmedabad', 'Goa'
];

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment', icon: 'Building' },
  { value: 'villa', label: 'Villa', icon: 'Home' },
  { value: 'penthouse', label: 'Penthouse', icon: 'Building2' },
  { value: 'plot', label: 'Plot/Land', icon: 'Map' },
  { value: 'commercial', label: 'Commercial', icon: 'Store' },
  { value: 'studio', label: 'Studio', icon: 'Bed' }
];

export const amenitiesList = [
  { value: 'gym', label: 'Gym', icon: 'Dumbbell' },
  { value: 'swimming-pool', label: 'Swimming Pool', icon: 'Waves' },
  { value: 'clubhouse', label: 'Clubhouse', icon: 'Users' },
  { value: 'parking', label: 'Parking', icon: 'Car' },
  { value: 'security', label: '24/7 Security', icon: 'Shield' },
  { value: 'lift', label: 'Lift/Elevator', icon: 'ArrowUpDown' },
  { value: 'power-backup', label: 'Power Backup', icon: 'Zap' },
  { value: 'gas-pipeline', label: 'Gas Pipeline', icon: 'Flame' },
  { value: 'garden', label: 'Garden', icon: 'TreePine' },
  { value: 'play-area', label: 'Kids Play Area', icon: 'Baby' },
  { value: 'smart-home', label: 'Smart Home', icon: 'Cpu' },
  { value: 'modular-kitchen', label: 'Modular Kitchen', icon: 'ChefHat' }
];

export const lifestyleOptions = [
  { value: 'family-friendly', label: 'Family Friendly', icon: 'Heart' },
  { value: 'premium', label: 'Premium Living', icon: 'Crown' },
  { value: 'it-hub', label: 'IT Hub', icon: 'Laptop' },
  { value: 'beach-life', label: 'Beach Life', icon: 'Waves' },
  { value: 'corporate', label: 'Corporate', icon: 'Briefcase' },
  { value: 'bohemian', label: 'Bohemian', icon: 'Palette' }
];

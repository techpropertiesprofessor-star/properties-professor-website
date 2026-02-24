const express = require('express');
const router = express.Router();

// Comprehensive neighborhood data for major Indian cities
const neighborhoodData = {
  // MUMBAI
  'bandra west, mumbai': {
    location: 'Bandra West, Mumbai',
    safetyScore: 92,
    overallRating: 4.5,
    metro: [
      { name: 'Bandra Railway Station', distance: '1.2 km', type: 'Railway' },
      { name: 'Bandra-Kurla Complex Metro', distance: '2.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Dhirubhai Ambani International School', distance: '1.5 km', rating: 4.8 },
      { name: 'JBCN International School', distance: '2.1 km', rating: 4.6 },
      { name: "St. Stanislaus High School", distance: '0.8 km', rating: 4.5 }
    ],
    hospitals: [
      { name: 'Lilavati Hospital', distance: '0.5 km', rating: 4.7 },
      { name: 'Holy Family Hospital', distance: '1.8 km', rating: 4.5 },
      { name: 'Bandra Medical Centre', distance: '0.3 km', rating: 4.2 }
    ],
    shopping: [
      { name: 'Linking Road Market', distance: '0.5 km', type: 'Street Market' },
      { name: 'Hill Road Shopping', distance: '0.8 km', type: 'Shopping Street' }
    ],
    restaurants: 85,
    groceryStores: 45,
    avgPropertyPrice: '₹45,000 - ₹65,000 per sq.ft'
  },

  'andheri west, mumbai': {
    location: 'Andheri West, Mumbai',
    safetyScore: 88,
    overallRating: 4.3,
    metro: [
      { name: 'Andheri Metro Station', distance: '0.5 km', type: 'Metro' },
      { name: 'Andheri Railway Station', distance: '1.0 km', type: 'Railway' }
    ],
    schools: [
      { name: 'Ryan International School', distance: '1.2 km', rating: 4.5 },
      { name: 'Thakur College', distance: '2.0 km', rating: 4.3 }
    ],
    hospitals: [
      { name: 'Kokilaben Hospital', distance: '3.0 km', rating: 4.8 },
      { name: 'Criticare Hospital', distance: '1.5 km', rating: 4.4 }
    ],
    shopping: [
      { name: 'Infiniti Mall', distance: '1.5 km', type: 'Mall' },
      { name: 'Andheri Lokhandwala Market', distance: '2.0 km', type: 'Market' }
    ],
    restaurants: 120,
    groceryStores: 60,
    avgPropertyPrice: '₹25,000 - ₹40,000 per sq.ft'
  },

  'powai, mumbai': {
    location: 'Powai, Mumbai',
    safetyScore: 94,
    overallRating: 4.6,
    metro: [
      { name: 'Powai Metro (Upcoming)', distance: '1.0 km', type: 'Metro' },
      { name: 'Kanjurmarg Railway Station', distance: '4.5 km', type: 'Railway' }
    ],
    schools: [
      { name: 'Hiranandani Foundation School', distance: '0.5 km', rating: 4.7 },
      { name: 'IIT Bombay Campus', distance: '1.5 km', rating: 5.0 }
    ],
    hospitals: [
      { name: 'Hiranandani Hospital', distance: '0.8 km', rating: 4.6 },
      { name: 'Jupiter Hospital', distance: '2.0 km', rating: 4.5 }
    ],
    shopping: [
      { name: 'Haiko Mall', distance: '0.5 km', type: 'Mall' },
      { name: 'Galleria Mall', distance: '1.0 km', type: 'Mall' }
    ],
    restaurants: 75,
    groceryStores: 35,
    avgPropertyPrice: '₹22,000 - ₹35,000 per sq.ft'
  },

  // BANGALORE
  'koramangala, bangalore': {
    location: 'Koramangala, Bangalore',
    safetyScore: 90,
    overallRating: 4.5,
    metro: [
      { name: 'Trinity Metro Station', distance: '2.8 km', type: 'Metro' },
      { name: 'Bellandur Metro (Upcoming)', distance: '3.2 km', type: 'Metro' }
    ],
    schools: [
      { name: 'National Public School', distance: '0.8 km', rating: 4.8 },
      { name: 'Inventure Academy', distance: '1.5 km', rating: 4.6 },
      { name: 'The Valley School', distance: '5.0 km', rating: 4.7 }
    ],
    hospitals: [
      { name: 'Manipal Hospital', distance: '1.2 km', rating: 4.7 },
      { name: 'Sakra World Hospital', distance: '2.5 km', rating: 4.6 },
      { name: 'Apollo Clinic', distance: '0.5 km', rating: 4.3 }
    ],
    shopping: [
      { name: 'Forum Mall', distance: '0.5 km', type: 'Mall' },
      { name: '1MG Road', distance: '3.0 km', type: 'Commercial Hub' }
    ],
    restaurants: 200,
    groceryStores: 55,
    avgPropertyPrice: '₹12,000 - ₹20,000 per sq.ft'
  },

  'whitefield, bangalore': {
    location: 'Whitefield, Bangalore',
    safetyScore: 88,
    overallRating: 4.3,
    metro: [
      { name: 'Whitefield Metro Station', distance: '1.0 km', type: 'Metro' },
      { name: 'Kadugodi Metro', distance: '2.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Inventure Academy', distance: '2.0 km', rating: 4.6 },
      { name: 'Gopalan International School', distance: '1.5 km', rating: 4.4 },
      { name: 'Whitefield Global School', distance: '0.8 km', rating: 4.3 }
    ],
    hospitals: [
      { name: 'Columbia Asia Hospital', distance: '1.5 km', rating: 4.5 },
      { name: 'Narayana Health', distance: '3.0 km', rating: 4.7 }
    ],
    shopping: [
      { name: 'Phoenix Marketcity', distance: '2.0 km', type: 'Mall' },
      { name: 'VR Bengaluru', distance: '3.5 km', type: 'Mall' }
    ],
    restaurants: 150,
    groceryStores: 40,
    avgPropertyPrice: '₹8,000 - ₹15,000 per sq.ft'
  },

  'indiranagar, bangalore': {
    location: 'Indiranagar, Bangalore',
    safetyScore: 91,
    overallRating: 4.6,
    metro: [
      { name: 'Indiranagar Metro Station', distance: '0.3 km', type: 'Metro' },
      { name: 'Trinity Metro', distance: '1.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Bishop Cotton Boys School', distance: '3.0 km', rating: 4.8 },
      { name: 'St. Francis Xavier Girls High School', distance: '2.0 km', rating: 4.5 }
    ],
    hospitals: [
      { name: 'Manipal Hospital', distance: '2.5 km', rating: 4.7 },
      { name: 'Fortis Hospital', distance: '4.0 km', rating: 4.6 }
    ],
    shopping: [
      { name: '100 Feet Road', distance: '0.2 km', type: 'Shopping Street' },
      { name: '12th Main', distance: '0.5 km', type: 'Cafes & Boutiques' }
    ],
    restaurants: 250,
    groceryStores: 30,
    avgPropertyPrice: '₹15,000 - ₹25,000 per sq.ft'
  },

  // DELHI NCR
  'noida sector 62, noida': {
    location: 'Noida Sector 62, Noida',
    safetyScore: 85,
    overallRating: 4.2,
    metro: [
      { name: 'Noida Sector 62 Metro', distance: '0.5 km', type: 'Metro' },
      { name: 'Noida Electronic City Metro', distance: '1.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Amity International School', distance: '1.0 km', rating: 4.5 },
      { name: 'Delhi Public School', distance: '2.2 km', rating: 4.6 },
      { name: 'Lotus Valley International School', distance: '3.0 km', rating: 4.4 }
    ],
    hospitals: [
      { name: 'Fortis Hospital', distance: '1.5 km', rating: 4.6 },
      { name: 'Max Super Speciality Hospital', distance: '2.0 km', rating: 4.7 },
      { name: 'Yatharth Wellness Hospital', distance: '1.0 km', rating: 4.3 }
    ],
    shopping: [
      { name: 'Sector 18 Market', distance: '5.0 km', type: 'Market' },
      { name: 'DLF Mall of India', distance: '4.5 km', type: 'Mall' }
    ],
    restaurants: 100,
    groceryStores: 45,
    avgPropertyPrice: '₹7,500 - ₹12,000 per sq.ft'
  },

  'greater noida west, noida': {
    location: 'Greater Noida West, Noida',
    safetyScore: 82,
    overallRating: 4.0,
    metro: [
      { name: 'Noida Extension Metro (Upcoming)', distance: '2.0 km', type: 'Metro' },
      { name: 'Pari Chowk Metro', distance: '5.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Ryan International School', distance: '1.5 km', rating: 4.3 },
      { name: 'Cambridge School', distance: '2.0 km', rating: 4.2 }
    ],
    hospitals: [
      { name: 'Sharda Hospital', distance: '3.0 km', rating: 4.4 },
      { name: 'Yatharth Hospital', distance: '2.5 km', rating: 4.3 }
    ],
    shopping: [
      { name: 'Gaur City Mall', distance: '1.0 km', type: 'Mall' },
      { name: 'Local Markets', distance: '0.5 km', type: 'Market' }
    ],
    restaurants: 60,
    groceryStores: 35,
    avgPropertyPrice: '₹4,500 - ₹7,000 per sq.ft'
  },

  'gurgaon sector 49, gurgaon': {
    location: 'Gurgaon Sector 49, Gurgaon',
    safetyScore: 87,
    overallRating: 4.3,
    metro: [
      { name: 'HUDA City Centre Metro', distance: '8.0 km', type: 'Metro' },
      { name: 'Rapid Metro Sector 55-56', distance: '3.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'GD Goenka World School', distance: '2.0 km', rating: 4.6 },
      { name: 'Shiv Nadar School', distance: '3.5 km', rating: 4.7 }
    ],
    hospitals: [
      { name: 'Medanta Hospital', distance: '5.0 km', rating: 4.8 },
      { name: 'Fortis Memorial Research Institute', distance: '6.0 km', rating: 4.7 }
    ],
    shopping: [
      { name: 'Ambience Mall', distance: '4.0 km', type: 'Mall' },
      { name: 'South Point Mall', distance: '3.5 km', type: 'Mall' }
    ],
    restaurants: 80,
    groceryStores: 25,
    avgPropertyPrice: '₹8,000 - ₹14,000 per sq.ft'
  },

  'dwarka, delhi': {
    location: 'Dwarka, Delhi',
    safetyScore: 89,
    overallRating: 4.4,
    metro: [
      { name: 'Dwarka Sector 21 Metro', distance: '1.0 km', type: 'Metro' },
      { name: 'Dwarka Mor Metro', distance: '2.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Mount Carmel School', distance: '1.0 km', rating: 4.5 },
      { name: 'Bal Bharati Public School', distance: '1.8 km', rating: 4.4 }
    ],
    hospitals: [
      { name: 'Venkateshwar Hospital', distance: '2.0 km', rating: 4.5 },
      { name: 'Manipal Hospital', distance: '3.0 km', rating: 4.6 }
    ],
    shopping: [
      { name: 'Vegas Mall', distance: '1.5 km', type: 'Mall' },
      { name: 'Sector 12 Market', distance: '0.8 km', type: 'Market' }
    ],
    restaurants: 90,
    groceryStores: 40,
    avgPropertyPrice: '₹10,000 - ₹18,000 per sq.ft'
  },

  // HYDERABAD
  'gachibowli, hyderabad': {
    location: 'Gachibowli, Hyderabad',
    safetyScore: 91,
    overallRating: 4.5,
    metro: [
      { name: 'Raidurg Metro', distance: '2.0 km', type: 'Metro' },
      { name: 'HITEC City Metro', distance: '3.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'CHIREC International School', distance: '1.5 km', rating: 4.7 },
      { name: 'Delhi Public School', distance: '2.0 km', rating: 4.6 }
    ],
    hospitals: [
      { name: 'Continental Hospitals', distance: '1.0 km', rating: 4.6 },
      { name: 'AIG Hospitals', distance: '2.5 km', rating: 4.7 }
    ],
    shopping: [
      { name: 'Inorbit Mall', distance: '3.0 km', type: 'Mall' },
      { name: 'Sarath City Capital Mall', distance: '4.0 km', type: 'Mall' }
    ],
    restaurants: 110,
    groceryStores: 35,
    avgPropertyPrice: '₹7,000 - ₹12,000 per sq.ft'
  },

  'hitech city, hyderabad': {
    location: 'HITEC City, Hyderabad',
    safetyScore: 93,
    overallRating: 4.6,
    metro: [
      { name: 'HITEC City Metro', distance: '0.5 km', type: 'Metro' },
      { name: 'Raidurg Metro', distance: '2.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Oakridge International School', distance: '3.0 km', rating: 4.7 },
      { name: 'Meridian School', distance: '4.0 km', rating: 4.5 }
    ],
    hospitals: [
      { name: 'Apollo Hospital', distance: '5.0 km', rating: 4.8 },
      { name: 'KIMS Hospital', distance: '4.0 km', rating: 4.6 }
    ],
    shopping: [
      { name: 'Inorbit Mall', distance: '1.5 km', type: 'Mall' },
      { name: 'Forum Sujana Mall', distance: '3.0 km', type: 'Mall' }
    ],
    restaurants: 150,
    groceryStores: 40,
    avgPropertyPrice: '₹8,500 - ₹14,000 per sq.ft'
  },

  'jubilee hills, hyderabad': {
    location: 'Jubilee Hills, Hyderabad',
    safetyScore: 95,
    overallRating: 4.8,
    metro: [
      { name: 'Jubilee Hills Check Post Metro', distance: '0.8 km', type: 'Metro' },
      { name: 'Peddamma Temple Metro', distance: '1.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Oakridge International School', distance: '1.0 km', rating: 4.8 },
      { name: 'The Hyderabad Public School', distance: '2.0 km', rating: 4.9 }
    ],
    hospitals: [
      { name: 'Care Hospitals', distance: '1.5 km', rating: 4.7 },
      { name: 'KIMS Hospital', distance: '2.5 km', rating: 4.6 }
    ],
    shopping: [
      { name: 'GVK One Mall', distance: '3.0 km', type: 'Mall' },
      { name: 'Road No. 36 Boutiques', distance: '0.5 km', type: 'Boutiques' }
    ],
    restaurants: 180,
    groceryStores: 25,
    avgPropertyPrice: '₹18,000 - ₹35,000 per sq.ft'
  },

  // PUNE
  'hinjewadi, pune': {
    location: 'Hinjewadi, Pune',
    safetyScore: 86,
    overallRating: 4.2,
    metro: [
      { name: 'Hinjewadi Metro (Upcoming)', distance: '1.0 km', type: 'Metro' },
      { name: 'Pune Metro Extension (Planned)', distance: '2.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'DY Patil International School', distance: '3.0 km', rating: 4.5 },
      { name: 'Indus International School', distance: '5.0 km', rating: 4.6 }
    ],
    hospitals: [
      { name: 'Manipal Hospital', distance: '2.0 km', rating: 4.5 },
      { name: 'Sahyadri Hospital', distance: '4.0 km', rating: 4.4 }
    ],
    shopping: [
      { name: 'Xion Mall', distance: '2.5 km', type: 'Mall' },
      { name: 'Hinjewadi Market', distance: '1.0 km', type: 'Market' }
    ],
    restaurants: 100,
    groceryStores: 35,
    avgPropertyPrice: '₹6,500 - ₹10,000 per sq.ft'
  },

  'kharadi, pune': {
    location: 'Kharadi, Pune',
    safetyScore: 88,
    overallRating: 4.4,
    metro: [
      { name: 'Kharadi Metro (Upcoming)', distance: '1.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Vibgyor High School', distance: '1.0 km', rating: 4.4 },
      { name: 'Sanskriti School', distance: '2.0 km', rating: 4.3 }
    ],
    hospitals: [
      { name: 'Columbia Asia Hospital', distance: '2.5 km', rating: 4.5 },
      { name: 'Noble Hospital', distance: '3.0 km', rating: 4.4 }
    ],
    shopping: [
      { name: 'Amanora Mall', distance: '2.0 km', type: 'Mall' },
      { name: 'Phoenix Marketcity', distance: '3.5 km', type: 'Mall' }
    ],
    restaurants: 85,
    groceryStores: 30,
    avgPropertyPrice: '₹7,000 - ₹11,000 per sq.ft'
  },

  'baner, pune': {
    location: 'Baner, Pune',
    safetyScore: 89,
    overallRating: 4.5,
    metro: [
      { name: 'Baner Metro (Upcoming)', distance: '0.8 km', type: 'Metro' }
    ],
    schools: [
      { name: 'The Orchid School', distance: '1.0 km', rating: 4.6 },
      { name: 'Symbiosis School', distance: '2.5 km', rating: 4.7 }
    ],
    hospitals: [
      { name: 'Ruby Hall Clinic', distance: '5.0 km', rating: 4.7 },
      { name: 'Jupiter Hospital', distance: '3.0 km', rating: 4.5 }
    ],
    shopping: [
      { name: 'Westend Mall', distance: '4.0 km', type: 'Mall' },
      { name: 'ICC Trade Tower', distance: '2.0 km', type: 'Commercial' }
    ],
    restaurants: 120,
    groceryStores: 40,
    avgPropertyPrice: '₹8,500 - ₹14,000 per sq.ft'
  },

  // CHENNAI
  'anna nagar, chennai': {
    location: 'Anna Nagar, Chennai',
    safetyScore: 90,
    overallRating: 4.5,
    metro: [
      { name: 'Anna Nagar East Metro', distance: '0.5 km', type: 'Metro' },
      { name: 'Anna Nagar Tower Metro', distance: '1.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'DAV Public School', distance: '1.0 km', rating: 4.5 },
      { name: 'PSBB School', distance: '1.5 km', rating: 4.7 }
    ],
    hospitals: [
      { name: 'SIMS Hospital', distance: '1.5 km', rating: 4.6 },
      { name: 'Apollo Hospital', distance: '3.0 km', rating: 4.8 }
    ],
    shopping: [
      { name: 'VR Chennai', distance: '2.0 km', type: 'Mall' },
      { name: 'Anna Nagar Tower Park', distance: '0.5 km', type: 'Park & Market' }
    ],
    restaurants: 90,
    groceryStores: 45,
    avgPropertyPrice: '₹12,000 - ₹20,000 per sq.ft'
  },

  'omr, chennai': {
    location: 'OMR (IT Corridor), Chennai',
    safetyScore: 85,
    overallRating: 4.2,
    metro: [
      { name: 'OMR Metro (Upcoming)', distance: '2.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'PSBB School', distance: '2.5 km', rating: 4.7 },
      { name: 'Chettinad Vidyashram', distance: '3.0 km', rating: 4.5 }
    ],
    hospitals: [
      { name: 'Gleneagles Global Health City', distance: '5.0 km', rating: 4.7 },
      { name: 'Kauvery Hospital', distance: '4.0 km', rating: 4.5 }
    ],
    shopping: [
      { name: 'OMR Food Street', distance: '1.0 km', type: 'Food Street' },
      { name: 'Sholinganallur Market', distance: '2.0 km', type: 'Market' }
    ],
    restaurants: 130,
    groceryStores: 35,
    avgPropertyPrice: '₹6,500 - ₹10,000 per sq.ft'
  },

  // KOLKATA
  'salt lake, kolkata': {
    location: 'Salt Lake City, Kolkata',
    safetyScore: 91,
    overallRating: 4.4,
    metro: [
      { name: 'Salt Lake Stadium Metro', distance: '1.0 km', type: 'Metro' },
      { name: 'Karunamoyee Metro', distance: '1.5 km', type: 'Metro' }
    ],
    schools: [
      { name: 'DPS Ruby Park', distance: '2.0 km', rating: 4.6 },
      { name: 'South Point School', distance: '4.0 km', rating: 4.8 }
    ],
    hospitals: [
      { name: 'AMRI Hospital', distance: '1.5 km', rating: 4.6 },
      { name: 'Apollo Gleneagles Hospital', distance: '3.0 km', rating: 4.7 }
    ],
    shopping: [
      { name: 'City Centre Salt Lake', distance: '1.0 km', type: 'Mall' },
      { name: 'Salt Lake Central Park', distance: '0.5 km', type: 'Park' }
    ],
    restaurants: 100,
    groceryStores: 40,
    avgPropertyPrice: '₹6,000 - ₹10,000 per sq.ft'
  },

  'new town, kolkata': {
    location: 'New Town, Kolkata',
    safetyScore: 93,
    overallRating: 4.5,
    metro: [
      { name: 'New Town Metro (Under Construction)', distance: '2.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'DPS Newtown', distance: '1.0 km', rating: 4.6 },
      { name: 'Techno India Group School', distance: '1.5 km', rating: 4.4 }
    ],
    hospitals: [
      { name: 'Tata Medical Center', distance: '2.5 km', rating: 4.8 },
      { name: 'Medica Superspecialty Hospital', distance: '3.0 km', rating: 4.6 }
    ],
    shopping: [
      { name: 'Axis Mall', distance: '1.5 km', type: 'Mall' },
      { name: 'Eco Park', distance: '2.0 km', type: 'Park' }
    ],
    restaurants: 80,
    groceryStores: 30,
    avgPropertyPrice: '₹5,500 - ₹9,000 per sq.ft'
  },

  // AHMEDABAD
  'sg highway, ahmedabad': {
    location: 'SG Highway, Ahmedabad',
    safetyScore: 88,
    overallRating: 4.3,
    metro: [
      { name: 'Ahmedabad Metro (Upcoming)', distance: '3.0 km', type: 'Metro' }
    ],
    schools: [
      { name: 'Anand Niketan School', distance: '1.5 km', rating: 4.5 },
      { name: 'DPS Bopal', distance: '3.0 km', rating: 4.4 }
    ],
    hospitals: [
      { name: 'Sterling Hospital', distance: '2.0 km', rating: 4.5 },
      { name: 'Apollo Hospital', distance: '4.0 km', rating: 4.7 }
    ],
    shopping: [
      { name: 'Iscon Mega Mall', distance: '1.0 km', type: 'Mall' },
      { name: 'SG Mall', distance: '1.5 km', type: 'Mall' }
    ],
    restaurants: 95,
    groceryStores: 35,
    avgPropertyPrice: '₹5,500 - ₹9,000 per sq.ft'
  }
};

// Get all neighborhoods overview
router.get('/', (req, res) => {
  try {
    const neighborhoods = Object.values(neighborhoodData).map(area => ({
      location: area.location,
      safetyScore: area.safetyScore,
      overallRating: area.overallRating,
      avgPropertyPrice: area.avgPropertyPrice
    }));
    res.json({ success: true, data: neighborhoods, count: neighborhoods.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching neighborhoods' });
  }
});

// Get list of all available locations for autocomplete
router.get('/locations', (req, res) => {
  try {
    const locations = Object.values(neighborhoodData).map(area => area.location);
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching locations' });
  }
});

// Search for neighborhood data
router.get('/search', (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const normalizedQuery = query.toString().toLowerCase().trim();
    
    // First try exact match
    let data = neighborhoodData[normalizedQuery];
    
    // If no exact match, try partial match
    if (!data) {
      const keys = Object.keys(neighborhoodData);
      const matchedKey = keys.find(key => 
        key.includes(normalizedQuery) || 
        normalizedQuery.includes(key.split(',')[0].trim()) ||
        key.split(',')[0].includes(normalizedQuery)
      );
      
      if (matchedKey) {
        data = neighborhoodData[matchedKey];
      }
    }

    if (data) {
      res.json({ success: true, data });
    } else {
      // Cities with OPERATIONAL metro systems in India (as of 2024)
      // Only includes metros that are currently running and serving passengers
      const metroEnabledCities = [
        'delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'ghaziabad', 'faridabad', 'greater noida', // Delhi NCR
        'mumbai', 'navi mumbai', // Mumbai Region (Thane metro not yet operational)
        'bangalore', 'bengaluru', // Bangalore (Namma Metro)
        'chennai', // Chennai Metro
        'kolkata', 'howrah', // Kolkata Metro
        'hyderabad', 'secunderabad', // Hyderabad Metro
        'jaipur', // Jaipur Metro (Pink Line operational)
        'lucknow', // Lucknow Metro
        'kochi', 'cochin', 'ernakulam', // Kochi Metro
        'nagpur', // Nagpur Metro (Aqua Line operational)
        'ahmedabad', 'gandhinagar', // Ahmedabad Metro
        'pune', 'pimpri', 'chinchwad' // Pune Metro (partially operational)
        // NOT included (under construction/planned): Surat, Kanpur, Agra, Bhopal, Indore, Patna, Meerut
      ];
      
      // Major cities (tier 1 and tier 2)
      const majorCities = [
        'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 
        'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore',
        'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ghaziabad',
        'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan',
        'varanasi', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad',
        'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada',
        'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur',
        'hubli', 'mysore', 'tiruchirappalli', 'bareilly', 'aligarh', 'tiruppur',
        'moradabad', 'bhubaneswar', 'salem', 'warangal', 'guntur', 'dehradun'
      ];
      
      // Check if the searched location is in a metro-enabled city
      const hasMetro = metroEnabledCities.some(city => normalizedQuery.includes(city));
      const isMajorCity = majorCities.some(city => normalizedQuery.includes(city));
      
      // Generate appropriate transit options
      let transitOptions = [];
      if (hasMetro) {
        transitOptions = [
          { name: 'Nearest Metro Station', distance: (Math.random() * 5 + 2).toFixed(1) + ' km', type: 'Metro' },
          { name: 'Railway Station', distance: (Math.random() * 8 + 3).toFixed(1) + ' km', type: 'Railway' }
        ];
      } else if (isMajorCity) {
        transitOptions = [
          { name: 'Bus Stand', distance: (Math.random() * 3 + 1).toFixed(1) + ' km', type: 'Bus' },
          { name: 'Railway Station', distance: (Math.random() * 5 + 2).toFixed(1) + ' km', type: 'Railway' }
        ];
      } else {
        // Smaller cities/towns - only bus stand and railway
        transitOptions = [
          { name: 'Bus Stand', distance: (Math.random() * 2 + 0.5).toFixed(1) + ' km', type: 'Bus' },
          { name: 'Railway Station', distance: (Math.random() * 6 + 2).toFixed(1) + ' km', type: 'Railway' }
        ];
      }
      
      // Determine property price range based on city tier
      let priceRange = '₹2,000 - ₹5,000 per sq.ft'; // Default for small towns
      if (normalizedQuery.includes('mumbai') || normalizedQuery.includes('delhi') || normalizedQuery.includes('bangalore') || normalizedQuery.includes('bengaluru')) {
        priceRange = '₹15,000 - ₹35,000 per sq.ft';
      } else if (normalizedQuery.includes('chennai') || normalizedQuery.includes('hyderabad') || normalizedQuery.includes('pune') || normalizedQuery.includes('kolkata')) {
        priceRange = '₹8,000 - ₹20,000 per sq.ft';
      } else if (isMajorCity) {
        priceRange = '₹4,000 - ₹12,000 per sq.ft';
      }
      
      // Generate safety score based on city tier
      let safetyScore = Math.floor(Math.random() * 10) + 75; // 75-85 for small towns
      if (isMajorCity) {
        safetyScore = Math.floor(Math.random() * 10) + 80; // 80-90 for major cities
      }
      
      // Generate note based on metro availability
      let note = 'This is estimated data based on general area characteristics. For accurate information, please contact our team.';
      if (!hasMetro) {
        note = 'This area does not have metro connectivity. ' + note;
      }
      
      res.json({ 
        success: true, 
        data: {
          location: query,
          safetyScore: safetyScore,
          overallRating: (Math.random() * 1 + 3.5).toFixed(1),
          metro: transitOptions,
          schools: [
            { name: 'Government School', distance: (Math.random() * 1.5 + 0.5).toFixed(1) + ' km', rating: parseFloat((Math.random() * 0.8 + 3.5).toFixed(1)) },
            { name: 'Private School', distance: (Math.random() * 2 + 1).toFixed(1) + ' km', rating: parseFloat((Math.random() * 0.8 + 4).toFixed(1)) }
          ],
          hospitals: [
            { name: isMajorCity ? 'Multi-Specialty Hospital' : 'District Hospital', distance: (Math.random() * 3 + 1).toFixed(1) + ' km', rating: parseFloat((Math.random() * 0.8 + 3.5).toFixed(1)) },
            { name: isMajorCity ? 'Private Hospital' : 'Primary Health Center', distance: (Math.random() * 4 + 2).toFixed(1) + ' km', rating: parseFloat((Math.random() * 0.8 + 3.8).toFixed(1)) }
          ],
          shopping: [
            { name: isMajorCity ? 'Shopping Mall' : 'Local Market', distance: (Math.random() * 2 + 0.5).toFixed(1) + ' km', type: isMajorCity ? 'Mall' : 'Market' },
            { name: 'Weekly Haat/Bazaar', distance: (Math.random() * 1.5 + 0.3).toFixed(1) + ' km', type: 'Market' }
          ],
          restaurants: isMajorCity ? Math.floor(Math.random() * 40) + 40 : Math.floor(Math.random() * 20) + 10,
          groceryStores: isMajorCity ? Math.floor(Math.random() * 20) + 20 : Math.floor(Math.random() * 10) + 8,
          avgPropertyPrice: priceRange,
          note: note
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching neighborhood' });
  }
});

// Get specific neighborhood by exact name
router.get('/:location', (req, res) => {
  try {
    const location = req.params.location.toLowerCase().trim();
    const data = neighborhoodData[location];

    if (data) {
      res.json({ success: true, data });
    } else {
      res.status(404).json({ success: false, message: 'Neighborhood not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching neighborhood data' });
  }
});

module.exports = router;

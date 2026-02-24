const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

// Real Investment Opportunities based on Indian Government Data
const investmentOpportunities = [
  {
    id: 1,
    category: 'Infrastructure',
    title: 'National Infrastructure Pipeline (NIP)',
    description: 'India\'s ₹111 lakh crore infrastructure development plan covering roads, railways, airports, and urban infrastructure across all states.',
    investmentHighlight: '₹111 Lakh Crore by 2027',
    sectors: ['Roads & Highways', 'Railways', 'Urban Infrastructure', 'Airports', 'Ports'],
    governmentSource: 'Ministry of Finance, Government of India',
    benefits: [
      'FDI up to 100% allowed in infrastructure',
      'Tax holidays for infrastructure projects',
      'Land acquisition support from government',
      'Single window clearance for projects'
    ],
    expectedROI: '12-18% annually',
    timeline: '2020-2027 (Extended)',
    officialLink: 'https://indiainvestmentgrid.gov.in/',
    icon: 'road'
  },
  {
    id: 2,
    category: 'Smart Cities',
    title: 'Smart Cities Mission',
    description: 'Development of 100 smart cities with modern infrastructure, sustainable environment, and citizen-friendly governance.',
    investmentHighlight: '₹2.05 Lakh Crore Investment',
    sectors: ['Urban Development', 'IT Infrastructure', 'Sustainable Energy', 'Transportation'],
    governmentSource: 'Ministry of Housing and Urban Affairs',
    benefits: [
      '100% FDI allowed in townships',
      'PPP model opportunities',
      'Tax incentives for green buildings',
      'Fast-track approvals in smart city zones'
    ],
    expectedROI: '10-15% annually',
    timeline: '2015-2027 (Extended)',
    officialLink: 'https://smartcities.gov.in/',
    icon: 'city'
  },
  {
    id: 3,
    category: 'Industrial Corridors',
    title: 'Delhi-Mumbai Industrial Corridor (DMIC)',
    description: 'Mega infrastructure project spanning 1,504 km with 24 investment regions, 8 smart cities, and world-class infrastructure.',
    investmentHighlight: '₹100 Lakh Crore+ Investment',
    sectors: ['Manufacturing', 'Logistics', 'Industrial Parks', 'Export Zones'],
    governmentSource: 'DMIC Development Corporation',
    benefits: [
      'Single window clearance',
      'Plug-and-play factory spaces',
      'Dedicated freight corridor connectivity',
      'Tax-free zones for exports'
    ],
    expectedROI: '15-22% annually',
    timeline: '2008-2028',
    officialLink: 'https://www.dmicdc.com/',
    icon: 'factory'
  },
  {
    id: 4,
    category: 'Airports',
    title: 'UDAN - Regional Connectivity Scheme',
    description: 'Development of 100+ new airports and upgrading existing ones to boost regional air connectivity across India.',
    investmentHighlight: '₹4,500 Crore Subsidy Support',
    sectors: ['Aviation', 'Tourism', 'Hospitality', 'Logistics'],
    governmentSource: 'Ministry of Civil Aviation',
    benefits: [
      '100% FDI allowed in airports',
      'Viability gap funding available',
      'Land at concessional rates',
      'Revenue guarantee for 10 years'
    ],
    expectedROI: '8-14% annually',
    timeline: '2016-2028 (Extended)',
    officialLink: 'https://www.civilaviation.gov.in/',
    icon: 'plane'
  },
  {
    id: 5,
    category: 'Expressways',
    title: 'Bharatmala Pariyojana',
    description: 'Umbrella program for highway development covering 65,000 km including economic corridors, inter-corridors, and expressways.',
    investmentHighlight: '₹10.63 Lakh Crore Investment',
    sectors: ['Highways', 'Logistics Parks', 'Wayside Amenities', 'Multi-modal Hubs'],
    governmentSource: 'National Highways Authority of India (NHAI)',
    benefits: [
      '100% FDI in road development',
      'Toll collection rights (BOT model)',
      'InvIT investment opportunities',
      '30-year concession periods'
    ],
    expectedROI: '12-16% annually',
    timeline: '2017-2027',
    officialLink: 'https://bharatmala.nhai.gov.in/',
    icon: 'highway'
  },
  {
    id: 6,
    category: 'Railways',
    title: 'Dedicated Freight Corridors',
    description: 'Eastern and Western Dedicated Freight Corridors spanning 3,306 km to revolutionize freight transportation in India.',
    investmentHighlight: '₹1.5 Lakh Crore Investment',
    sectors: ['Railways', 'Logistics', 'Warehousing', 'Industrial Zones'],
    governmentSource: 'Ministry of Railways',
    benefits: [
      'Private train operations allowed',
      'Logistics park development opportunities',
      'Multi-modal connectivity',
      'Reduced logistics cost by 30%'
    ],
    expectedROI: '10-14% annually',
    timeline: '2006-2027 (Extended)',
    officialLink: 'https://dfccil.com/',
    icon: 'train'
  },
  {
    id: 7,
    category: 'Renewable Energy',
    title: 'National Solar Mission',
    description: 'Target of 500 GW renewable energy capacity by 2030, with massive opportunities in solar, wind, and hybrid projects.',
    investmentHighlight: '₹15 Lakh Crore Investment Needed',
    sectors: ['Solar Power', 'Wind Energy', 'Energy Storage', 'Green Hydrogen'],
    governmentSource: 'Ministry of New and Renewable Energy',
    benefits: [
      '100% FDI allowed',
      'Accelerated depreciation benefits',
      'Waiver of inter-state transmission charges',
      'Priority sector lending'
    ],
    expectedROI: '14-20% annually',
    timeline: '2010-2030',
    officialLink: 'https://mnre.gov.in/',
    icon: 'sun'
  },
  {
    id: 8,
    category: 'Industrial Parks',
    title: 'PM Gati Shakti National Master Plan',
    description: 'Integrated infrastructure development across 16 ministries for seamless multi-modal connectivity and logistics efficiency.',
    investmentHighlight: '₹100+ Lakh Crore Projects',
    sectors: ['Logistics', 'Manufacturing', 'Textiles', 'Pharmaceuticals', 'Electronics'],
    governmentSource: 'DPIIT, Ministry of Commerce',
    benefits: [
      'Single window portal for all clearances',
      'GIS-based project monitoring',
      'Reduced logistics costs',
      'Time-bound project approvals'
    ],
    expectedROI: '12-18% annually',
    timeline: '2021-2030',
    officialLink: 'https://pmgatishakti.gov.in/',
    icon: 'network'
  },
  {
    id: 9,
    category: 'Real Estate Investment Trusts',
    title: 'REITs & InvITs',
    description: 'SEBI-regulated investment vehicles allowing NRIs to invest in Indian real estate and infrastructure without direct property ownership.',
    investmentHighlight: '₹1.3 Lakh Crore+ Market Cap',
    sectors: ['Commercial Real Estate', 'Retail', 'Warehousing', 'Infrastructure'],
    governmentSource: 'Securities and Exchange Board of India (SEBI)',
    benefits: [
      'No minimum investment barriers',
      'Regular dividend income',
      'Professional management',
      'Easy exit through stock exchange',
      'No stamp duty or registration'
    ],
    expectedROI: '7-10% dividend + capital appreciation',
    timeline: 'Ongoing',
    officialLink: 'https://www.sebi.gov.in/',
    icon: 'chart'
  },
  {
    id: 10,
    category: 'SEZ & Free Trade',
    title: 'Special Economic Zones',
    description: 'Over 270 operational SEZs offering tax benefits, simplified procedures, and world-class infrastructure for export businesses.',
    investmentHighlight: '₹6+ Lakh Crore Exports',
    sectors: ['IT/ITES', 'Pharmaceuticals', 'Gems & Jewelry', 'Engineering', 'Textiles'],
    governmentSource: 'Ministry of Commerce and Industry',
    benefits: [
      '100% income tax exemption for 5 years',
      '50% exemption for next 5 years',
      'Duty-free imports',
      'Single window clearance',
      'No minimum export obligation'
    ],
    expectedROI: '15-25% annually',
    timeline: 'Ongoing',
    officialLink: 'https://sezindia.nic.in/',
    icon: 'building'
  }
];

// Foreign Investor Leads storage
const foreignInvestorLeads = [];

// Government Guidelines for NRI Property Investment
const governmentGuidelines = {
  title: 'NRI Property Investment Guidelines - India',
  issuedBy: 'Reserve Bank of India (RBI) & Ministry of Finance',
  lastUpdated: '2026-01-15',
  downloadUrl: 'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12380&Mode=0',
  alternateUrl: 'https://www.fema.rbi.org.in/',
  keyRegulations: [
    {
      title: 'FEMA Guidelines',
      description: 'Foreign Exchange Management Act regulations for NRI property acquisition',
      details: [
        'NRIs can purchase residential and commercial properties',
        'No limit on number of residential properties',
        'Payment must be through NRE/NRO/FCNR accounts or inward remittance',
        'Agricultural land, plantation property, and farmhouse cannot be purchased'
      ]
    },
    {
      title: 'Repatriation Rules',
      description: 'Rules for sending money back to country of residence',
      details: [
        'Sale proceeds of 2 residential properties can be repatriated',
        'Repatriation allowed up to USD 1 million per financial year',
        'For inherited property, repatriation subject to conditions',
        'Commercial property proceeds fully repatriable'
      ]
    },
    {
      title: 'Tax Obligations',
      description: 'Tax requirements for NRI property transactions',
      details: [
        'TDS of 20% on long-term capital gains',
        'TDS of 30% on short-term capital gains',
        'Stamp duty and registration charges apply',
        'GST applicable on under-construction properties'
      ]
    },
    {
      title: 'Documentation Required',
      description: 'Essential documents for NRI property purchase',
      details: [
        'Valid Indian passport (current or expired)',
        'OCI/PIO card if applicable',
        'Address proof of overseas residence',
        'PAN card (mandatory for property transactions)',
        'Power of Attorney if buying through representative',
        'NRE/NRO bank account statements'
      ]
    }
  ],
  taxBenefits: [
    {
      section: 'Section 24(b)',
      benefit: 'Deduction up to ₹2 lakh on home loan interest',
      eligibility: 'Self-occupied property'
    },
    {
      section: 'Section 80C',
      benefit: 'Deduction up to ₹1.5 lakh on principal repayment',
      eligibility: 'All NRIs with home loans'
    },
    {
      section: 'Section 80EEA',
      benefit: 'Additional deduction of ₹1.5 lakh',
      eligibility: 'First-time buyers, property value up to ₹45 lakh'
    },
    {
      section: 'Section 54',
      benefit: 'Exemption on LTCG if reinvested in property',
      eligibility: 'Property sold after 2 years'
    },
    {
      section: 'Section 54EC',
      benefit: 'Exemption on LTCG if invested in specified bonds',
      eligibility: 'Investment within 6 months of sale'
    }
  ],
  steps: [
    { step: 1, title: 'Open NRE/NRO Account', description: 'Required for all property transactions' },
    { step: 2, title: 'Obtain PAN Card', description: 'Mandatory for property purchase and tax filing' },
    { step: 3, title: 'Arrange Power of Attorney', description: 'If not present in India for registration' },
    { step: 4, title: 'Property Selection & Due Diligence', description: 'Verify RERA registration and legal titles' },
    { step: 5, title: 'Make Payment', description: 'Through banking channels from NRE/NRO account' },
    { step: 6, title: 'Registration', description: 'Complete sale deed registration' },
    { step: 7, title: 'Mutation & Records', description: 'Update property records in your name' }
  ]
};

// NRI Statistics
const nriStatistics = {
  totalInvestment2023: '$13.1 billion',
  yoyGrowth: '+15%',
  topSourceCountries: [
    { country: 'USA', percentage: 35, flag: '🇺🇸' },
    { country: 'UAE', percentage: 25, flag: '🇦🇪' },
    { country: 'UK', percentage: 15, flag: '🇬🇧' },
    { country: 'Singapore', percentage: 10, flag: '🇸🇬' },
    { country: 'Canada', percentage: 8, flag: '🇨🇦' },
    { country: 'Australia', percentage: 7, flag: '🇦🇺' }
  ],
  topDestinationCities: [
    { city: 'Mumbai', percentage: 28 },
    { city: 'Bangalore', percentage: 22 },
    { city: 'Delhi NCR', percentage: 18 },
    { city: 'Hyderabad', percentage: 12 },
    { city: 'Pune', percentage: 10 },
    { city: 'Chennai', percentage: 10 }
  ],
  preferredPropertyTypes: [
    { type: 'Apartments', percentage: 45 },
    { type: 'Villas', percentage: 25 },
    { type: 'Plots', percentage: 15 },
    { type: 'Commercial', percentage: 15 }
  ],
  avgInvestmentSize: '₹1.2 Cr - ₹3 Cr'
};

// Store NRI inquiries (in production, this would go to database)
const nriInquiries = [];

// Store site visit bookings
const siteVisitBookings = [];

// Store video call requests
const videoCallRequests = [];

// =============== API ROUTES ===============

// Get NRI overview data
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalOpportunities: investmentOpportunities.length,
        featuredOpportunities: investmentOpportunities.slice(0, 3),
        guidelines: governmentGuidelines,
        statistics: nriStatistics,
        supportedCountries: ['USA', 'UK', 'UAE', 'Canada', 'Australia', 'Singapore', 'Germany', 'Japan'],
        services: ['Property Search', 'Legal Assistance', 'Tax Planning', 'Property Management', 'Video Consultations']
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching NRI data' });
  }
});

// Get all investment opportunities
router.get('/opportunities', (req, res) => {
  try {
    const { type, location, minPrice, maxPrice } = req.query;
    
    let filtered = [...investmentOpportunities];
    
    if (type) {
      filtered = filtered.filter(opp => opp.type.toLowerCase() === type.toLowerCase());
    }
    
    if (location) {
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({ 
      success: true, 
      data: filtered,
      count: filtered.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching opportunities' });
  }
});

// Get single opportunity
router.get('/opportunities/:id', (req, res) => {
  try {
    const opportunity = investmentOpportunities.find(o => o.id === parseInt(req.params.id));
    if (opportunity) {
      res.json({ success: true, data: opportunity });
    } else {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching opportunity' });
  }
});

// Get government guidelines
router.get('/guidelines', (req, res) => {
  try {
    res.json({ success: true, data: governmentGuidelines });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching guidelines' });
  }
});

// Get NRI statistics
router.get('/statistics', (req, res) => {
  try {
    res.json({ success: true, data: nriStatistics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
});

// Submit NRI inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const { name, email, phone, country, message, propertyInterest, budget } = req.body;
    
    if (!name || !email || !phone || !country) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, and country are required' 
      });
    }
    
    // Save to Lead collection for admin panel visibility
    const lead = new Lead({
      name,
      email,
      phone,
      leadType: 'nri_inquiry',
      isNRI: true,
      country,
      message: message || `NRI Inquiry - Interest: ${propertyInterest || 'General'}. Budget: ${budget || 'Not specified'}`,
      source: 'nri_portal',
      budget: {
        min: 0,
        max: budget ? parseInt(budget.replace(/[^0-9]/g, '')) || 0 : 0
      }
    });
    
    await lead.save();
    
    // Also save to in-memory for backward compatibility
    const inquiry = {
      id: lead._id,
      name,
      email,
      phone,
      country,
      message: message || '',
      propertyInterest: propertyInterest || 'General',
      budget: budget || 'Not specified',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    
    nriInquiries.push(inquiry);
    
    res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully. Our NRI specialist will contact you within 24 hours.',
      data: { id: lead._id }
    });
  } catch (error) {
    console.error('Error submitting NRI inquiry:', error);
    res.status(500).json({ success: false, message: 'Error submitting inquiry' });
  }
});

// Submit Foreign Investor Lead (for investment opportunities)
router.post('/investor-lead', (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      country, 
      investmentInterest, 
      investmentAmount, 
      timeline,
      sectors,
      message,
      opportunityId,
      opportunityTitle
    } = req.body;
    
    if (!name || !email || !phone || !country) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, and country are required' 
      });
    }
    
    const lead = {
      id: Date.now(),
      type: 'Foreign Investor',
      name,
      email,
      phone,
      country,
      investmentInterest: investmentInterest || 'General',
      investmentAmount: investmentAmount || 'Not specified',
      timeline: timeline || 'Not specified',
      sectors: sectors || [],
      message: message || '',
      opportunityId: opportunityId || null,
      opportunityTitle: opportunityTitle || 'General Investment Inquiry',
      status: 'New',
      priority: 'High',
      source: 'NRI Investment Portal',
      createdAt: new Date().toISOString()
    };
    
    foreignInvestorLeads.push(lead);
    
    // Also add to general NRI inquiries for backwards compatibility
    nriInquiries.push({
      ...lead,
      propertyInterest: `Investment: ${lead.opportunityTitle}`,
      budget: lead.investmentAmount
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your interest! Our investment specialist will contact you within 24 hours.',
      data: { leadId: lead.id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting lead' });
  }
});

// Get all foreign investor leads (admin)
router.get('/investor-leads', (req, res) => {
  try {
    res.json({ success: true, data: foreignInvestorLeads, count: foreignInvestorLeads.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching investor leads' });
  }
});

// Alias for foreign-investor-interest (same as investor-lead)
router.post('/foreign-investor-interest', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      country, 
      investmentInterest, 
      investmentAmount, 
      timeline,
      sectors,
      message,
      opportunityId,
      opportunityTitle
    } = req.body;
    
    if (!name || !email || !phone || !country) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, and country are required' 
      });
    }
    
    // Save to MongoDB
    const lead = new Lead({
      name,
      email,
      phone,
      country,
      isNRI: true,
      leadType: 'foreign_investor',
      investmentInterest: investmentInterest || 'General',
      investmentAmount: investmentAmount || 'Not specified',
      investmentTimeline: timeline || 'Not specified',
      sectors: sectors || [],
      message: message || '',
      opportunityTitle: opportunityTitle || 'General Investment Inquiry',
      status: 'new',
      priority: 'high',
      source: 'nri_portal'
    });
    
    await lead.save();
    
    // Automatically create customer record from NRI lead
    try {
      await Customer.findOrCreateCustomer({
        name,
        email,
        phone,
        source: 'nri_inquiry',
        notes: `NRI Lead - Country: ${country}. Investment Interest: ${investmentInterest || 'General'}. Amount: ${investmentAmount || 'Not specified'}. Opportunity: ${opportunityTitle || 'General Investment Inquiry'}`
      });
      console.log('Customer record created from NRI lead:', { name, email, phone });
    } catch (customerError) {
      console.error('Error creating customer from NRI lead:', customerError);
    }
    
    // Also keep in memory for backwards compatibility
    foreignInvestorLeads.push({
      id: lead._id,
      type: 'Foreign Investor',
      name,
      email,
      phone,
      country,
      investmentInterest: investmentInterest || 'General',
      investmentAmount: investmentAmount || 'Not specified',
      timeline: timeline || 'Not specified',
      sectors: sectors || [],
      message: message || '',
      opportunityId: opportunityId || null,
      opportunityTitle: opportunityTitle || 'General Investment Inquiry',
      status: 'New',
      priority: 'High',
      source: 'NRI Investment Portal',
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your interest! Our investment specialist will contact you within 24 hours.',
      data: { leadId: lead._id }
    });
  } catch (error) {
    console.error('Error saving foreign investor lead:', error);
    res.status(500).json({ success: false, message: 'Error submitting lead' });
  }
});

// Book site visit
router.post('/book-visit', async (req, res) => {
  try {
    const { name, email, phone, country, visitDate, propertyIds, notes } = req.body;
    
    if (!name || !email || !phone || !visitDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, and visit date are required' 
      });
    }
    
    // Save to Lead collection for admin panel visibility
    const lead = new Lead({
      name,
      email,
      phone,
      leadType: 'nri_inquiry',
      isNRI: true,
      country: country || 'Not specified',
      message: `Site Visit Booking - Date: ${visitDate}. Properties: ${propertyIds?.join(', ') || 'General visit'}. Notes: ${notes || 'None'}`,
      source: 'nri_portal'
    });
    
    await lead.save();
    
    const booking = {
      id: lead._id,
      name,
      email,
      phone,
      country: country || 'Not specified',
      visitDate,
      propertyIds: propertyIds || [],
      notes: notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    siteVisitBookings.push(booking);
    
    res.status(201).json({ 
      success: true, 
      message: 'Site visit booked successfully. We will confirm your schedule shortly.',
      data: { bookingId: lead._id, visitDate }
    });
  } catch (error) {
    console.error('Error booking site visit:', error);
    res.status(500).json({ success: false, message: 'Error booking site visit' });
  }
});

// Request video call
router.post('/video-call', async (req, res) => {
  try {
    const { name, email, phone, country, timezone, preferredTime, topic } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone are required' 
      });
    }
    
    // Save to Lead collection for admin panel visibility
    const lead = new Lead({
      name,
      email,
      phone,
      leadType: 'nri_inquiry',
      isNRI: true,
      country: country || 'Not specified',
      message: `Video Call Request - Timezone: ${timezone || 'IST'}. Preferred Time: ${preferredTime || 'Any'}. Topic: ${topic || 'General Consultation'}`,
      source: 'nri_portal'
    });
    
    await lead.save();
    
    const request = {
      id: lead._id,
      name,
      email,
      phone,
      country: country || 'Not specified',
      timezone: timezone || 'IST',
      preferredTime: preferredTime || 'Any',
      topic: topic || 'General Consultation',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    videoCallRequests.push(request);
    
    res.status(201).json({ 
      success: true, 
      message: 'Video call request submitted. Our team will send you a meeting link.',
      data: { requestId: lead._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting video call request' });
  }
});

// Get all inquiries (admin)
router.get('/inquiries', (req, res) => {
  try {
    res.json({ success: true, data: nriInquiries, count: nriInquiries.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching inquiries' });
  }
});

// Get all site visit bookings (admin)
router.get('/bookings', (req, res) => {
  try {
    res.json({ success: true, data: siteVisitBookings, count: siteVisitBookings.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// Calculate tax benefits
router.post('/calculate-tax', (req, res) => {
  try {
    const { propertyValue, loanAmount, interestRate, tenure, selfOccupied } = req.body;
    
    if (!propertyValue || !loanAmount || !interestRate || !tenure) {
      return res.status(400).json({ 
        success: false, 
        message: 'Property value, loan amount, interest rate, and tenure are required' 
      });
    }
    
    const annualInterest = (loanAmount * interestRate / 100);
    const monthlyEMI = (loanAmount * (interestRate/100/12) * Math.pow(1 + interestRate/100/12, tenure*12)) 
                       / (Math.pow(1 + interestRate/100/12, tenure*12) - 1);
    const annualPrincipal = (monthlyEMI * 12) - annualInterest;
    
    // Section 24(b) - Interest deduction
    const section24Benefit = selfOccupied ? Math.min(annualInterest, 200000) : annualInterest;
    
    // Section 80C - Principal deduction
    const section80CBenefit = Math.min(annualPrincipal, 150000);
    
    // Section 80EEA (if applicable - first time buyer, property < 45L)
    const section80EEABenefit = (propertyValue <= 4500000 && annualInterest > 200000) 
      ? Math.min(annualInterest - 200000, 150000) : 0;
    
    const totalAnnualBenefit = section24Benefit + section80CBenefit + section80EEABenefit;
    
    // Assuming 30% tax bracket
    const taxSaved = totalAnnualBenefit * 0.30;
    
    res.json({ 
      success: true, 
      data: {
        monthlyEMI: Math.round(monthlyEMI),
        annualInterest: Math.round(annualInterest),
        annualPrincipal: Math.round(annualPrincipal),
        deductions: {
          section24b: Math.round(section24Benefit),
          section80C: Math.round(section80CBenefit),
          section80EEA: Math.round(section80EEABenefit),
          total: Math.round(totalAnnualBenefit)
        },
        estimatedTaxSaved: Math.round(taxSaved),
        effectiveInterestRate: ((annualInterest - taxSaved) / loanAmount * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error calculating tax benefits' });
  }
});

// Get all foreign investor leads from MongoDB (admin/public)
router.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find({ leadType: 'foreign_investor' })
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ 
      success: true, 
      data: leads,
      count: leads.length 
    });
  } catch (error) {
    console.error('Error fetching foreign investor leads:', error);
    res.status(500).json({ success: false, message: 'Error fetching leads' });
  }
});

// Get foreign investor leads stats
router.get('/leads/stats', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({ leadType: 'foreign_investor' });
    const newLeads = await Lead.countDocuments({ leadType: 'foreign_investor', status: 'new' });
    const convertedLeads = await Lead.countDocuments({ leadType: 'foreign_investor', status: 'converted' });
    
    const byCountry = await Lead.aggregate([
      { $match: { leadType: 'foreign_investor' } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalLeads,
        new: newLeads,
        converted: convertedLeads,
        byCountry
      }
    });
  } catch (error) {
    console.error('Error fetching leads stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

module.exports = router;

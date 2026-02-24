const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/customers/test/count
// @desc    Get customer count (PUBLIC - for testing)
// @access  Public
router.get('/test/count', async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const recentCount = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 3600000) } // Last hour
    });
    const bySource = await Customer.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const latest = await Customer.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      total,
      recentCount,
      bySource,
      latest: latest.map(c => ({
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        source: c.source,
        createdAt: c.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
});

// @route   GET /api/customers
// @desc    Get all customers with filters and pagination
// @access  Private (Admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      source,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (source) filter.source = source;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const customers = await Customer.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Customer.countDocuments(filter);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/customers/stats
// @desc    Get customer statistics
// @access  Private (Admin only)
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    
    // By source
    const bySource = await Customer.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // By status
    const byStatus = await Customer.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Customer.countDocuments({ createdAt: { $gte: today } });

    // This week's count
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = await Customer.countDocuments({ createdAt: { $gte: weekAgo } });

    // This month's count
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthCount = await Customer.countDocuments({ createdAt: { $gte: monthAgo } });

    // With email
    const withEmail = await Customer.countDocuments({ email: { $ne: '' } });
    
    // With phone
    const withPhone = await Customer.countDocuments({ phone: { $ne: '' } });

    res.json({
      success: true,
      data: {
        total,
        todayCount,
        weekCount,
        monthCount,
        withEmail,
        withPhone,
        bySource: bySource.map(s => ({ source: s._id || 'unknown', count: s.count })),
        byStatus: byStatus.map(s => ({ status: s._id || 'unknown', count: s.count }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/customers/export
// @desc    Export customers as CSV
// @access  Private (Admin only)
router.get('/export', auth, adminOnly, async (req, res) => {
  try {
    const { source, status, startDate, endDate } = req.query;
    const filter = {};

    if (source) filter.source = source;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });

    // Generate CSV
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Status', 'City', 'Country', 'Interested In', 'Budget', 'Created At'];
    const csvRows = [headers.join(',')];

    customers.forEach(c => {
      const row = [
        `"${c.name || ''}"`,
        `"${c.email || ''}"`,
        `"${c.phone || ''}"`,
        `"${c.source || ''}"`,
        `"${c.status || ''}"`,
        `"${c.city || ''}"`,
        `"${c.country || ''}"`,
        `"${c.interestedIn || ''}"`,
        `"${c.budget || ''}"`,
        `"${c.createdAt ? new Date(c.createdAt).toISOString() : ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=customers-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer
// @access  Private (Admin only)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/customers
// @desc    Create or update customer (public - for forms)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, source, sourceDetails, city, country, interestedIn, budget, message, notes } = req.body;

    // Must have at least email or phone or name
    if (!email && !phone && !name) {
      return res.status(400).json({ success: false, message: 'At least name, email or phone is required' });
    }

    const customerData = {
      name: name || '',
      email: email || '',
      phone: phone || '',
      source: source || 'other',
      sourceDetails: sourceDetails || '',
      city: city || '',
      country: country || 'India',
      interestedIn: interestedIn || '',
      budget: budget || '',
      message: message || '',
      notes: notes || '',
      ipAddress: req.ip || '',
      userAgent: req.get('User-Agent') || ''
    };

    const { customer, isNew } = await Customer.findOrCreateCustomer(customerData);

    res.status(isNew ? 201 : 200).json({
      success: true,
      data: customer,
      message: isNew ? 'Customer created successfully' : 'Customer updated successfully',
      isNew
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/customers/newsletter
// @desc    Subscribe to newsletter (email only)
// @access  Public
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const customerData = {
      email,
      source: 'newsletter',
      sourceDetails: 'Newsletter subscription',
      marketingConsent: true
    };

    const { customer, isNew } = await Customer.findOrCreateCustomer(customerData);

    res.status(200).json({
      success: true,
      message: isNew ? 'Successfully subscribed to newsletter!' : 'You are already subscribed!',
      isNew
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/customers/:id/status
// @desc    Update customer status
// @access  Private (Admin only)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: customer,
      message: 'Status updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/customers/bulk/delete
// @desc    Bulk delete customers
// @access  Private (Admin only)
router.post('/bulk/delete', auth, adminOnly, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No customer IDs provided' });
    }

    const result = await Customer.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} customers deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

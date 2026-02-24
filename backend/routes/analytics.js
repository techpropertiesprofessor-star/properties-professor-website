const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin)
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalProperties,
      activeProperties,
      featuredProperties,
      totalLeads,
      newLeadsThisMonth,
      convertedLeads,
      totalUsers,
      newUsersThisMonth,
      propertiesByCity,
      propertiesByType,
      leadsByStatus,
      recentProperties,
      topViewedProperties
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'available', isActive: true }),
      Property.countDocuments({ featured: true, isActive: true }),
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({ status: 'converted' }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$location.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Property.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title price priceInWords location status createdAt images analytics'),
      Property.find({ isActive: true })
        .sort({ 'analytics.views': -1 })
        .limit(5)
        .select('title price priceInWords location analytics images')
    ]);

    // Calculate trends
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const leadsLastMonth = await Lead.countDocuments({
      createdAt: { $gte: lastMonth, $lt: startOfMonth }
    });

    const leadTrend = leadsLastMonth > 0 
      ? ((newLeadsThisMonth - leadsLastMonth) / leadsLastMonth * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          featuredProperties,
          totalLeads,
          newLeadsThisMonth,
          leadTrend: parseFloat(leadTrend),
          convertedLeads,
          conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0,
          totalUsers,
          newUsersThisMonth
        },
        charts: {
          propertiesByCity,
          propertiesByType,
          leadsByStatus
        },
        recent: {
          properties: recentProperties,
          topViewed: topViewedProperties
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/properties
// @desc    Get property analytics
// @access  Private (Admin)
router.get('/properties', auth, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const [
      totalViews,
      totalLeads,
      avgViewsPerProperty,
      priceRangeDistribution,
      monthlyTrends
    ] = await Promise.all([
      Property.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$analytics.views' } } }
      ]),
      Property.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$analytics.leads' } } }
      ]),
      Property.aggregate([
        { $match: { ...matchStage, 'analytics.views': { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$analytics.views' } } }
      ]),
      Property.aggregate([
        { $match: matchStage },
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 5000000, 10000000, 25000000, 50000000, 100000000],
            default: '100Cr+',
            output: { count: { $sum: 1 } }
          }
        }
      ]),
      Property.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            views: { $sum: '$analytics.views' },
            leads: { $sum: '$analytics.leads' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalViews: totalViews[0]?.total || 0,
        totalLeads: totalLeads[0]?.total || 0,
        avgViewsPerProperty: Math.round(avgViewsPerProperty[0]?.avg || 0),
        priceRangeDistribution,
        monthlyTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/leads
// @desc    Get lead analytics
// @access  Private (Admin)
router.get('/leads', auth, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const [
      leadsBySource,
      leadsByStatus,
      conversionBySource,
      dailyLeads,
      avgResponseTime
    ] = await Promise.all([
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { ...matchStage, status: 'converted' } },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
        { $limit: 30 }
      ]),
      Lead.aggregate([
        { $match: { status: { $ne: 'new' }, notes: { $exists: true, $ne: [] } } },
        {
          $project: {
            responseTime: {
              $subtract: [
                { $arrayElemAt: ['$notes.createdAt', 0] },
                '$createdAt'
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        leadsBySource,
        leadsByStatus,
        conversionBySource,
        dailyLeads,
        avgResponseTimeHours: avgResponseTime[0]?.avgResponseTime 
          ? Math.round(avgResponseTime[0].avgResponseTime / (1000 * 60 * 60))
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

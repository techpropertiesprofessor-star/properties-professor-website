const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/news
// @desc    Get all news articles with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      breaking,
      search,
      tag,
      city
    } = req.query;

    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (featured) filter.isFeatured = featured === 'true';
    if (breaking) filter.isBreaking = breaking === 'true';
    if (tag) filter.tags = { $in: [tag] };
    if (city) filter.relatedCities = { $in: [city] };

    if (search) {
      filter.$text = { $search: search };
    }

    const news = await News.find(filter)
      .sort({ isBreaking: -1, isFeatured: -1, publishedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('relatedProperties', 'title location price images');

    const total = await News.countDocuments(filter);

    res.json({
      success: true,
      data: news,
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

// @route   GET /api/news/featured
// @desc    Get featured news
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const news = await News.find({ isFeatured: true, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title summary featuredImage slug category publishedAt');

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/news/breaking
// @desc    Get breaking news
// @access  Public
router.get('/breaking/list', async (req, res) => {
  try {
    const news = await News.find({ isBreaking: true, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title summary featuredImage slug category publishedAt');

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/news/categories
// @desc    Get all news categories with count
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await News.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryLabels = {
      'market-trends': 'Market Trends',
      'policy-updates': 'Policy Updates',
      'investment': 'Investment',
      'luxury-properties': 'Luxury Properties',
      'affordable-housing': 'Affordable Housing',
      'commercial': 'Commercial',
      'nri': 'NRI Corner',
      'interior-design': 'Interior Design',
      'legal': 'Legal',
      'general': 'General'
    };

    res.json({
      success: true,
      data: categories.map(c => ({
        id: c._id,
        label: categoryLabels[c._id] || c._id,
        count: c.count
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/news/:slug
// @desc    Get single news article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug, isPublished: true })
      .populate('relatedProperties', 'title location price images type developer');

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    // Increment view count
    news.views += 1;
    await news.save();

    // Get related news
    const relatedNews = await News.find({
      _id: { $ne: news._id },
      isPublished: true,
      $or: [
        { category: news.category },
        { tags: { $in: news.tags } },
        { relatedCities: { $in: news.relatedCities } }
      ]
    })
      .limit(4)
      .select('title summary featuredImage slug category publishedAt');

    res.json({
      success: true,
      data: { article: news, related: relatedNews }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/news
// @desc    Create new news article
// @access  Private (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const news = new News({
      ...req.body,
      createdBy: req.user.id
    });

    await news.save();

    res.status(201).json({
      success: true,
      data: news,
      message: 'News article created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news article
// @access  Private (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({
      success: true,
      data: news,
      message: 'News article updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news article
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/news/:id/publish
// @desc    Toggle publish status
// @access  Private (Admin only)
router.put('/:id/publish', auth, adminOnly, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    news.isPublished = !news.isPublished;
    if (news.isPublished && !news.publishedAt) {
      news.publishedAt = new Date();
    }

    await news.save();

    res.json({
      success: true,
      data: news,
      message: `News article ${news.isPublished ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

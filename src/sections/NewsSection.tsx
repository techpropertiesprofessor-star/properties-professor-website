import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Eye, TrendingUp, Building2, FileText, Gavel, Home, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface NewsArticle {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  featuredImage: string;
  isBreaking: boolean;
  publishedAt: string;
  views: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  'market-trends': TrendingUp,
  'policy-updates': Gavel,
  'investment': Building2,
  'luxury-properties': Home,
  'affordable-housing': Home,
  'commercial': Building2,
  'nri': Globe,
  'interior-design': Palette,
  'legal': FileText,
  'general': FileText
};

const categoryLabels: Record<string, string> = {
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

const API_BASE = 'https://api.propertiesprofessor.com/api';

const fallbackNews: NewsArticle[] = [
  {
    _id: '1',
    slug: 'mumbai-real-estate-market-growth-q1-2026',
    title: 'Mumbai Real Estate Market Shows Strong Growth in Q1 2026',
    summary: 'Mumbai property prices rose by 12% in the first quarter of 2026, driven by strong demand in suburban areas.',
    category: 'market-trends',
    featuredImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    isBreaking: true,
    publishedAt: new Date().toISOString(),
    views: 1250
  },
  {
    _id: '2',
    slug: 'rera-guidelines-home-buyers-2026',
    title: 'New RERA Guidelines for Home Buyers in 2026',
    summary: 'The government has introduced new guidelines to protect home buyers and ensure timely delivery of projects.',
    category: 'policy-updates',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    isBreaking: false,
    publishedAt: new Date().toISOString(),
    views: 890
  },
  {
    _id: '3',
    slug: 'investment-hotspots-bangalore-2026',
    title: 'Top 5 Investment Hotspots in Bangalore',
    summary: 'Discover the best areas in Bangalore for real estate investment with high appreciation potential.',
    category: 'investment',
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    isBreaking: false,
    publishedAt: new Date().toISOString(),
    views: 756
  }
];

const handleNewsClick = (slug: string) => {
  window.location.href = `/news/${slug}`;
};

export function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>(fallbackNews);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail) {
      setSubscribeMessage('Please enter your email');
      return;
    }
    
    setSubscribing(true);
    setSubscribeMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/customers/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await response.json();
      
      if (data.success) {
        setSubscribeMessage(data.message);
        setNewsletterEmail('');
      } else {
        setSubscribeMessage(data.message || 'Failed to subscribe');
      }
    } catch {
      setSubscribeMessage('Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE}/news?limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setNews(data.data);
          }
        }
      } catch (error) {
        // Silently use fallback data
        console.log('Using fallback news');
      }
    };
    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  const featuredArticle = news.find(n => n.isBreaking) || news[0];
  const otherArticles = filteredNews.filter(n => n._id !== featuredArticle?._id);

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
              Stay Updated
            </span>
            <h2 className="heading-2 text-gray-900 mt-2">
              Property News & Insights
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl">
              Get the latest updates on market trends, policy changes, and investment opportunities in Indian real estate.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/news'}
            variant="outline" 
            className="mt-6 md:mt-0 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
          >
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All News
          </button>
          {Object.entries(categoryLabels).slice(0, 6).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No news articles available yet.</p>
          </div>
        ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Article */}
          {featuredArticle && (
          <div 
            onClick={() => handleNewsClick(featuredArticle.slug)}
            className={`transition-all duration-700 delay-200 cursor-pointer ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <div className="group relative h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={featuredArticle.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {featuredArticle.isBreaking && (
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                      Breaking News
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    {categoryLabels[featuredArticle.category] || 'General'}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FF6B35] transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {featuredArticle.summary}
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredArticle.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Other Articles */}
          <div className={`space-y-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {otherArticles.map((article) => {
              const Icon = categoryIcons[article.category] || FileText;
              return (
                <div
                  key={article._id}
                  onClick={() => handleNewsClick(article.slug)}
                  className="group flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center">
                        <Icon className="w-3 h-3 text-[#1E3A5F]" />
                      </div>
                      <span className="text-xs font-medium text-[#1E3A5F]">
                        {categoryLabels[article.category]}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Newsletter CTA */}
        <div className={`mt-16 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] rounded-3xl p-8 md:p-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-white/70">
                Get the latest property news and market insights delivered to your inbox.
              </p>
              {subscribeMessage && (
                <p className={`text-sm mt-2 ${subscribeMessage.includes('Success') || subscribeMessage.includes('subscribed') ? 'text-green-400' : 'text-orange-400'}`}>
                  {subscribeMessage}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewsletterSubscribe()}
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Button 
                  onClick={handleNewsletterSubscribe}
                  disabled={subscribing}
                  className="btn-secondary whitespace-nowrap"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

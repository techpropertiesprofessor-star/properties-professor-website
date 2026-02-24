import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import { 
  Search, 
  Calendar, 
  Eye, 
  TrendingUp, 
  Building2, 
  FileText, 
  Gavel, 
  Home, 
  Globe, 
  Palette,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NewsArticle {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  featuredImage: string;
  isBreaking: boolean;
  isFeatured: boolean;
  publishedAt: string;
  views: number;
  author: {
    name: string;
    avatar?: string;
  };
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

const API_BASE = 'http://localhost:5001/api';

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

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
    fetchNews();
  }, [selectedCategory, page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/news?page=${page}&limit=12`;
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setNews(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredArticle = filteredNews.find(n => n.isFeatured || n.isBreaking);
  const otherArticles = filteredNews.filter(n => n._id !== featuredArticle?._id);

  const handleNewsClick = (slug: string) => {
    window.location.href = `/news/${slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-gradient-to-br from-[#1E3A5F] via-[#2d4a6f] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-[#FF6B35] font-semibold text-sm mb-4">
              📰 Stay Informed
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Property News & Insights
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Get the latest updates on market trends, policy changes, and investment opportunities in Indian real estate.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-2xl bg-white/95 border-0 shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setSelectedCategory('all'); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            All News
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setSelectedCategory(key); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Articles Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'No news articles have been published yet.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <div 
                onClick={() => handleNewsClick(featuredArticle.slug)}
                className="mb-12 cursor-pointer group"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-auto">
                      <img
                        src={featuredArticle.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {featuredArticle.isBreaking && (
                          <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Breaking News
                          </span>
                        )}
                        {featuredArticle.isFeatured && (
                          <span className="px-3 py-1 rounded-full bg-[#FF6B35] text-white text-xs font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="inline-flex items-center gap-2 text-[#1E3A5F] font-medium text-sm mb-3">
                        {(() => {
                          const Icon = categoryIcons[featuredArticle.category] || FileText;
                          return <Icon className="w-4 h-4" />;
                        })()}
                        {categoryLabels[featuredArticle.category] || 'General'}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-[#1E3A5F] transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {featuredArticle.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredArticle.publishedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {featuredArticle.views} views
                          </span>
                        </div>
                        <span className="text-[#FF6B35] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article) => {
                const Icon = categoryIcons[article.category] || FileText;
                return (
                  <article
                    key={article._id}
                    onClick={() => handleNewsClick(article.slug)}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {article.isBreaking && (
                          <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                            Breaking
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-full bg-white/90 text-gray-700 text-xs font-medium flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {categoryLabels[article.category]}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views}
                          </span>
                        </div>
                        <span className="text-[#FF6B35] font-medium group-hover:underline">
                          Read More
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-full font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-[#1E3A5F] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f] rounded-3xl p-8 md:p-12">
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
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNewsletterSubscribe()}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button 
                onClick={handleNewsletterSubscribe}
                disabled={subscribing}
                className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#e55a2a] transition-colors disabled:opacity-70"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

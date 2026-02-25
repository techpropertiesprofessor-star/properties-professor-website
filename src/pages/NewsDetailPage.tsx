import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import { 
  Calendar, 
  Eye, 
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  TrendingUp, 
  Building2, 
  FileText, 
  Gavel, 
  Home, 
  Globe, 
  Palette,
  Loader2,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsArticle {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  featuredImage: string;
  images?: Array<{ url: string; caption: string }>;
  isBreaking: boolean;
  isFeatured: boolean;
  publishedAt: string;
  views: number;
  likes: number;
  author: {
    name: string;
    avatar?: string;
    designation?: string;
  };
  tags?: string[];
  relatedCities?: string[];
}

interface RelatedArticle {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  featuredImage: string;
  category: string;
  publishedAt: string;
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

const API_BASE = 'http://143.198.94.42:5001/api';

interface NewsDetailPageProps {
  slug: string;
}

export default function NewsDetailPage({ slug }: NewsDetailPageProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/news/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setArticle(data.data.article);
        setRelatedNews(data.data.related || []);
      } else {
        setError(data.message || 'Article not found');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const handleRelatedClick = (relatedSlug: string) => {
    window.location.href = `/news/${relatedSlug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-[#1E3A5F]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-40 text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-8">{error || 'The article you are looking for does not exist.'}</p>
          <Button 
            onClick={() => window.location.href = '/news'}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = categoryIcons[article.category] || FileText;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Image */}
      <div className="relative pt-20">
        <div className="absolute inset-0 h-[500px] overflow-hidden">
          <img
            src={article.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-50" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/80 text-sm mb-8">
            <a href="/" className="hover:text-white">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/news" className="hover:text-white">News</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{categoryLabels[article.category] || 'Article'}</span>
          </nav>

          {/* Category & Breaking Badge */}
          <div className="flex items-center gap-3 mb-4">
            {article.isBreaking && (
              <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                Breaking News
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              <Icon className="w-4 h-4" />
              {categoryLabels[article.category] || 'General'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#FF6B35] flex items-center justify-center text-white text-lg font-bold">
                {article.author?.avatar ? (
                  <img src={article.author.avatar} alt={article.author.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  article.author?.name?.charAt(0) || 'P'
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{article.author?.name || 'Properties Professor'}</p>
                <p className="text-sm">{article.author?.designation || 'Editorial Team'}</p>
              </div>
            </div>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.views} views
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Summary */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#FF6B35] pl-6">
            {article.summary}
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Additional Images */}
          {article.images && article.images.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              {article.images.map((img, index) => (
                <figure key={index} className="rounded-xl overflow-hidden">
                  <img src={img.url} alt={img.caption || `Image ${index + 1}`} className="w-full h-48 object-cover" />
                  {img.caption && (
                    <figcaption className="text-sm text-gray-500 mt-2 text-center">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-[#1E3A5F] hover:text-white transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share & Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 font-medium">Share:</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors relative"
                >
                  <Copy className="w-5 h-5" />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/news'}
              variant="outline"
              className="border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((related) => (
                <article
                  key={related._id}
                  onClick={() => handleRelatedClick(related.slug)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={related.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-full bg-white/90 text-gray-700 text-xs font-medium">
                        {categoryLabels[related.category] || 'General'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(related.publishedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Author Box */}
        <div className="mb-12 bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#FF6B35] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {article.author?.avatar ? (
                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{article.author?.name || 'Properties Professor'}</h3>
              <p className="text-gray-500 mb-3">{article.author?.designation || 'Editorial Team'}</p>
              <p className="text-gray-600">
                Our editorial team brings you the latest insights and updates from India's real estate market. 
                Stay informed with expert analysis and comprehensive coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

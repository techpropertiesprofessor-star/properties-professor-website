import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  X,
  Upload,
  Star,
  AlertCircle,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  featuredImage: string;
  isPublished: boolean;
  isFeatured: boolean;
  isBreaking: boolean;
  publishedAt: string;
  views: number;
  author: { name: string };
}

interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  authorName: string;
  featuredImage: string;
  isFeatured: boolean;
  isBreaking: boolean;
}

const initialFormData: NewsFormData = {
  title: '',
  summary: '',
  content: '',
  category: 'general',
  authorName: 'Properties Professor',
  featuredImage: '',
  isFeatured: false,
  isBreaking: false
};

const categoryOptions = [
  { value: 'market-trends', label: 'Market Trends' },
  { value: 'policy-updates', label: 'Policy Updates' },
  { value: 'investment', label: 'Investment' },
  { value: 'luxury-properties', label: 'Luxury Properties' },
  { value: 'affordable-housing', label: 'Affordable Housing' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'nri', label: 'NRI Corner' },
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'legal', label: 'Legal' },
  { value: 'general', label: 'General' }
];

const API_BASE = 'https://api.propertiesprofessor.com/api';

export function NewsManager() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('pp_token');
      const response = await fetch(`${API_BASE}/news?limit=50`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setNews(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const token = localStorage.getItem('pp_token');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'news');
      formDataUpload.append('maxWidth', '1200');
      formDataUpload.append('quality', '85');

      const response = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, featuredImage: result.data.url }));
        setImagePreview(result.data.url);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();
  };

  const handleSaveNews = async (publish: boolean) => {
    if (!formData.title || !formData.summary) {
      alert('Please fill in title and summary');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('pp_token');

    const newsData = {
      title: formData.title,
      slug: generateSlug(formData.title),
      summary: formData.summary,
      content: formData.content || formData.summary,
      category: formData.category,
      author: { name: formData.authorName },
      featuredImage: formData.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
      isFeatured: formData.isFeatured,
      isBreaking: formData.isBreaking,
      isPublished: publish,
      publishedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newsData)
      });
      const data = await response.json();
      if (data.success) {
        alert(publish ? 'News published successfully!' : 'News saved as draft!');
        setShowAddModal(false);
        resetForm();
        fetchNews();
      } else {
        alert(data.message || 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Error saving news');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImagePreview('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    const token = localStorage.getItem('pp_token');
    try {
      const response = await fetch(`${API_BASE}/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchNews();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleTogglePublish = async (article: NewsArticle) => {
    const token = localStorage.getItem('pp_token');
    try {
      await fetch(`${API_BASE}/news/${article._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !article.isPublished })
      });
      fetchNews();
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const filteredNews = news.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (value: string) => {
    return categoryOptions.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">News & Articles</h2>
          <p className="text-gray-500">Manage property news and market updates</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add News Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Articles</p>
          <p className="text-2xl font-bold text-[#1E3A5F]">{news.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Published</p>
          <p className="text-2xl font-bold text-emerald-600">{news.filter(n => n.isPublished).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Featured</p>
          <p className="text-2xl font-bold text-amber-500">{news.filter(n => n.isFeatured).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Breaking</p>
          <p className="text-2xl font-bold text-red-500">{news.filter(n => n.isBreaking).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
            >
              <option value="">All Categories</option>
              {categoryOptions.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <div key={article._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative h-48">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {article.isBreaking && (
                  <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Breaking
                  </span>
                )}
                {article.isFeatured && (
                  <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {article.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-medium">
                  {getCategoryLabel(article.category)}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{article.summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center text-white text-sm font-semibold">
                    {article.author.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600">{article.author.name}</span>
                </div>
                <span className="text-sm text-gray-400">{article.views} views</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleTogglePublish(article)}
                  className={`p-2 rounded-lg ${article.isPublished ? 'hover:bg-red-50 text-red-600' : 'hover:bg-emerald-50 text-emerald-600'}`}
                  title={article.isPublished ? 'Unpublish' : 'Publish'}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(article._id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add News Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Add News Article</h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="form-label">Article Title *</label>
                  <Input 
                    placeholder="Enter article title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Author Name</label>
                  <Input 
                    placeholder="Enter author name"
                    value={formData.authorName}
                    onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Summary *</label>
                  <textarea 
                    className="form-input h-20 resize-none"
                    placeholder="Enter article summary (max 500 characters)"
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Content</label>
                  <textarea 
                    className="form-input h-48 resize-none"
                    placeholder="Write your article content here..."
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Featured Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <div 
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#1E3A5F]'
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-12 h-12 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Uploading to cloud storage...</p>
                      </>
                    ) : imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Upload featured image</p>
                        <p className="text-sm text-gray-400 mt-1">Recommended: 1200x600px - Stored on cloud</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    />
                    <span>Mark as Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={formData.isBreaking}
                      onChange={(e) => setFormData({...formData, isBreaking: e.target.checked})}
                    />
                    <span>Mark as Breaking News</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-4">
              <Button variant="outline" onClick={() => handleSaveNews(false)} disabled={saving}>
                Save as Draft
              </Button>
              <Button className="btn-primary" onClick={() => handleSaveNews(true)} disabled={saving}>
                {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                Publish Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

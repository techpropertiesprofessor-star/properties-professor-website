import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star,
  X,
  Video,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  propertyType: string;
  rating: number;
  review: string;
  image?: string;
  videoUrl?: string;
  isVideoTestimonial: boolean;
  featured: boolean;
  verified: boolean;
  createdAt: string;
}

const API_BASE = 'http://localhost:5001/api';

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    propertyType: 'apartment',
    rating: 5,
    review: '',
    image: '',
    videoUrl: '',
    isVideoTestimonial: false,
    featured: false,
    verified: true
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const token = localStorage.getItem('pp_token');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'testimonials');
      formDataUpload.append('maxWidth', '400');
      formDataUpload.append('quality', '85');

      const response = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.data.url }));
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

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/testimonials`);
      const data = await response.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      propertyType: 'apartment',
      rating: 5,
      review: '',
      image: '',
      videoUrl: '',
      isVideoTestimonial: false,
      featured: false,
      verified: true
    });
    setEditMode(false);
    setSelectedTestimonial(null);
  };

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.review.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const token = localStorage.getItem('pp_token');
      const response = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setTestimonials(prev => prev.filter(t => t._id !== id));
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      propertyType: testimonial.propertyType,
      rating: testimonial.rating,
      review: testimonial.review,
      image: testimonial.image || '',
      videoUrl: testimonial.videoUrl || '',
      isVideoTestimonial: testimonial.isVideoTestimonial,
      featured: testimonial.featured,
      verified: testimonial.verified
    });
    setEditMode(true);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('pp_token');
      const url = editMode && selectedTestimonial 
        ? `${API_BASE}/testimonials/${selectedTestimonial._id}`
        : `${API_BASE}/testimonials`;
      
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchTestimonials();
        setShowAddModal(false);
        resetForm();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error saving testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customer Testimonials</h2>
          <p className="text-gray-500">Manage customer reviews and video testimonials</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Star className="w-10 h-10 text-amber-500 mb-3" />
          <p className="text-2xl font-bold text-gray-800">{testimonials.length}</p>
          <p className="text-sm text-gray-500">Total Reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Video className="w-10 h-10 text-blue-500 mb-3" />
          <p className="text-2xl font-bold text-gray-800">
            {testimonials.filter(t => t.isVideoTestimonial).length}
          </p>
          <p className="text-sm text-gray-500">Video Testimonials</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
          <p className="text-2xl font-bold text-gray-800">
            {testimonials.filter(t => t.featured).length}
          </p>
          <p className="text-sm text-gray-500">Featured</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Star className="w-10 h-10 text-amber-500 mb-3 fill-amber-500" />
          <p className="text-2xl font-bold text-gray-800">
            {testimonials.length > 0 
              ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
              : '0.0'}
          </p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {testimonial.image && !testimonial.image.startsWith('data:') && (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                )}
                {(!testimonial.image || testimonial.image.startsWith('data:')) && (
                  <div className="w-14 h-14 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{testimonial.propertyType}</p>
                  <p className="text-xs text-gray-400">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(testimonial)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(testimonial._id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{testimonial.review}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {testimonial.featured && (
                <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  Featured
                </span>
              )}
              {testimonial.isVideoTestimonial && (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Video
                </span>
              )}
              {testimonial.verified && (
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai, Maharashtra"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                    <option value="investment">Investment Property</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                        id="testimonial-image-upload"
                      />
                      <label
                        htmlFor="testimonial-image-upload"
                        className={`flex-1 px-4 py-3 rounded-xl border border-dashed border-gray-300 text-center cursor-pointer transition-colors ${
                          uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#1E3A5F]'
                        }`}
                      >
                        {uploadingImage ? (
                          <span className="text-gray-500">Uploading...</span>
                        ) : formData.image ? (
                          <span className="text-emerald-600">✓ Image uploaded</span>
                        ) : (
                          <span className="text-gray-500">Click to upload photo</span>
                        )}
                      </label>
                    </div>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Or paste image URL here"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    />
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full object-cover mx-auto" />
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Content *</label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none resize-none"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                >
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>

              {/* Video Testimonial */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVideoTestimonial"
                    checked={formData.isVideoTestimonial}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                  />
                  <span className="text-sm font-medium text-gray-700">This is a video testimonial</span>
                </label>
              </div>

              {formData.isVideoTestimonial && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube/Vimeo)</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                  />
                  <span className="text-sm font-medium text-gray-700">Feature on homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as verified customer</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1 btn-primary" disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                  {selectedTestimonial ? 'Update' : 'Save'} Testimonial
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

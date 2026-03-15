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
  Home,
  Building,
  TrendingUp,
  Star,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cities, propertyTypes } from '@/data/mockData';
import type { Property } from '@/types';

interface SectionToggle {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface PropertyFormData {
  title: string;
  description: string;
  type: string;
  city: string;
  area: string;
  address: string;
  price: number;
  areaSize: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnishing: string;
  ageOfProperty: number;
  amenities: string;
  maintenanceCharges: string;
  keyLocation: string;
  availabilityDate: string;
  developerName: string;
  status: string;
  images: { url: string; caption: string; isMain: boolean }[];
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  type: 'apartment',
  city: '',
  area: '',
  address: '',
  price: 0,
  areaSize: 0,
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  furnishing: 'unfurnished',
  ageOfProperty: 0,
  amenities: '',
  maintenanceCharges: 'include',
  keyLocation: '',
  availabilityDate: '',
  developerName: 'Properties Professor',
  status: 'available',
  images: []
};

interface SectionToggle {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const sectionOptions: SectionToggle[] = [
  { id: 'homepage', label: 'Homepage', icon: Home, color: 'bg-blue-500' },
  { id: 'buy', label: 'Buy Section', icon: Building, color: 'bg-emerald-500' },
  { id: 'rent', label: 'Rent Section', icon: MapPin, color: 'bg-purple-500' },
  { id: 'newProjects', label: 'New Projects', icon: Star, color: 'bg-amber-500' },
  { id: 'commercial', label: 'Commercial', icon: DollarSign, color: 'bg-pink-500' },
  { id: 'featured', label: 'Featured', icon: Star, color: 'bg-orange-500' },
  { id: 'premium', label: 'Premium', icon: TrendingUp, color: 'bg-red-500' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'bg-cyan-500' }
];

const AMENITIES_LIST = [
  'AC', 'TV', 'Fridge', 'Washing Machine', 'Geyser', 'Modular Kitchen', 
  'Wardrobe', 'Bed', 'Sofa', 'Dining Table', 'RO', 'Microwave', 
  'Chimney', 'Water Purifier', 'Fan', 'Light'
];

const API_BASE = 'https://api.propertiesprofessor.com/api';

export function PropertiesManager() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [selectedSections, setSelectedSections] = useState<string[]>(['buy']);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/properties?limit=100`);
      const data = await response.json();
      if (data.success) {
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced removeImage: confirm, call backend, update UI only on success
  const removeImage = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    const token = localStorage.getItem('pp_token');
    const image = formData.images[index];
    // Extract key from URL
    const urlParts = image.url.split('/');
    const key = urlParts.slice(3).join('/'); // skip https://bucket.region.cdn.digitaloceanspaces.com/
    try {
      const response = await fetch(`${API_BASE}/media/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key })
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
      } else {
        alert(data.message || 'Failed to delete image from storage.');
      }
    } catch (error) {
      alert('Error deleting image.');
      console.error('Error deleting image:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const token = localStorage.getItem('pp_token');

    try {
      // Upload files to DigitalOcean Spaces, include propertyId if editing
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('folder', 'properties');
        formDataUpload.append('maxWidth', '1920');
        formDataUpload.append('quality', '85');
        if (editMode && selectedProperty?._id) {
          formDataUpload.append('propertyId', selectedProperty._id);
        }

        const response = await fetch(`${API_BASE}/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        });

        const result = await response.json();
        if (result.success) {
          return {
            url: result.data.url,
            caption: file.name,
            isMain: formData.images.length === 0,
          };
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages.map((img, idx) => ({
          ...img,
          isMain: prev.images.length === 0 && idx === 0
        }))]
      }));
      setImagePreview(prev => [...prev, ...uploadedImages.map(img => img.url)]);

    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSaveProperty = async () => {
    if (!formData.title || !formData.city || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('pp_token');

    const propertyData = {
      title: formData.title,
      description: formData.description || 'Beautiful property in prime location',
      type: formData.type,
      status: formData.status,
      price: formData.price,
      area: formData.areaSize,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      parking: formData.parking,
      furnishing: formData.furnishing,
      ageOfProperty: formData.ageOfProperty,
      amenities: formData.amenities.split(',').map(a => a.trim().toLowerCase().replace(/ /g, '-')).filter(Boolean),
      location: {
        city: formData.city,
        area: formData.area,
        address: formData.address || formData.area
      },
      developer: {
        name: formData.developerName || 'Properties Professor',
        trustScore: 85
      },
      images: formData.images.length > 0 ? formData.images : [
        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', caption: 'Property Image', isMain: true }
      ],
      sections: {
        homepage: selectedSections.includes('homepage'),
        buy: selectedSections.includes('buy'),
        rent: selectedSections.includes('rent'),
        newProjects: selectedSections.includes('newProjects'),
        commercial: selectedSections.includes('commercial'),
        featured: selectedSections.includes('featured'),
        premium: selectedSections.includes('premium'),
        trending: selectedSections.includes('trending')
      },
      displayOrder,
      pricePerSqft: formData.areaSize > 0 ? Math.round(formData.price / formData.areaSize) : 0,
      financial: {
        maintenanceCharges: formData.maintenanceCharges,
        keyLocation: formData.keyLocation,
        availabilityDate: formData.availabilityDate
      }
    };

    try {
      const url = editMode && selectedProperty 
        ? `${API_BASE}/properties/${selectedProperty._id}`
        : `${API_BASE}/properties`;
      
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editMode ? 'Property updated successfully!' : 'Property created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchProperties();
      } else {
        alert(data.message || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedSections(['buy']);
    setDisplayOrder(0);
    setImagePreview([]);
    setEditMode(false);
    setSelectedProperty(null);
  };

  const openEditModal = (property: Property) => {
    setEditMode(true);
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      type: property.type,
      city: property.location.city,
      area: property.location.area,
      address: property.location.address || '',
      price: property.price,
      areaSize: property.area,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      parking: property.parking || 0,
      furnishing: property.furnishing || 'unfurnished',
      ageOfProperty: property.ageOfProperty || 0,
      amenities: property.amenities ? property.amenities.join(', ') : '',
      developerName: 'Properties Professor',
      status: property.status,
      maintenanceCharges: property.financial?.maintenanceCharges || 'include',
      keyLocation: property.financial?.keyLocation || '',
      availabilityDate: property.financial?.availabilityDate || '',
      images: (property.images || []).map(img => ({
        url: img.url,
        caption: img.caption || '',
        isMain: img.isMain || false
      }))
    });
    setImagePreview(property.images?.map(img => img.url) || []);
    const sections: string[] = [];
    if (property.sections?.homepage) sections.push('homepage');
    if (property.sections?.buy) sections.push('buy');
    if (property.sections?.rent) sections.push('rent');
    if (property.sections?.newProjects) sections.push('newProjects');
    if (property.sections?.commercial) sections.push('commercial');
    if (property.sections?.featured) sections.push('featured');
    if (property.sections?.premium) sections.push('premium');
    if (property.sections?.trending) sections.push('trending');
    setSelectedSections(sections.length > 0 ? sections : ['buy']);
    setDisplayOrder(property.displayOrder || 0);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    const token = localStorage.getItem('pp_token');
    try {
      const response = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchProperties();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const filteredProperties = properties.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'sold': return 'bg-red-100 text-red-700';
      case 'under_construction': return 'bg-amber-100 text-amber-700';
      case 'reserved': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPropertySections = (property: Property) => {
    const sections: string[] = [];
    if (property.sections?.homepage) sections.push('Homepage');
    if (property.sections?.buy) sections.push('Buy');
    if (property.sections?.rent) sections.push('Rent');
    if (property.sections?.newProjects) sections.push('New Projects');
    if (property.sections?.commercial) sections.push('Commercial');
    if (property.sections?.featured) sections.push('Featured');
    if (property.sections?.premium) sections.push('Premium');
    return sections;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Properties</h2>
          <p className="text-gray-500">Manage your property listings and section placement</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Properties</p>
          <p className="text-2xl font-bold text-[#1E3A5F]">{properties.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Available</p>
          <p className="text-2xl font-bold text-emerald-600">{properties.filter(p => p.status === 'available').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Featured</p>
          <p className="text-2xl font-bold text-amber-500">{properties.filter(p => p.sections?.featured).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Homepage</p>
          <p className="text-2xl font-bold text-blue-500">{properties.filter(p => p.sections?.homepage).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
              <option value="">All Sections</option>
              {sectionOptions.map(section => (
                <option key={section.id} value={section.id}>{section.label}</option>
              ))}
            </select>
            <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
            <span className="ml-3 text-gray-600">Loading properties...</span>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400 text-sm mt-1">Add your first property to get started</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sections</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stats</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">{property.title}</h4>
                        <p className="text-sm text-gray-500">
                          {property.bedrooms} BHK • {property.area} sq.ft
                        </p>
                        <p className="text-sm text-gray-500">{property.developer.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {getPropertySections(property).map((section, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                          {section}
                        </span>
                      ))}
                    </div>
                    {property.displayOrder && property.displayOrder > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Order: {property.displayOrder}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1E3A5F]">
                      {property.priceInWords || `₹${(property.price / 10000000).toFixed(1)} Cr`}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{property.pricePerSqft?.toLocaleString()}/sq.ft
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      <p>{property.analytics?.views || 0} views</p>
                      <p>{property.analytics?.leads || 0} leads</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowDetailModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEditModal(property)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(property._id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination */}
        {!loading && filteredProperties.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">{editMode ? 'Edit Property' : 'Add New Property'}</h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="form-label">Property Title *</label>
                  <Input 
                    placeholder="Enter property title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">Property Type *</label>
                  <select 
                    className="form-input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="">Select type</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <select 
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  >
                    <option value="">Select city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Area/Locality *</label>
                  <Input 
                    placeholder="Enter area"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">Price (₹) *</label>
                  <Input 
                    type="number" 
                    placeholder="Enter price"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="form-label">Area (sq.ft) *</label>
                  <Input 
                    type="number" 
                    placeholder="Enter area"
                    value={formData.areaSize || ''}
                    onChange={(e) => setFormData({...formData, areaSize: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="form-label">Bedrooms</label>
                  <Input 
                    type="number" 
                    placeholder="Number of bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="form-label">Bathrooms</label>
                  <Input 
                    type="number" 
                    placeholder="Number of bathrooms"
                    value={formData.bathrooms || ''}
                    onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="form-label">Parking</label>
                  <Input 
                    type="number" 
                    placeholder="Number of parking spots"
                    value={formData.parking || ''}
                    onChange={(e) => setFormData({...formData, parking: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="form-label">Furnishing</label>
                  <select 
                    className="form-input"
                    value={formData.furnishing}
                    onChange={(e) => setFormData({...formData, furnishing: e.target.value})}
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully-Furnished</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Age of Property (years)</label>
                  <Input 
                    type="number" 
                    placeholder="E.g. 0 for new, 5 for 5 years old"
                    value={formData.ageOfProperty || ''}
                    onChange={(e) => setFormData({...formData, ageOfProperty: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Amenities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AMENITIES_LIST.map((amenity) => {
                      const isSelected = formData.amenities.split(',').map(a => a.trim()).includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => {
                            const current = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
                            const updated = current.includes(amenity)
                              ? current.filter(a => a !== amenity)
                              : [...current, amenity];
                            setFormData({...formData, amenities: updated.join(', ')});
                          }}
                          className={`px-4 py-2 rounded-full border transition-all text-sm ${
                            isSelected 
                              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4">
                    <label className="text-xs text-gray-500">Other Amenities (Comma Separated)</label>
                    <Input 
                      placeholder="E.g. swimming-pool, gym, etc."
                      value={formData.amenities}
                      onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Maintenance Charges</label>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, maintenanceCharges: 'include'})}
                      className={`px-6 py-2 rounded-xl border transition-all ${
                        formData.maintenanceCharges === 'include' 
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Include in rent
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, maintenanceCharges: 'separate'})}
                      className={`px-6 py-2 rounded-xl border transition-all ${
                        formData.maintenanceCharges === 'separate' 
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Separate
                    </button>
                  </div>
                </div>

                {/* Amenities Chips Section */}
                <div className="md:col-span-2">
                  <label className="form-label">Furnishings / Amenities</label>
                  <button 
                    type="button" 
                    className="text-xs text-[#1E3A5F] hover:underline mb-2 block"
                    onClick={() => setFormData({...formData, amenities: AMENITIES_LIST.join(', ')})}
                  >
                    + Add All Furnishings / Amenities
                  </button>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AMENITIES_LIST.map((amenity) => {
                      const isSelected = formData.amenities.split(',').map(a => a.trim()).includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => {
                            const current = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
                            const updated = current.includes(amenity)
                              ? current.filter(a => a !== amenity)
                              : [...current, amenity];
                            setFormData({...formData, amenities: updated.join(', ')});
                          }}
                          className={`px-4 py-2 rounded-full border transition-all text-sm shadow-sm font-medium ${
                            isSelected 
                              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4">
                    <label className="text-xs text-gray-500">Other Amenities (Comma Separated)</label>
                    <Input 
                      placeholder="E.g. swimming-pool, gym, etc."
                      value={formData.amenities}
                      onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Key Location</label>
                  <Input 
                    placeholder="e.g. With Owner, With Security" 
                    value={formData.keyLocation}
                    onChange={(e) => setFormData({...formData, keyLocation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="form-label">Availability Date</label>
                  <Input 
                    type="date"
                    value={formData.availabilityDate}
                    onChange={(e) => setFormData({...formData, availabilityDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="under_construction">Under Construction</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>

                {/* Section Targeting */}
                <div className="md:col-span-2">
                  <label className="form-label">Publish to Sections *</label>
                  <p className="text-sm text-gray-500 mb-3">Select where this property should appear on the website</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sectionOptions.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          selectedSections.includes(section.id)
                            ? 'border-[#1E3A5F] bg-[#1E3A5F]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${section.color} flex items-center justify-center`}>
                          <section.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{section.label}</span>
                        {selectedSections.includes(section.id) && (
                          <CheckCircle className="w-4 h-4 text-[#1E3A5F] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Display Order</label>
                  <Input 
                    type="number" 
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    placeholder="0 = default order"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input h-32 resize-none"
                    placeholder="Enter property description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Images</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                  <div 
                    onClick={() => !uploadingImages && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      uploadingImages ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#1E3A5F]'
                    }`}
                  >
                    {uploadingImages ? (
                      <>
                        <div className="w-12 h-12 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Uploading to cloud storage...</p>
                        <p className="text-sm text-gray-400 mt-1">Please wait</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload images</p>
                        <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 10MB each - Stored on cloud</p>
                      </>
                    )}
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreview.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {imagePreview.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-[#1E3A5F] text-white text-xs rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-4">
              <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button 
                className="btn-primary"
                onClick={handleSaveProperty}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {editMode ? 'Update Property' : 'Save Property'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {showDetailModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Property Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-6">
                <img
                  src={selectedProperty.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'}
                  alt={selectedProperty.title}
                  className="w-48 h-48 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedProperty.title}</h2>
                  <p className="text-gray-500 mt-1">
                    {selectedProperty.location.area}, {selectedProperty.location.city}
                  </p>
                  <p className="text-2xl font-bold text-[#1E3A5F] mt-3">
                    {selectedProperty.priceInWords || `₹${(selectedProperty.price / 10000000).toFixed(1)} Cr`}
                  </p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-600">
                    <span>{selectedProperty.bedrooms} BHK</span>
                    <span>{selectedProperty.bathrooms} Bath</span>
                    <span>{selectedProperty.area} sq.ft</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Published Sections</h4>
                <div className="flex flex-wrap gap-2">
                  {getPropertySections(selectedProperty).map((section, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-[#1E3A5F] text-white text-sm">
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Analytics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#1E3A5F]">{selectedProperty.analytics?.views || 0}</p>
                    <p className="text-sm text-gray-500">Views</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-600">{selectedProperty.analytics?.leads || 0}</p>
                    <p className="text-sm text-gray-500">Leads</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-amber-500">{selectedProperty.analytics?.shortlists || 0}</p>
                    <p className="text-sm text-gray-500">Shortlists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

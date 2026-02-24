import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Building2, MapPin, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Developer {
  id: number;
  name: string;
  logo: string;
  description: string;
  location: string;
  projectsCount: number;
  established: string;
  specialization: string[];
  featured: boolean;
  reraRegistered: boolean;
  website: string;
  rating: number;
}

export function DevelopersManager() {
  const [developers, setDevelopers] = useState<Developer[]>([
    {
      id: 1,
      name: 'Prestige Group',
      logo: '🏢',
      description: 'Leading real estate developer with 35+ years of excellence in creating landmark residential and commercial projects.',
      location: 'Bangalore, Karnataka',
      projectsCount: 285,
      established: '1986',
      specialization: ['Luxury Apartments', 'Commercial', 'Villas'],
      featured: true,
      reraRegistered: true,
      website: 'https://www.prestigeconstructions.com',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Godrej Properties',
      logo: '🏗️',
      description: 'India\'s leading real estate developer delivering innovative and sustainable real estate solutions.',
      location: 'Mumbai, Maharashtra',
      projectsCount: 150,
      established: '1990',
      specialization: ['Smart Homes', 'Sustainable Living', 'Premium Residences'],
      featured: true,
      reraRegistered: true,
      website: 'https://www.godrejproperties.com',
      rating: 4.6
    },
    {
      id: 3,
      name: 'DLF Limited',
      logo: '🌆',
      description: 'DLF is India\'s largest real estate company in terms of revenues, earnings, market capitalisation and developable area.',
      location: 'Gurgaon, Haryana',
      projectsCount: 320,
      established: '1946',
      specialization: ['Luxury Developments', 'IT Parks', 'Retail'],
      featured: true,
      reraRegistered: true,
      website: 'https://www.dlf.in',
      rating: 4.4
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Developer>>({
    name: '',
    logo: '🏢',
    description: '',
    location: '',
    projectsCount: 0,
    established: '',
    specialization: [],
    featured: false,
    reraRegistered: false,
    website: '',
    rating: 0
  });

  const filteredDevelopers = developers.filter(dev =>
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (formData.name && formData.location) {
      const newDeveloper: Developer = {
        id: Date.now(),
        name: formData.name,
        logo: formData.logo || '🏢',
        description: formData.description || '',
        location: formData.location,
        projectsCount: formData.projectsCount || 0,
        established: formData.established || '',
        specialization: formData.specialization || [],
        featured: formData.featured || false,
        reraRegistered: formData.reraRegistered || false,
        website: formData.website || '',
        rating: formData.rating || 0
      };
      setDevelopers([...developers, newDeveloper]);
      setIsAddingNew(false);
      resetForm();
    }
  };

  const handleUpdate = () => {
    if (editingId && formData.name && formData.location) {
      setDevelopers(developers.map(dev =>
        dev.id === editingId ? { ...dev, ...formData } as Developer : dev
      ));
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this developer?')) {
      setDevelopers(developers.filter(dev => dev.id !== id));
    }
  };

  const handleEdit = (developer: Developer) => {
    setEditingId(developer.id);
    setFormData(developer);
    setIsAddingNew(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '🏢',
      description: '',
      location: '',
      projectsCount: 0,
      established: '',
      specialization: [],
      featured: false,
      reraRegistered: false,
      website: '',
      rating: 0
    });
  };

  const toggleFeatured = (id: number) => {
    setDevelopers(developers.map(dev =>
      dev.id === id ? { ...dev, featured: !dev.featured } : dev
    ));
  };

  const addSpecialization = (spec: string) => {
    if (spec && !formData.specialization?.includes(spec)) {
      setFormData({
        ...formData,
        specialization: [...(formData.specialization || []), spec]
      });
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specialization: formData.specialization?.filter(s => s !== spec) || []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Developers & Builders</h2>
          <p className="text-gray-500 mt-1">{developers.length} total developers • {developers.filter(d => d.featured).length} featured</p>
        </div>
        <Button
          onClick={() => {
            setIsAddingNew(true);
            setEditingId(null);
            resetForm();
          }}
          className="bg-[#1E3A5F] hover:bg-[#152a45]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Developer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Developers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{developers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{developers.filter(d => d.featured).length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">RERA Registered</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{developers.filter(d => d.reraRegistered).length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{developers.reduce((sum, d) => sum + d.projectsCount, 0)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search developers by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Edit Developer' : 'Add New Developer'}
            </h3>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Developer Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="e.g., Prestige Group"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo/Icon</label>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="🏢"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none resize-none"
                placeholder="Brief description of the developer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
              <input
                type="text"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="e.g., 1990"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Projects</label>
              <input
                type="number"
                value={formData.projectsCount}
                onChange={(e) => setFormData({ ...formData, projectsCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="Number of projects"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                max="5"
                min="0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="4.5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://www.example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specialization?.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#1E3A5F] text-white rounded-full text-sm flex items-center gap-2"
                  >
                    {spec}
                    <button onClick={() => removeSpecialization(spec)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="spec-input"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                  placeholder="Add specialization..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addSpecialization(input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('spec-input') as HTMLInputElement;
                    addSpecialization(input.value);
                    input.value = '';
                  }}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                />
                <span className="text-sm font-medium text-gray-700">Featured Developer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reraRegistered}
                  onChange={(e) => setFormData({ ...formData, reraRegistered: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                />
                <span className="text-sm font-medium text-gray-700">RERA Registered</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={editingId ? handleUpdate : handleAdd}
              className="bg-[#1E3A5F] hover:bg-[#152a45]"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update Developer' : 'Add Developer'}
            </Button>
            <Button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
                resetForm();
              }}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Developers List */}
      <div className="grid gap-4">
        {filteredDevelopers.map((developer) => (
          <div
            key={developer.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-3xl flex-shrink-0">
                  {developer.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{developer.name}</h3>
                    {developer.featured && (
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {developer.reraRegistered && (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        RERA
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{developer.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {developer.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {developer.projectsCount} Projects
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Est. {developer.established}
                    </span>
                    <span className="flex items-center gap-1">
                      ⭐ {developer.rating.toFixed(1)}
                    </span>
                  </div>
                  {developer.specialization.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {developer.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFeatured(developer.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    developer.featured
                      ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={developer.featured ? 'Remove from featured' : 'Mark as featured'}
                >
                  <Award className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(developer)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(developer.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDevelopers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No developers found</h3>
          <p className="text-gray-500">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}

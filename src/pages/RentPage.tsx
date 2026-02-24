import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import { Search, MapPin, Bed, Bath, Maximize, Heart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cities, propertyTypes } from '@/data/mockData';
import type { Property } from '@/types';

const API_BASE = 'http://localhost:5001/api';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

export function RentPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [_loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [isLoggedIn] = useState(isUserLoggedIn());

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    const queryParam = params.get('q');
    
    if (cityParam && cityParam !== 'All') {
      setSelectedCity(cityParam);
    }
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, []);

  // Fetch saved properties if logged in
  useEffect(() => {
    if (isLoggedIn) {
      const fetchSavedProperties = async () => {
        try {
          const token = localStorage.getItem('pp_token');
          const response = await fetch(`${API_BASE}/users/saved-properties`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success && data.data) {
            setSavedProperties(data.data.map((p: any) => p._id));
          }
        } catch (error) {
          console.error('Error fetching saved properties:', error);
        }
      };
      fetchSavedProperties();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties/section/rent`);
        const data = await response.json();
        if (data.success && data.data) {
          setProperties(data.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter properties
  const rentProperties = properties.filter(p => 
    (selectedCity === '' || p.location?.city === selectedCity) &&
    (selectedType === '' || p.type === selectedType) &&
    (searchQuery === '' || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.area?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSave = async (id: string) => {
    if (!isLoggedIn) {
      alert('Please login to save properties');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    try {
      const token = localStorage.getItem('pp_token');
      const response = await fetch(`${API_BASE}/users/save-property/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSavedProperties(prev => 
          prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Rent Properties</h1>
          <p className="text-white/80">Find the perfect rental home for you and your family</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-16 z-30 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rental properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <Button className="btn-primary">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{rentProperties.length}</span> rental properties
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-56">
                <img
                  src={property.images[0]?.url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-medium">
                    For Rent
                  </span>
                </div>
                <button
                  onClick={() => toggleSave(property._id)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${savedProperties.includes(property._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold">
                    {formatPrice(property.price)}/month
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{property.title}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  {property.location.area}, {property.location.city}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {property.bedrooms} BHK
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {property.bathrooms} Bath
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    {property.area} sq.ft
                  </span>
                </div>

                <Button 
                  onClick={() => window.location.href = `/property/${property._id}`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {rentProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No rental properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

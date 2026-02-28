import { useState, useRef, useEffect } from 'react';
import { MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight, Heart, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
// Removed mockProperties import; only real backend data will be used
import type { Property } from '@/types';

const API_BASE = 'https://api.propertiesprofessor.com/api';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [isLoggedIn] = useState(isUserLoggedIn());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties/section/featured`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setProperties(data.data);
          } else {
            setProperties([]);
          }
        }
      } catch (error) {
        // No fallback; show empty if fetch fails
      }
    };
    fetchProperties();
    
    // Fetch saved properties if logged in
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={ref} className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
              Handpicked For You
            </span>
            <h2 className="heading-2 text-gray-900 mt-2">
              Featured Properties
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl">
              Discover our curated selection of premium properties, verified with blockchain technology 
              and backed by trusted developers.
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Properties Scroll Container */}
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No featured properties available yet.</p>
          </div>
        ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {properties.map((property: Property, index: number) => (
            <div
              key={property._id}
              className={`flex-shrink-0 w-[350px] snap-start transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="property-card h-full">
                {/* Image */}
                <div className="property-card-image">
                  <img
                    src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {property.blockchain?.verified && (
                      <span className="trust-badge trust-badge-verified">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {property.premium && (
                      <span className="trust-badge trust-badge-premium">
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => toggleSave(property._id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        savedProperties.includes(property._id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4">
                    <span className="price-tag">
                      {property.priceInWords || `₹${(property.price / 10000000).toFixed(1)} Cr`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Developer Trust Score */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">
                        TrustScore {property.developer.trustScore}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {property.developer.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                    <MapPin className="w-4 h-4 text-[#FF6B35]" />
                    {property.location.area}, {property.location.city}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms} BHK
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms} Bath
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize className="w-4 h-4" />
                      {property.area} sq.ft
                    </span>
                  </div>

                  {/* Neighborhood Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.neighborhood?.lifestyle?.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button 
                    onClick={() => window.location.href = `/property/${property._id}`}
                    className="w-full btn-primary"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => window.location.href = '/buy'}
            variant="outline" 
            className="px-8 py-3 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-colors"
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}

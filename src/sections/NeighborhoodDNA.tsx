import { useState, useEffect, useRef } from 'react';
import { MapPin, Shield, GraduationCap, Train, Utensils, Building2, TrendingUp, Search, Loader2, Hospital, ShoppingBag, Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';

const API_BASE = 'https://api.propertiesprofessor.com/api';

interface NeighborhoodData {
  location: string;
  safetyScore: number;
  overallRating: number;
  metro: Array<{ name: string; distance: string; type: string }>;
  schools: Array<{ name: string; distance: string; rating: number }>;
  hospitals: Array<{ name: string; distance: string; rating: number }>;
  shopping: Array<{ name: string; distance: string; type: string }>;
  restaurants: number;
  groceryStores: number;
  avgPropertyPrice: string;
  note?: string;
}

interface HeatmapLayer {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const defaultLayers: HeatmapLayer[] = [
  { id: 'safety', name: 'Safety Score', icon: Shield, color: 'bg-emerald-500' },
  { id: 'schools', name: 'Schools', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'connectivity', name: 'Connectivity', icon: Train, color: 'bg-purple-500' },
  { id: 'dining', name: 'Dining & Cafe', icon: Utensils, color: 'bg-orange-500' },
  { id: 'commercial', name: 'Shopping', icon: Building2, color: 'bg-pink-500' }
];

// Fallback data when API is not available
const fallbackData: NeighborhoodData = {
  location: 'Bandra West, Mumbai',
  safetyScore: 92,
  overallRating: 4.5,
  metro: [
    { name: 'Bandra Railway Station', distance: '1.2 km', type: 'Railway' },
    { name: 'Bandra-Kurla Complex Metro', distance: '2.5 km', type: 'Metro' }
  ],
  schools: [
    { name: 'Dhirubhai Ambani International School', distance: '1.5 km', rating: 4.8 },
    { name: 'JBCN International School', distance: '2.1 km', rating: 4.6 }
  ],
  hospitals: [
    { name: 'Lilavati Hospital', distance: '0.5 km', rating: 4.7 },
    { name: 'Holy Family Hospital', distance: '1.8 km', rating: 4.5 }
  ],
  shopping: [
    { name: 'Linking Road Market', distance: '0.5 km', type: 'Street Market' }
  ],
  restaurants: 85,
  groceryStores: 45,
  avgPropertyPrice: '₹45,000 - ₹65,000 per sq.ft'
};

export function NeighborhoodDNA() {
  const [activeLayer, setActiveLayer] = useState<string>('safety');
  const [searchQuery, setSearchQuery] = useState('');
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch available locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE}/neighborhoods/locations`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAllLocations(data.data);
          }
        }
      } catch (error) {
        console.log('Using fallback locations');
        setAllLocations([
          'Bandra West, Mumbai',
          'Andheri West, Mumbai',
          'Powai, Mumbai',
          'Koramangala, Bangalore',
          'Whitefield, Bangalore',
          'Indiranagar, Bangalore',
          'Noida Sector 62, Noida',
          'Greater Noida West, Noida',
          'Gurgaon Sector 49, Gurgaon',
          'Dwarka, Delhi',
          'Gachibowli, Hyderabad',
          'HITEC City, Hyderabad',
          'Jubilee Hills, Hyderabad',
          'Hinjewadi, Pune',
          'Kharadi, Pune',
          'Baner, Pune',
          'Anna Nagar, Chennai',
          'OMR, Chennai',
          'Salt Lake, Kolkata',
          'New Town, Kolkata',
          'SG Highway, Ahmedabad'
        ]);
      }
    };
    fetchLocations();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allLocations]);

  const searchNeighborhood = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await fetch(`${API_BASE}/neighborhoods/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setNeighborhoodData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchNeighborhood(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    searchNeighborhood(suggestion);
  };

  const getLayerScore = (layerId: string): number => {
    switch (layerId) {
      case 'safety':
        return neighborhoodData.safetyScore;
      case 'schools':
        return neighborhoodData.schools[0]?.rating ? neighborhoodData.schools[0].rating * 20 : 85;
      case 'connectivity':
        return 95 - (parseFloat(neighborhoodData.metro[0]?.distance || '3') * 5);
      case 'dining':
        return Math.min(neighborhoodData.restaurants, 100);
      case 'commercial':
        return neighborhoodData.shopping.length > 0 ? 88 : 70;
      default:
        return 85;
    }
  };

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
            Know Before You Move
          </span>
          <h2 className="heading-2 text-gray-900 mt-2">
            Neighborhood DNA
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Get deep insights into any neighborhood across India - from safety scores and school ratings 
            to metro connectivity and lifestyle amenities.
          </p>
        </div>

        {/* Location Search with Autocomplete */}
        <div className={`max-w-2xl mx-auto mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div ref={searchRef} className="relative">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any location in India (e.g., Koramangala, Bangalore)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:outline-none text-gray-700"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="btn-primary px-6"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-[#FF6B35]" />
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-3">
            Popular: Koramangala • Powai • Gurgaon • Whitefield • Jubilee Hills • Hinjewadi
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Interactive Map & Scores */}
          <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              {/* Map Header with Location */}
              <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8a] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{neighborhoodData.location.split(',')[0]}</h3>
                      <p className="text-white/70 text-sm">{neighborhoodData.location.split(',')[1]?.trim()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{neighborhoodData.overallRating}</span>
                  </div>
                </div>
              </div>

              {/* Map Visualization with OpenStreetMap */}
              <div className="relative h-[320px] bg-gray-100">
                {loading && (
                  <div className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35] mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Loading neighborhood data...</p>
                    </div>
                  </div>
                )}
                
                {/* OpenStreetMap Embed (No API Key Required) */}
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${neighborhoodData.location.includes('Mumbai') ? '72.8,19.0,72.95,19.15' : neighborhoodData.location.includes('Bangalore') ? '77.55,12.9,77.7,13.05' : neighborhoodData.location.includes('Delhi') || neighborhoodData.location.includes('Noida') || neighborhoodData.location.includes('Gurgaon') ? '77.0,28.4,77.4,28.7' : neighborhoodData.location.includes('Hyderabad') ? '78.35,17.35,78.55,17.5' : neighborhoodData.location.includes('Pune') ? '73.75,18.45,73.95,18.6' : neighborhoodData.location.includes('Chennai') ? '80.15,12.95,80.35,13.15' : neighborhoodData.location.includes('Kolkata') ? '88.3,22.5,88.45,22.65' : neighborhoodData.location.includes('Ahmedabad') ? '72.5,22.95,72.7,23.1' : '77.5,12.9,77.7,13.05'}&layer=mapnik&marker=${neighborhoodData.location.includes('Mumbai') ? '19.06,72.85' : neighborhoodData.location.includes('Bangalore') ? '12.97,77.6' : '28.6,77.2'}`}
                  className="w-full h-full border-0"
                  title="Neighborhood Map"
                />

                {/* Floating Score Card */}
                <div className="absolute top-4 left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 z-10">
                  <div className="flex items-center gap-4">
                    {/* Circular Progress */}
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke={activeLayer === 'safety' ? '#10b981' : activeLayer === 'schools' ? '#3b82f6' : activeLayer === 'connectivity' ? '#8b5cf6' : activeLayer === 'dining' ? '#f97316' : '#ec4899'}
                          strokeWidth="4" 
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${Math.round(getLayerScore(activeLayer)) * 1.76} 176`}
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">{Math.round(getLayerScore(activeLayer))}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Score</p>
                      <p className="font-semibold text-gray-800">{defaultLayers.find(l => l.id === activeLayer)?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Property Price Badge */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] rounded-xl px-4 py-3 shadow-lg z-10">
                  <p className="text-xs text-white/80">Avg. Price</p>
                  <p className="font-bold text-white text-sm">{neighborhoodData.avgPropertyPrice}</p>
                </div>
              </div>

              {/* Layer Switcher */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Explore Layers</p>
                <div className="flex flex-wrap gap-2">
                  {defaultLayers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        activeLayer === layer.id
                          ? `${layer.color} text-white shadow-lg scale-105`
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <layer.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{layer.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Detailed Amenities */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <h3 className="font-semibold text-gray-800 mb-6">Nearby Amenities in {neighborhoodData.location.split(',')[0]}</h3>
            
            <div className="space-y-4">
              {/* Metro/Transit */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Train className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    {neighborhoodData.metro.some(t => t.type === 'Metro') ? 'Metro & Transit' : 'Public Transit'}
                  </span>
                </div>
                <div className="space-y-2">
                  {neighborhoodData.metro.map((station, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{station.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          station.type === 'Metro' ? 'bg-purple-100 text-purple-600' :
                          station.type === 'Railway' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {station.type}
                        </span>
                      </div>
                      <span className="text-gray-500">{station.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schools */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Schools</span>
                </div>
                <div className="space-y-2">
                  {neighborhoodData.schools.slice(0, 3).map((school, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{school.name}</span>
                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {school.rating}
                        </span>
                      </div>
                      <span className="text-gray-500">{school.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Hospital className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Hospitals</span>
                </div>
                <div className="space-y-2">
                  {neighborhoodData.hospitals.slice(0, 3).map((hospital, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{hospital.name}</span>
                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {hospital.rating}
                        </span>
                      </div>
                      <span className="text-gray-500">{hospital.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Shopping & Lifestyle</span>
                </div>
                <div className="space-y-2">
                  {neighborhoodData.shopping.map((shop, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{shop.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">{shop.type}</span>
                      </div>
                      <span className="text-gray-500">{shop.distance}</span>
                    </div>
                  ))}
                  <div className="flex gap-4 mt-2 pt-2 border-t border-gray-100 text-sm">
                    <span className="text-gray-600">🍽️ {neighborhoodData.restaurants} Restaurants</span>
                    <span className="text-gray-600">🛒 {neighborhoodData.groceryStores} Grocery Stores</span>
                  </div>
                </div>
              </div>

              {/* Note if data is estimated */}
              {neighborhoodData.note && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-sm text-amber-700">ℹ️ {neighborhoodData.note}</p>
                </div>
              )}

              {/* Price Trend */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Investment Insights</span>
                </div>
                <p className="text-sm text-emerald-700">
                  Property values in {neighborhoodData.location.split(',')[0]} are showing 
                  <span className="font-bold text-emerald-800"> positive growth trends</span>. 
                  Safety Score: {neighborhoodData.safetyScore}/100.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

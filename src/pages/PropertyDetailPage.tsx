import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import { 
  MapPin, Bed, Bath, Maximize, Heart, Share2, Phone, Mail, 
  Calendar, Home, Shield, ChevronLeft, ChevronRight,
  CheckCircle, Star, Building2, Ruler, Car, Sofa, Clock,
  Award, BarChart3, X, ArrowLeft, Loader2, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';

const API_BASE = 'https://api.propertiesprofessor.com/api';

// Helper function to check if user is logged in  
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

export function PropertyDetailPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [scheduleData, setScheduleData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '10:00 AM - 12:00 PM'
  });

  // Check login status on mount and fetch saved properties
  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn());
    const checkLogin = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  // Check if property is saved when property loads
  useEffect(() => {
    if (property && isLoggedIn) {
      const checkIfSaved = async () => {
        try {
          const token = localStorage.getItem('pp_token');
          const response = await fetch(`${API_BASE}/users/saved-properties`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success && data.data) {
            const savedIds = data.data.map((p: any) => p._id);
            setIsSaved(savedIds.includes(property._id));
          }
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      };
      checkIfSaved();
    }
  }, [property, isLoggedIn]);

  const toggleSave = async () => {
    if (!isLoggedIn) {
      alert('Please login to save properties');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    if (!property) return;
    
    try {
      const token = localStorage.getItem('pp_token');
      const response = await fetch(`${API_BASE}/users/save-property/${property._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Get property ID from URL
        const pathParts = window.location.pathname.split('/');
        const propertyId = pathParts[pathParts.length - 1];
        
        const response = await fetch(`${API_BASE}/properties/${propertyId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setProperty(data.data);
          
          // Fetch similar properties from same city
          const similarResponse = await fetch(`${API_BASE}/properties?city=${data.data.location?.city}&limit=4`);
          const similarData = await similarResponse.json();
          if (similarData.success && similarData.data) {
            setSimilarProperties(similarData.data.filter((p: Property) => p._id !== propertyId).slice(0, 3));
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1E3A5F] mx-auto mb-4" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
            <p className="text-gray-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => window.location.href = '/buy'}
              className="btn-primary"
            >
              Browse Properties
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      // Save to leads
      const response = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          propertyId: property._id,
          message: formData.message || `Inquiry about ${property.title}`,
          source: 'website'
        })
      });
      
      // Also save to customer data
      try {
        const customerResponse = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            source: 'property_inquiry',
            notes: `Property: ${property?.title}. ${formData.message || ''}`
          })
        });
        const customerData = await customerResponse.json();
        console.log('Customer save result:', customerData);
      } catch (customerError) {
        console.error('Error saving customer:', customerError);
      }
      
      const data = await response.json();
      if (data.success) {
        alert('Thank you! Our team will contact you shortly.');
        setShowContactForm(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert(data.message || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.name || !scheduleData.phone || !scheduleData.date) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      // Save to leads
      const response = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleData.name,
          email: scheduleData.email || `${scheduleData.phone}@placeholder.com`,
          phone: scheduleData.phone,
          propertyId: property._id,
          message: `Site visit requested for ${scheduleData.date} at ${scheduleData.time}`,
          source: 'website'
        })
      });
      
      // Also save to customer data
      try {
        const customerResponse = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: scheduleData.name,
            email: scheduleData.email || '',
            phone: scheduleData.phone,
            source: 'site_visit',
            notes: `Site visit for ${property?.title} on ${scheduleData.date} at ${scheduleData.time}`
          })
        });
        const customerData = await customerResponse.json();
        console.log('Customer save (site visit) result:', customerData);
      } catch (customerError) {
        console.error('Error saving customer (site visit):', customerError);
      }
      
      const data = await response.json();
      if (data.success) {
        alert('Site visit scheduled! Our team will contact you shortly.');
        setShowScheduleModal(false);
        setScheduleData({ name: '', phone: '', email: '', date: '', time: '10:00 AM - 12:00 PM' });
      } else {
        alert(data.message || 'Failed to schedule visit');
      }
    } catch (error) {
      console.error('Error scheduling visit:', error);
      alert('Error scheduling visit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Back Button */}
      <div className="pt-20 pb-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1E3A5F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to listings</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
              <img
                src={property.images[currentImageIndex]?.url}
                alt={property.images[currentImageIndex]?.caption || property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {property.blockchain?.verified && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {property.premium && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Premium
                  </span>
                )}
                {property.featured && (
                  <span className="px-3 py-1 rounded-full bg-[#1E3A5F] text-white text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {property.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx + 1)}
                  className="h-[120px] md:h-[240px] rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Image ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {property.images.length > 5 && (
                <div className="h-[120px] md:h-[240px] rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <span className="text-gray-600 font-medium">+{property.images.length - 5} more</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-500 flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-[#FF6B35]" />
                    {property.location.address}, {property.location.area}, {property.location.city}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleSave}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-gray-100">
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                    <Bed className="w-5 h-5" />
                    <span className="font-semibold text-2xl text-gray-800">{property.bedrooms}</span>
                  </div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                    <Bath className="w-5 h-5" />
                    <span className="font-semibold text-2xl text-gray-800">{property.bathrooms}</span>
                  </div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                    <Maximize className="w-5 h-5" />
                    <span className="font-semibold text-2xl text-gray-800">{property.area}</span>
                  </div>
                  <p className="text-sm text-gray-500">Sq. Ft.</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                    <Car className="w-5 h-5" />
                    <span className="font-semibold text-2xl text-gray-800">{property.parking}</span>
                  </div>
                  <p className="text-sm text-gray-500">Parking</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-3xl font-bold text-[#1E3A5F]">
                    {formatPrice(property.price)}
                    {property.listingType === 'rent' && <span className="text-lg">/month</span>}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{property.pricePerSqft?.toLocaleString()}/sq.ft
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    property.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    property.status === 'sold' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {property.status === 'available' ? 'Available' :
                     property.status === 'sold' ? 'Sold' :
                     'Under Construction'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#FF6B35]" />
                About this Property
              </h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium text-gray-800 capitalize">{property.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sofa className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Furnishing</p>
                    <p className="font-medium text-gray-800 capitalize">{property.furnishing ? property.furnishing.replace('-', ' ') : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Floor</p>
                    <p className="font-medium text-gray-800">{property.floor || "-"} of {property.totalFloors || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Age of Property</p>
                    <p className="font-medium text-gray-800">{property.ageOfProperty || 0} years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF6B35]" />
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 capitalize">{amenity.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF6B35]" />
                Developer Information
              </h2>
              <div className="flex items-start gap-4">
                {property.developer.logo && (
                {property.developer.logo && (
                <img
                  src={property.developer.logo}
                  alt={property.developer.name}
                  className="w-20 h-20 rounded-xl border border-gray-200"
                />
                )}
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{property.developer.name}</h3>
                  {property.developer.description && {property.developer.description && <p className="text-gray-600 text-sm mt-1">{property.developer.description}</p>}}
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium text-gray-800">{property.developer.trustScore}/100</span>
                    </div>
                    {property.developer.since && (<>
                    {property.developer.since && (<>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">Since {property.developer.since}</span>
                    </>)}
                    </>)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-500">Completed Projects</p>
                      <p className="text-lg font-bold text-gray-800">{property.developer.completedProjects}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50">
                      <p className="text-sm text-gray-500">Ongoing Projects</p>
                      <p className="text-lg font-bold text-gray-800">{property.developer.ongoingProjects}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Neighborhood */}
            {property.neighborhood && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  Neighborhood
                </h2>
                
                {/* Scores */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-emerald-50">
                    <p className="text-2xl font-bold text-emerald-600">{property.neighborhood.safetyScore}</p>
                    <p className="text-sm text-gray-600 mt-1">Safety Score</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-blue-50">
                    <p className="text-2xl font-bold text-blue-600">{property.neighborhood.connectivity}</p>
                    <p className="text-sm text-gray-600 mt-1">Connectivity</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-50">
                    <p className="text-2xl font-bold text-amber-600">{property.neighborhood.schoolRating}</p>
                    <p className="text-sm text-gray-600 mt-1">School Rating</p>
                  </div>
                </div>

                {/* Lifestyle Tags */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Lifestyle</p>
                  <div className="flex flex-wrap gap-2">
                    {property.neighborhood.lifestyle?.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nearby Places */}
                <div className="space-y-4">
                  {property.neighborhood.nearby?.schools && property.neighborhood.nearby.schools.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">🎓 Nearby Schools</p>
                      {property.neighborhood.nearby.schools.map((school, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <span className="text-gray-600">{school.name}</span>
                          <span className="text-sm text-gray-500">{school.distance} km</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {property.neighborhood.nearby?.hospitals && property.neighborhood.nearby.hospitals.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">🏥 Nearby Hospitals</p>
                      {property.neighborhood.nearby.hospitals.map((hospital, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <span className="text-gray-600">{hospital.name}</span>
                          <span className="text-sm text-gray-500">{hospital.distance} km</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {property.neighborhood.nearby?.malls && property.neighborhood.nearby.malls.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">🛍️ Shopping Centers</p>
                      {property.neighborhood.nearby.malls.map((mall, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2">
                          <span className="text-gray-600">{mall.name}</span>
                          <span className="text-sm text-gray-500">{mall.distance} km</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Construction Details */}
            {property.construction && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#FF6B35]" />
                  Construction Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Stage</p>
                    <p className="font-medium text-gray-800">{property.construction.currentStage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RERA Number</p>
                    <p className="font-medium text-gray-800">{property.construction.reraNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Possession Date</p>
                    <p className="font-medium text-gray-800">
                      {property.construction.possessionDate ? new Date(property.construction.possessionDate).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${property.construction.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{property.construction.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Properties</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {similarProperties.map((prop) => (
                    <div
                      key={prop._id}
                      onClick={() => window.location.href = `/property/${prop._id}`}
                      className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <img
                        src={prop.images[0]?.url}
                        alt={prop.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{prop.location.area}</p>
                        <p className="font-bold text-[#1E3A5F] text-sm mt-2">
                          {formatPrice(prop.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Contact Form Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Interested in this property?</h3>
                
                <div className="space-y-3 mb-6">
                  {isLoggedIn ? (
                    <>
                      <Button
                        onClick={() => setShowContactForm(!showContactForm)}
                        className="w-full btn-primary"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Request a Call Back
                      </Button>
                      
                      <Button
                        onClick={() => setShowScheduleModal(true)}
                        variant="outline"
                        className="w-full border-[#1E3A5F] text-[#1E3A5F]"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule Site Visit
                      </Button>

                      <a
                        href={`mailto:propertiesproffer@gmail.com?subject=Inquiry for ${property.title}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">Send Email</span>
                      </a>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Please login to make enquiries</p>
                      <Button
                        onClick={() => window.location.href = '/login'}
                        className="w-full btn-primary"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Login to Enquire
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Don't have an account? <a href="/register" className="text-[#FF6B35] hover:underline">Register here</a>
                      </p>
                    </div>
                  )}
                </div>

                {showContactForm && (
                  <form onSubmit={handleContactSubmit} className="space-y-3 pt-4 border-t border-gray-100">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                      required
                    />
                    <textarea
                      placeholder="Message (Optional)"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none h-24 resize-none"
                    />
                    <Button type="submit" className="w-full btn-primary">
                      Submit Request
                    </Button>
                  </form>
                )}
              </div>

              {/* Property Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#FF6B35]" />
                  Property Analytics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="font-medium text-gray-800">{property.analytics?.views || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Leads</span>
                    <span className="font-medium text-gray-800">{property.analytics?.leads || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Shortlists</span>
                    <span className="font-medium text-gray-800">{property.analytics?.shortlists || 0}</span>
                  </div>
                </div>
              </div>

              {/* Safety Info */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Safe & Verified</h4>
                    <p className="text-sm text-gray-600">
                      All properties are verified by our team. Your data is secure and protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Schedule Site Visit</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={handleScheduleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <select 
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                  >
                    <option>10:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 02:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={scheduleData.name}
                    onChange={(e) => setScheduleData({...scheduleData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    value={scheduleData.email}
                    onChange={(e) => setScheduleData({...scheduleData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone</label>
                  <input
                    type="tel"
                    value={scheduleData.phone}
                    onChange={(e) => setScheduleData({...scheduleData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-primary" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Confirm Schedule'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

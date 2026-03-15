import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/sections/Hero';
import { TrustBar } from '@/sections/TrustBar';
import { AIMatcher } from '@/sections/AIMatcher';
import { FeaturedProperties } from '@/sections/FeaturedProperties';
import { NeighborhoodDNA } from '@/sections/NeighborhoodDNA';
import { FinancialJourney } from '@/sections/FinancialJourney';
import { NRISection } from '@/sections/NRISection';
import { DeveloperSpotlight } from '@/sections/DeveloperSpotlight';
import { Testimonials } from '@/sections/Testimonials';
import { NewsSection } from '@/sections/NewsSection';
import { CTASection } from '@/sections/CTASection';
import { Footer } from '@/sections/Footer';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { PropertiesManager } from '@/components/admin/PropertiesManager';
import { DevelopersManager } from '@/components/admin/DevelopersManager';
import { LeadsManager } from '@/components/admin/LeadsManager';
import { NewsManager } from '@/components/admin/NewsManager';
import { TestimonialsManager } from '@/components/admin/TestimonialsManager';
import { SettingsManager, getSiteSettings } from '@/components/admin/SettingsManager';
import { CustomerManager } from '@/components/admin/CustomerManager';
import { BuyPage } from '@/pages/BuyPage';
import { RentPage } from '@/pages/RentPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import MarketResearchPage from '@/pages/MarketResearchPage';
import NRIPage from '@/pages/NRIPage';
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';

// Error Boundary Component to prevent white screen crashes
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6">We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#1E3A5F] text-white rounded-xl hover:bg-[#2d4a6f] transition-colors font-medium"
            >
              Refresh Page
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="block mx-auto mt-3 text-sm text-[#FF6B35] hover:underline"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main Website Homepage
function MainWebsite() {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch settings from backend
    fetch('https://api.propertiesprofessor.com/api/settings')
      .then(res => res.json())
      .then(data => {
        setSiteSettings(data);
      })
      .catch(err => {
        console.error('Error fetching settings:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        {siteSettings?.features?.enableAIMatcher !== false && <AIMatcher />}
        <FeaturedProperties />
        <NeighborhoodDNA />
        {siteSettings?.features?.enableFinancialCalculator !== false && <FinancialJourney />}
        {siteSettings?.features?.enableNRIServices !== false && <NRISection />}
        <DeveloperSpotlight />
        <Testimonials />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

// New Projects Page
function NewProjectsPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewProjects();
  }, []);

  const fetchNewProjects = async () => {
    try {
      const response = await fetch('https://api.propertiesprofessor.com/api/properties/section/newProjects');
      const data = await response.json();
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching new projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 pb-8 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">New Projects</h1>
          <p className="text-white/80">Discover the latest residential and commercial projects across India</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property._id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/property/${property._id}`}
              >
                <div className="h-48 relative">
                  {property.images?.[0]?.url ? (
                    <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-6xl">🏗️</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#FF6B35] text-white text-xs font-medium">New Launch</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 text-lg">{property.title}</h3>
                  <p className="text-gray-500 text-sm">{property.location?.area}, {property.location?.city}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-[#1E3A5F]">
                      {property.priceInWords || `₹${(property.price / 10000000).toFixed(2)} Cr`}
                    </span>
                    <span className="text-sm text-gray-500">{property.bedrooms} BHK</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🏗️</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No New Projects Available</h3>
            <p className="text-gray-500">Check back soon for new property launches!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// Commercial Page
function CommercialPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommercialProperties();
  }, []);

  const fetchCommercialProperties = async () => {
    try {
      const response = await fetch('https://api.propertiesprofessor.com/api/properties/section/commercial');
      const data = await response.json();
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching commercial properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 pb-8 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Commercial Properties</h1>
          <p className="text-white/80">Find the perfect office space, retail outlet, or commercial building</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property._id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/property/${property._id}`}
              >
                <div className="h-48 relative">
                  {property.images?.[0]?.url ? (
                    <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-6xl">🏢</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#1E3A5F] text-white text-xs font-medium">Commercial</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 text-lg">{property.title}</h3>
                  <p className="text-gray-500 text-sm">{property.location?.area}, {property.location?.city}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-[#1E3A5F]">
                      {property.priceInWords || `₹${(property.price / 10000000).toFixed(2)} Cr`}
                    </span>
                    <span className="text-sm text-gray-500">{property.area?.carpet || property.area?.builtUp} sq.ft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🏢</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Commercial Properties Available</h3>
            <p className="text-gray-500">Check back soon for new commercial listings!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

// Contact Page
function ContactPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [settings, setSettings] = useState(getSiteSettings());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Debug: Log login state
  console.log('ContactPage - isLoggedIn:', isLoggedIn, 'token:', !!localStorage.getItem('pp_token'), 'user:', !!localStorage.getItem('pp_user'));

  useEffect(() => {
    // Check login on mount
    setIsLoggedIn(isUserLoggedIn());
    
    const checkLogin = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('storage', checkLogin);
    
    const handleSettingsUpdate = () => setSettings(getSiteSettings());
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    try {
      // Save to leads API
      const response = await fetch('https://api.propertiesprofessor.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          message: formData.message || 'Contact form inquiry',
          source: 'contact_page'
        })
      });
      
      // Also save to customer data
      try {
        await fetch('https://api.propertiesprofessor.com/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            source: 'contact_form',
            notes: formData.message
          })
        });
      } catch (err) {
        console.error('Error saving customer:', err);
      }

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 pb-8 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/80">Get in touch with our team for any queries or assistance</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Message Sent!</h2>
                <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:bg-[#2d4a6f] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none" 
                        placeholder="John" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none" 
                      placeholder="john@example.com" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none" 
                      placeholder="+91 98765 43210" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none h-32 resize-none" 
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#FF6B35] text-white font-semibold hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">Our Office</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{settings.company.name}</p>
                    <p className="text-gray-500 text-sm">{settings.contact.address}<br />{settings.contact.city}, {settings.contact.state} {settings.contact.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span className="text-gray-600">{settings.contact.phone}</span>
                </div>
                {settings.contact.tollFree && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">☎️</span>
                    <span className="text-gray-600">{settings.contact.tollFree} (Toll Free)</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <span className="text-gray-600">{settings.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🕐</span>
                  <span className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Saved Properties Page
function SavedPropertiesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedProperties();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchSavedProperties = async () => {
    try {
      const token = localStorage.getItem('pp_token');
      const response = await fetch('https://api.propertiesprofessor.com/api/users/saved-properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSavedProperties(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId: string) => {
    try {
      const token = localStorage.getItem('pp_token');
      const response = await fetch(`https://api.propertiesprofessor.com/api/users/save-property/${propertyId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSavedProperties(prev => prev.filter(p => p._id !== propertyId));
      }
    } catch (error) {
      console.error('Error removing property:', error);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-24 pb-8 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Saved Properties</h1>
          <p className="text-white/80">Your favorite properties in one place</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🔐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-500 mb-6">Please login to view and save your favorite properties</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 rounded-xl bg-[#1E3A5F] text-white font-semibold hover:bg-[#2d4a6f] transition-colors"
            >
              Login to Continue
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-[#1E3A5F] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading saved properties...</p>
          </div>
        ) : savedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">💔</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved properties yet</h3>
            <p className="text-gray-500 mb-6">Start browsing and save properties you like</p>
            <button 
              onClick={() => window.location.href = '/buy'}
              className="px-6 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden group">
                <div className="relative h-48">
                  <img 
                    src={property.images?.[0]?.url || '/placeholder-property.jpg'} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemove(property._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
                  >
                    <span className="text-red-500">❤️</span>
                  </button>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 text-sm font-medium text-gray-800">
                    {property.type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{property.location?.locality}, {property.location?.city}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#1E3A5F]">{formatPrice(property.price)}</span>
                    <button 
                      onClick={() => window.location.href = `/property/${property._id}`}
                      className="px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#e55a2b] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <PropertiesManager />;
      case 'developers':
        return <DevelopersManager />;
      case 'leads':
        return <LeadsManager />;
      case 'customers':
        return <CustomerManager />;
      case 'news':
        return <NewsManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Analytics Coming Soon</h3>
              <p className="text-gray-500 mt-2">Advanced analytics and reporting features are under development.</p>
            </div>
          </div>
        );
      case 'settings':
        return <SettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}

// Main App Component - Simple Router
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route to appropriate component
  const renderRoute = () => {
    switch (currentPath) {
      case '/':
      case '/index.html':
        return <MainWebsite />;
      case '/buy':
        return <BuyPage />;
      case '/rent':
        return <RentPage />;
      case '/new-projects':
        return <NewProjectsPage />;
      case '/commercial':
        return <CommercialPage />;
      case '/nri':
        return <NRIPage />;
      case '/news':
        return <NewsPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/contact':
        return <ContactPage />;
      case '/saved':
        return <SavedPropertiesPage />;
      case '/admin':
        return <AdminDashboard />;
      case '/about':
        return <AboutPage />;
      case '/terms':
        return <TermsPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/market-research':
        return <MarketResearchPage />;
      default:
        // Check if it's a property detail page
        if (currentPath.startsWith('/property/')) {
          return <PropertyDetailPage />;
        }
        // Check if it's a news detail page
        if (currentPath.startsWith('/news/')) {
          const slug = currentPath.replace('/news/', '');
          return <NewsDetailPage slug={slug} />;
        }
        return <MainWebsite />;
    }
  };

  return (
    <ErrorBoundary>
      {renderRoute()}
    </ErrorBoundary>
  );
}

export default App;

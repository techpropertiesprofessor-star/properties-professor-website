import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import { Award, Users, Target, Heart, Shield, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';
import { getSiteSettings } from '@/components/admin/SettingsManager';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

export function AboutPage() {
  const [settings, setSettings] = useState(getSiteSettings());
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(getSiteSettings());
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    // Check login status
    const checkLogin = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('storage', checkLogin);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Properties Professor</h1>
          <p className="text-white/80 text-lg">Your Trusted Partner in Real Estate Journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Properties Professor is India's most trusted real estate platform, dedicated to making 
              property buying, selling, and renting a seamless and transparent experience. Founded with 
              a vision to revolutionize the real estate industry, we combine cutting-edge technology 
              with personalized service.
            </p>
            <p className="text-gray-600 mb-4">
              With years of expertise and thousands of satisfied customers, we've established ourselves 
              as the go-to platform for all real estate needs across India. Our commitment to transparency, 
              verified listings, and customer satisfaction sets us apart.
            </p>
            <p className="text-gray-600">
              Whether you're a first-time homebuyer, an experienced investor, or looking to rent your 
              dream home, Properties Professor is here to guide you every step of the way.
            </p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-3xl font-bold text-[#FF6B35] mb-2">10,000+</div>
                <p className="text-gray-600 text-sm">Properties Listed</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-3xl font-bold text-[#FF6B35] mb-2">5,000+</div>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-3xl font-bold text-[#FF6B35] mb-2">50+</div>
                <p className="text-gray-600 text-sm">Cities Covered</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="text-3xl font-bold text-[#FF6B35] mb-2">500Cr+</div>
                <p className="text-gray-600 text-sm">Worth Transacted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Trust & Transparency</h3>
              <p className="text-gray-600">
                Every property is verified, and every transaction is transparent. We believe in building 
                trust through honesty and integrity.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We go the extra mile to ensure your real estate 
                journey is smooth and successful.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Innovation</h3>
              <p className="text-gray-600">
                We leverage the latest technology and AI to provide you with the best property matches 
                and market insights.
              </p>
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] rounded-2xl p-8 text-white">
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-white/90">
              To empower every Indian with the tools and knowledge to make informed real estate decisions, 
              making property transactions accessible, transparent, and hassle-free for everyone.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8555] rounded-2xl p-8 text-white">
            <Award className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-white/90">
              To become India's most trusted and comprehensive real estate platform, setting new standards 
              for transparency, customer service, and technological innovation in the industry.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Choose Properties Professor?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">100% Verified Listings</h4>
                <p className="text-gray-600 text-sm">Every property is personally verified by our team to ensure authenticity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Expert Guidance</h4>
                <p className="text-gray-600 text-sm">Our team of real estate experts is always ready to assist you.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Pan-India Presence</h4>
                <p className="text-gray-600 text-sm">Access properties across 50+ cities in India.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Award-Winning Service</h4>
                <p className="text-gray-600 text-sm">Recognized as one of India's most trusted real estate platforms.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Get in Touch</h2>
            <p className="text-gray-600">Have questions? We're here to help you find your dream property.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <button 
              onClick={() => {
                if (isLoggedIn) {
                  window.location.href = `tel:${settings.contact.phone.replace(/\s/g, '')}`;
                } else {
                  window.location.href = '/login?redirect=contact';
                }
              }}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#FF6B35] hover:bg-orange-50 transition-colors text-left w-full"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Call Us</p>
                <p className="font-semibold text-gray-800">{isLoggedIn ? settings.contact.phone : 'Login to view'}</p>
              </div>
            </button>
            <button 
              onClick={() => {
                if (isLoggedIn) {
                  window.location.href = `mailto:${settings.contact.email}`;
                } else {
                  window.location.href = '/login?redirect=contact';
                }
              }}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#FF6B35] hover:bg-orange-50 transition-colors text-left w-full"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Us</p>
                <p className="font-semibold text-gray-800">{isLoggedIn ? settings.contact.email : 'Login to view'}</p>
              </div>
            </button>
            <a href={settings.contact.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#FF6B35] hover:bg-orange-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Visit Us</p>
                <p className="font-semibold text-gray-800 text-sm">{settings.contact.city}, {settings.contact.state}</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

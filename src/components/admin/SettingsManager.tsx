import { useState, useEffect } from 'react';
import { Save, Upload, Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Globe, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiteSettings {
  company: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
  };
  contact: {
    phone: string;
    email: string;
    tollFree: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    googleMapsUrl: string;
  };
  social: {
    instagram: string;
    linkedin: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  features: {
    enableAIMatcher: boolean;
    enableVirtualTours: boolean;
    enableNRIServices: boolean;
    enableFinancialCalculator: boolean;
  };
}

const defaultSettings: SiteSettings = {
  company: {
    name: 'Properties Professor',
    tagline: 'Your Trusted Real Estate Partner',
    description: 'Properties Professor is India\'s leading real estate platform, helping you find your dream home with AI-powered recommendations and expert guidance.',
    logo: '/logo.png'
  },
  contact: {
    phone: '+91 91563 01600',
    email: 'propertiesproffer@gmail.com',
    tollFree: '1800 123 4567',
    address: 'Office No. 123, Real Estate Plaza',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    googleMapsUrl: 'https://maps.google.com/?q=Pune,Maharashtra'
  },
  social: {
    instagram: 'https://www.instagram.com/propertiesprofessor',
    linkedin: 'https://www.linkedin.com/company/properties-professor',
    facebook: 'https://www.facebook.com/profile.php?id=61586274812766',
    twitter: 'https://twitter.com/propertiespro',
    youtube: 'https://youtube.com/@propertiesprofessor'
  },
  features: {
    enableAIMatcher: true,
    enableVirtualTours: true,
    enableNRIServices: true,
    enableFinancialCalculator: true
  }
};

// Helper function to get settings (can be used by other components)
export function getSiteSettings(): SiteSettings {
  try {
    const saved = localStorage.getItem('pp_site_settings');
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return defaultSettings;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [activeSection, setActiveSection] = useState<'company' | 'contact' | 'social' | 'features'>('company');
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('http://143.198.94.42:5001/api/settings');
        const data = await response.json();
        if (data) {
          // Merge with defaults to ensure all fields exist
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (error) {
        console.error('Error loading settings from backend:', error);
        // Fallback to localStorage
        const saved = getSiteSettings();
        setSettings(saved);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to backend
      const response = await fetch('http://143.198.94.42:5001/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings to server');
      }
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('pp_site_settings', JSON.stringify(settings));
      // Dispatch event so other components can react
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
      alert('Settings saved successfully! Changes will reflect across the site.');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const token = localStorage.getItem('pp_token');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'branding');
      formDataUpload.append('maxWidth', '500');
      formDataUpload.append('quality', '90');

      const response = await fetch('http://143.198.94.42:5001/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setSettings(prev => ({
          ...prev,
          company: { ...prev.company, logo: result.data.url }
        }));
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const sections = [
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'contact', label: 'Contact Details', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'features', label: 'Features', icon: Globe }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Site Settings</h2>
          <p className="text-gray-500 mt-1">Manage your website configuration and preferences</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1E3A5F] hover:bg-[#152a45]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === section.id
                ? 'border-[#1E3A5F] text-[#1E3A5F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Company Information */}
      {activeSection === 'company' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {uploadingLogo ? (
                  <div className="w-8 h-8 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin" />
                ) : settings.company.logo ? (
                  <img src={settings.company.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                <label
                  htmlFor="logo-upload"
                  className={`px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 cursor-pointer inline-block ${
                    uploadingLogo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG - Stored on cloud</p>
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={settings.company.name}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                company: { ...prev.company, name: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              value={settings.company.tagline}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                company: { ...prev.company, tagline: e.target.value }
              }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
            <textarea
              value={settings.company.description}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                company: { ...prev.company, description: e.target.value }
              }))}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Contact Details */}
      {activeSection === 'contact' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Primary Phone
              </label>
              <input
                type="tel"
                value={settings.contact.phone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, phone: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* Toll Free */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Toll Free Number
              </label>
              <input
                type="tel"
                value={settings.contact.tollFree}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, tollFree: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Street Address
              </label>
              <input
                type="text"
                value={settings.contact.address}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, address: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={settings.contact.city}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, city: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={settings.contact.state}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, state: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={settings.contact.pincode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, pincode: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
              />
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
              <input
                type="url"
                value={settings.contact.googleMapsUrl}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  contact: { ...prev.contact, googleMapsUrl: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://maps.google.com/?q=..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Media */}
      {activeSection === 'social' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
          
          <div className="space-y-4">
            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="w-4 h-4 inline mr-2 text-pink-500" />
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={settings.social.instagram}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, instagram: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://www.instagram.com/yourpage"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="w-4 h-4 inline mr-2 text-blue-600" />
                LinkedIn Company Page URL
              </label>
              <input
                type="url"
                value={settings.social.linkedin}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, linkedin: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://www.linkedin.com/company/yourpage"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="w-4 h-4 inline mr-2 text-blue-700" />
                Facebook Page URL
              </label>
              <input
                type="url"
                value={settings.social.facebook}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, facebook: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://www.facebook.com/yourpage"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2 text-sky-500" />
                Twitter/X Profile URL
              </label>
              <input
                type="url"
                value={settings.social.twitter}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, twitter: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://twitter.com/yourpage"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2 text-red-600" />
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={settings.social.youtube}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, youtube: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none"
                placeholder="https://youtube.com/@yourpage"
              />
            </div>
          </div>
        </div>
      )}

      {/* Features Toggle */}
      {activeSection === 'features' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Website Features</h3>
          <p className="text-sm text-gray-500 mb-4">Enable or disable specific features on your website</p>
          
          <div className="space-y-4">
            {/* AI Matcher */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50">
              <div>
                <h4 className="font-medium text-gray-800">AI Property Matcher</h4>
                <p className="text-sm text-gray-500">AI-powered property recommendations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.enableAIMatcher}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableAIMatcher: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
              </label>
            </div>

            {/* Virtual Tours */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50">
              <div>
                <h4 className="font-medium text-gray-800">Virtual Tours</h4>
                <p className="text-sm text-gray-500">360° property virtual tours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.enableVirtualTours}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableVirtualTours: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
              </label>
            </div>

            {/* NRI Services */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50">
              <div>
                <h4 className="font-medium text-gray-800">NRI Services</h4>
                <p className="text-sm text-gray-500">Services for Non-Resident Indians</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.enableNRIServices}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableNRIServices: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
              </label>
            </div>

            {/* Financial Calculator */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50">
              <div>
                <h4 className="font-medium text-gray-800">Financial Calculator</h4>
                <p className="text-sm text-gray-500">EMI and loan calculators</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.enableFinancialCalculator}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    features: { ...prev.features, enableFinancialCalculator: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A5F]"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1E3A5F] hover:bg-[#152a45]"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}

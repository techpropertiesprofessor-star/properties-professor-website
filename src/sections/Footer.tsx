import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp } from 'lucide-react';
import { getSiteSettings } from '@/components/admin/SettingsManager';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

const footerLinks = {
  properties: {
    title: 'Properties',
    links: [
      { label: 'Buy Property', href: '/buy' },
      { label: 'Rent Property', href: '/rent' },
      { label: 'New Projects', href: '/new-projects' },
      { label: 'Commercial', href: '/commercial' },
      { label: 'PG/Co-living', href: '/rent' },
      { label: 'Plots/Land', href: '/buy' }
    ]
  },
  cities: {
    title: 'Cities',
    links: [
      { label: 'Mumbai', href: '#' },
      { label: 'Bangalore', href: '#' },
      { label: 'Gurgaon', href: '#' },
      { label: 'Pune', href: '#' },
      { label: 'Hyderabad', href: '#' },
      { label: 'Chennai', href: '#' }
    ]
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/contact' },
      { label: 'Press', href: '/news' },
      { label: 'Blog', href: '/news' },
      { label: 'Partner With Us', href: '/contact' },
      { label: 'Contact Us', href: '/contact' }
    ]
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Sitemap', href: '/' },
      { label: 'Grievance', href: '/contact' },
      { label: 'RERA Information', href: '/contact' }
    ]
  }
};

export function Footer() {
  const [settings, setSettings] = useState(getSiteSettings());
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  useEffect(() => {
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      setSettings(getSiteSettings());
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    // Check login status
    const checkLogin = () => {
      setIsLoggedIn(isUserLoggedIn());
    };
    window.addEventListener('storage', checkLogin);
    // Also check periodically in case localStorage changed
    const interval = setInterval(checkLogin, 1000);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Facebook, href: settings.social.facebook, label: 'Facebook' },
    { icon: Twitter, href: settings.social.twitter, label: 'Twitter' },
    { icon: Instagram, href: settings.social.instagram, label: 'Instagram' },
    { icon: Linkedin, href: settings.social.linkedin, label: 'LinkedIn' },
    { icon: Youtube, href: settings.social.youtube, label: 'YouTube' }
  ];

  return (
    <footer className="bg-[#1E3A5F] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/logo.png" 
                  alt="Properties Professor" 
                  className="w-28 h-28 object-contain"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black uppercase tracking-tight text-white">
                    PROPERTIES
                  </span>
                  <span className="text-2xl font-black uppercase tracking-tight text-[#FF6B35]">
                    PROFESSOR
                  </span>
                </div>
              </div>
              <p className="text-white/70 mb-6 max-w-sm">
                {settings.company.description}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href={settings.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-[#FF6B35] transition-colors"
                >
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  <span className="text-sm">{settings.contact.city}, {settings.contact.state}, India</span>
                </a>
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      window.location.href = `tel:${settings.contact.phone.replace(/\s/g, '')}`;
                    } else {
                      window.location.href = '/login?redirect=contact';
                    }
                  }}
                  className="flex items-center gap-3 text-white/70 hover:text-[#FF6B35] transition-colors w-full text-left"
                >
                  <Phone className="w-5 h-5 text-[#FF6B35]" />
                  <span className="text-sm">{isLoggedIn ? settings.contact.phone : 'Login to view phone'}</span>
                </button>
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      window.location.href = `mailto:${settings.contact.email}`;
                    } else {
                      window.location.href = '/login?redirect=contact';
                    }
                  }}
                  className="flex items-center gap-3 text-white/70 hover:text-[#FF6B35] transition-colors w-full text-left"
                >
                  <Mail className="w-5 h-5 text-[#FF6B35]" />
                  <span className="text-sm">{isLoggedIn ? settings.contact.email : 'Login to view email'}</span>
                </button>
              </div>
            </div>

            {/* Links Columns */}
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-[#FF6B35] transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links Only */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-white/70 text-sm">Follow us:</span>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50 text-sm">
                © 2026 Properties Professor. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {/* RERA badge removed */}
                <button
                  onClick={scrollToTop}
                  className="w-10 h-10 rounded-full bg-[#FF6B35] hover:bg-[#e55a2b] flex items-center justify-center transition-colors"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

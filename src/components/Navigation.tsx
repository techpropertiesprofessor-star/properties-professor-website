import { useState, useEffect } from 'react';
import { Menu, X, User, Heart, Phone, LogIn, LogOut, Home, Building2, MapPin, Briefcase, Globe, BookOpen, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

const navLinks = [
  { label: 'Buy', href: '/buy', icon: Home },
  { label: 'Rent', href: '/rent', icon: Building2 },
  { label: 'New Projects', href: '/new-projects', icon: MapPin },
  { label: 'Commercial', href: '/commercial', icon: Briefcase },
  { label: 'NRI', href: '/nri', icon: Globe },
  { label: 'About', href: '/about', icon: Info },
  { label: 'News', href: '/news', icon: BookOpen }
];

export function Navigation({ forceSolid = false }: { forceSolid?: boolean } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  const activeScrolled = isScrolled || forceSolid;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check login status
    const checkLogin = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('storage', checkLogin);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLogin);
    };
  }, []);

  const handleNavClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          activeScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2'
            : 'bg-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img 
                src="/logo.png" 
                alt="Properties Professor" 
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col gap-0">
                <span className={`text-base font-bold uppercase tracking-tight transition-colors leading-tight ${
                  activeScrolled ? 'text-[#1E3A5F]' : 'text-white'
                }`}>
                  PROPERTIES
                </span>
                <span className={`text-base font-bold uppercase tracking-tight transition-colors leading-tight ${
                  activeScrolled ? 'text-[#FF6B35]' : 'text-[#FF6B35]'
                }`}>
                  PROFESSOR
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeScrolled 
                      ? 'text-gray-600 hover:text-[#1E3A5F] hover:bg-gray-100' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={() => window.location.href = '/saved'}
                className={`p-2.5 rounded-lg transition-colors ${
                  activeScrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-white'
                }`}
                title="Saved Properties"
              >
                <Heart className="w-5 h-5" />
              </button>
              {isLoggedIn ? (
                <button 
                  onClick={() => {
                    localStorage.removeItem('pp_token');
                    localStorage.removeItem('pp_user');
                    window.location.href = '/';
                  }}
                  className={`p-2.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeScrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-white'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className={`p-2.5 rounded-lg transition-colors ${
                    activeScrolled ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-white'
                  }`}
                  title="Login"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
              <Button 
                onClick={() => {
                  if (isLoggedIn) {
                    window.location.href = '/contact';
                  } else {
                    window.location.href = '/login?redirect=contact';
                  }
                }}
                className={`flex items-center gap-2 ${
                  activeScrolled ? 'btn-primary' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Contact Us</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                activeScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${activeScrolled ? 'text-gray-600' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${activeScrolled ? 'text-gray-600' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-[#1E3A5F]">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setIsMobileMenuOpen(false);
                    handleNavClick(link.href); 
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#1E3A5F] font-medium transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
              {isLoggedIn ? (
                <Button 
                  onClick={() => { 
                    setIsMobileMenuOpen(false); 
                    localStorage.removeItem('pp_token');
                    localStorage.removeItem('pp_user');
                    window.location.href = '/';
                  }}
                  className="w-full btn-primary"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button 
                  onClick={() => { setIsMobileMenuOpen(false); window.location.href = '/login'; }}
                  className="w-full btn-primary"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login / Register
                </Button>
              )}
              <Button 
                onClick={() => { 
                  setIsMobileMenuOpen(false); 
                  if (isLoggedIn) {
                    window.location.href = '/contact';
                  } else {
                    window.location.href = '/login?redirect=contact';
                  }
                }}
                variant="outline" 
                className="w-full border-[#1E3A5F] text-[#1E3A5F]"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-2">Need help?</p>
              <p className="text-lg font-semibold text-[#1E3A5F]">1800 123 4567</p>
              <p className="text-sm text-gray-500">Toll Free</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

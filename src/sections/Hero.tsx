import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Mic, ArrowRight, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProperties, cities } from '@/data/mockData';

// Web Speech API types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [, setSearchResults] = useState<typeof mockProperties>([]);
  const [, setShowResults] = useState(false);
  
  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // Indian English
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setSearchQuery(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleVoiceRecognition = () => {
    if (!voiceSupported || !recognitionRef.current) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSearchQuery(''); // Clear previous search
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSearch = () => {
    // Filter properties based on search query and city
    const results = mockProperties.filter(p => {
      const matchesCity = selectedCity === 'All' || p.location.city === selectedCity;
      const matchesQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesQuery;
    });
    
    setSearchResults(results);
    setShowResults(true);
    
    // Navigate to buy page with search params
    window.location.href = `/buy?city=${selectedCity}&q=${searchQuery}`;
  };

  const handleQuickFilter = (filter: string) => {
    const routes: Record<string, string> = {
      'Buy': '/buy',
      'Rent': '/rent',
      'New Projects': '/new-projects',
      'Commercial': '/commercial'
    };
    window.location.href = routes[filter] || '/buy';
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Luxury Home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl animate-pulse-slow"
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#00C9A7]/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div 
              className={`space-y-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
                <span className="text-white/90 text-sm font-medium">
                  India's Most Trusted Real Estate Platform
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="heading-1 text-white">
                  Find Your
                  <span className="block text-[#FF6B35]">Perfect Home</span>
                </h1>
                <p className="text-xl text-white/80 max-w-lg">
                  Discover verified properties with blockchain security, 
                  AI-powered matching, and complete transparency.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                {/* Voice Listening Indicator - Enhanced UI */}
                {isListening && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2d5a8a] to-[#1E3A5F] text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        {/* Animated Sound Waves */}
                        <div className="flex items-end gap-0.5 h-6">
                          <span className="w-1 bg-[#FF6B35] rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ height: '6px', animationDelay: '0ms' }} />
                          <span className="w-1 bg-[#FF6B35] rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ height: '12px', animationDelay: '100ms' }} />
                          <span className="w-1 bg-[#FF6B35] rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ height: '20px', animationDelay: '200ms' }} />
                          <span className="w-1 bg-[#FF6B35] rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ height: '16px', animationDelay: '300ms' }} />
                          <span className="w-1 bg-[#FF6B35] rounded-full animate-[soundwave_0.5s_ease-in-out_infinite]" style={{ height: '8px', animationDelay: '400ms' }} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">Listening...</span>
                          <span className="text-xs text-white/70">Speak your search query</span>
                        </div>
                        {/* Pulsing Mic Icon */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#FF6B35] rounded-full animate-ping opacity-30" />
                          <div className="relative w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Arrow pointing down */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-[#1E3A5F] rotate-45 border-r border-b border-white/20" />
                  </div>
                )}
                <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* City Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowCityDropdown(!showCityDropdown)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-[#FF6B35]" />
                      <span className="font-medium text-gray-700">{selectedCity}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showCityDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <button
                          onClick={() => {
                            setSelectedCity('All');
                            setShowCityDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          All Cities
                        </button>
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city);
                              setShowCityDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by locality, project, or landmark..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-12 py-3 border-0 bg-transparent focus-visible:ring-0 text-gray-700 placeholder:text-gray-400"
                    />
                    <button 
                      onClick={toggleVoiceRecognition}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                        isListening 
                          ? 'bg-red-100 animate-pulse' 
                          : 'hover:bg-gray-100'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice search'}
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5 text-red-500" />
                      ) : (
                        <Mic className="w-5 h-5 text-[#1E3A5F]" />
                      )}
                    </button>
                  </div>

                  {/* Search Button */}
                  <Button 
                    onClick={handleSearch}
                    className="btn-secondary px-8 py-3 h-auto"
                  >
                    Search
                  </Button>
                </div>
              </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                {['Buy', 'Rent', 'New Projects', 'Commercial'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleQuickFilter(filter)}
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                  >
                    {filter}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Stats */}
                {/* Marketing stats removed as per requirements */}
            </div>

            {/* Right Column - Floating Cards */}
            <div 
              className={`hidden lg:block relative h-[500px] transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              {/* Floating Property Cards */}
              {mockProperties.slice(0, 3).map((property, index) => (
                <div
                  key={property._id}
                  onClick={() => window.location.href = `/buy`}
                  className="absolute w-72 bg-white rounded-2xl shadow-2xl overflow-hidden animate-float cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    top: `${index * 120}px`,
                    right: `${index * 40}px`,
                    animationDelay: `${index * 0.5}s`,
                    zIndex: 3 - index
                  }}
                >
                  <div className="relative h-40">
                    <img
                      src={property.images[0]?.url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="trust-badge trust-badge-verified">
                        Verified
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="price-tag text-sm">
                        {property.priceInWords || `₹${(property.price / 10000000).toFixed(1)} Cr`}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location.area}, {property.location.city}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span>{property.bedrooms} BHK</span>
                      <span>{property.area} sq.ft</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#00C9A7]/20 rounded-full blur-2xl" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF6B35]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const API_BASE = 'https://api.propertiesprofessor.com/api';

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  propertyType: string;
  rating: number;
  review: string;
  image?: string;
  videoUrl?: string;
  isVideoTestimonial: boolean;
  featured: boolean;
  verified: boolean;
}

const fallbackTestimonials: Testimonial[] = [
  {
    _id: '1',
    name: 'Rahul & Priya Sharma',
    location: 'Mumbai',
    propertyType: '3BHK Apartment',
    rating: 5,
    review: 'Properties Professor made our dream of owning a home in Mumbai a reality. The AI matching found us the perfect 3BHK in Bandra that matched our lifestyle perfectly.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    isVideoTestimonial: true,
    featured: true,
    verified: true
  },
  {
    _id: '2',
    name: 'Amit Gupta',
    location: 'USA',
    propertyType: '2BHK Investment',
    rating: 5,
    review: 'Being in the US, I was worried about investing in Indian real estate. Properties Professor\'s virtual tours and NRI services made it seamless.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isVideoTestimonial: true,
    featured: true,
    verified: true
  },
  {
    _id: '3',
    name: 'Sneha Reddy',
    location: 'Bangalore',
    propertyType: '2BHK Apartment',
    rating: 5,
    review: 'The Neighborhood DNA feature helped me understand the area before moving. I found a great apartment near my office with all the amenities I needed.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    isVideoTestimonial: false,
    featured: true,
    verified: true
  }
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  useEffect(() => {
    // Try to fetch from API, but keep fallback data if it fails
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE}/testimonials/featured`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        // Silently use fallback data
        console.log('Using fallback testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  if (!activeTestimonial) {
    return (
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="heading-2 text-gray-900 mt-2">
            Real Stories, Real Homes
          </h2>
          <p className="text-gray-600 mt-3">
            No testimonials available yet. Add testimonials from the admin panel.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="heading-2 text-gray-900 mt-2">
            Real Stories, Real Homes
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Join thousands of happy families who found their dream homes through Properties Professor.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Image/Video Side */}
              <div className="relative h-80 lg:h-auto bg-gray-100">
                {activeTestimonial.image && !activeTestimonial.image.startsWith('data:') ? (
                  <img
                    src={activeTestimonial.image}
                    alt={activeTestimonial.name || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1E3A5F]">
                    <span className="text-white text-6xl font-bold">{(activeTestimonial.name || 'A').charAt(0)}</span>
                  </div>
                )}
                {activeTestimonial.isVideoTestimonial && activeTestimonial.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button 
                      onClick={() => setShowVideoModal(true)}
                      className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Play className="w-6 h-6 text-[#FF6B35] ml-1" />
                    </button>
                  </div>
                )}
                
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl text-gray-700 leading-relaxed mb-8">
                  "{activeTestimonial.review || ''}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p className="font-semibold text-gray-800">{activeTestimonial.name || ''}</p>
                    <p className="text-sm text-gray-500">{activeTestimonial.location || ''}</p>
                  </div>
                </div>

                {/* Journey Stats */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="px-4 py-2 rounded-full bg-[#1E3A5F]/10">
                    <span className="text-sm font-medium text-[#1E3A5F]">
                      {activeTestimonial.propertyType || ''}
                    </span>
                  </div>
                  {activeTestimonial.verified && (
                    <div className="px-4 py-2 rounded-full bg-emerald-100">
                      <span className="text-sm font-medium text-emerald-700">
                        Verified Customer
                      </span>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === activeIndex
                            ? 'bg-[#FF6B35] w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { value: '50,000+', label: 'Happy Families' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '95%', label: 'Would Recommend' },
            { value: '30 Days', label: 'Avg. Search Time' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <p className="text-3xl font-bold text-[#1E3A5F]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Video Modal */}
      {showVideoModal && activeTestimonial.videoUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {getYouTubeVideoId(activeTestimonial.videoUrl) ? (
                <iframe
                  className="absolute inset-0 w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(activeTestimonial.videoUrl)}?autoplay=1&rel=0`}
                  title="Testimonial Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl">
                  <p className="text-white">Invalid video URL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

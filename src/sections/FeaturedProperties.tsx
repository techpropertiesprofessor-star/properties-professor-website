export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!(localStorage.getItem('pp_token') && localStorage.getItem('pp_user')));
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties/section/featured`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProperties(data.data);
          }
        }
      } catch (error) {
        // No fallback to mock/demo data
      }
    };
    fetchProperties();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (properties.length === 0) {
    return (
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-500">No featured properties available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">Handpicked For You</span>
            <h2 className="heading-2 text-gray-900 mt-2">Featured Properties</h2>
            <p className="text-gray-600 mt-3 max-w-xl">Explore our curated selection of featured properties from trusted developers.</p>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {properties.map((property) => (
            <div key={property._id} className="flex-shrink-0 w-[350px] snap-start">
              <div className="property-card h-full">
                <div className="property-card-image">
                  <img src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'} alt={property.title} className="w-full h-full object-cover" />
                  <button onClick={() => window.location.href = `/property/${property._id}`} className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-[#FF6B35] text-white font-semibold shadow-lg">View Details</button>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{property.location?.area}, {property.location?.city}</p>
                  <p className="font-bold text-[#1E3A5F] text-xl mb-1">₹{property.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{property.bedrooms} BHK • {property.area} sq.ft</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

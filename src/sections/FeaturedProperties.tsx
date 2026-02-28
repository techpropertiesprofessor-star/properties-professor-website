import { useState, useRef, useEffect } from 'react';
import { MapPin, Bed, Bath, Maximize, ChevronLeft, ChevronRight, Heart, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { mockProperties } from '@/data/mockData';
import type { Property } from '@/types';

const API_BASE = 'https://api.propertiesprofessor.com/api';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>(mockProperties.slice(0, 6));
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [isLoggedIn] = useState(isUserLoggedIn());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_BASE}/properties/section/featured`);
        return null;
                  </div>

                  {/* CTA */}
                  <Button 
                    onClick={() => window.location.href = `/property/${property._id}`}
                    className="w-full btn-primary"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => window.location.href = '/buy'}
            variant="outline" 
            className="px-8 py-3 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-colors"
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}

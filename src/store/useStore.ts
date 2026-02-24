import { useState, useCallback } from 'react';
import type { Property, Lead, User, SearchFilters } from '@/types';

interface AppState {
  // Auth State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Properties State
  properties: Property[];
  featuredProperties: Property[];
  selectedProperty: Property | null;
  savedProperties: string[];
  
  // Leads State
  leads: Lead[];
  
  // UI State
  isLoading: boolean;
  searchFilters: SearchFilters;
}

const initialSearchFilters: SearchFilters = {
  city: '',
  area: '',
  type: '',
  status: 'available',
  listingType: 'sale',
  amenities: [],
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// Simple hook-based store (no zustand dependency)
export function useStore() {
  const [state, setState] = useState<AppState>({
    user: null,
    token: null,
    isAuthenticated: false,
    properties: [],
    featuredProperties: [],
    selectedProperty: null,
    savedProperties: [],
    leads: [],
    isLoading: false,
    searchFilters: initialSearchFilters
  });

  const setUser = useCallback((user: User | null) => {
    setState(prev => ({ ...prev, user, isAuthenticated: !!user }));
  }, []);

  const setToken = useCallback((token: string | null) => {
    setState(prev => ({ ...prev, token }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: null,
      token: null,
      isAuthenticated: false,
      savedProperties: []
    }));
  }, []);

  const setProperties = useCallback((properties: Property[]) => {
    setState(prev => ({ ...prev, properties }));
  }, []);

  const setFeaturedProperties = useCallback((properties: Property[]) => {
    setState(prev => ({ ...prev, featuredProperties: properties }));
  }, []);

  const setSelectedProperty = useCallback((property: Property | null) => {
    setState(prev => ({ ...prev, selectedProperty: property }));
  }, []);

  const toggleSavedProperty = useCallback((propertyId: string) => {
    setState(prev => {
      const index = prev.savedProperties.indexOf(propertyId);
      if (index === -1) {
        return { ...prev, savedProperties: [...prev.savedProperties, propertyId] };
      } else {
        return {
          ...prev,
          savedProperties: prev.savedProperties.filter((id) => id !== propertyId)
        };
      }
    });
  }, []);

  const setLeads = useCallback((leads: Lead[]) => {
    setState(prev => ({ ...prev, leads }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setState(prev => ({
      ...prev,
      searchFilters: { ...prev.searchFilters, ...filters }
    }));
  }, []);

  const resetSearchFilters = useCallback(() => {
    setState(prev => ({ ...prev, searchFilters: initialSearchFilters }));
  }, []);

  return {
    ...state,
    setUser,
    setToken,
    logout,
    setProperties,
    setFeaturedProperties,
    setSelectedProperty,
    toggleSavedProperty,
    setLeads,
    setIsLoading,
    setSearchFilters,
    resetSearchFilters
  };
}

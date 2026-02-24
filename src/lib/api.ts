// API Service for Properties Professor
// Connects frontend to backend APIs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('pp_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
        error: data.error,
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ==================== AUTH API ====================

export const authAPI = {
  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest<{
      _id: string;
      name: string;
      email: string;
      role: string;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('pp_token', response.data.token);
      localStorage.setItem('pp_user', JSON.stringify(response.data));
    }

    return response;
  },

  // Get current user
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('pp_user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('pp_token');
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// ==================== PROPERTIES API ====================

export const propertiesAPI = {
  // Get all properties with filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    listingType?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/properties?${queryParams}`);
  },

  // Get featured properties
  getFeatured: async () => {
    return apiRequest('/properties/featured/list');
  },

  // Get properties by section
  getBySection: async (section: string, limit?: number) => {
    return apiRequest(`/properties/section/${section}?limit=${limit || 12}`);
  },

  // Get single property
  getById: async (id: string) => {
    return apiRequest(`/properties/${id}`);
  },

  // Create property (Admin)
  create: async (propertyData: Record<string, unknown>) => {
    return apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Update property (Admin)
  update: async (id: string, propertyData: Record<string, unknown>) => {
    return apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  // Delete property (Admin)
  delete: async (id: string) => {
    return apiRequest(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle featured
  toggleFeatured: async (id: string) => {
    return apiRequest(`/properties/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  },
};

// ==================== LEADS API ====================

export const leadsAPI = {
  // Get all leads (Admin)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/leads?${queryParams}`);
  },

  // Get dashboard stats
  getStats: async () => {
    return apiRequest('/leads/stats/dashboard');
  },

  // Create lead (Contact form submission)
  create: async (leadData: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    propertyId?: string;
    source?: string;
  }) => {
    return apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // Update lead status (Admin)
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete lead (Admin)
  delete: async (id: string) => {
    return apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== NEWS API ====================

export const newsAPI = {
  // Get all news
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/news?${queryParams}`);
  },

  // Get single article
  getById: async (id: string) => {
    return apiRequest(`/news/${id}`);
  },

  // Create article (Admin)
  create: async (articleData: Record<string, unknown>) => {
    return apiRequest('/news', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  // Update article (Admin)
  update: async (id: string, articleData: Record<string, unknown>) => {
    return apiRequest(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  // Delete article (Admin)
  delete: async (id: string) => {
    return apiRequest(`/news/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TESTIMONIALS API ====================

export const testimonialsAPI = {
  // Get all testimonials
  getAll: async (params?: { featured?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/testimonials?${queryParams}`);
  },

  // Get stats
  getStats: async () => {
    return apiRequest('/testimonials/stats/summary');
  },

  // Create testimonial (Admin)
  create: async (testimonialData: Record<string, unknown>) => {
    return apiRequest('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },

  // Update testimonial (Admin)
  update: async (id: string, testimonialData: Record<string, unknown>) => {
    return apiRequest(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  },

  // Delete testimonial (Admin)
  delete: async (id: string) => {
    return apiRequest(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== DEVELOPERS API ====================

export const developersAPI = {
  // Get all developers
  getAll: async (params?: { featured?: boolean; search?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiRequest(`/developers?${queryParams}`);
  },

  // Get single developer
  getById: async (id: string) => {
    return apiRequest(`/developers/${id}`);
  },

  // Get stats
  getStats: async () => {
    return apiRequest('/developers/stats/summary');
  },

  // Create developer (Admin)
  create: async (developerData: Record<string, unknown>) => {
    return apiRequest('/developers', {
      method: 'POST',
      body: JSON.stringify(developerData),
    });
  },

  // Update developer (Admin)
  update: async (id: string, developerData: Record<string, unknown>) => {
    return apiRequest(`/developers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(developerData),
    });
  },

  // Delete developer (Admin)
  delete: async (id: string) => {
    return apiRequest(`/developers/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle featured (Admin)
  toggleFeatured: async (id: string) => {
    return apiRequest(`/developers/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  },
};

// ==================== SETTINGS API ====================

export const settingsAPI = {
  // Get settings
  get: async () => {
    return apiRequest('/settings');
  },

  // Update all settings (Admin)
  update: async (settingsData: Record<string, unknown>) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },

  // Update company info
  updateCompany: async (companyData: Record<string, unknown>) => {
    return apiRequest('/settings/company', {
      method: 'PATCH',
      body: JSON.stringify(companyData),
    });
  },

  // Update contact info
  updateContact: async (contactData: Record<string, unknown>) => {
    return apiRequest('/settings/contact', {
      method: 'PATCH',
      body: JSON.stringify(contactData),
    });
  },

  // Update social links
  updateSocial: async (socialData: Record<string, unknown>) => {
    return apiRequest('/settings/social', {
      method: 'PATCH',
      body: JSON.stringify(socialData),
    });
  },

  // Update features
  updateFeatures: async (featuresData: Record<string, unknown>) => {
    return apiRequest('/settings/features', {
      method: 'PATCH',
      body: JSON.stringify(featuresData),
    });
  },
};

// ==================== ANALYTICS API ====================

export const analyticsAPI = {
  // Get dashboard stats
  getDashboard: async () => {
    return apiRequest('/analytics/dashboard');
  },

  // Get property views
  getPropertyViews: async (propertyId: string) => {
    return apiRequest(`/analytics/properties/${propertyId}/views`);
  },

  // Track property view
  trackView: async (propertyId: string) => {
    return apiRequest(`/analytics/properties/${propertyId}/view`, {
      method: 'POST',
    });
  },
};

// Default export with all APIs
export default {
  auth: authAPI,
  properties: propertiesAPI,
  leads: leadsAPI,
  news: newsAPI,
  testimonials: testimonialsAPI,
  developers: developersAPI,
  settings: settingsAPI,
  analytics: analyticsAPI,
};

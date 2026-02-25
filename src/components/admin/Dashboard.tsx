import { useEffect, useState } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Phone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#1E3A5F', '#FF6B35', '#00C9A7', '#F59E0B', '#8B5CF6'];

interface DashboardData {
  overview: {
    totalProperties: number;
    activeProperties: number;
    featuredProperties: number;
    totalLeads: number;
    newLeadsThisMonth: number;
    leadTrend: number;
    convertedLeads: number;
    conversionRate: number;
    totalUsers: number;
    newUsersThisMonth: number;
  };
  charts: {
    propertiesByCity: Array<{ _id: string; count: number }>;
    propertiesByType: Array<{ _id: string; count: number }>;
    leadsByStatus: Array<{ _id: string; count: number }>;
  };
  recent: {
    properties: any[];
    topViewed: any[];
  };
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token
      const token = localStorage.getItem('pp_token');
      
      if (!token) {
        setError('Please login to view dashboard');
        setLoading(false);
        return;
      }

      // Fetch analytics data
      const analyticsRes = await fetch('http://143.198.94.42:5001/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!analyticsRes.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await analyticsRes.json();
      
      if (analyticsData.success) {
        setStats(analyticsData.data);
      }

      // Fetch recent leads
      const leadsRes = await fetch('http://143.198.94.42:5001/api/leads?limit=5&sort=-createdAt', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.success || Array.isArray(leadsData.data)) {
          setRecentLeads(leadsData.data || leadsData);
        }
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-[#1E3A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2d4a6f]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Calculate estimated revenue (average property price * converted leads)
  const estimatedRevenue = stats.overview.convertedLeads * 1.5; // Assuming avg 1.5 Cr per conversion

  const kpiCards = [
    {
      title: 'Total Properties',
      value: stats.overview.totalProperties,
      change: `${stats.overview.activeProperties} active`,
      trend: 'up',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Leads',
      value: stats.overview.totalLeads,
      change: `+${stats.overview.newLeadsThisMonth} this month`,
      trend: stats.overview.leadTrend >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'bg-emerald-500'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.overview.conversionRate}%`,
      change: `${stats.overview.convertedLeads} converted`,
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-amber-500'
    },
    {
      title: 'Revenue (Est.)',
      value: `₹${estimatedRevenue.toFixed(1)} Cr`,
      change: 'Based on conversions',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${card.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {card.change}
                  </span>
                  <span className="text-gray-400 text-sm">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Properties by City */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Properties by City</h3>
          <div className="h-80">
            {stats.charts?.propertiesByCity && stats.charts.propertiesByCity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.propertiesByCity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No property data available
              </div>
            )}
          </div>
        </div>

        {/* Leads by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Leads by Status</h3>
          <div className="h-80">
            {stats.charts?.leadsByStatus && stats.charts.leadsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.leadsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ _id, count }) => `${_id}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.charts.leadsByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No leads data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Properties</h3>
            <button className="text-[#FF6B35] text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stats.recent.properties && stats.recent.properties.length > 0 ? stats.recent.properties.slice(0, 5).map((property) => (
              <div key={property._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img
                  src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop'}
                  alt={property.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{property.title}</h4>
                  <p className="text-sm text-gray-500">
                    {property.location?.area || ''}{property.location?.area && property.location?.city ? ', ' : ''}{property.location?.city || ''}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {property.analytics?.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {property.analytics?.leads || 0}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1E3A5F]">
                    {property.priceInWords || (property.price ? `₹${(property.price / 10000000).toFixed(1)} Cr` : 'Price on Request')}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    property.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    property.status === 'sold' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {property.status || 'available'}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No properties yet</p>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Leads</h3>
            <button className="text-[#FF6B35] text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentLeads.length > 0 ? recentLeads.slice(0, 5).map((lead) => (
              <div key={lead._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center text-white font-semibold">
                  {lead.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800">{lead.name}</h4>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                    lead.status === 'converted' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No leads yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

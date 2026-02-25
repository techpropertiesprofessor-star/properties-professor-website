import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  X,
  Loader2,
  TrendingUp,
  MessageSquare,
  Globe,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  sourceDetails: string;
  city: string;
  country: string;
  interestedIn: string;
  budget: string;
  message: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  withEmail: number;
  withPhone: number;
  bySource: Array<{ _id: string; count: number }>;
}

const sourceLabels: Record<string, string> = {
  'newsletter': 'Newsletter',
  'contact_form': 'Contact Form',
  'property_inquiry': 'Property Inquiry',
  'nri_inquiry': 'NRI Inquiry',
  'site_visit': 'Site Visit',
  'callback_request': 'Callback Request',
  'emi_calculator': 'EMI Calculator',
  'ai_matcher': 'AI Matcher',
  'chat': 'Chat',
  'manual': 'Manual Entry',
  'other': 'Other'
};

const API_BASE = 'http://143.198.94.42:5001/api';

export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [page, selectedSource]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('pp_token');
      let url = `${API_BASE}/customers?page=${page}&limit=20`;
      if (selectedSource) url += `&source=${selectedSource}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      
      // If auth fails, try public endpoint
      if (!data.success && response.status === 401) {
        console.warn('Auth failed, trying public endpoint...');
        const publicResponse = await fetch(`${API_BASE}/customers/test/count`);
        const publicData = await publicResponse.json();
        if (publicData.success) {
          setCustomers(publicData.latest || []);
          setTotalCount(publicData.total || 0);
        }
      } else if (data.success) {
        setCustomers(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('pp_token');
      const response = await fetch(`${API_BASE}/customers/stats`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      
      // If auth fails, try public endpoint
      if (!data.success && response.status === 401) {
        console.warn('Stats auth failed, trying public endpoint...');
        const publicResponse = await fetch(`${API_BASE}/customers/test/count`);
        const publicData = await publicResponse.json();
        if (publicData.success) {
          setStats({
            total: publicData.total,
            todayCount: 0,
            weekCount: 0,
            monthCount: 0,
            withEmail: 0,
            withPhone: 0,
            bySource: publicData.bySource || []
          });
        }
      } else if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCustomers();
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem('pp_token');
      let url = `${API_BASE}/customers/export?`;
      if (selectedSource) url += `source=${selectedSource}&`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `customer-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExporting(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'newsletter': return <Mail className="w-4 h-4" />;
      case 'contact_form': return <MessageSquare className="w-4 h-4" />;
      case 'property_inquiry': return <Home className="w-4 h-4" />;
      case 'nri_inquiry': return <Globe className="w-4 h-4" />;
      case 'site_visit': return <Calendar className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customer Data</h2>
          <p className="text-gray-500">Raw contact data from all website forms ({totalCount} total)</p>
        </div>
        <Button 
          onClick={handleExport}
          disabled={exporting}
          className="btn-primary"
        >
          {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Download CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              Total
            </div>
            <p className="text-2xl font-bold text-[#1E3A5F]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Today
            </div>
            <p className="text-2xl font-bold text-emerald-600">{stats.todayCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              This Week
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.weekCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              This Month
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.monthCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Mail className="w-4 h-4" />
              With Email
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.withEmail}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Phone className="w-4 h-4" />
              With Phone
            </div>
            <p className="text-2xl font-bold text-pink-600">{stats.withPhone}</p>
          </div>
        </div>
      )}

      {/* Source Distribution */}
      {stats?.bySource && stats.bySource.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Traffic by Source</h3>
          <div className="flex flex-wrap gap-2">
            {stats.bySource.map((item) => (
              <span 
                key={item._id} 
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
              >
                {getSourceIcon(item._id)}
                {sourceLabels[item._id] || item._id}: <strong>{item.count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12"
            />
          </div>
          <select 
            value={selectedSource}
            onChange={(e) => { setSelectedSource(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
          >
            <option value="">All Sources</option>
            {Object.entries(sourceLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <Button onClick={handleSearch} className="btn-primary">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customer data found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer, index) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(page - 1) * 20 + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">
                        {customer.name || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {customer.email ? (
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline text-sm">
                          {customer.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {customer.phone ? (
                        <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline text-sm">
                          {customer.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {getSourceIcon(customer.source)}
                        {sourceLabels[customer.source] || customer.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer.city || customer.country || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => { setSelectedCustomer(customer); setShowDetailModal(true); }}
                        className="p-2 text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages} ({totalCount} records)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Name</label>
                  <p className="font-medium">{selectedCustomer.name || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Source</label>
                  <p className="font-medium">{sourceLabels[selectedCustomer.source] || selectedCustomer.source}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  {selectedCustomer.email ? (
                    <a href={`mailto:${selectedCustomer.email}`} className="block text-blue-600 hover:underline">
                      {selectedCustomer.email}
                    </a>
                  ) : (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Phone</label>
                  {selectedCustomer.phone ? (
                    <a href={`tel:${selectedCustomer.phone}`} className="block text-blue-600 hover:underline">
                      {selectedCustomer.phone}
                    </a>
                  ) : (
                    <p className="text-gray-400">-</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Location</label>
                  <p className="font-medium">{selectedCustomer.city || selectedCustomer.country || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Budget</label>
                  <p className="font-medium">{selectedCustomer.budget || '-'}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Interest</label>
                <p className="font-medium">{selectedCustomer.interestedIn || '-'}</p>
              </div>

              {selectedCustomer.message && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Message</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedCustomer.message}</p>
                </div>
              )}

              {selectedCustomer.notes && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Notes</label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedCustomer.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 text-sm text-gray-500">
                <p>Created: {formatDate(selectedCustomer.createdAt)}</p>
                <p>Last Updated: {formatDate(selectedCustomer.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

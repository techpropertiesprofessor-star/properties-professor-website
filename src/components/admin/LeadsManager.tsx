import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  X,
  Send,
  Loader2,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  property?: {
    _id: string;
    title: string;
    location?: { city: string; area: string };
  };
  message?: string;
  status: string;
  priority: string;
  source: string;
  createdAt: string;
  notes?: Array<{ text: string; createdBy: { name: string }; createdAt: string }>;
  // Foreign investor fields
  leadType?: string;
  isNRI?: boolean;
  country?: string;
  investmentInterest?: string;
  investmentAmount?: string;
  investmentTimeline?: string;
  opportunityTitle?: string;
  sectors?: string[];
}

const API_BASE = 'https://api.propertiesprofessor.com/api';

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-100 text-amber-700' },
  { value: 'qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-700' },
  { value: 'site_visit_scheduled', label: 'Site Visit', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'negotiating', label: 'Negotiating', color: 'bg-pink-100 text-pink-700' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' }
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-amber-100 text-amber-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' }
];

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('pp_token');
      const statusParam = statusFilter ? `&status=${statusFilter}` : '';
      const response = await fetch(`${API_BASE}/leads?limit=100${statusParam}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setLeads(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery)
  );

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const token = localStorage.getItem('pp_token');
    try {
      const response = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setLeads(prev => prev.map(lead => 
          lead._id === leadId ? { ...lead, status: newStatus } : lead
        ));
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    const token = localStorage.getItem('pp_token');
    
    try {
      const response = await fetch(`${API_BASE}/leads/${selectedLead._id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newNote })
      });
      const data = await response.json();
      if (data.success) {
        const updatedLead = {
          ...selectedLead,
          notes: [
            ...(selectedLead.notes || []),
            {
              text: newNote,
              createdBy: { name: 'Admin' },
              createdAt: new Date().toISOString()
            }
          ]
        };
        setLeads(prev => prev.map(lead => 
          lead._id === selectedLead._id ? updatedLead : lead
        ));
        setSelectedLead(updatedLead);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
          <p className="text-gray-500">Manage and track your leads</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700">
            <span className="font-semibold">{leads.filter(l => l.status === 'new').length}</span>
            <span className="text-sm ml-1">New</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700">
            <span className="font-semibold">{leads.filter(l => l.status === 'contacted').length}</span>
            <span className="text-sm ml-1">Contacted</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <select className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
              <option value="">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
            <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
          <span className="ml-3 text-gray-600">Loading leads...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Leads Found</h3>
          <p className="text-gray-500">Leads will appear here when visitors inquire about properties.</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div 
            key={lead._id} 
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedLead(lead);
              setShowDetailModal(true);
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center text-white font-semibold">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                {lead.priority}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Property Info */}
            {typeof lead.property === 'object' && lead.property && (
              <div className="p-3 bg-gray-50 rounded-xl mb-4">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {lead.property.title}
                </p>
                <p className="text-xs text-gray-500">
                  {lead.property.location?.area}, {lead.property.location?.city}
                </p>
              </div>
            )}

            {/* Foreign Investor Info */}
            {lead.leadType === 'foreign_investor' && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Foreign Investor</span>
                  {lead.country && <span className="text-xs text-gray-600">{lead.country}</span>}
                </div>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {lead.opportunityTitle || lead.investmentInterest || 'Investment Inquiry'}
                </p>
                {lead.investmentAmount && (
                  <p className="text-xs text-green-600 font-medium">Budget: {lead.investmentAmount}</p>
                )}
              </div>
            )}

            {/* Status & Actions */}
            <div className="flex items-center justify-between">
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(lead.status)}`}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${lead.phone}`);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`mailto:${lead.email}`);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Lead Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center text-white font-semibold text-xl">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedLead.name}</h3>
                  <p className="text-gray-500">{selectedLead.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* Contact Actions */}
              <div className="flex gap-3 mb-6">
                <a 
                  href={`tel:${selectedLead.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Call</span>
                </a>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </button>
              </div>

              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-0 ${getStatusColor(selectedLead.status)}`}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(selectedLead.priority)}`}>
                    {selectedLead.priority}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Source</p>
                  <p className="font-medium text-gray-800 capitalize">{selectedLead.source.replace('_', ' ')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-medium text-gray-800">{new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Property Details */}
              {selectedLead.property && typeof selectedLead.property === 'object' && (
                <div className="p-4 bg-gradient-to-r from-[#1E3A5F]/5 to-transparent rounded-xl mb-6">
                  <p className="text-sm text-gray-500 mb-2">Interested In</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedLead.property.title || 'Property'}</p>
                      <p className="text-sm text-gray-500">
                        {selectedLead.property.location?.area}, {selectedLead.property.location?.city}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Foreign Investor Details */}
              {selectedLead.leadType === 'foreign_investor' && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-medium">Foreign Investor</span>
                    {selectedLead.country && (
                      <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{selectedLead.country}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investment Interest</p>
                      <p className="font-medium text-gray-800">{selectedLead.opportunityTitle || selectedLead.investmentInterest || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investment Amount</p>
                      <p className="font-medium text-green-600">{selectedLead.investmentAmount || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Timeline</p>
                      <p className="font-medium text-gray-800">{selectedLead.investmentTimeline || 'Not specified'}</p>
                    </div>
                    {selectedLead.sectors && selectedLead.sectors.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Sectors of Interest</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedLead.sectors.map((sector, i) => (
                            <span key={i} className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full border">{sector}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedLead.message && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700">{selectedLead.message}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Notes & Activity</p>
                <div className="space-y-3 mb-4">
                  {selectedLead.notes?.map((note, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {note.createdBy.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-700">{note.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {note.createdBy.name} • {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Note */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddNote} className="btn-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

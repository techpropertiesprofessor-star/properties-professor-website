import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import {
  Globe, Video, FileText, Calculator, Phone, Clock, CheckCircle,
  Download, TrendingUp, Building2, ExternalLink, Send, Loader2, X,
  Factory, Train, Sun, Zap, Network, BarChart3, Briefcase, Route, PlaneTakeoff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteSettings } from '@/components/admin/SettingsManager';

const API_BASE = 'https://api.propertiesprofessor.com/api';

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('pp_token');
  const user = localStorage.getItem('pp_user');
  return !!(token && user);
};

interface Opportunity {
  id: number;
  category: string;
  title: string;
  description: string;
  investmentHighlight: string;
  sectors: string[];
  governmentSource: string;
  benefits: string[];
  expectedROI: string;
  timeline: string;
  officialLink: string;
  icon: string;
}

interface Guidelines {
  title: string;
  issuedBy: string;
  lastUpdated: string;
  downloadUrl: string;
  alternateUrl: string;
  keyRegulations: Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  taxBenefits: Array<{
    section: string;
    benefit: string;
    eligibility: string;
  }>;
  steps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
}

interface Statistics {
  totalInvestment2023: string;
  yoyGrowth: string;
  topSourceCountries: Array<{
    country: string;
    percentage: number;
    flag: string;
  }>;
  topDestinationCities: Array<{
    city: string;
    percentage: number;
  }>;
  preferredPropertyTypes: Array<{
    type: string;
    percentage: number;
  }>;
  avgInvestmentSize: string;
}

export default function NRIPage() {
  const [settings] = useState(getSiteSettings());
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [guidelines, setGuidelines] = useState<Guidelines | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'guidelines' | 'calculator' | 'contact'>('opportunities');
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  
  // Check login status on mount
  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(isUserLoggedIn());
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);
  
  // Interest modal state
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [interestFormData, setInterestFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    investmentAmount: '',
    timeline: '',
    message: ''
  });
  const [interestSubmitting, setInterestSubmitting] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    propertyInterest: 'General',
    budget: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Video call modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoCallData, setVideoCallData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    timezone: '',
    preferredTime: '',
    topic: ''
  });
  
  // Tax calculator states
  const [calcData, setCalcData] = useState({
    propertyValue: 5000000,
    loanAmount: 4000000,
    interestRate: 8.5,
    tenure: 20,
    selfOccupied: true
  });
  const [taxResult, setTaxResult] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [oppRes, guideRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/nri/opportunities`),
        fetch(`${API_BASE}/nri/guidelines`),
        fetch(`${API_BASE}/nri/statistics`)
      ]);
      
      if (oppRes.ok) {
        const data = await oppRes.json();
        if (data.success) setOpportunities(data.data);
      }
      
      if (guideRes.ok) {
        const data = await guideRes.json();
        if (data.success) setGuidelines(data.data);
      }
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error fetching NRI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInterestSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/nri/foreign-investor-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...interestFormData,
          opportunityId: selectedOpportunity?.id,
          opportunityTitle: selectedOpportunity?.title,
          investmentInterest: selectedOpportunity?.category,
          sectors: selectedOpportunity?.sectors || []
        })
      });
      
      // Also save to customer data
      try {
        const customerResponse = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: interestFormData.name,
            email: interestFormData.email,
            phone: interestFormData.phone,
            city: interestFormData.country,
            source: 'nri_inquiry',
            notes: `Foreign Investor Interest - ${selectedOpportunity?.title}. Amount: ${interestFormData.investmentAmount}. ${interestFormData.message || ''}`
          })
        });
        const customerData = await customerResponse.json();
        console.log('Customer save (NRI investor) result:', customerData);
      } catch (customerError) {
        console.error('Error saving customer (NRI investor):', customerError);
      }
      
      if (response.ok) {
        setInterestSuccess(true);
        setInterestFormData({ name: '', email: '', phone: '', country: '', investmentAmount: '', timeline: '', message: '' });
        setTimeout(() => {
          setInterestSuccess(false);
          setShowInterestModal(false);
          setSelectedOpportunity(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
    } finally {
      setInterestSubmitting(false);
    }
  };

  const openInterestModal = (opportunity: Opportunity) => {
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=nri';
      return;
    }
    setSelectedOpportunity(opportunity);
    setShowInterestModal(true);
  };

  const getOpportunityIcon = (icon: string) => {
    switch (icon) {
      case 'road': return <Route className="w-8 h-8" />;
      case 'city': return <Building2 className="w-8 h-8" />;
      case 'factory': return <Factory className="w-8 h-8" />;
      case 'plane': return <PlaneTakeoff className="w-8 h-8" />;
      case 'highway': return <Route className="w-8 h-8" />;
      case 'train': return <Train className="w-8 h-8" />;
      case 'sun': return <Sun className="w-8 h-8" />;
      case 'network': return <Network className="w-8 h-8" />;
      case 'chart': return <BarChart3 className="w-8 h-8" />;
      case 'building': return <Briefcase className="w-8 h-8" />;
      default: return <TrendingUp className="w-8 h-8" />;
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check login before submitting
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=nri';
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/nri/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Also save to customer data
      try {
        const customerResponse = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.country,
            budget: formData.budget,
            source: 'nri_inquiry',
            notes: `NRI Inquiry - Interest: ${formData.propertyInterest}. Budget: ${formData.budget}. ${formData.message || ''}`
          })
        });
        const customerData = await customerResponse.json();
        console.log('Customer save (NRI inquiry) result:', customerData);
      } catch (customerError) {
        console.error('Error saving customer (NRI inquiry):', customerError);
      }
      
      if (response.ok) {
        setFormSuccess(true);
        setFormData({ name: '', email: '', phone: '', country: '', message: '', propertyInterest: 'General', budget: '' });
        setTimeout(() => setFormSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleVideoCallRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE}/nri/video-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoCallData)
      });
      
      // Also save to customer data
      try {
        const customerResponse = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: videoCallData.name,
            email: videoCallData.email,
            phone: videoCallData.phone,
            city: videoCallData.country,
            source: 'nri_inquiry',
            notes: `Video Call Request - Topic: ${videoCallData.topic}. Timezone: ${videoCallData.timezone}. Preferred: ${videoCallData.preferredTime}`
          })
        });
        const customerData = await customerResponse.json();
        console.log('Customer save (NRI video call) result:', customerData);
      } catch (customerError) {
        console.error('Error saving customer (NRI video call):', customerError);
      }
      
      if (response.ok) {
        setShowVideoModal(false);
        setVideoCallData({ name: '', email: '', phone: '', country: '', timezone: '', preferredTime: '', topic: '' });
        alert('Video call request submitted! Our team will send you a meeting link.');
      }
    } catch (error) {
      console.error('Error requesting video call:', error);
    }
  };

  const calculateTax = async () => {
    try {
      const response = await fetch(`${API_BASE}/nri/calculate-tax`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calcData)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) setTaxResult(data.data);
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 bg-gradient-to-br from-[#1E3A5F] via-[#2d5a8a] to-[#1E3A5F] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00C9A7]/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-[#FF6B35]" />
            <span className="text-white/80 font-medium">For Non-Resident Indians</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in Your <span className="text-[#FF6B35]">Homeland</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl">
            Complete guidance for NRIs to invest in Indian real estate. From property selection to 
            legal documentation, we handle everything while you're abroad.
          </p>
          
          {/* Quick Stats */}
          {statistics && (
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-white">{statistics.totalInvestment2023}</p>
                <p className="text-white/60 text-sm">NRI Investment in 2023</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-[#00C9A7]">{statistics.yoyGrowth}</p>
                <p className="text-white/60 text-sm">Year-over-Year Growth</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-white">{statistics.avgInvestmentSize}</p>
                <p className="text-white/60 text-sm">Average Investment</p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => {
                if (isLoggedIn) {
                  setShowVideoModal(true);
                } else {
                  window.location.href = '/login?redirect=nri';
                }
              }}
              className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white"
            >
              <Video className="w-5 h-5 mr-2" />
              Schedule Video Call
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'opportunities', label: 'Investment Opportunities', icon: TrendingUp },
              { id: 'guidelines', label: 'Government Guidelines', icon: FileText },
              { id: 'calculator', label: 'Tax Calculator', icon: Calculator },
              { id: 'contact', label: 'Contact Us', icon: Phone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
          </div>
        ) : (
          <>
            {/* Investment Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Investment Opportunities in India</h2>
                  <p className="text-gray-600">
                    Explore government-backed infrastructure and development projects. All data sourced from official Indian government portals.
                  </p>
                </div>
                
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Why Invest in Indian Infrastructure?</h3>
                      <p className="text-gray-600 text-sm">
                        India is the world's fastest-growing major economy with GDP growth of 7%+. The government has committed 
                        ₹111 lakh crore ($1.5 trillion) for infrastructure development through National Infrastructure Pipeline. 
                        100% FDI is allowed in most infrastructure sectors.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2d5a8a] flex items-center justify-center text-white">
                              {getOpportunityIcon(opp.icon)}
                            </div>
                            <div>
                              <span className="text-xs font-medium text-[#FF6B35] uppercase">{opp.category}</span>
                              <h3 className="font-semibold text-gray-800 text-lg">{opp.title}</h3>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{opp.description}</p>
                        
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-gray-600">Investment Size</p>
                          <p className="text-xl font-bold text-green-700">{opp.investmentHighlight}</p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">SECTORS COVERED</p>
                          <div className="flex flex-wrap gap-1">
                            {opp.sectors.map((sector, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {sector}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">KEY BENEFITS</p>
                          <ul className="space-y-1">
                            {opp.benefits.slice(0, 3).map((benefit, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Expected ROI: <strong className="text-green-600">{opp.expectedROI}</strong></span>
                          <span>Timeline: {opp.timeline}</span>
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-4">
                          Source: {opp.governmentSource}
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => openInterestModal(opp)}
                            className="flex-1 btn-primary"
                          >
                            I'm Interested
                          </Button>
                          <a href={opp.officialLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-gray-300">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Source Countries */}
                {statistics && (
                  <div className="mt-12 bg-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">NRI Investment by Country</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {statistics.topSourceCountries.map((country, idx) => (
                        <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl">
                          <span className="text-3xl mb-2 block">{country.flag}</span>
                          <p className="font-medium text-gray-800">{country.country}</p>
                          <p className="text-[#FF6B35] font-bold">{country.percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <strong>Disclaimer:</strong> Investment information is sourced from official Government of India portals. 
                    Returns mentioned are indicative and subject to market conditions. Please consult with a financial 
                    advisor before making investment decisions.
                  </p>
                </div>
              </div>
            )}

            {/* Guidelines Tab */}
            {activeTab === 'guidelines' && guidelines && (
              <div className="space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8a] rounded-2xl p-8 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{guidelines.title}</h2>
                      <p className="text-white/70">Issued by: {guidelines.issuedBy}</p>
                      <p className="text-white/60 text-sm">Last Updated: {guidelines.lastUpdated}</p>
                    </div>
                    <div className="flex gap-3">
                      <a href={guidelines.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-white text-[#1E3A5F] hover:bg-gray-100">
                          <Download className="w-4 h-4 mr-2" />
                          RBI Circular
                        </Button>
                      </a>
                      <a href={guidelines.alternateUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          FEMA Portal
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Key Regulations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Key Regulations</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {guidelines.keyRegulations.map((reg, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-6 shadow-md">
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">{reg.title}</h4>
                        <p className="text-gray-600 text-sm mb-4">{reg.description}</p>
                        <ul className="space-y-2">
                          {reg.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tax Benefits for NRIs</h3>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Section</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Benefit</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Eligibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guidelines.taxBenefits.map((benefit, idx) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="py-3 px-4 font-semibold text-[#1E3A5F]">{benefit.section}</td>
                            <td className="py-3 px-4 text-gray-700">{benefit.benefit}</td>
                            <td className="py-3 px-4 text-gray-600 text-sm">{benefit.eligibility}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Steps to Buy */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Steps to Purchase Property as NRI</h3>
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="relative">
                      {guidelines.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold">
                              {step.step}
                            </div>
                            {idx < guidelines.steps.length - 1 && (
                              <div className="w-0.5 flex-1 bg-[#FF6B35]/20 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <h4 className="font-semibold text-gray-800">{step.title}</h4>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Calculator Tab */}
            {activeTab === 'calculator' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">NRI Tax Benefits Calculator</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Value: {formatCurrency(calcData.propertyValue)}
                        </label>
                        <input
                          type="range"
                          min="1000000"
                          max="100000000"
                          step="100000"
                          value={calcData.propertyValue}
                          onChange={(e) => setCalcData({ ...calcData, propertyValue: Number(e.target.value) })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>₹10L</span>
                          <span>₹10Cr</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loan Amount: {formatCurrency(calcData.loanAmount)}
                        </label>
                        <input
                          type="range"
                          min="500000"
                          max={calcData.propertyValue * 0.8}
                          step="100000"
                          value={calcData.loanAmount}
                          onChange={(e) => setCalcData({ ...calcData, loanAmount: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interest Rate: {calcData.interestRate}%
                        </label>
                        <input
                          type="range"
                          min="6"
                          max="15"
                          step="0.1"
                          value={calcData.interestRate}
                          onChange={(e) => setCalcData({ ...calcData, interestRate: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loan Tenure: {calcData.tenure} years
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="1"
                          value={calcData.tenure}
                          onChange={(e) => setCalcData({ ...calcData, tenure: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="selfOccupied"
                          checked={calcData.selfOccupied}
                          onChange={(e) => setCalcData({ ...calcData, selfOccupied: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <label htmlFor="selfOccupied" className="text-sm text-gray-700">
                          Self-occupied property (visiting India periodically)
                        </label>
                      </div>
                      
                      <Button onClick={calculateTax} className="w-full btn-primary">
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Tax Benefits
                      </Button>
                    </div>
                    
                    {taxResult && (
                      <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d5a8a] rounded-2xl p-6 text-white">
                        <h3 className="font-semibold text-lg mb-4">Your Tax Benefits</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between">
                            <span className="text-white/70">Monthly EMI</span>
                            <span className="font-bold">{formatCurrency(taxResult.monthlyEMI)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Annual Interest</span>
                            <span className="font-medium">{formatCurrency(taxResult.annualInterest)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Annual Principal</span>
                            <span className="font-medium">{formatCurrency(taxResult.annualPrincipal)}</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-white/20 pt-4 mb-4">
                          <h4 className="font-medium mb-3">Deductions Available</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Section 24(b) - Interest</span>
                              <span className="text-[#00C9A7]">{formatCurrency(taxResult.deductions.section24b)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Section 80C - Principal</span>
                              <span className="text-[#00C9A7]">{formatCurrency(taxResult.deductions.section80C)}</span>
                            </div>
                            {taxResult.deductions.section80EEA > 0 && (
                              <div className="flex justify-between">
                                <span>Section 80EEA</span>
                                <span className="text-[#00C9A7]">{formatCurrency(taxResult.deductions.section80EEA)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-white/10 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white/70">Total Deduction</span>
                            <span className="text-xl font-bold">{formatCurrency(taxResult.deductions.total)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Estimated Tax Saved</span>
                            <span className="text-2xl font-bold text-[#00C9A7]">{formatCurrency(taxResult.estimatedTaxSaved)}</span>
                          </div>
                          <p className="text-white/50 text-xs mt-2">
                            *Assuming 30% tax bracket. Actual savings may vary.
                          </p>
                        </div>
                        
                        <div className="mt-4 p-3 bg-[#FF6B35]/20 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">Effective Interest Rate:</span> {taxResult.effectiveInterestRate}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Our NRI Specialist</h2>
                  <p className="text-gray-600 mb-8">
                    Our dedicated NRI team is available 24/7 across all time zones. Fill out the form and we'll get back to you within 24 hours.
                  </p>
                  
                  {formSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">Inquiry submitted successfully! Our specialist will contact you within 24 hours.</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmitInquiry}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone (with country code) *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence *</label>
                        <select
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                        >
                          <option value="">Select country</option>
                          <option value="USA">🇺🇸 United States</option>
                          <option value="UAE">🇦🇪 United Arab Emirates</option>
                          <option value="UK">🇬🇧 United Kingdom</option>
                          <option value="Canada">🇨🇦 Canada</option>
                          <option value="Singapore">🇸🇬 Singapore</option>
                          <option value="Australia">🇦🇺 Australia</option>
                          <option value="Germany">🇩🇪 Germany</option>
                          <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Interest</label>
                        <select
                          value={formData.propertyInterest}
                          onChange={(e) => setFormData({ ...formData, propertyInterest: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                        >
                          <option value="General">General Inquiry</option>
                          <option value="Residential">Residential Apartment</option>
                          <option value="Villa">Villa/House</option>
                          <option value="Plot">Plot/Land</option>
                          <option value="Commercial">Commercial Property</option>
                          <option value="Vacation">Vacation Home</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
                        >
                          <option value="">Select budget</option>
                          <option value="50L-1Cr">₹50 Lakh - ₹1 Crore</option>
                          <option value="1Cr-2Cr">₹1 Crore - ₹2 Crore</option>
                          <option value="2Cr-5Cr">₹2 Crore - ₹5 Crore</option>
                          <option value="5Cr-10Cr">₹5 Crore - ₹10 Crore</option>
                          <option value="10Cr+">₹10 Crore+</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none h-32 resize-none"
                          placeholder="Tell us about your requirements, preferred locations, timeline, etc."
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Button 
                        type="submit" 
                        className="btn-primary flex-1"
                        disabled={formSubmitting}
                      >
                        {formSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Send className="w-5 h-5 mr-2" />
                        )}
                        Submit Inquiry
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => {
                          if (isLoggedIn) {
                            setShowVideoModal(true);
                          } else {
                            window.location.href = '/login?redirect=nri';
                          }
                        }}
                        className="bg-[#1E3A5F] hover:bg-[#152a45] text-white flex-1"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Schedule Video Call
                      </Button>
                    </div>
                  </form>
                </div>
                
                {/* Contact Info */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  <button 
                    onClick={() => {
                      if (isLoggedIn) {
                        window.location.href = `tel:${settings.contact.phone.replace(/\s/g, '')}`;
                      } else {
                        window.location.href = '/login?redirect=nri';
                      }
                    }}
                    className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
                    <p className="text-gray-600">{isLoggedIn ? settings.contact.phone : 'Login to view'}</p>
                    <p className="text-gray-500 text-sm">24/7 NRI Helpline</p>
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (isLoggedIn) {
                        window.open(`https://wa.me/${settings.contact.phone.replace(/\s/g, '').replace('+', '')}`, '_blank');
                      } else {
                        window.location.href = '/login?redirect=nri';
                      }
                    }}
                    className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">{isLoggedIn ? settings.contact.phone : 'Login to view'}</p>
                    <p className="text-gray-500 text-sm">Quick Response</p>
                  </button>
                  
                  <div className="bg-white rounded-xl p-6 shadow-md text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Office Hours</h3>
                    <p className="text-gray-600">Available 24/7</p>
                    <p className="text-gray-500 text-sm">All Time Zones</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interest Modal */}
      {showInterestModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[#FF6B35] uppercase">{selectedOpportunity.category}</span>
                  <h3 className="text-xl font-bold text-gray-800">{selectedOpportunity.title}</h3>
                </div>
                <button onClick={() => { setShowInterestModal(false); setSelectedOpportunity(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Express your interest and our team will contact you with detailed information.</p>
            </div>
            
            {interestSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Interest Registered!</h4>
                <p className="text-gray-600">Our investment team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={interestFormData.name}
                    onChange={(e) => setInterestFormData({ ...interestFormData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={interestFormData.email}
                      onChange={(e) => setInterestFormData({ ...interestFormData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={interestFormData.phone}
                      onChange={(e) => setInterestFormData({ ...interestFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence *</label>
                  <select
                    required
                    value={interestFormData.country}
                    onChange={(e) => setInterestFormData({ ...interestFormData, country: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                  >
                    <option value="">Select country</option>
                    <option value="USA">United States</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Germany">Germany</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investment Capacity</label>
                    <select
                      value={interestFormData.investmentAmount}
                      onChange={(e) => setInterestFormData({ ...interestFormData, investmentAmount: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                    >
                      <option value="">Select range</option>
                      <option value="$100K-$500K">$100K - $500K</option>
                      <option value="$500K-$1M">$500K - $1M</option>
                      <option value="$1M-$5M">$1M - $5M</option>
                      <option value="$5M-$10M">$5M - $10M</option>
                      <option value="$10M+">$10M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investment Timeline</label>
                    <select
                      value={interestFormData.timeline}
                      onChange={(e) => setInterestFormData({ ...interestFormData, timeline: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                    >
                      <option value="">Select timeline</option>
                      <option value="Immediate">Immediate (0-3 months)</option>
                      <option value="ShortTerm">Short Term (3-6 months)</option>
                      <option value="MediumTerm">Medium Term (6-12 months)</option>
                      <option value="LongTerm">Long Term (12+ months)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                  <textarea
                    value={interestFormData.message}
                    onChange={(e) => setInterestFormData({ ...interestFormData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                    rows={3}
                    placeholder="Any specific questions or requirements..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary"
                  disabled={interestSubmitting}
                >
                  {interestSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Interest
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree to be contacted by our investment team.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Schedule Video Call</h3>
              <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleVideoCallRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={videoCallData.name}
                  onChange={(e) => setVideoCallData({ ...videoCallData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={videoCallData.email}
                    onChange={(e) => setVideoCallData({ ...videoCallData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={videoCallData.phone}
                    onChange={(e) => setVideoCallData({ ...videoCallData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Timezone</label>
                  <select
                    value={videoCallData.timezone}
                    onChange={(e) => setVideoCallData({ ...videoCallData, timezone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                  >
                    <option value="">Select timezone</option>
                    <option value="EST">EST (New York)</option>
                    <option value="PST">PST (Los Angeles)</option>
                    <option value="GMT">GMT (London)</option>
                    <option value="GST">GST (Dubai)</option>
                    <option value="SGT">SGT (Singapore)</option>
                    <option value="AEDT">AEDT (Sydney)</option>
                    <option value="IST">IST (India)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <select
                    value={videoCallData.preferredTime}
                    onChange={(e) => setVideoCallData({ ...videoCallData, preferredTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                  >
                    <option value="">Select time</option>
                    <option value="Morning">Morning (8AM - 12PM)</option>
                    <option value="Afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="Evening">Evening (5PM - 9PM)</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <select
                  value={videoCallData.topic}
                  onChange={(e) => setVideoCallData({ ...videoCallData, topic: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#FF6B35] outline-none"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Property Investment">Property Investment</option>
                  <option value="Legal & Documentation">Legal & Documentation</option>
                  <option value="Tax Benefits">Tax Benefits</option>
                  <option value="Virtual Property Tour">Virtual Property Tour</option>
                </select>
              </div>
              
              <Button type="submit" className="w-full btn-primary">
                <Video className="w-5 h-5 mr-2" />
                Request Video Call
              </Button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

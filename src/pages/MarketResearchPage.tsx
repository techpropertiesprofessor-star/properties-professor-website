import { useState, useEffect } from 'react';
import { 
  TrendingUp, Search, MapPin, Building2, 
  BarChart3, Shield, Clock, AlertTriangle, Lightbulb, ChevronRight,
  Building, Home, LandPlot, ArrowUp, ArrowDown, RefreshCw, Info,
  Target, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE = 'https://api.propertiesprofessor.com/api';

interface StateMarketData {
  state: string;
  capital: string;
  majorCities: string[];
  avgPricePerSqft: {
    residential: number;
    commercial: number;
    plots: number;
  };
  priceRange: string;
  yoyGrowth: number;
  marketTrend: string;
  hotspots: string[];
  upcomingProjects: Array<{
    name: string;
    type: string;
    investment: string;
    status: string;
  }>;
  governmentPolicies: Array<{
    name: string;
    benefit: string;
  }>;
  reraRegistered: number;
  infrastructureScore: number;
  investmentRating: string;
  demandSupplyRatio: number;
  rentalYield: number;
  forecast: {
    [year: string]: { growth: number; reason: string };
  };
  risks: string[];
  opportunities: string[];
  lastUpdated: string;
}

interface StateOverview {
  state: string;
  capital: string;
  trend: string;
  yoyGrowth: number;
  rating: string;
}

interface MarketOverview {
  totalStates: number;
  avgNationalGrowth: string;
  topGrowthStates: Array<{ state: string; growth: number }>;
  hotMarkets: string[];
  totalRERAProjects: number;
  lastUpdated: string;
}

export default function MarketResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<StateMarketData | null>(null);
  const [allStates, setAllStates] = useState<StateOverview[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'prices' | 'projects' | 'forecast'>('overview');

  // Fetch all states and overview on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInitialData();
      setLastRefresh(new Date());
    }, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    setOverviewLoading(true);
    try {
      const [statesRes, overviewRes] = await Promise.all([
        fetch(`${API_BASE}/market-research/states`),
        fetch(`${API_BASE}/market-research/overview`)
      ]);
      
      if (statesRes.ok) {
        const statesData = await statesRes.json();
        if (statesData.success) {
          setAllStates(statesData.data);
        }
      }
      
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        if (overviewData.success) {
          setMarketOverview(overviewData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setOverviewLoading(false);
    }
  };

  const searchState = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/market-research/search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setSelectedState(data.data[0]);
        } else {
          setSelectedState(null);
        }
      }
    } catch (error) {
      console.error('Error searching state:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchState(searchQuery);
  };

  const selectStateFromList = async (stateName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/market-research/state/${encodeURIComponent(stateName.toLowerCase())}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedState(data.data);
          setSearchQuery(stateName);
        }
      }
    } catch (error) {
      console.error('Error fetching state:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'rising' ? (
      <ArrowUp className="w-4 h-4 text-green-500" />
    ) : trend === 'falling' ? (
      <ArrowDown className="w-4 h-4 text-red-500" />
    ) : (
      <span className="w-4 h-4 text-yellow-500">→</span>
    );
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('A')) return 'text-green-600 bg-green-100';
    if (rating.startsWith('B')) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="text-white/70 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            ← Back to Home
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Market Research
          </h1>
          <p className="text-white/80 mt-2 max-w-2xl">
            Comprehensive real estate market analysis for all 28 states and 8 Union Territories of India. 
            Get insights on property prices, upcoming projects, government policies, and investment forecasts.
          </p>
          
          {/* Last Updated */}
          <div className="flex items-center gap-2 mt-4 text-white/60 text-sm">
            <RefreshCw className="w-4 h-4" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            <span className="text-white/40">•</span>
            <span>Auto-refreshes every 5 minutes</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any state, city, or region (e.g., Maharashtra, Noida, Bangalore...)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF6B35] text-gray-700"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="btn-primary px-8" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview Cards */}
        {!selectedState && (
          <>
            {overviewLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
              </div>
            ) : marketOverview && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">National Market Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{marketOverview.totalStates}</span>
                    </div>
                    <p className="text-gray-500 text-sm">States & UTs Covered</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-green-600">+{marketOverview.avgNationalGrowth}%</span>
                    </div>
                    <p className="text-gray-500 text-sm">Avg. YoY Growth</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{(marketOverview.totalRERAProjects / 1000).toFixed(0)}K+</span>
                    </div>
                    <p className="text-gray-500 text-sm">RERA Projects</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Target className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{marketOverview.hotMarkets.length}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Rising Markets</p>
                  </div>
                </div>

                {/* Top Growth States */}
                <div className="mt-6 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4">Top Growth States</h3>
                  <div className="flex flex-wrap gap-3">
                    {marketOverview.topGrowthStates.map((state, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectStateFromList(state.state)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:shadow-md transition-all"
                      >
                        <span className="font-medium text-gray-700">{state.state}</span>
                        <span className="text-green-600 font-bold">+{state.growth}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All States Grid */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select a State / Union Territory</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allStates.map((state, idx) => (
                <button
                  key={idx}
                  onClick={() => selectStateFromList(state.state)}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#FF6B35]/30 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{state.state}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRatingColor(state.rating)}`}>
                      {state.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{state.capital}</p>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(state.trend)}
                    <span className={`text-sm font-medium ${state.yoyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {state.yoyGrowth > 0 ? '+' : ''}{state.yoyGrowth}% YoY
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Selected State Details */}
        {selectedState && (
          <div className="space-y-6">
            {/* Back Button & Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedState(null)}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                ← Back to all states
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Last updated: {new Date(selectedState.lastUpdated).toLocaleDateString()}
              </div>
            </div>

            {/* State Header Card */}
            <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2d5a8a] rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{selectedState.state}</h2>
                  <p className="text-white/70">Capital: {selectedState.capital}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedState.majorCities.slice(0, 5).map((city, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-4 py-2 rounded-xl text-lg font-bold ${
                    selectedState.marketTrend === 'rising' ? 'bg-green-500' :
                    selectedState.marketTrend === 'falling' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {selectedState.marketTrend === 'rising' ? '📈 Rising Market' :
                     selectedState.marketTrend === 'falling' ? '📉 Falling Market' : '➡️ Stable Market'}
                  </div>
                  <span className={`px-4 py-1 rounded-full font-bold ${getRatingColor(selectedState.investmentRating)} text-lg`}>
                    Investment Rating: {selectedState.investmentRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-3xl font-bold text-green-600">+{selectedState.yoyGrowth}%</p>
                <p className="text-sm text-gray-500">YoY Growth</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-800">{selectedState.reraRegistered}</p>
                <p className="text-sm text-gray-500">RERA Projects</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-800">{selectedState.infrastructureScore}/10</p>
                <p className="text-sm text-gray-500">Infrastructure</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-purple-600">{selectedState.rentalYield}%</p>
                <p className="text-sm text-gray-500">Rental Yield</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedState.demandSupplyRatio}</p>
                <p className="text-sm text-gray-500">Demand/Supply</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {(['overview', 'prices', 'projects', 'forecast'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Hotspots */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#FF6B35]" />
                    Investment Hotspots
                  </h3>
                  <div className="space-y-2">
                    {selectedState.hotspots.map((hotspot, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-[#FF6B35]" />
                        <span className="text-gray-700">{hotspot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Government Policies */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Government Policies & Benefits
                  </h3>
                  <div className="space-y-3">
                    {selectedState.governmentPolicies.map((policy, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-gray-800">{policy.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{policy.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunities */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Investment Opportunities
                  </h3>
                  <div className="space-y-2">
                    {selectedState.opportunities.map((opp, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <ChevronRight className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{opp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Risk Factors
                  </h3>
                  <div className="space-y-2">
                    {selectedState.risks.map((risk, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-gray-700">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prices' && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Residential</h3>
                      <p className="text-sm text-gray-500">Average Price</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{selectedState.avgPricePerSqft.residential.toLocaleString()}
                  </p>
                  <p className="text-gray-500">per sq.ft</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Commercial</h3>
                      <p className="text-sm text-gray-500">Average Price</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{selectedState.avgPricePerSqft.commercial.toLocaleString()}
                  </p>
                  <p className="text-gray-500">per sq.ft</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <LandPlot className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Plots/Land</h3>
                      <p className="text-sm text-gray-500">Average Price</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{selectedState.avgPricePerSqft.plots.toLocaleString()}
                  </p>
                  <p className="text-gray-500">per sq.ft</p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Price Range</h3>
                      <p className="text-lg text-gray-700">{selectedState.priceRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Upcoming Projects & Infrastructure</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Project Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Investment</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedState.upcomingProjects.map((project, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-800">{project.name}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {project.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{project.investment}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              project.status === 'Operational' ? 'bg-green-100 text-green-700' :
                              project.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-700' :
                              project.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(selectedState.forecast).map(([year, data]) => (
                  <div key={year} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{year}</h3>
                      <span className={`text-2xl font-bold ${data.growth > 10 ? 'text-green-600' : data.growth > 5 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        +{data.growth}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-4">
                      <div 
                        className={`h-2 rounded-full ${data.growth > 10 ? 'bg-green-500' : data.growth > 5 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(data.growth * 5, 100)}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Growth Driver:</span> {data.reason}
                    </p>
                  </div>
                ))}

                <div className="md:col-span-3 bg-gradient-to-r from-[#1E3A5F]/5 to-[#FF6B35]/5 rounded-xl p-6 border border-[#1E3A5F]/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Investment Analysis</h4>
                      <p className="text-gray-600">
                        Based on current trends, infrastructure development, and government policies, 
                        <strong> {selectedState.state}</strong> is projected to see an average annual growth 
                        of <strong className="text-green-600">
                          {(Object.values(selectedState.forecast).reduce((sum: number, f) => sum + f.growth, 0) / 
                            Object.keys(selectedState.forecast).length).toFixed(1)}%
                        </strong> over the next 3 years. 
                        {selectedState.investmentRating.startsWith('A') && 
                          ' This makes it one of the top investment destinations in India.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

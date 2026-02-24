import { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  FileText,
  MessageSquare,
  Briefcase,
  UserCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'developers', label: 'Developers', icon: Briefcase },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'customers', label: 'Customer Data', icon: UserCheck },
  { id: 'news', label: 'News & Articles', icon: FileText },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1E3A5F] text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold">PP</span>
            </div>
            {isSidebarOpen && (
              <div>
                <span className="text-xl font-bold">Properties Professor</span>
                <span className="block text-xs text-white/60">Admin Panel</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4">
            <button 
              onClick={() => {
                localStorage.removeItem('pp_token');
                localStorage.removeItem('pp_user');
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B35]" />
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

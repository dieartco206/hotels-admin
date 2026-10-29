import React, { useState, useEffect } from 'react';
import { 
  adminApi, 
  getAuthToken, 
  getAuthUser, 
  removeAuthToken, 
  removeAuthUser 
} from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HotelsAndPartners from './pages/HotelsAndPartners';
import AllBookings from './pages/AllBookings';
import SettlementsAudit from './pages/SettlementsAudit';
import PlatformSettings from './pages/PlatformSettings';
import Login from './pages/Login';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize active tab from URL query param, hash, or localStorage
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const validTabs = ['dashboard', 'properties', 'bookings', 'settlements', 'settings'];
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && validTabs.includes(tabParam)) return tabParam;

      const hashParam = window.location.hash.replace('#', '');
      if (hashParam && validTabs.includes(hashParam)) return hashParam;

      const savedTab = localStorage.getItem('hotels_admin_active_tab');
      if (savedTab && validTabs.includes(savedTab)) return savedTab;
    } catch (e) {
      // Ignore fallback
    }
    return 'dashboard';
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize selected region from URL query param or localStorage
  const [selectedRegion, setSelectedRegion] = useState(() => {
    try {
      const validRegions = ['all', 'Indonesia', 'Malaysia', 'Singapore'];
      const params = new URLSearchParams(window.location.search);
      const regionParam = params.get('region');
      if (regionParam && validRegions.includes(regionParam)) return regionParam;

      const savedRegion = localStorage.getItem('hotels_admin_selected_region');
      if (savedRegion && validRegions.includes(savedRegion)) return savedRegion;
    } catch (e) {
      // Ignore fallback
    }
    return 'all';
  });

  // Admin Data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // Synchronize active tab and selected region with URL params & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hotels_admin_active_tab', activeTab);
      localStorage.setItem('hotels_admin_selected_region', selectedRegion);

      const params = new URLSearchParams(window.location.search);
      params.set('tab', activeTab);
      if (selectedRegion && selectedRegion !== 'all') {
        params.set('region', selectedRegion);
      } else {
        params.delete('region');
      }
      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {
      // Ignore storage/history access restriction
    }
  }, [activeTab, selectedRegion]);

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const validTabs = ['dashboard', 'properties', 'bookings', 'settlements', 'settings'];
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
      const regionParam = params.get('region');
      const validRegions = ['all', 'Indonesia', 'Malaysia', 'Singapore'];
      if (regionParam && validRegions.includes(regionParam)) {
        setSelectedRegion(regionParam);
      } else {
        setSelectedRegion('all');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getAuthUser();
    if (token && storedUser && storedUser.role === 'admin') {
      setUser(storedUser);
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard metrics
      const dashRes = await adminApi.getDashboard().catch(() => null);
      if (dashRes?.data) setDashboardStats(dashRes.data);

      // 2. All hotels
      const hotelsRes = await adminApi.getHotels().catch(() => null);
      if (hotelsRes?.data) setHotels(hotelsRes.data);

      // 3. Partner applications
      const appsRes = await adminApi.getApplications().catch(() => null);
      if (appsRes?.data) setApplications(appsRes.data);

      // 4. All bookings
      const bookingsRes = await adminApi.getBookings().catch(() => null);
      if (bookingsRes?.data) setBookings(bookingsRes.data);

      // 5. Settlements
      const settlementsRes = await adminApi.getSettlements().catch(() => null);
      if (settlementsRes?.data) setSettlements(settlementsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    loadAllAdminData();
  };

  const handleLogout = () => {
    removeAuthToken();
    removeAuthUser();
    try {
      localStorage.removeItem('hotels_admin_active_tab');
      localStorage.removeItem('hotels_admin_selected_region');
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {
      // Ignore
    }
    setUser(null);
    setDashboardStats(null);
    setHotels([]);
    setApplications([]);
    setBookings([]);
    setSettlements([]);
  };

  if (!user && !loading) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      <div className="flex-1 w-full flex min-h-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingAppsCount}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 w-full min-w-0 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
              <span className="text-xs font-semibold">Synchronizing with Regional OTA Telemetry...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  stats={dashboardStats}
                  hotels={hotels}
                  bookings={bookings}
                  onNavigate={setActiveTab}
                  selectedRegion={selectedRegion}
                  onSelectRegion={setSelectedRegion}
                />
              )}

              {activeTab === 'properties' && (
                <HotelsAndPartners
                  hotels={hotels}
                  applications={applications}
                  onRefresh={loadAllAdminData}
                  selectedRegion={selectedRegion}
                  onSelectRegion={setSelectedRegion}
                />
              )}

              {activeTab === 'bookings' && (
                <AllBookings
                  bookings={bookings}
                  onRefresh={loadAllAdminData}
                  selectedRegion={selectedRegion}
                  onSelectRegion={setSelectedRegion}
                />
              )}

              {activeTab === 'settlements' && (
                <SettlementsAudit
                  settlements={settlements}
                  onRefresh={loadAllAdminData}
                  selectedRegion={selectedRegion}
                  onSelectRegion={setSelectedRegion}
                />
              )}

              {activeTab === 'settings' && (
                <PlatformSettings
                  selectedRegion={selectedRegion}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

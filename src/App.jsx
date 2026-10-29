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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Data states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [settlements, setSettlements] = useState([]);

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
      />

      <div className="flex-1 w-full flex min-h-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingAppsCount}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto">
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
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'properties' && (
                <HotelsAndPartners
                  hotels={hotels}
                  applications={applications}
                  onRefresh={loadAllAdminData}
                />
              )}

              {activeTab === 'bookings' && (
                <AllBookings
                  bookings={bookings}
                  onRefresh={loadAllAdminData}
                />
              )}

              {activeTab === 'settlements' && (
                <SettlementsAudit
                  settlements={settlements}
                  onRefresh={loadAllAdminData}
                />
              )}

              {activeTab === 'settings' && (
                <PlatformSettings />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

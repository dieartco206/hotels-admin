import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Power,
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  Check,
  X,
  Loader2,
  Globe2,
  RotateCcw
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function HotelsAndPartners({ 
  applications = [], 
  hotels = [], 
  onRefresh,
  selectedRegion = 'all',
  onSelectRegion
}) {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'applications'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Helper to format country & flag accurately
  const getCountryInfo = (country, city) => {
    const cNorm = (country || '').toLowerCase();
    const cityNorm = (city || '').toLowerCase();
    if (cNorm.includes('singapore') || cNorm === 'sg' || cityNorm.includes('singapore')) {
      return { flag: '🇸🇬', name: 'Singapore' };
    }
    if (cNorm.includes('malaysia') || cNorm === 'my' || ['kuala lumpur', 'penang', 'langkawi'].includes(cityNorm)) {
      return { flag: '🇲🇾', name: 'Malaysia' };
    }
    return { flag: '🇮🇩', name: 'Indonesia' };
  };

  const handleReviewApplication = async (appId, action) => {
    setActionLoadingId(appId);
    try {
      await adminApi.reviewApplication(appId, action, `Reviewed by Superadmin on ${new Date().toLocaleDateString()}`);
      setNotification(`Application successfully marked as ${action}d!`);
      setTimeout(() => setNotification(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleHotelStatus = async (hotel) => {
    const nextStatus = hotel.status === 'active' ? 'suspended' : 'active';
    setActionLoadingId(hotel.id);
    try {
      await adminApi.toggleHotelStatus(hotel.id, nextStatus);
      setNotification(`Property "${hotel.name}" status updated to ${nextStatus.toUpperCase()}.`);
      setTimeout(() => setNotification(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update property status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter applications by selectedRegion
  const scopedApplications = useMemo(() => {
    return applications.filter((app) => {
      if (selectedRegion === 'all') return true;
      const city = (app.city || '').toLowerCase();
      if (selectedRegion === 'Indonesia') {
        return ['bali', 'jakarta', 'bandung', 'yogyakarta', 'surabaya', 'lombok'].includes(city) || (app.country || '').toLowerCase().includes('indonesia');
      }
      if (selectedRegion === 'Malaysia') {
        return ['kuala lumpur', 'penang', 'langkawi', 'johor'].includes(city) || (app.country || '').toLowerCase().includes('malaysia');
      }
      if (selectedRegion === 'Singapore') {
        return city.includes('singapore') || (app.country || '').toLowerCase().includes('singapore');
      }
      return true;
    });
  }, [applications, selectedRegion]);

  const pendingApps = scopedApplications.filter((a) => a.status === 'pending');

  // Filtered hotels list by selectedRegion & local search/filters
  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      // 1. Global Region Filter
      const countryInfo = getCountryInfo(h.country, h.city);
      if (selectedRegion !== 'all' && countryInfo.name.toLowerCase() !== selectedRegion.toLowerCase()) {
        return false;
      }

      // 2. Search Term
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        h.name.toLowerCase().includes(term) ||
        (h.city && h.city.toLowerCase().includes(term)) ||
        (h.area && h.area.toLowerCase().includes(term));

      // 3. Status Filter
      const matchesStatus = 
        statusFilter === 'all' || 
        h.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [hotels, selectedRegion, searchTerm, statusFilter]);

  const currentRegionName = selectedRegion === 'all' 
    ? 'Semua Wilayah (Cross-Border)' 
    : selectedRegion === 'Indonesia' ? '🇮🇩 Indonesia' : selectedRegion === 'Malaysia' ? '🇲🇾 Malaysia' : '🇸🇬 Singapore';

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* 1. Header Card (Fluid Full-Width) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Properties & Hotel Partners
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {filteredHotels.length} Properties
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Live inventory control tower. Audit property details, manage listing statuses, and review onboarding requests.
          </p>
        </div>

        {/* Tab switch (Segmented Control) */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-stretch sm:self-start md:self-auto shrink-0 border border-slate-200/60">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hotels' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hotel Directory ({filteredHotels.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'applications' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Onboarding</span>
            {pendingApps.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                {pendingApps.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Active Region Isolation Banner */}
      {selectedRegion !== 'all' ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl leading-none">
              {selectedRegion === 'Indonesia' ? '🇮🇩' : selectedRegion === 'Malaysia' ? '🇲🇾' : '🇸🇬'}
            </span>
            <div>
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <span>Filter Wilayah Aktif: {selectedRegion}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold uppercase">
                  Data Terisolasi
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5">
                Menampilkan hanya properti dan pendaftaran kemitraan di wilayah <strong>{selectedRegion}</strong> agar data tidak tercampur aduk.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectRegion && onSelectRegion('all')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Tampilkan Semua Wilayah</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Globe2 className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Mode Cross-Border Aktif: Menampilkan gabungan seluruh properti (Singapura, Malaysia, Indonesia).</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 font-medium">Pilah Cepat:</span>
            <button onClick={() => onSelectRegion('Indonesia')} className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 cursor-pointer">🇮🇩 ID</button>
            <button onClick={() => onSelectRegion('Malaysia')} className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 cursor-pointer">🇲🇾 MY</button>
            <button onClick={() => onSelectRegion('Singapore')} className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 cursor-pointer">🇸🇬 SG</button>
          </div>
        </div>
      )}

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Tab 1: Hotel Directory */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          {/* Search & Status Toolbar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search hotel name, city, area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Status Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200/70 border border-transparent rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Full-Width Hotels Table (Responsive Horizontal Scroll) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Property</th>
                    <th className="py-3.5 px-4">Territory</th>
                    <th className="py-3.5 px-4">Classification</th>
                    <th className="py-3.5 px-4">Starting Rate</th>
                    <th className="py-3.5 px-4">Rooms</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHotels.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center text-slate-400">
                        <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        Tidak ada hotel yang sesuai dengan pencarian atau wilayah {currentRegionName}.
                      </td>
                    </tr>
                  ) : (
                    filteredHotels.map((h) => {
                      const isActive = h.status === 'active';
                      const roomCount = h.rooms ? h.rooms.length : 0;
                      const countryInfo = getCountryInfo(h.country, h.city);
                      const isLoading = actionLoadingId === h.id;

                      return (
                        <tr key={h.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* Property Details */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={h.image}
                                alt={h.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="min-w-0">
                                <div className="font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                                  {h.name}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {h.type}
                                  </span>
                                  {h.badge && (
                                    <span className="text-amber-700 font-medium truncate">
                                      • {h.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Territory & Flag */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-800">{h.city}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{countryInfo.flag}</span>
                              <span className="font-medium">{countryInfo.name}</span>
                            </div>
                          </td>

                          {/* Classification */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{h.star_rating}-Star Luxury</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              ★ <span className="font-bold text-slate-800">{h.rating}</span> ({h.review_count} reviews)
                            </div>
                          </td>

                          {/* Starting Rate */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-black text-slate-900 font-mono text-sm">
                              <span className="text-xs font-bold text-slate-500 mr-1">{h.currency}</span>
                              {Math.round(h.price_start).toLocaleString('en-US')}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">per room / night</div>
                          </td>

                          {/* Rooms Categories */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                              <Building2 className="w-3.5 h-3.5 text-slate-500" />
                              {roomCount} Tier{roomCount !== 1 ? 's' : ''}
                            </span>
                          </td>

                          {/* Listing Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                              {h.status}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleToggleHotelStatus(h)}
                              disabled={isLoading}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5 ${
                                isActive
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                              } disabled:opacity-50`}
                            >
                              {isLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Power className="w-3.5 h-3.5" />
                              )}
                              <span>{isActive ? 'Suspend' : 'Activate'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Menampilkan <strong className="text-slate-900 font-bold">{filteredHotels.length}</strong> properti di wilayah <strong className="text-slate-900 font-bold">{currentRegionName}</strong>
              </div>
              <div className="flex items-center gap-4">
                <span>Take-rate: <strong className="text-brand-600 font-bold">15.0%</strong></span>
                <span>Aktif: <strong className="text-emerald-700 font-bold">{filteredHotels.filter(h => h.status === 'active').length}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Partner Onboarding Requests */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Inbound Hotelier Partnership Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">Audit permohonan mitra baru khusus wilayah {currentRegionName}.</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {pendingApps.length} Permohonan Tertunda
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {scopedApplications.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                Tidak ada permohonan kemitraan hotel untuk wilayah {currentRegionName}.
              </div>
            ) : (
              scopedApplications.map((app) => {
                const isPending = app.status === 'pending';
                const isLoading = actionLoadingId === app.id;

                return (
                  <div key={app.id} className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-black text-slate-900 text-sm sm:text-base">{app.property_name}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {app.property_type}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Owner: <strong className="text-slate-800">{app.contact_name}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{app.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {app.city}
                        </span>
                        <span>•</span>
                        <span>Kuota: <strong className="text-slate-800">{app.room_count || 12} Kamar</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Diajukan {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isPending ? (
                      <div className="flex items-center gap-2 self-stretch sm:self-end lg:self-auto shrink-0">
                        <button
                          onClick={() => handleReviewApplication(app.id, 'reject')}
                          disabled={isLoading}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'approve')}
                          disabled={isLoading}
                          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Setujui & Onboard</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        {app.notes || `Diproses pada ${new Date(app.updated_at).toLocaleDateString()}`}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

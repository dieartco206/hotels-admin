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
  Sparkles as Dummy, // not used
  Check,
  X,
  Loader2
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function HotelsAndPartners({ applications = [], hotels = [], onRefresh }) {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'applications'
  const [searchTerm, setSearchTerm] = useState('');
  const [territoryFilter, setTerritoryFilter] = useState('all');
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

  const pendingApps = applications.filter((a) => a.status === 'pending');

  // Filtered hotels list
  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        h.name.toLowerCase().includes(term) ||
        (h.city && h.city.toLowerCase().includes(term)) ||
        (h.area && h.area.toLowerCase().includes(term));

      const countryInfo = getCountryInfo(h.country, h.city);
      const matchesTerritory = 
        territoryFilter === 'all' ||
        countryInfo.name.toLowerCase() === territoryFilter.toLowerCase();

      const matchesStatus = 
        statusFilter === 'all' || 
        h.status === statusFilter;

      return matchesSearch && matchesTerritory && matchesStatus;
    });
  }, [hotels, searchTerm, territoryFilter, statusFilter]);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Card (Fluid Full-Width) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Properties & Hotel Partners
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {hotels.length} Properties Listed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Live cross-border inventory control tower. Audit hotel properties, review partnership onboarding requests, and toggle listing statuses.
          </p>
        </div>

        {/* Tab switch (Segmented Control) */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto shrink-0 border border-slate-200/60">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hotels' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hotel Directory ({hotels.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'applications' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Partner Onboarding</span>
            {pendingApps.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                {pendingApps.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Tab 1: Hotel Directory */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          {/* Search & Territory Toolbar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by hotel name, city, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 shrink-0 hidden sm:inline">Territory:</span>
              {[
                { id: 'all', label: 'All Territories' },
                { id: 'Singapore', label: '🇸🇬 Singapore' },
                { id: 'Malaysia', label: '🇲🇾 Malaysia' },
                { id: 'Indonesia', label: '🇮🇩 Indonesia' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTerritoryFilter(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    territoryFilter === t.id
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}

              <div className="h-5 w-[1px] bg-slate-200 mx-1 shrink-0" />

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 border border-transparent rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Full-Width Hotels Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Property</th>
                    <th className="py-3.5 px-4">Territory</th>
                    <th className="py-3.5 px-4">Classification</th>
                    <th className="py-3.5 px-4">Starting Rate</th>
                    <th className="py-3.5 px-4">Rooms</th>
                    <th className="py-3.5 px-4">Listing Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHotels.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No luxury properties match your search or filter criteria.
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
                                    <span className="text-amber-700 font-medium">
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
                Showing <span className="font-bold text-slate-900">{filteredHotels.length}</span> of <span className="font-bold text-slate-900">{hotels.length}</span> verified luxury properties
              </div>
              <div className="flex items-center gap-4">
                <span>Distribution Take-rate: <strong className="text-brand-600 font-bold">15.0%</strong></span>
                <span>Active Properties: <strong className="text-emerald-700 font-bold">{hotels.filter(h => h.status === 'active').length}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Partner Onboarding Requests */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Inbound Hotelier Partnership Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">Audit property documentation, ownership credentials, and commission agreements before onboarding.</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {pendingApps.length} Pending Actions
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                No inbound hotel partnership applications currently on record.
              </div>
            ) : (
              applications.map((app) => {
                const isPending = app.status === 'pending';
                const isLoading = actionLoadingId === app.id;

                return (
                  <div key={app.id} className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-black text-slate-900 text-base">{app.property_name}</span>
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
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Owner: <strong className="text-slate-800">{app.contact_name}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {app.city}
                        </span>
                        <span>•</span>
                        <span>Inventory: <strong className="text-slate-800">{app.room_count || 12} Rooms</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Submitted {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isPending ? (
                      <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0">
                        <button
                          onClick={() => handleReviewApplication(app.id, 'reject')}
                          disabled={isLoading}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Decline Request
                        </button>
                        <button
                          onClick={() => handleReviewApplication(app.id, 'approve')}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Approve & Onboard</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        {app.notes || `Processed on ${new Date(app.updated_at).toLocaleDateString()}`}
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

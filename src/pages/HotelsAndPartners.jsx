import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Power,
  Users
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function HotelsAndPartners({ applications, hotels, onRefresh }) {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'applications'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState(null);

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
      setNotification(`Property ${hotel.name} status updated to ${nextStatus}.`);
      setTimeout(() => setNotification(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update property status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingApps = applications.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Properties & Hotel Partners</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {hotels.length} Properties Listed
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Audit property inventory, review partner onboarding requests, and manage listing statuses.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'hotels' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hotel Directory ({hotels.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Partner Onboarding</span>
            {pendingApps.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingApps.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Tab 1: Hotel Directory */}
      {activeTab === 'hotels' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Property</th>
                  <th className="py-3 px-4 font-semibold">Territory</th>
                  <th className="py-3 px-4 font-semibold">Classification</th>
                  <th className="py-3 px-4 font-semibold">Starting Rate</th>
                  <th className="py-3 px-4 font-semibold">Rooms</th>
                  <th className="py-3 px-4 font-semibold">Listing Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hotels.map((h) => {
                  const isActive = h.status === 'active';
                  const roomCount = h.rooms ? h.rooms.length : 0;

                  return (
                    <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={h.image}
                            alt={h.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{h.name}</div>
                            <div className="text-[11px] text-slate-400 capitalize">{h.type} Resort</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">{h.city}</div>
                        <div className="text-[11px] text-slate-400">
                          {h.country === 'SG' ? '🇸🇬 Singapore' : h.country === 'MY' ? '🇲🇾 Malaysia' : '🇮🇩 Indonesia'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{h.star_rating}-Star</span>
                        </div>
                        <div className="text-[11px] text-slate-400">★ {h.rating} ({h.review_count} reviews)</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {h.currency} {Math.round(h.price_start).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {roomCount} Categories
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleHotelStatus(h)}
                          disabled={actionLoadingId === h.id}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Partner Onboarding Requests */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-900">
            Inbound Hotelier Partnership Requests
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No partnership applications in queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Business Name</th>
                    <th className="py-3 px-4 font-semibold">Contact Person</th>
                    <th className="py-3 px-4 font-semibold">Territory</th>
                    <th className="py-3 px-4 font-semibold">Units</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => {
                    const isPending = app.status === 'pending';
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {app.business_name}
                          {app.notes && <div className="text-[11px] font-normal text-slate-400">{app.notes}</div>}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{app.contact_person}</div>
                          <div className="text-[11px] text-slate-400">{app.email} • {app.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {app.city}, {app.country}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {app.property_count || 1} Property
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            app.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReviewApplication(app.id, 'approve')}
                                disabled={actionLoadingId === app.id}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewApplication(app.id, 'reject')}
                                disabled={actionLoadingId === app.id}
                                className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs font-medium">Processed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Filter, 
  Globe2, 
  AlertCircle, 
  CheckCircle2, 
  XOctagon 
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function AllBookings({ bookings, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.booking_code} and issue a platform refund?`)) {
      return;
    }

    setCancellingId(booking.id);
    try {
      await adminApi.cancelBooking(booking.id);
      setNotification(`Booking ${booking.booking_code} cancelled and refunded. Room allotment restored.`);
      setTimeout(() => setNotification(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      b.booking_code.toLowerCase().includes(term) ||
      b.guest_name.toLowerCase().includes(term) ||
      (b.hotel?.name && b.hotel.name.toLowerCase().includes(term));

    const matchesCountry =
      countryFilter === 'all' ||
      (b.hotel?.country && b.hotel.country.toUpperCase() === countryFilter.toUpperCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Master Reservations Ledger</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {bookings.length} Platform Transactions
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Global cross-border booking records with full audit trail and refund authority.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Country Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Territories' },
            { id: 'SG', label: '🇸🇬 Singapore' },
            { id: 'MY', label: '🇲🇾 Malaysia' },
            { id: 'ID', label: '🇮🇩 Indonesia' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCountryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                countryFilter === c.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, guest, hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* Bookings Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No booking transactions found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Booking Code</th>
                  <th className="py-3 px-4 font-semibold">Property</th>
                  <th className="py-3 px-4 font-semibold">Guest</th>
                  <th className="py-3 px-4 font-semibold">Stay Dates</th>
                  <th className="py-3 px-4 font-semibold">Gross (GBV)</th>
                  <th className="py-3 px-4 font-semibold">15% Take</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Superadmin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => {
                  const checkInStr = new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const checkOutStr = new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const commission = (b.total_amount || 0) * 0.15;
                  const isCancelled = b.status === 'cancelled';

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-600">
                        {b.booking_code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.hotel?.name || 'Property'}</div>
                        <div className="text-[11px] text-slate-400">
                          {b.hotel?.city}, {b.hotel?.country} • {b.room?.name || 'Room'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{b.guest_name}</div>
                        <div className="text-[11px] text-slate-400">{b.guest_email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium">{checkInStr} – {checkOutStr}</div>
                        <div className="text-[11px] text-slate-400">{b.nights} night(s)</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {b.currency} {Math.round(b.total_amount).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">
                        {b.currency} {Math.round(commission).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isCancelled
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-brand-700 border border-brand-200'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isCancelled ? (
                          <button
                            onClick={() => handleCancelBooking(b)}
                            disabled={cancellingId === b.id}
                            className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Cancel & Refund
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">Refunded</span>
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
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Filter, 
  Globe2, 
  AlertCircle, 
  CheckCircle2, 
  XOctagon,
  Calendar,
  User,
  Building2,
  DollarSign,
  Loader2
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function AllBookings({ bookings = [], onRefresh }) {
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

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.booking_code?.toLowerCase().includes(term) ||
        b.guest_name?.toLowerCase().includes(term) ||
        b.guest_email?.toLowerCase().includes(term) ||
        (b.hotel?.name && b.hotel.name.toLowerCase().includes(term));

      const hotelCountry = (b.hotel?.country || '').toLowerCase();
      const hotelCity = (b.hotel?.city || '').toLowerCase();

      const matchesCountry =
        countryFilter === 'all' ||
        (countryFilter === 'SG' && (hotelCountry.includes('singapore') || hotelCity.includes('singapore'))) ||
        (countryFilter === 'MY' && (hotelCountry.includes('malaysia') || ['kuala lumpur', 'penang', 'langkawi'].includes(hotelCity))) ||
        (countryFilter === 'ID' && (hotelCountry.includes('indonesia') || ['bali', 'jakarta', 'bandung', 'yogyakarta'].includes(hotelCity)));

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [bookings, searchTerm, countryFilter, statusFilter]);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Master Reservations Audit
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {bookings.length} Total Bookings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Audit live cross-border guest reservations across Singapore, Indonesia, and Malaysia partner networks.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search code, guest name, email, or hotel..."
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

        {/* Territory & Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 shrink-0 hidden sm:inline">Territory:</span>
          {[
            { id: 'all', label: 'All Territories' },
            { id: 'SG', label: '🇸🇬 Singapore' },
            { id: 'MY', label: '🇲🇾 Malaysia' },
            { id: 'ID', label: '🇮🇩 Indonesia' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCountryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                countryFilter === c.id
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {c.label}
            </button>
          ))}

          <div className="h-5 w-[1px] bg-slate-200 mx-1 shrink-0" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 border border-transparent rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 3. Full-Width Bookings Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <BookOpenCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No booking transactions found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-5">Booking Code</th>
                  <th className="py-3.5 px-4">Hotel Property</th>
                  <th className="py-3.5 px-4">Guest Info</th>
                  <th className="py-3.5 px-4">Stay Dates</th>
                  <th className="py-3.5 px-4">Gross Total</th>
                  <th className="py-3.5 px-4">15% Take-Rate</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => {
                  const checkIn = new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                  const checkOut = new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                  const commission = (b.total_amount || 0) * 0.15;
                  const isCancelling = cancellingId === b.id;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Code */}
                      <td className="py-4 px-5 font-mono font-bold text-brand-600 whitespace-nowrap">
                        {b.booking_code}
                      </td>

                      {/* Hotel */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{b.hotel?.name || 'Luxury Property'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{b.hotel?.city || 'City'}, {b.hotel?.country || 'Region'}</span>
                        </div>
                      </td>

                      {/* Guest */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{b.guest_name}</div>
                        <div className="text-[11px] text-slate-400">{b.guest_email} • {b.guest_phone}</div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{checkIn} – {checkOut}</div>
                        <div className="text-[10px] text-slate-400">{b.nights || 1} Night(s)</div>
                      </td>

                      {/* Gross Amount */}
                      <td className="py-4 px-4 font-black text-slate-900 font-mono whitespace-nowrap">
                        <span className="text-xs text-slate-400 mr-1">{b.currency}</span>
                        {Math.round(b.total_amount).toLocaleString('en-US')}
                      </td>

                      {/* Commission */}
                      <td className="py-4 px-4 font-bold text-amber-600 font-mono whitespace-nowrap">
                        <span className="text-xs text-amber-500 mr-1">{b.currency}</span>
                        {Math.round(commission).toLocaleString('en-US')}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'checked_in' ? 'bg-emerald-500' : b.status === 'cancelled' ? 'bg-rose-500' : 'bg-blue-500'
                          }`} />
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {b.status !== 'cancelled' ? (
                          <button
                            onClick={() => handleCancelBooking(b)}
                            disabled={isCancelling}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                          >
                            {isCancelling ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <XOctagon className="w-3.5 h-3.5" />
                            )}
                            <span>Cancel & Refund</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Refunded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{filtered.length}</strong> of <strong className="text-slate-900">{bookings.length}</strong> total reservations
          </div>
          <div className="font-semibold text-slate-700">
            Automated Audit & Fraud Shield: <span className="text-emerald-700 font-bold">100% Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

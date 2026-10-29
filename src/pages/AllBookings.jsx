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
  Loader2,
  RotateCcw
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function AllBookings({ 
  bookings = [], 
  onRefresh,
  selectedRegion = 'all',
  onSelectRegion
}) {
  const [searchTerm, setSearchTerm] = useState('');
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
      // 1. Regional Isolation
      const hotelCountry = (b.hotel?.country || '').toLowerCase();
      const hotelCity = (b.hotel?.city || '').toLowerCase();

      if (selectedRegion === 'Indonesia') {
        const isIndo = hotelCountry.includes('indonesia') || ['bali', 'jakarta', 'bandung', 'yogyakarta'].includes(hotelCity);
        if (!isIndo) return false;
      } else if (selectedRegion === 'Malaysia') {
        const isMalay = hotelCountry.includes('malaysia') || ['kuala lumpur', 'penang', 'langkawi'].includes(hotelCity);
        if (!isMalay) return false;
      } else if (selectedRegion === 'Singapore') {
        const isSG = hotelCountry.includes('singapore') || hotelCity.includes('singapore');
        if (!isSG) return false;
      }

      // 2. Search
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        b.booking_code?.toLowerCase().includes(term) ||
        b.guest_name?.toLowerCase().includes(term) ||
        b.guest_email?.toLowerCase().includes(term) ||
        (b.hotel?.name && b.hotel.name.toLowerCase().includes(term));

      // 3. Status
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, selectedRegion, searchTerm, statusFilter]);

  const currentRegionName = selectedRegion === 'all' 
    ? 'Semua Wilayah (Cross-Border)' 
    : selectedRegion === 'Indonesia' ? '🇮🇩 Indonesia' : selectedRegion === 'Malaysia' ? '🇲🇾 Malaysia' : '🇸🇬 Singapore';

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Master Reservations Audit
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {filtered.length} Bookings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Audit live guest reservations. Memantau check-in, detail tamu, dan aliran komisi platform.
          </p>
        </div>

        {selectedRegion !== 'all' && (
          <button
            onClick={() => onSelectRegion('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Lihat Semua Wilayah</span>
          </button>
        )}
      </div>

      {/* 2. Active Region Isolation Banner */}
      {selectedRegion !== 'all' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl leading-none">
              {selectedRegion === 'Indonesia' ? '🇮🇩' : selectedRegion === 'Malaysia' ? '🇲🇾' : '🇸🇬'}
            </span>
            <div>
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <span>Reservasi Terisolasi: {selectedRegion}</span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5">
                Hanya menampilkan transaksi pemesanan tamu pada hotel di negara <strong>{selectedRegion}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search code, guest name, email, or hotel..."
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

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200/70 border border-transparent rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors cursor-pointer w-full sm:w-auto"
          >
            <option value="all">Semua Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 4. Full-Width Bookings Ledger Table (Responsive Scroll) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <BookOpenCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            Tidak ada transaksi reservasi untuk wilayah {currentRegionName}.
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-5">Booking Code</th>
                  <th className="py-3.5 px-4">Hotel Property</th>
                  <th className="py-3.5 px-4">Guest Info</th>
                  <th className="py-3.5 px-4">Stay Dates</th>
                  <th className="py-3.5 px-4">Gross Total</th>
                  <th className="py-3.5 px-4">15% Take</th>
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
                        <div className="text-[10px] text-slate-400">{b.nights || 1} Malam</div>
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
                            <span>Batalkan & Refund</span>
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
            Menampilkan <strong className="text-slate-900">{filtered.length}</strong> reservasi wilayah {currentRegionName}
          </div>
          <div className="font-semibold text-slate-700">
            Escrow Guard: <span className="text-emerald-700 font-bold">100% Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

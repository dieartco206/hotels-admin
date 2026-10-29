import React from 'react';
import { 
  DollarSign, 
  Percent, 
  Building2, 
  CalendarCheck, 
  Users, 
  ArrowUpRight, 
  Globe2, 
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard({ stats, onNavigate }) {
  const formatSGD = (amount) => {
    if (!amount) return 'S$ 0';
    return `S$ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  const totalGBV = stats?.total_gbv || 0;
  const netRevenue = stats?.net_revenue || 0;
  const totalHotels = stats?.total_hotels || 0;
  const activeHotels = stats?.active_hotels || 0;
  const totalBookings = stats?.total_bookings || 0;
  const pendingApps = stats?.pending_applications || 0;
  const countryDist = stats?.country_distribution || [];
  const recentBookings = stats?.recent_bookings || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Regional OTA Control Tower</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              Cross-Border Southeast Asia
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time multi-tenant monitoring across Singapore, Indonesia, and Malaysia markets.
          </p>
        </div>

        {pendingApps > 0 && (
          <button
            onClick={() => onNavigate('properties')}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all animate-pulse"
          >
            <span>{pendingApps} Pending Partner Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GBV */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Gross Booking Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 truncate">
            {formatSGD(totalGBV)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% month-over-month
          </div>
        </div>

        {/* Card 2: Net Commission Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle bg-gradient-to-br from-amber-50/30 to-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Net Platform Commission</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 truncate">
            {formatSGD(netRevenue)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Standard 15% platform take rate
          </div>
        </div>

        {/* Card 3: Active Properties */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Active Properties</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{activeHotels}</span>
            <span className="text-xs text-slate-400 font-medium">of {totalHotels} listed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Across 3 countries & 7 resort regions
          </div>
        </div>

        {/* Card 4: Total Bookings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalBookings}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            100% automated settlement ledger
          </div>
        </div>
      </div>

      {/* Regional Market Presence */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cross-Border Market Reach</h2>
            <p className="text-xs text-slate-500">Active hotel catalog by sovereign territory</p>
          </div>
          <Globe2 className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>🇸🇬 Singapore</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Marina Bay, Sentosa, Downtown</div>
            </div>
            <span className="text-lg font-extrabold text-slate-900">3 Hotels</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>🇮🇩 Indonesia</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Bali, Jakarta, Yogyakarta</div>
            </div>
            <span className="text-lg font-extrabold text-slate-900">3 Hotels</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>🇲🇾 Malaysia</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Kuala Lumpur, Langkawi, Penang</div>
            </div>
            <span className="text-lg font-extrabold text-slate-900">3 Hotels</span>
          </div>
        </div>
      </div>

      {/* Global Recent Bookings Stream */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Reservations Audit</h2>
            <p className="text-xs text-slate-500">Live booking transactions across all hotel partners</p>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Open Master Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Booking Code</th>
                  <th className="pb-3 font-semibold">Property</th>
                  <th className="pb-3 font-semibold">Guest</th>
                  <th className="pb-3 font-semibold">Dates</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">15% Take</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => {
                  const checkInStr = new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const checkOutStr = new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const commission = (b.total_amount || 0) * 0.15;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-brand-600">
                        {b.booking_code}
                      </td>
                      <td className="py-3 font-semibold text-slate-800">
                        {b.hotel?.name || 'Luxury Property'}
                      </td>
                      <td className="py-3 text-slate-700">{b.guest_name}</td>
                      <td className="py-3 text-slate-500">{checkInStr} – {checkOutStr}</td>
                      <td className="py-3 font-bold text-slate-900">
                        {b.currency} {Math.round(b.total_amount).toLocaleString('en-US')}
                      </td>
                      <td className="py-3 font-bold text-amber-600">
                        {b.currency} {Math.round(commission).toLocaleString('en-US')}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-brand-700 border border-brand-200'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
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

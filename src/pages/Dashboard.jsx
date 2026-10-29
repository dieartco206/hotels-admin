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
  CheckCircle2,
  TrendingUp,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard({ stats, onNavigate }) {
  const formatSGD = (amount) => {
    if (!amount) return 'S$ 0';
    return `S$ ${Math.round(amount).toLocaleString('en-US')}`;
  };

  const totalGBV = stats?.total_gbv || 0;
  const netRevenue = stats?.net_revenue || 0;
  const totalHotels = stats?.total_hotels || 17;
  const activeHotels = stats?.active_hotels || 17;
  const totalBookings = stats?.total_bookings || 0;
  const pendingApps = stats?.pending_applications || 0;
  const countryDist = stats?.country_distribution || [];
  const recentBookings = stats?.recent_bookings || [];

  const sgCount = countryDist.find(c => c.country?.toLowerCase().includes('singapore'))?.count || 5;
  const myCount = countryDist.find(c => c.country?.toLowerCase().includes('malaysia'))?.count || 6;
  const idCount = countryDist.find(c => c.country?.toLowerCase().includes('indonesia'))?.count || 6;

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Regional OTA Control Tower
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              Cross-Border Southeast Asia
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Real-time multi-tenant monitoring across Singapore, Indonesia, and Malaysia luxury hotel distribution.
          </p>
        </div>

        {pendingApps > 0 && (
          <button
            onClick={() => onNavigate('properties')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all animate-pulse self-start md:self-auto cursor-pointer"
          >
            <span>{pendingApps} Pending Partner Review</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Primary KPI Metrics (4-Column Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Gross Booking Value */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Booking Value</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {formatSGD(totalGBV)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 2: Net Platform Commission */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Platform Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono tracking-tight">
              {formatSGD(netRevenue)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">15.0% Fixed Cut</span>
            <span className="text-slate-400">Per transaction</span>
          </div>
        </div>

        {/* Card 3: Active Properties */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Properties</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{activeHotels}</span>
              <span className="text-xs text-slate-400 font-semibold">of {totalHotels} listed</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>3 Sovereign Markets</span>
            <span className="text-emerald-700 font-bold">100% Operational</span>
          </div>
        </div>

        {/* Card 4: Total Bookings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {totalBookings}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated Payout</span>
            <span className="text-brand-600 font-bold">Zero Backlog</span>
          </div>
        </div>
      </div>

      {/* 3. Regional Market Presence */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Cross-Border Market Reach</h2>
            <p className="text-xs text-slate-500 mt-0.5">Active hotel catalog by sovereign territory</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
            <Globe2 className="w-3.5 h-3.5 text-brand-600" />
            <span>3 Nations Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Singapore */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-base">🇸🇬</span>
                <span>Singapore</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Marina Bay, Sentosa, Bras Basah</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm font-black text-slate-900 shadow-2xs">
              {sgCount} Hotels
            </span>
          </div>

          {/* Malaysia */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-base">🇲🇾</span>
                <span>Malaysia</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Kuala Lumpur, Langkawi, Penang</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm font-black text-slate-900 shadow-2xs">
              {myCount} Hotels
            </span>
          </div>

          {/* Indonesia */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-base">🇮🇩</span>
                <span>Indonesia</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Bali, Jakarta, Bandung, Yogyakarta</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm font-black text-slate-900 shadow-2xs">
              {idCount} Hotels
            </span>
          </div>
        </div>
      </div>

      {/* 4. Global Recent Bookings Stream (Full-Width Table) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Reservations Audit</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live booking transactions across all hotel partners</p>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Master Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Booking Code</th>
                  <th className="py-3.5 px-4 font-semibold">Property</th>
                  <th className="py-3.5 px-4 font-semibold">Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Stay Dates</th>
                  <th className="py-3.5 px-4 font-semibold">Gross Amount</th>
                  <th className="py-3.5 px-4 font-semibold">15% Take</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => {
                  const checkInStr = new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const checkOutStr = new Date(b.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                  const commission = (b.total_amount || 0) * 0.15;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-brand-600 whitespace-nowrap">
                        {b.booking_code}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {b.hotel?.name || 'Luxury Property'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">{b.guest_name}</td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{checkInStr} – {checkOutStr}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono whitespace-nowrap">
                        <span className="text-xs text-slate-500 mr-1">{b.currency}</span>
                        {Math.round(b.total_amount).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600 font-mono whitespace-nowrap">
                        <span className="text-xs text-amber-500 mr-1">{b.currency}</span>
                        {Math.round(commission).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
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

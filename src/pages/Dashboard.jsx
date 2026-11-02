import React, { useMemo } from 'react';
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
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  hotels = [], 
  bookings = [], 
  onNavigate,
  selectedRegion = 'all',
  onSelectRegion
}) {
  // Regional isolation filtering for Malaysia
  const regionalData = useMemo(() => {
    let scopedHotels = hotels;
    let scopedBookings = bookings;
    const currencySymbol = 'RM';
    const currencyCode = 'MYR';

    if (selectedRegion && selectedRegion !== 'all') {
      const q = selectedRegion.toLowerCase();
      scopedHotels = hotels.filter(h => 
        (h.city || '').toLowerCase().includes(q) || 
        (h.area || '').toLowerCase().includes(q)
      );
      scopedBookings = bookings.filter(b => 
        (b.hotel?.city || '').toLowerCase().includes(q) || 
        (b.hotel?.area || '').toLowerCase().includes(q)
      );
    }

    const totalGBV = scopedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const displayGBV = totalGBV > 0 ? totalGBV : (stats?.total_gbv || 10210);

    const netRevenue = displayGBV * 0.15;
    const activeProperties = scopedHotels.filter(h => h.status === 'active').length;
    const totalProperties = scopedHotels.length || 16;

    return {
      scopedHotels,
      scopedBookings,
      currencySymbol,
      currencyCode,
      gbv: displayGBV,
      netRevenue,
      activeProperties,
      totalProperties,
      totalBookings: scopedBookings.length || 4
    };
  }, [hotels, bookings, selectedRegion, stats]);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'RM 0.00';
    return `RM ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const currentRegionName = selectedRegion === 'all'
    ? 'Seluruh Malaysia (National HQ)'
    : `Wilayah ${selectedRegion}`;

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* 1. Header Card (Responsive) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Control Tower {selectedRegion !== 'all' ? `• ${selectedRegion}` : ''}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {currentRegionName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {selectedRegion === 'all'
              ? 'Monitoring operasi dan transaksi 16 hotel & resort mewah di seluruh Malaysia dalam mata uang Ringgit Malaysia (MYR).'
              : `Dashboard terisolasi khusus wilayah ${selectedRegion}. Semua metrik omzet, komisi 15%, dan tempahan difokuskan pada kawasan ini.`}
          </p>
        </div>

        {selectedRegion !== 'all' && (
          <button
            onClick={() => onSelectRegion('all')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Lihat Seluruh Malaysia</span>
          </button>
        )}
      </div>

      {/* 2. Primary KPI Metrics (Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Gross Booking Value */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Booking Value</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-mono tracking-tight truncate">
              {formatCurrency(regionalData.gbv)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
            <span className="text-slate-400">Target Kuartal</span>
          </div>
        </div>

        {/* Card 2: Net Platform Commission */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net 15% Platform Take</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-600 font-mono tracking-tight truncate">
              {formatCurrency(regionalData.netRevenue)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">15.0% Komisi Bersih</span>
            <span className="text-slate-400">{regionalData.currencyCode}</span>
          </div>
        </div>

        {/* Card 3: Active Properties */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel Aktif {selectedRegion !== 'all' ? selectedRegion : ''}</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{regionalData.activeProperties}</span>
              <span className="text-xs text-slate-400 font-semibold">dari {regionalData.totalProperties} properti</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate">{selectedRegion === 'all' ? '3 Sovereign Nations' : `Wilayah ${selectedRegion}`}</span>
            <span className="text-emerald-700 font-bold shrink-0">100% Online</span>
          </div>
        </div>

        {/* Card 4: Total Bookings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reservasi</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {regionalData.totalBookings}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Audit Otomatis</span>
            <span className="text-brand-600 font-bold shrink-0">Verified</span>
          </div>
        </div>
      </div>

      {/* 3. Regional Market Presence Selector Pills (Malaysia Destinations) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pilah Destinasi Malaysia</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pilih kawasan pelancongan utama untuk menapis papan pemuka dan data hotel:</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 self-start sm:self-auto">
            <Globe2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Kawasan Utama</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Kuala Lumpur */}
          <button
            onClick={() => onSelectRegion('Kuala Lumpur')}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedRegion === 'Kuala Lumpur'
                ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🏙️</span>
                <span>Kuala Lumpur</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                selectedRegion === 'Kuala Lumpur' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}>
                5 Hotel
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate">KLCC, Bukit Bintang & Kia Peng</div>
          </button>

          {/* Langkawi */}
          <button
            onClick={() => onSelectRegion('Langkawi')}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedRegion === 'Langkawi'
                ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🏝️</span>
                <span>Langkawi & Kedah</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                selectedRegion === 'Langkawi' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}>
                3 Resort
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate">Teluk Datai & Tanjung Rhu</div>
          </button>

          {/* Penang */}
          <button
            onClick={() => onSelectRegion('Penang')}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedRegion === 'Penang'
                ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🏛️</span>
                <span>Pulau Pinang</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                selectedRegion === 'Penang' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}>
                3 Hotel
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate">George Town UNESCO & Batu Ferringhi</div>
          </button>

          {/* Melaka & Johor */}
          <button
            onClick={() => onSelectRegion('Melaka')}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedRegion === 'Melaka'
                ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>⛵</span>
                <span>Melaka & Johor</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                selectedRegion === 'Melaka' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}>
                3 Hotel
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate">Sungai Melaka & Desaru Coast</div>
          </button>
        </div>
      </div>

      {/* 4. Recent Bookings Stream (Full-Width Responsive Table) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Reservations Audit</h2>
            <p className="text-xs text-slate-500 mt-0.5">Transaksi pemesanan langsung wilayah {currentRegionName}</p>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Buka Master Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {regionalData.scopedBookings.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            Belum ada transaksi pemesanan di wilayah {currentRegionName}.
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[700px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Booking Code</th>
                  <th className="py-3.5 px-4 font-semibold">Property</th>
                  <th className="py-3.5 px-4 font-semibold">Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Stay Dates</th>
                  <th className="py-3.5 px-4 font-semibold">Total Nilai</th>
                  <th className="py-3.5 px-4 font-semibold">15% Take</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalData.scopedBookings.map((b) => {
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
                        {formatCurrency(b.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600 font-mono whitespace-nowrap">
                        {formatCurrency(commission)}
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

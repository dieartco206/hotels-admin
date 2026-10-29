import React from 'react';
import { 
  Sliders, 
  Percent, 
  Coins, 
  Database, 
  ShieldCheck, 
  Server, 
  CheckCircle2,
  Globe2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function PlatformSettings() {
  const currencies = [
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: '1.000 (Base)', flag: '🇸🇬' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: '3.485 MYR/SGD', flag: '🇲🇾' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: '11,850 IDR/SGD', flag: '🇮🇩' },
  ];

  return (
    <div className="w-full space-y-6 text-xs sm:text-sm">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Policy & Regional Rules
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              Regional Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Global commission agreements, multi-currency conversion reference, and system telemetry across sovereign markets.
          </p>
        </div>
      </div>

      {/* 2. Settings Grid (Full Width Fluid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Policy Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Standard Platform Take Rate</h3>
              <p className="text-xs text-slate-500">Uniform across all verified hotel partners</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">15.0%</div>
              <div className="text-xs text-slate-500 mt-1">Deducted automatically per confirmed guest checkout</div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs">
              Active Policy
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            Covers payment gateway processing fees, cross-border settlement, marketing customer acquisition, and 24/7 guest customer support.
          </p>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Escrow Settlement Cycle</span>
            <strong className="text-slate-900 font-bold">T+1 Post Check-in</strong>
          </div>
        </div>

        {/* Currency Rates Matrix */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-Currency Liquidity Pool</h3>
              <p className="text-xs text-slate-500">Real-time cross-border FX benchmark</p>
            </div>
          </div>

          <div className="space-y-2">
            {currencies.map((c) => (
              <div key={c.code} className="p-3 sm:p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{c.flag}</span>
                  <div>
                    <div className="font-bold text-slate-900">{c.code} ({c.symbol})</div>
                    <div className="text-[11px] text-slate-500">{c.name}</div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-800 text-xs sm:text-sm">
                  {c.rate}
                </div>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">
            Spot FX rates synchronized with monetary authorities to eliminate conversion risk for sovereign partners.
          </p>
        </div>

        {/* System & Architecture Info */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Regional Engine Health</h3>
              <p className="text-xs text-slate-500">Microservices cluster & database connectivity</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-600">Core REST Backend:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Golang Gin v1.10 Online (Port 8080)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-600">Primary Database:</span>
              <span className="font-bold text-slate-900">MySQL InnoDB • hotels_db</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-600">Security Standard:</span>
              <span className="font-bold text-slate-900">JWT HMAC-SHA256 & BCrypt Cost 10</span>
            </div>
          </div>
        </div>

        {/* Security & Access Policy */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Superadmin Privilege Enforcement</h3>
              <p className="text-xs text-slate-500">Role-Based Access Control (RBAC)</p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            Superadmin privileges allow overriding hotel operational statuses, reviewing partnership agreements, cancelling bookings with automated refunding, and triggering wire disbursement transfers.
          </p>

          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium">
            🔒 Any financial action executed inside this console is immutably logged for fiscal auditing.
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Sliders, 
  Percent, 
  Coins, 
  Database, 
  ShieldCheck, 
  Server, 
  CheckCircle2 
} from 'lucide-react';

export default function PlatformSettings() {
  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Policy & Regional Rules</h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
            Regional Standard
          </span>
        </div>
        <p className="text-slate-500">
          Global commission rates, multi-currency conversion reference, and system telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commission Policy Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Standard Platform Take Rate</h3>
              <p className="text-[11px] text-slate-500">Uniform across all verified hotel partners</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">15.0%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Deducted automatically per confirmed checkout</div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs">
              Active Policy
            </span>
          </div>

          <p className="text-slate-500 leading-relaxed">
            Covers payment gateway processing fees, cross-border settlement, marketing customer acquisition, and 24/7 guest customer support.
          </p>
        </div>

        {/* Currency Rates Matrix */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cross-Border FX Conversion</h3>
              <p className="text-[11px] text-slate-500">Dynamic benchmark exchange rate</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">1 SGD (Singapore Dollar)</span>
              <span className="font-mono font-bold text-slate-900">≈ Rp 11,850 IDR</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">1 SGD (Singapore Dollar)</span>
              <span className="font-mono font-bold text-slate-900">≈ RM 3.48 MYR</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">1 MYR (Malaysian Ringgit)</span>
              <span className="font-mono font-bold text-slate-900">≈ Rp 3,405 IDR</span>
            </div>
          </div>
        </div>

        {/* Backend Infrastructure Telemetry */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">System Telemetry & Database Health</h3>
              <p className="text-[11px] text-slate-500">Connected services and runtime engine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">Database Engine</div>
                <div className="font-bold text-slate-800 text-xs">MySQL 8.0 (hotels_db)</div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">Backend API Gateway</div>
                <div className="font-bold text-slate-800 text-xs">Golang / Gin (:8080)</div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">JWT Token Security</div>
                <div className="font-bold text-slate-800 text-xs">HMAC-SHA256 (72h)</div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

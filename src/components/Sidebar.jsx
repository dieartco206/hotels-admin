import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  BookOpenCheck, 
  Landmark, 
  Sliders, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pendingCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Platform HQ', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties & Partners', icon: Building2, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'bookings', label: 'Master Reservations', icon: BookOpenCheck },
    { id: 'settlements', label: 'Settlement Audits', icon: Landmark },
    { id: 'settings', label: 'Platform Policy', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Control Tower
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security / System Summary Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Commission System</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Standard OTA distribution fee set at <span className="font-bold text-brand-600">15.0%</span> across Singapore, Indonesia, and Malaysia.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>HQ Engine v3.1</span>
        <span className="flex items-center gap-1 text-slate-500">
          <HelpCircle className="w-3.5 h-3.5" />
          Docs
        </span>
      </div>
    </aside>
  );
}

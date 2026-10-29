import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  BookOpenCheck, 
  Landmark, 
  Sliders, 
  HelpCircle,
  FileCheck2,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  pendingCount = 0,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { id: 'dashboard', label: 'Platform HQ', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties & Partners', icon: Building2, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'bookings', label: 'Master Reservations', icon: BookOpenCheck },
    { id: 'settlements', label: 'Settlement Audits', icon: Landmark },
    { id: 'settings', label: 'Platform Policy', icon: Sliders },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Mobile Header in Drawer */}
        <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-200">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Navigation Menu
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security / System Summary Box */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Commission Matrix</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Standard OTA distribution fee set at <span className="font-bold text-brand-600">15.0%</span> across Singapore, Indonesia, and Malaysia.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200/60 text-xs text-slate-400 flex items-center justify-between">
        <span className="font-mono text-[11px]">HQ Engine v3.2</span>
        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
          <HelpCircle className="w-3.5 h-3.5" />
          Docs
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed/Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 shrink-0 min-h-[calc(100vh-61px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

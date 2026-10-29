import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Bell, LogOut, Globe2, Activity, Menu, X, ChevronDown, Check } from 'lucide-react';

export const REGIONS = [
  { id: 'all', name: 'Semua Wilayah', flag: '🌐', short: 'Semua', currency: 'Multi-FX', label: 'Cross-Border 3 Negara' },
  { id: 'Indonesia', name: 'Indonesia', flag: '🇮🇩', short: 'ID', currency: 'IDR', label: 'Bali, Jakarta, Bandung, Jogja' },
  { id: 'Malaysia', name: 'Malaysia', flag: '🇲🇾', short: 'MY', currency: 'MYR', label: 'Kuala Lumpur, Penang, Langkawi' },
  { id: 'Singapore', name: 'Singapore', flag: '🇸🇬', short: 'SG', currency: 'SGD', label: 'Marina Bay, Sentosa, Bras Basah' },
];

export default function Navbar({ 
  user, 
  onLogout, 
  onToggleSidebar, 
  isSidebarOpen,
  selectedRegion = 'all',
  onSelectRegion
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRegion = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Clean Branding */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-base sm:text-lg shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base whitespace-nowrap">
                Hotels HQ
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 shrink-0">
                Superadmin
              </span>
            </div>
            {/* Hidden on mobile to prevent squishing */}
            <p className="hidden md:block text-[11px] text-slate-500 font-medium truncate">
              Regional Cross-Border OTA Platform
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 ml-3 pl-3 border-l border-slate-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-600 font-semibold">SG • MY • ID Live</span>
        </div>
      </div>

      {/* Right: Interactive Region Selector & Admin Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* 🌍 Interactive Global Region Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-bold text-slate-800 transition-all shadow-2xs cursor-pointer group"
            title="Pilih Wilayah Regional Operasional"
          >
            <span className="text-base sm:text-lg leading-none shrink-0">{currentRegion.flag}</span>
            <div className="text-left flex items-center gap-1 whitespace-nowrap">
              <span className="hidden sm:inline">{currentRegion.name}</span>
              <span className="sm:hidden text-xs">{currentRegion.short}</span>
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-extrabold rounded-md bg-white text-slate-600 border border-slate-200/60 uppercase">
                {currentRegion.currency}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                <span>Filter Wilayah Operasional</span>
                <span className="text-[10px] text-brand-600 font-bold">Pemisah Data</span>
              </div>

              <div className="space-y-1">
                {REGIONS.map((r) => {
                  const isSelected = selectedRegion === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        if (onSelectRegion) onSelectRegion(r.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected 
                          ? 'bg-slate-900 text-white font-bold shadow-xs' 
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{r.flag}</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold truncate flex items-center gap-1.5">
                            <span>{r.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {r.currency}
                            </span>
                          </div>
                          <div className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}>
                            {r.label}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 text-[10px] text-slate-400 leading-relaxed">
                💡 Memilih region akan otomatis mengisolasi hotel, booking, omzet, dan settlement ke negara tersebut.
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-3 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={user?.name || "Admin"}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <div className="hidden lg:block text-left text-xs">
              <div className="font-bold text-slate-900">{user?.name || "Superadmin Director"}</div>
              <div className="text-[11px] text-brand-600 font-semibold">Platform Owner</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

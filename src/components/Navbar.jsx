import React from 'react';
import { ShieldCheck, Bell, LogOut, Globe2, Activity, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout, onToggleSidebar, isSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle, Branding & Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-lg shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base">Hotels HQ</span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-amber-300">
                Superadmin Tower
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Regional Cross-Border OTA Platform</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-600 font-semibold">SG • MY • ID Online</span>
        </div>
      </div>

      {/* Right: Security & Admin Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
          <Globe2 className="w-3.5 h-3.5 text-brand-600" />
          <span>Multi-Currency Active</span>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={user?.name || "Admin"}
              className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <div className="hidden lg:block text-left text-xs">
              <div className="font-bold text-slate-900">{user?.name || "Superadmin Director"}</div>
              <div className="text-[11px] text-brand-600 font-semibold">Platform Owner</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

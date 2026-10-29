import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { adminApi } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPassword || password;

    if (!loginEmail || !loginPass) {
      setError('Please provide administrative credentials');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.login(loginEmail, loginPass);
      if (data.user?.role !== 'admin') {
        throw new Error('Access denied: You must be an administrator to access this console.');
      }
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickAdminLogin = () => {
    setEmail('admin@hotels.com');
    setPassword('admin123');
    handleLogin(null, 'admin@hotels.com', 'admin123');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-amber-400 shadow-md mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hotels Central HQ</h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">Platform Owner & Superadmin Control Tower</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-7 px-6 sm:px-8 rounded-2xl shadow-card border border-slate-200/80">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Superadmin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@hotels.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Administrative Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Authenticating Security...' : 'Enter Control Tower'}
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Quick Demo Preset */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={quickAdminLogin}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>One-Click Superadmin Demo</span>
                </div>
                <div className="text-[11px] text-slate-500">admin@hotels.com • Full Permissions</div>
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <KeyRound className="w-4 h-4 text-slate-500" />
          <span>Role-Based Access Control (RBAC) Enforced</span>
        </div>
      </div>
    </div>
  );
}

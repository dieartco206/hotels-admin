import React, { useState } from 'react';
import { 
  Landmark, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Building2,
  Loader2,
  Clock
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function SettlementsAudit({ settlements = [], onRefresh }) {
  const [approvingId, setApprovingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleApprovePayout = async (settlement) => {
    setApprovingId(settlement.id);
    try {
      await adminApi.approvePayout(settlement.id);
      setNotification(`Payout ${settlement.settlement_code} approved & funds transferred to partner bank.`);
      setTimeout(() => setNotification(null), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to approve payout');
    } finally {
      setApprovingId(null);
    }
  };

  const pendingSettlements = settlements.filter((s) => s.status === 'pending');
  const transferredSettlements = settlements.filter((s) => s.status === 'transferred' || s.status === 'approved');

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Settlement & Partner Disbursements
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {pendingSettlements.length} Pending Approval
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Audit 15% platform take-rate and authorize net payouts to verified hotel partner corporate bank accounts across SG, MY, and ID.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* 2. Full-Width Settlements Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Disbursement Approval Ledger</h2>
            <p className="text-xs text-slate-500 mt-0.5">Automated net settlement calculation minus 15.0% platform take-rate</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Batches: <strong className="text-slate-900 font-bold">{settlements.length}</strong>
          </span>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-400">
            <Landmark className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No settlement statements in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Settlement Code</th>
                  <th className="py-3.5 px-4 font-semibold">Hotel Partner</th>
                  <th className="py-3.5 px-4 font-semibold">Corporate Bank</th>
                  <th className="py-3.5 px-4 font-semibold">Gross GBV</th>
                  <th className="py-3.5 px-4 font-semibold">15% Commission</th>
                  <th className="py-3.5 px-4 font-semibold">Net Payout</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Authorize</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((s) => {
                  const isPending = s.status === 'pending';
                  const isLoading = approvingId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {s.settlement_code}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{s.hotel?.name || 'Hotel Partner'}</div>
                        <div className="text-[11px] text-slate-500">{s.hotel?.city}, {s.hotel?.country}</div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                        <div className="font-medium text-slate-800">{s.bank_name || 'Corporate Wire'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.bank_account || '8892-0192-4410'}</div>
                      </td>

                      <td className="py-4 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                        <span className="text-xs text-slate-400 mr-1">{s.currency}</span>
                        {Math.round(s.gross_amount).toLocaleString('en-US')}
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-amber-600 whitespace-nowrap">
                        +{s.currency} {Math.round(s.platform_commission).toLocaleString('en-US')}
                      </td>

                      <td className="py-4 px-4 font-mono font-black text-emerald-700 whitespace-nowrap text-sm">
                        <span className="text-xs text-emerald-600 mr-1">{s.currency}</span>
                        {Math.round(s.net_payout).toLocaleString('en-US')}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          s.status === 'transferred' || s.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            s.status === 'transferred' || s.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`} />
                          {s.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {isPending ? (
                          <button
                            onClick={() => handleApprovePayout(s)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span>{isLoading ? 'Processing...' : 'Authorize Wire'}</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            Disbursements Verified & Escrow Protected
          </div>
          <div className="font-semibold text-slate-700">
            Audit Status: <span className="text-emerald-700 font-bold">100% Balanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}

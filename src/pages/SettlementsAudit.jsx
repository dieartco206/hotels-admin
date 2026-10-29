import React, { useState } from 'react';
import { 
  Landmark, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { adminApi } from '../services/api';

export default function SettlementsAudit({ settlements, onRefresh }) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settlement & Partner Disbursements</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
              {pendingSettlements.length} Pending Approval
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Audit 15% platform take-rate and authorize net payouts to verified hotel partner corporate accounts.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Settlements Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-900">
          Disbursement Approval Ledger
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No settlement statements in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Settlement Code</th>
                  <th className="py-3 px-4 font-semibold">Hotel Partner</th>
                  <th className="py-3 px-4 font-semibold">Disbursement Bank</th>
                  <th className="py-3 px-4 font-semibold">Gross</th>
                  <th className="py-3 px-4 font-semibold">15% Commission</th>
                  <th className="py-3 px-4 font-semibold">Net Payout</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Authorize</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((s) => {
                  const isPending = s.status === 'pending';
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {s.settlement_code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{s.hotel?.name || 'Hotel Partner'}</div>
                        <div className="text-[11px] text-slate-400">{s.hotel?.city}, {s.hotel?.country}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{s.bank_name || 'Corporate Wire'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.bank_account || '8892-0192-4410'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {s.currency} {Math.round(s.gross_amount).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">
                        +{s.currency} {Math.round(s.platform_commission).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                        {s.currency} {Math.round(s.net_payout).toLocaleString('en-US')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          s.status === 'transferred' || s.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handleApprovePayout(s)}
                            disabled={approvingId === s.id}
                            className="flex items-center gap-1.5 ml-auto px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                          >
                            <Send className="w-3 h-3" />
                            <span>{approvingId === s.id ? 'Transferring...' : 'Release Payout'}</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-xs flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Transferred
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
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Check, X, ShieldOff, Shield, Clock, Plus, Ban, UserCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function SuppliersPage() {
  const { t, lang, suppliers, approveReceipt, rejectReceipt, toggleBlock, extendTrialDays } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = suppliers.filter(s => {
    if (filter === 'pending') return s.receipt && !s.receiptApproved;
    if (filter === 'blocked') return s.blocked;
    if (filter === 'active') return !s.blocked && (s.plan !== 'trial' || s.receiptApproved);
    return true;
  });

  const planBadge = (plan) => {
    const colors = {
      trial: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      standard: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    };
    return colors[plan] || colors.trial;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.suppliers} <span className="text-slate-400 font-normal">({suppliers.length})</span></h1>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : 'Tous' },
            { id: 'pending', label: lang === 'ar' ? 'بانتظار الدفع' : 'En attente' },
            { id: 'active', label: t.active },
            { id: 'blocked', label: t.blocked },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-md transition ${filter === f.id ? 'bg-white dark:bg-slate-700 shadow font-medium' : 'text-slate-600 dark:text-slate-400'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{lang === 'ar' ? 'المتجر' : 'Boutique'}</th>
                <th className="text-start px-4 py-3">Email</th>
                <th className="text-start px-4 py-3">{t.subscription}</th>
                <th className="text-start px-4 py-3">{lang === 'ar' ? 'الدفع' : 'Paiement'}</th>
                <th className="text-start px-4 py-3">{t.status}</th>
                <th className="text-start px-4 py-3">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(s => {
                const name = lang === 'fr' ? (s.storeNameFr || s.storeNameAr) : s.storeNameAr;
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-slate-500">{s.products.length} {t.products} · {s.orders.length} {t.orders}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" dir="ltr">{s.email}</td>
                    <td className="px-4 py-3"><span className={`badge ${planBadge(s.plan)}`}>{t['plan_' + s.plan]}</span></td>
                    <td className="px-4 py-3">
                      {s.plan === 'trial' ? (
                        <span className="text-xs text-slate-500">—</span>
                      ) : s.receiptApproved ? (
                        <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><Check size={12} /> {t.approve}</span>
                      ) : s.receipt ? (
                        <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"><Clock size={12} /> {t.pending}</span>
                      ) : (
                        <span className="text-xs text-red-500">{lang === 'ar' ? 'لم يرفع' : 'Non envoyé'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.blocked ? (
                        <span className="badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"><Ban size={12} /> {t.blocked}</span>
                      ) : (
                        <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><UserCheck size={12} /> {t.active}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {s.receipt && !s.receiptApproved && (
                          <>
                            <button onClick={() => approveReceipt(s.id)} className="btn-success !py-1 !px-2 text-xs" title={t.approve_receipt}><Check size={14} /></button>
                            <button onClick={() => rejectReceipt(s.id)} className="btn-danger !py-1 !px-2 text-xs" title={t.reject}><X size={14} /></button>
                          </>
                        )}
                        <button onClick={() => extendTrialDays(s.id, 7)} className="btn-secondary !py-1 !px-2 text-xs" title={t.extend_trial}><Plus size={14} /></button>
                        <button onClick={() => toggleBlock(s.id)} className={s.blocked ? 'btn-success !py-1 !px-2 text-xs' : 'btn-danger !py-1 !px-2 text-xs'} title={s.blocked ? t.unblock : t.block}>
                          {s.blocked ? <Shield size={14} /> : <ShieldOff size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">{t.no_data}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Package2, Users, Clock, Globe2, Receipt, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext.jsx';

export default function AdminOverview() {
  const { t, lang, suppliers, announcements } = useApp();

  const totalSuppliers = suppliers.length;
  const blocked = suppliers.filter(s => s.blocked).length;
  const pendingReceipts = suppliers.filter(s => s.receipt && !s.receiptApproved).length;
  const pendingDomains = suppliers.filter(s => s.domainStatus === 'pending').length;
  const trialExpired = suppliers.filter(s => s.plan === 'trial' && new Date(s.planStart) < new Date(Date.now() - 7 * 86400000)).length;

  const StatCard = ({ icon: Icon, label, value, color, to }) => {
    const inner = (
      <div className="card p-5 hover:shadow-lg transition flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl grid place-items-center ${color}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
    return to ? <Link to={to} className="block">{inner}</Link> : inner;
  };

  const recentReceipts = suppliers.filter(s => s.receipt && !s.receiptApproved).slice(0, 5);
  const recentDomains = suppliers.filter(s => s.domainStatus === 'pending').slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t.admin_dashboard} 🛡️</h1>
        <p className="text-sm text-slate-500 mt-1">{lang === 'ar' ? 'نظرة عامة على المنصة والموردين.' : 'Vue d\'ensemble de la plateforme et des fournisseurs.'}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label={t.suppliers} value={totalSuppliers} color="bg-blue-100 dark:bg-blue-900/40 text-blue-600" to="/admin/suppliers" />
        <StatCard icon={Receipt} label={lang === 'ar' ? 'إشعارات في الانتظار' : 'Reçus en attente'} value={pendingReceipts} color="bg-amber-100 dark:bg-amber-900/40 text-amber-600" to="/admin/suppliers" />
        <StatCard icon={Globe2} label={t.domain_requests} value={pendingDomains} color="bg-purple-100 dark:bg-purple-900/40 text-purple-600" to="/admin/domains" />
        <StatCard icon={AlertCircle} label={lang === 'ar' ? 'محظورون' : 'Bloqués'} value={blocked} color="bg-red-100 dark:bg-red-900/40 text-red-600" to="/admin/suppliers" />
        <StatCard icon={Clock} label={lang === 'ar' ? 'تجارب منتهية' : 'Essais expirés'} value={trialExpired} color="bg-slate-100 dark:bg-slate-800 text-slate-600" to="/admin/suppliers" />
        <StatCard icon={Package2} label={lang === 'ar' ? 'إعلانات منشورة' : 'Annonces publiées'} value={announcements.length} color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600" to="/admin/announcements" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">{lang === 'ar' ? 'إشعارات الدفع قيد المراجعة' : 'Reçus à valider'}</h3>
            <Link to="/admin/suppliers" className="text-sm text-brand-600 hover:underline">
              {lang === 'ar' ? 'عرض الكل' : 'Voir tout'} →
            </Link>
          </div>
          {recentReceipts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{t.no_data}</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentReceipts.map(s => (
                <li key={s.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{lang === 'fr' ? s.storeNameFr : s.storeNameAr}</p>
                    <p className="text-xs text-slate-500">{t['plan_' + s.plan]} · <span dir="ltr">{s.email}</span></p>
                  </div>
                  <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{t.pending}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">{t.domain_requests}</h3>
            <Link to="/admin/domains" className="text-sm text-brand-600 hover:underline">
              {lang === 'ar' ? 'عرض الكل' : 'Voir tout'} →
            </Link>
          </div>
          {recentDomains.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{t.no_data}</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentDomains.map(s => (
                <li key={s.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-brand-600 truncate" dir="ltr">{s.customDomain}</p>
                    <p className="text-xs text-slate-500 truncate">{lang === 'fr' ? s.storeNameFr : s.storeNameAr}</p>
                  </div>
                  <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{t.pending}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

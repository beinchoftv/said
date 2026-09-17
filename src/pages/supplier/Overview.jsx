import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Clock, TrendingUp, Send, ExternalLink, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';
import { useMemo, useState } from 'react';

export default function Overview() {
  const { t, lang, currentSupplier, trialDaysLeft } = useApp();
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (!currentSupplier) return { products: 0, orders: 0, pending: 0, revenue: 0 };
    const products = currentSupplier.products.length;
    const orders = currentSupplier.orders.length;
    const pending = currentSupplier.orders.filter(o => o.status === 'pending').length;
    const revenue = currentSupplier.orders
      .filter(o => o.status === 'confirmed' || o.status === 'shipped')
      .reduce((sum, o) => {
        const orderTotal = o.items.reduce((s, it) => {
          const p = currentSupplier.products.find(pp => pp.id === it.productId);
          return s + (p ? p.wholesalePrice * it.qty : 0);
        }, 0);
        return sum + orderTotal;
      }, 0);
    return { products, orders, pending, revenue };
  }, [currentSupplier]);

  if (!currentSupplier) return null;

  const daysLeft = trialDaysLeft(currentSupplier);
  const catalogUrl = `${window.location.origin}/catalog/${currentSupplier.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(catalogUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Export pending orders as WhatsApp message
  const exportToWhatsApp = () => {
    const pending = currentSupplier.orders.filter(o => o.status === 'pending');
    const lines = pending.map(o => {
      const items = o.items.map(it => {
        const p = currentSupplier.products.find(pp => pp.id === it.productId);
        const name = lang === 'fr' ? (p?.nameFr || p?.nameAr) : (p?.nameAr || p?.nameFr);
        return `- ${name} x${it.qty}`;
      }).join('\n');
      return `👤 ${o.customerName} (${o.customerCityAr})\n📞 ${o.customerPhone}\n${items}\n`;
    }).join('\n---\n');
    const text = lang === 'ar'
      ? `📦 *قائمة الطلبيات المعلقة*\n\n${lines}`
      : `📦 *Commandes en attente*\n\n${lines}`;
    window.open(`https://wa.me/${currentSupplier.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl grid place-items-center ${color}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{t.welcome_back}, {lang === 'fr' ? currentSupplier.storeNameFr : currentSupplier.storeNameAr} 👋</h1>
        <p className="text-sm text-slate-500 mt-1">
          {currentSupplier.plan === 'trial' && daysLeft > 0 && t.trial_days_left.replace('{days}', daysLeft)}
          {currentSupplier.plan !== 'trial' && (currentSupplier.receiptApproved ? lang === 'ar' ? `الباقة الحالية: ${t['plan_' + currentSupplier.plan]}` : `Forfait actuel : ${t['plan_' + currentSupplier.plan]}` : t.waiting_approval)}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label={t.total_products} value={stats.products} color="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" />
        <StatCard icon={ShoppingCart} label={t.total_orders} value={stats.orders} color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={Clock} label={t.pending_orders} value={stats.pending} color="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" />
        <StatCard icon={TrendingUp} label={t.total_revenue} value={`${stats.revenue} MAD`} color="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" />
      </div>

      {/* Quick actions */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <QrCode size={20} className="text-brand-600" />
            <h3 className="font-bold text-lg">{lang === 'ar' ? 'كتالوجك العام' : 'Votre catalogue public'}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {lang === 'ar' ? 'شارك هذا الرابط مع تجار التجزئة ليتمكنوا من تصفح منتجاتك وإرسال الطلبات مباشرة عبر واتساب.' : 'Partagez ce lien avec les détaillants pour qu\'ils parcourent vos produits et envoient des commandes via WhatsApp.'}
          </p>
          <div className="flex gap-2 flex-wrap">
            <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono truncate" dir="ltr">{catalogUrl}</code>
            <button onClick={copyLink} className="btn-secondary !py-2">
              {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? t.copied : t.copy_catalog}
            </button>
            <Link to={`/catalog/${currentSupplier.id}`} target="_blank" className="btn-primary !py-2">
              <ExternalLink size={16} /> {t.view_catalog}
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Send size={20} className="text-whatsapp" />
            <h3 className="font-bold text-lg">{lang === 'ar' ? 'تصدير سريع للواتساب' : 'Export rapide WhatsApp'}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {lang === 'ar' ? 'أرسل قائمة الطلبيات المعلقة إلى واتسابك أو لفريقك بنقرة واحدة.' : 'Envoyez la liste des commandes en attente à votre WhatsApp ou votre équipe en un clic.'}
          </p>
          <button onClick={exportToWhatsApp} className="btn-whatsapp w-full !py-2.5">
            <Send size={16} /> {t.export_orders}
          </button>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="p-5 flex items-center justify-between">
          <h3 className="font-bold text-lg">{t.orders}</h3>
          <Link to="/dashboard/orders" className="text-sm text-brand-600 hover:underline">
            {lang === 'ar' ? 'عرض الكل' : 'Voir tout'} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-start px-5 py-3">{t.customer}</th>
                <th className="text-start px-5 py-3">{t.city}</th>
                <th className="text-start px-5 py-3">{t.total}</th>
                <th className="text-start px-5 py-3">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentSupplier.orders.slice(0, 5).map(o => {
                const total = o.items.reduce((s, it) => {
                  const p = currentSupplier.products.find(pp => pp.id === it.productId);
                  return s + (p ? p.wholesalePrice * it.qty : 0);
                }, 0);
                const statusColor = {
                  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
                  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
                  shipped: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
                }[o.status];
                return (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3">
                      <div className="font-medium">{lang === 'fr' ? o.customerNameFr : o.customerName}</div>
                      <div className="text-xs text-slate-500" dir="ltr">{o.customerPhone}</div>
                    </td>
                    <td className="px-5 py-3">{lang === 'fr' ? o.customerCityFr : o.customerCityAr}</td>
                    <td className="px-5 py-3 font-semibold">{total} MAD</td>
                    <td className="px-5 py-3"><span className={`badge ${statusColor}`}>{t[o.status]}</span></td>
                  </tr>
                );
              })}
              {currentSupplier.orders.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">{t.no_data}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

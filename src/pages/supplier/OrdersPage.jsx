import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Truck, XCircle, Send, FileText, MessageCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function OrdersPage() {
  const { t, lang, currentSupplier, updateOrderStatus } = useApp();

  if (!currentSupplier) return null;

  const sendOrderWhatsApp = (o) => {
    const lines = o.items.map(it => {
      const p = currentSupplier.products.find(pp => pp.id === it.productId);
      const name = lang === 'fr' ? (p?.nameFr || p?.nameAr) : (p?.nameAr || p?.nameFr);
      const price = p?.wholesalePrice || 0;
      return `• ${name} x${it.qty} = ${price * it.qty} MAD`;
    }).join('\n');
    const total = o.items.reduce((s, it) => {
      const p = currentSupplier.products.find(pp => pp.id === it.productId);
      return s + (p ? p.wholesalePrice * it.qty : 0);
    }, 0);
    const intro = lang === 'ar'
      ? `📦 *تفاصيل الطلبية*\n👤 ${o.customerName}\n📞 ${o.customerPhone}\n📍 ${o.customerCityAr}\n\n${lines}\n\n💰 *المجموع:* ${total} MAD`
      : `📦 *Détails de la commande*\n👤 ${o.customerNameFr || o.customerName}\n📞 ${o.customerPhone}\n📍 ${o.customerCityFr || o.customerCityAr}\n\n${lines}\n\n💰 *Total:* ${total} MAD`;
    window.open(`https://wa.me/${o.customerPhone}?text=${encodeURIComponent(intro)}`, '_blank');
  };

  const statusColor = (s) => ({
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    shipped: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  }[s]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">{t.orders} <span className="text-slate-400 font-normal">({currentSupplier.orders.length})</span></h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-start px-4 py-3">{t.customer}</th>
                <th className="text-start px-4 py-3">{t.city}</th>
                <th className="text-start px-4 py-3">{t.products}</th>
                <th className="text-start px-4 py-3">{t.total}</th>
                <th className="text-start px-4 py-3">{t.date}</th>
                <th className="text-start px-4 py-3">{t.status}</th>
                <th className="text-start px-4 py-3">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentSupplier.orders.map(o => {
                const total = o.items.reduce((s, it) => {
                  const p = currentSupplier.products.find(pp => pp.id === it.productId);
                  return s + (p ? p.wholesalePrice * it.qty : 0);
                }, 0);
                const itemsPreview = o.items.slice(0, 2).map(it => {
                  const p = currentSupplier.products.find(pp => pp.id === it.productId);
                  const n = lang === 'fr' ? (p?.nameFr || p?.nameAr) : (p?.nameAr || p?.nameFr);
                  return `${n} x${it.qty}`;
                }).join(' · ') + (o.items.length > 2 ? ` +${o.items.length - 2}` : '');
                return (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium">{lang === 'fr' ? o.customerNameFr : o.customerName}</div>
                      <a href={`tel:${o.customerPhone}`} className="text-xs text-brand-600" dir="ltr">{o.customerPhone}</a>
                    </td>
                    <td className="px-4 py-3">{lang === 'fr' ? o.customerCityFr : o.customerCityAr}</td>
                    <td className="px-4 py-3 max-w-xs text-slate-600 dark:text-slate-400 text-xs">{itemsPreview}</td>
                    <td className="px-4 py-3 font-semibold">{total} MAD</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA')}</td>
                    <td className="px-4 py-3"><span className={`badge ${statusColor(o.status)}`}>{t[o.status]}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {o.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(currentSupplier.id, o.id, 'confirmed')} className="btn-secondary !p-2" title={t.confirm}><Check size={14} /></button>
                        )}
                        {o.status === 'confirmed' && (
                          <button onClick={() => updateOrderStatus(currentSupplier.id, o.id, 'shipped')} className="btn-secondary !p-2" title={t.ship}><Truck size={14} /></button>
                        )}
                        {(o.status === 'pending' || o.status === 'confirmed') && (
                          <button onClick={() => updateOrderStatus(currentSupplier.id, o.id, 'cancelled')} className="btn-ghost !p-2 text-red-600" title={t.cancel}><XCircle size={14} /></button>
                        )}
                        <button onClick={() => sendOrderWhatsApp(o)} className="btn-whatsapp !p-2" title={t.send_whatsapp}><MessageCircle size={14} /></button>
                        <Link to={`/invoice/${currentSupplier.id}/${o.id}`} target="_blank" className="btn-secondary !p-2" title={t.generate_invoice}><FileText size={14} /></Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentSupplier.orders.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">{t.no_data}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

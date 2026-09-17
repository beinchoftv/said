import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Package2, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext.jsx';

export default function InvoicePage() {
  const { supplierId, orderId } = useParams();
  const { lang, suppliers } = useApp();
  const supplier = suppliers.find(s => s.id === supplierId);
  const order = supplier?.orders.find(o => o.id === orderId);

  if (!supplier || !order) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-center">
          <Package2 size={48} className="mx-auto text-slate-400 mb-3" />
          <p className="mb-4">{lang === 'ar' ? 'الفاتورة غير موجودة' : 'Facture introuvable'}</p>
          <Link to="/dashboard" className="btn-primary">{lang === 'ar' ? 'العودة للوحة التحكم' : 'Retour au tableau de bord'}</Link>
        </div>
      </div>
    );
  }

  const storeName = lang === 'fr' ? (supplier.storeNameFr || supplier.storeNameAr) : (supplier.storeNameAr || supplier.storeNameAr);
  const customerName = lang === 'fr' ? (order.customerNameFr || order.customerName) : order.customerName;
  const city = lang === 'fr' ? (order.customerCityFr || order.customerCityAr) : order.customerCityAr;
  const items = order.items.map(it => {
    const p = supplier.products.find(pp => pp.id === it.productId);
    return { p, qty: it.qty, lineTotal: (p?.wholesalePrice || 0) * it.qty };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const vat = 0;
  const total = subtotal + vat;
  const today = new Date(order.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-8 no-print:bg-slate-100">
      <div className="no-print max-w-4xl mx-auto mb-4 flex items-center justify-between gap-3">
        <Link to="/dashboard/orders" className="btn-secondary"><ArrowLeft size={16} /> {lang === 'ar' ? 'رجوع' : 'Retour'}</Link>
        <button onClick={() => window.print()} className="btn-primary"><Printer size={16} /> {lang === 'ar' ? 'طباعة' : 'Imprimer'}</button>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-10 rounded-lg shadow-sm print:shadow-none print:p-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b-2 border-slate-900 dark:border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-600">{storeName}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {lang === 'ar' ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc'} · <span dir="ltr">{supplier.whatsapp}</span>
            </p>
          </div>
          <div className="text-start" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-4xl font-extrabold">{lang === 'ar' ? 'فاتورة' : 'FACTURE'}</h2>
            <p className="text-sm mt-2"><b>{lang === 'ar' ? 'رقم الفاتورة:' : 'N° :'}</b> INV-{orderId.slice(-6).toUpperCase()}</p>
            <p className="text-sm"><b>{lang === 'ar' ? 'التاريخ:' : 'Date :'}</b> {today}</p>
            <p className="text-sm"><b>{lang === 'ar' ? 'الحالة:' : 'Statut :'}</b> {order.status}</p>
          </div>
        </div>

        <div className="py-6 grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase text-slate-500 font-bold mb-1">{lang === 'ar' ? 'إلى:' : 'Facturé à :'}</p>
            <p className="font-semibold">{customerName}</p>
            <p className="text-sm">{city}</p>
            <p className="text-sm" dir="ltr">{order.customerPhone}</p>
          </div>
          <div className="sm:text-end">
            <p className="text-xs uppercase text-slate-500 font-bold mb-1">{lang === 'ar' ? 'من:' : 'De :'}</p>
            <p className="font-semibold">{storeName}</p>
            <p className="text-sm" dir="ltr">{supplier.email}</p>
          </div>
        </div>

        <table className="w-full text-sm border-t border-slate-200 dark:border-slate-700">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <th className="py-3 text-start">{lang === 'ar' ? 'المنتج' : 'Produit'}</th>
              <th className="py-3 text-center">{lang === 'ar' ? 'الكمية' : 'Qté'}</th>
              <th className="py-3 text-end">{lang === 'ar' ? 'السعر' : 'Prix'}</th>
              <th className="py-3 text-end">{lang === 'ar' ? 'المجموع' : 'Total'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((i, idx) => {
              const name = lang === 'fr' ? (i.p?.nameFr || i.p?.nameAr) : (i.p?.nameAr || i.p?.nameFr);
              return (
                <tr key={idx}>
                  <td className="py-3">{name || '—'}</td>
                  <td className="py-3 text-center">{i.qty}</td>
                  <td className="py-3 text-end">{i.p?.wholesalePrice || 0} MAD</td>
                  <td className="py-3 text-end font-semibold">{i.lineTotal} MAD</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900 dark:border-slate-100">
              <td colSpan={3} className="py-3 text-end font-semibold">{t.subtotal}</td>
              <td className="py-3 text-end">{subtotal} MAD</td>
            </tr>
            <tr>
              <td colSpan={3} className="py-2 text-end text-slate-500">TVA</td>
              <td className="py-2 text-end">{vat} MAD</td>
            </tr>
            <tr className="text-lg font-bold">
              <td colSpan={3} className="py-3 text-end">{t.total}</td>
              <td className="py-3 text-end text-brand-600">{total} MAD</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
          {lang === 'ar'
            ? 'شكراً لتعاملكم معنا · هذه الفاتورة صالحة كإثبات شراء.'
            : 'Merci pour votre confiance · Cette facture fait office de preuve d\'achat.'}
        </div>
      </div>
    </div>
  );
}

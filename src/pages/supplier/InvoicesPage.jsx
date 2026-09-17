import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Printer } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function InvoicesPage() {
  const { t, lang, currentSupplier } = useApp();
  if (!currentSupplier) return null;
  const billable = currentSupplier.orders.filter(o => o.status !== 'cancelled');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">{t.invoices}</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs uppercase">
              <tr>
                <th className="text-start px-5 py-3">#</th>
                <th className="text-start px-5 py-3">{t.customer}</th>
                <th className="text-start px-5 py-3">{t.date}</th>
                <th className="text-start px-5 py-3">{t.total}</th>
                <th className="text-start px-5 py-3">{t.status}</th>
                <th className="text-start px-5 py-3">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {billable.map((o, i) => {
                const total = o.items.reduce((s, it) => {
                  const p = currentSupplier.products.find(pp => pp.id === it.productId);
                  return s + (p ? p.wholesalePrice * it.qty : 0);
                }, 0);
                return (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono">INV-{String(i + 1).padStart(4, '0')}</td>
                    <td className="px-5 py-3 font-medium">{lang === 'fr' ? o.customerNameFr : o.customerName}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA')}</td>
                    <td className="px-5 py-3 font-semibold">{total} MAD</td>
                    <td className="px-5 py-3"><span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{t[o.status]}</span></td>
                    <td className="px-5 py-3">
                      <Link to={`/invoice/${currentSupplier.id}/${o.id}`} target="_blank" className="btn-secondary !py-1.5 text-xs">
                        <Printer size={14} /> {t.view_invoice}
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {billable.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">{t.no_data}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Package2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext.jsx';
import LegalModal from './LegalModal.jsx';

export default function Footer() {
  const { t } = useApp();
  const [modal, setModal] = useState(null); // 'privacy' | 'terms' | null

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center">
              <Package2 size={20} />
            </div>
            <span>{t.brand}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.footer_about}</p>
          <p className="text-xs text-slate-500">🇲🇦 Made in Morocco · 2026</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t.product_col}</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><a href="/#pricing" className="hover:text-brand-600">{t.pricing}</a></li>
            <li><a href="/" className="hover:text-brand-600">{t.catalog}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t.company_col}</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><a href="/" className="hover:text-brand-600">{t.about_us}</a></li>
            <li><a href="/" className="hover:text-brand-600">{t.contact_us}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t.legal_col}</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><button onClick={() => setModal('privacy')} className="hover:text-brand-600">{t.privacy_policy}</button></li>
            <li><button onClick={() => setModal('terms')} className="hover:text-brand-600">{t.terms_of_service}</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {t.brand} — {t.all_rights_reserved}
      </div>
      {modal && <LegalModal type={modal} onClose={() => setModal(null)} />}
    </footer>
  );
}

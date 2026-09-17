import React, { useState } from 'react';
import { Save, Store, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function SettingsPage() {
  const { t, lang, currentSupplier, updateProfile } = useApp();
  const [form, setForm] = useState({
    storeNameAr: currentSupplier?.storeNameAr || '',
    storeNameFr: currentSupplier?.storeNameFr || '',
    email: currentSupplier?.email || '',
    whatsapp: currentSupplier?.whatsapp || '',
  });
  const [saved, setSaved] = useState(false);

  if (!currentSupplier) return null;

  const submit = (e) => {
    e.preventDefault();
    updateProfile(currentSupplier.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold">{t.profile_settings}</h1>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t.store_name} (AR)</label>
            <div className="relative">
              <Store size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
              <input className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.storeNameAr} onChange={onChange('storeNameAr')} />
            </div>
          </div>
          <div>
            <label className="label">{t.store_name} (FR)</label>
            <div className="relative">
              <Store size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
              <input className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.storeNameFr} onChange={onChange('storeNameFr')} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
              <input type="email" className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.email} onChange={onChange('email')} dir="ltr" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label">{t.store_phone}</label>
            <div className="relative">
              <Phone size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
              <input type="tel" className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.whatsapp} onChange={onChange('whatsapp')} dir="ltr" placeholder="212661234567+" />
            </div>
            <p className="text-xs text-slate-500 mt-1">{t.store_phone_help}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-sm text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> {lang === 'ar' ? 'تم الحفظ' : 'Enregistré'}
            </span>
          )}
          <button type="submit" className="btn-primary">
            <Save size={16} /> {t.save_changes}
          </button>
        </div>
      </form>

      <div className="card p-6 text-sm text-slate-500 bg-slate-50 dark:bg-slate-900/50">
        <p className="mb-1"><b>{t.subscription}:</b> {t['plan_' + currentSupplier.plan]}</p>
        <p><b>{lang === 'ar' ? 'معرف المورد:' : 'ID Fournisseur:'}</b> <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded" dir="ltr">{currentSupplier.id}</code></p>
      </div>
    </div>
  );
}

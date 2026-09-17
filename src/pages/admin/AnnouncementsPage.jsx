import React, { useState } from 'react';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function AnnouncementsPage() {
  const { t, lang, announcements, publishAnnouncement } = useApp();
  const [ar, setAr] = useState('');
  const [fr, setFr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!ar.trim() && !fr.trim()) return;
    publishAnnouncement(ar.trim() || fr.trim(), fr.trim() || ar.trim());
    setAr(''); setFr('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">{t.announcements}</h1>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Megaphone size={20} className="text-brand-600" />
          <h3 className="font-bold">{t.new_announcement}</h3>
        </div>
        <div>
          <label className="label">العربية</label>
          <textarea className="input min-h-[80px]" value={ar} onChange={e => setAr(e.target.value)} placeholder="اكتب الإعلان بالعربية..." />
        </div>
        <div>
          <label className="label">Français</label>
          <textarea className="input min-h-[80px]" dir="ltr" value={fr} onChange={e => setFr(e.target.value)} placeholder="Écrivez l'annonce en français..." />
        </div>
        <button type="submit" className="btn-primary">
          <Send size={16} /> {t.publish}
        </button>
      </form>

      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="card p-4 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 grid place-items-center flex-shrink-0">
              <Megaphone size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" dir="rtl">{a.textAr}</p>
              {a.textFr && a.textFr !== a.textAr && <p className="text-sm text-slate-500 mt-1" dir="ltr">{a.textFr}</p>}
              <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString(lang === 'fr' ? 'fr-FR' : 'ar-MA')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

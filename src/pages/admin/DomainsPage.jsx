import React from 'react';
import { Check, X, Globe2, ExternalLink } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function DomainsPage() {
  const { t, lang, suppliers, approveDomain, rejectDomain } = useApp();
  const requested = suppliers.filter(s => s.domainStatus === 'pending');
  const active = suppliers.filter(s => s.domainStatus === 'active');

  const DomainRow = ({ s, pending }) => {
    const name = lang === 'fr' ? (s.storeNameFr || s.storeNameAr) : s.storeNameAr;
    return (
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 grid place-items-center flex-shrink-0">
          <Globe2 size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-brand-600 font-semibold truncate" dir="ltr">{s.customDomain}</div>
          <div className="text-sm text-slate-500 truncate">{name} · <span className="font-mono">{s.email}</span></div>
        </div>
        {pending ? (
          <div className="flex gap-2">
            <button onClick={() => approveDomain(s.id)} className="btn-success !py-2"><Check size={16} /> {t.approve_domain}</button>
            <button onClick={() => rejectDomain(s.id)} className="btn-danger !py-2"><X size={16} /> {t.reject}</button>
          </div>
        ) : (
          <a href={`https://${s.customDomain}`} target="_blank" rel="noopener" className="btn-secondary !py-2">
            <ExternalLink size={16} /> {t.preview_catalog}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">{t.domain_requests}</h1>

      <section>
        <h2 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">{t.pending} ({requested.length})</h2>
        {requested.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">{t.no_data}</div>
        ) : (
          <div className="space-y-3">{requested.map(s => <DomainRow key={s.id} s={s} pending />)}</div>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">{t.domain_active} ({active.length})</h2>
        {active.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">{t.no_data}</div>
        ) : (
          <div className="space-y-3">{active.map(s => <DomainRow key={s.id} s={s} pending={false} />)}</div>
        )}
      </section>
    </div>
  );
}

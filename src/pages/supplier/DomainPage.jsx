import React, { useState } from 'react';
import { Globe2, CheckCircle2, Clock, AlertTriangle, ExternalLink, Lock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext.jsx';

export default function DomainPage() {
  const { t, lang, currentSupplier, requestDomain } = useApp();
  const [domain, setDomain] = useState(currentSupplier?.customDomain || '');

  if (!currentSupplier) return null;
  const isEnterprise = currentSupplier.plan === 'enterprise' && currentSupplier.receiptApproved;

  const submit = (e) => {
    e.preventDefault();
    if (!domain) return;
    requestDomain(currentSupplier.id, domain.trim().toLowerCase());
  };

  const previewUrl = currentSupplier.domainStatus === 'active' && currentSupplier.customDomain
    ? `https://${currentSupplier.customDomain}`
    : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">{t.domain_title}</h1>
      <p className="text-slate-600 dark:text-slate-400">{t.domain_subtitle}</p>

      {!isEnterprise ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 grid place-items-center mx-auto mb-4">
            <Lock size={28} />
          </div>
          <h3 className="text-lg font-bold mb-2">{lang === 'ar' ? 'هذه الميزة متاحة في الباقة المتقدمة فقط' : 'Fonctionnalité réservée au forfait Enterprise'}</h3>
          <p className="text-slate-500 mb-4">{lang === 'ar' ? 'قم بالترقية إلى باقة Enterprise لتمكين ربط الدومين الخاص.' : 'Passez au forfait Enterprise pour activer votre domaine personnalisé.'}</p>
          <Link to="/payment" className="btn-primary">{t.upgrade_for_domain}</Link>
        </div>
      ) : (
        <>
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe2 size={20} className="text-brand-600" />
              <h3 className="font-bold">{t.domain_title}</h3>
              {currentSupplier.domainStatus === 'active' && (
                <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ms-auto">
                  <CheckCircle2 size={12} /> {t.domain_active}
                </span>
              )}
              {currentSupplier.domainStatus === 'pending' && (
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ms-auto">
                  <Clock size={12} /> {t.domain_pending}
                </span>
              )}
              {currentSupplier.domainStatus === 'none' && (
                <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ms-auto">
                  {t.domain_none}
                </span>
              )}
            </div>

            {currentSupplier.domainStatus === 'active' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <div className="font-semibold" dir="ltr">{currentSupplier.customDomain}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{lang === 'ar' ? 'دومينك نشط ويعمل الآن.' : 'Votre domaine est actif.'}</p>
                  </div>
                  <a href={previewUrl} target="_blank" rel="noopener" className="btn-secondary !py-1.5 text-sm">
                    <ExternalLink size={14} /> {t.preview_catalog}
                  </a>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm">
                  <p className="font-semibold mb-2">🎨 {lang === 'ar' ? 'معاينة افتراضية' : 'Aperçu simulé'}</p>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-mono flex items-center gap-2 border-b border-slate-200 dark:border-slate-700" dir="ltr">
                      <span className="text-emerald-600">🔒</span>
                      <span className="text-slate-600 dark:text-slate-400 truncate">{currentSupplier.customDomain}</span>
                    </div>
                    <iframe
                      src={`/catalog/${currentSupplier.id}?embedded=1`}
                      title="Catalog preview"
                      className="w-full h-80 border-0"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {currentSupplier.domainStatus === 'pending' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{t.waiting_approval}</span>
                  </div>
                )}
                <div>
                  <label className="label">{lang === 'ar' ? 'الدومين المطلوب' : 'Domaine demandé'}</label>
                  <div className="relative">
                    <Globe2 size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
                    <input
                      type="text"
                      required
                      placeholder={t.domain_placeholder}
                      dir="ltr"
                      className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'} font-mono`}
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{t.domain_help}</p>
                </div>
                <button type="submit" className="btn-primary">
                  <Send size={16} /> {t.request_domain}
                </button>
              </form>
            )}
          </div>

          <div className="card p-6 bg-slate-50 dark:bg-slate-900/50">
            <h4 className="font-semibold mb-3">{lang === 'ar' ? 'خطوات الربط (CNAME)' : 'Configuration CNAME'}</h4>
            <ol className="list-decimal list-inside text-sm space-y-2 text-slate-600 dark:text-slate-400">
              <li dir="ltr">Add a <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">CNAME</code> record: <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">catalog</code> → <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">cname.stockjomla.ma</code></li>
              <li>{lang === 'ar' ? 'انتظر حتى ينتشر DNS (قد يستغرق من ساعة إلى 24 ساعة).' : 'Attendez la propagation DNS (1h à 24h).'}</li>
              <li>{lang === 'ar' ? 'أدخل الدومين أعلاه واطلب الربط.' : 'Saisissez votre domaine ci-dessus et demandez le raccordement.'}</li>
              <li>{lang === 'ar' ? 'سيقوم المسؤول بمراجعة طلبك والموافقة عليه.' : 'L\'administrateur vérifiera et validera votre demande.'}</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

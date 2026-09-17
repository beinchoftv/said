import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle2, Building2, CreditCard, ChevronLeft, FileText, AlertCircle } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useApp } from '../contexts/AppContext.jsx';

export default function PaymentPage() {
  const { t, lang, currentSupplier, uploadReceipt, selectPlan } = useApp();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(currentSupplier?.plan && currentSupplier.plan !== 'trial' ? currentSupplier.plan : 'standard');
  const [fileName, setFileName] = useState(currentSupplier?.receipt?.name || '');
  const [submitted, setSubmitted] = useState(!!currentSupplier?.receipt);
  const fileRef = useRef(null);

  if (!currentSupplier) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="card p-8 text-center max-w-md">
            <AlertCircle size={48} className="mx-auto mb-4 text-amber-500" />
            <p className="mb-4">{lang === 'ar' ? 'يرجى تسجيل الدخول أولاً.' : 'Veuillez vous connecter d\'abord.'}</p>
            <button onClick={() => navigate('/login')} className="btn-primary">{t.login}</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const prices = { standard: 199, pro: 399, enterprise: 799 };
  const planNames = {
    standard: t.standard, pro: t.pro, enterprise: t.enterprise,
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName) return;
    selectPlan(currentSupplier.id, selectedPlan);
    uploadReceipt(currentSupplier.id, { name: fileName, size: 0 });
    setSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
          <ChevronLeft size={18} /> {t.go_back}
        </button>

        <h1 className="text-3xl font-bold mb-2">{t.payment_title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{t.payment_subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bank info */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 grid place-items-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{t.cih_bank}</h3>
                  <p className="text-xs text-slate-500">CIH BANK S.A.</p>
                </div>
              </div>
              <div className="space-y-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <div><span className="text-slate-500">{lang === 'ar' ? 'رقم الحساب (RIB):' : 'RIB :'}</span> <span dir="ltr">230 810 000000 0012345678 90</span></div>
                <div><span className="text-slate-500">IBAN:</span> <span dir="ltr">MA64 2308 1000 0000 1234 5678 9090</span></div>
                <div><span className="text-slate-500">SWIFT:</span> <span dir="ltr">CIHMMAMC</span></div>
                <div><span className="text-slate-500">{lang === 'ar' ? 'المستفيد:' : 'Bénéficiaire :'}</span> StockJomla SARL</div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 grid place-items-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{t.attijari}</h3>
                  <p className="text-xs text-slate-500">Attijariwafa Bank</p>
                </div>
              </div>
              <div className="space-y-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                <div><span className="text-slate-500">RIB:</span> <span dir="ltr">007 780 000000 0098765432 10</span></div>
                <div><span className="text-slate-500">IBAN:</span> <span dir="ltr">MA64 0077 8000 0000 9876 5432 1010</span></div>
                <div><span className="text-slate-500">SWIFT:</span> <span dir="ltr">BCMAMAMC</span></div>
                <div><span className="text-slate-500">{lang === 'ar' ? 'المستفيد:' : 'Bénéficiaire :'}</span> StockJomla SARL</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-6">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{t.receipt_uploaded}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t.waiting_approval}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">{lang === 'ar' ? 'اختر الباقة' : 'Choisir le forfait'}</label>
                  <select className="input" value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}>
                    {['standard', 'pro', 'enterprise'].map(p => (
                      <option key={p} value={p}>{planNames[p]} — {prices[p]} MAD/{t.per_month}</option>
                    ))}
                  </select>
                </div>
                <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
                  <span className="font-medium">{t.total}</span>
                  <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{prices[selectedPlan]} <small className="text-sm font-normal">MAD</small></span>
                </div>

                <div>
                  <label className="label">{t.upload_receipt}</label>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-brand-500 dark:hover:border-brand-500 transition">
                    <Upload size={28} className="text-slate-400" />
                    <span className="text-sm font-medium">{fileName || t.choose_file}</span>
                    <span className="text-xs text-slate-500">PDF / JPG / PNG</span>
                  </button>
                </div>

                <button type="submit" disabled={!fileName} className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FileText size={18} /> {t.submit_receipt}
                </button>
                <p className="text-xs text-slate-500 text-center">{lang === 'ar' ? 'ستتم مراجعة إشعار الدفع من طرف الإدارة خلال 24 ساعة.' : 'Le reçu sera validé par l\'administration sous 24h.'}</p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

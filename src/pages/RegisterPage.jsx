import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Package2, UserPlus, Store, Mail, Lock, Phone } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useApp } from '../contexts/AppContext.jsx';

export default function RegisterPage() {
  const { t, lang, registerSupplier } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prePlan = searchParams.get('plan') || 'trial';

  const [form, setForm] = useState({
    storeName: '',
    email: '',
    whatsapp: '212',
    password: '',
    plan: prePlan,
  });

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerSupplier({
      storeNameAr: form.storeName,
      storeNameFr: form.storeName,
      email: form.email,
      whatsapp: form.whatsapp,
      password: form.password,
      plan: form.plan,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="card w-full max-w-lg p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-600 text-white items-center justify-center mb-3">
              <Package2 size={28} />
            </div>
            <h1 className="text-2xl font-bold">{t.register}</h1>
            <p className="text-sm text-slate-500 mt-1">{lang === 'ar' ? 'أنشئ حسابك وابدأ تجربتك المجانية' : 'Créez votre compte et démarrez votre essai gratuit'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t.store_name}</label>
              <div className="relative">
                <Store size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
                <input required className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.storeName} onChange={onChange('storeName')} placeholder={lang === 'ar' ? 'متجر البركة' : 'Boutique Baraka'} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
                <input type="email" required dir="ltr" className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.email} onChange={onChange('email')} placeholder="you@brand.ma" />
              </div>
            </div>
            <div>
              <label className="label">{t.store_phone}</label>
              <div className="relative">
                <Phone size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
                <input type="tel" required dir="ltr" className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.whatsapp} onChange={onChange('whatsapp')} placeholder="212661234567+" />
              </div>
              <p className="text-xs text-slate-500 mt-1">{t.store_phone_help}</p>
            </div>
            <div>
              <label className="label">{lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}</label>
              <div className="relative">
                <Lock size={18} className={`absolute top-2.5 ${lang === 'ar' ? 'right-3' : 'left-3'} text-slate-400`} />
                <input type="password" required minLength={6} dir="ltr" className={`input ${lang === 'ar' ? 'pr-10' : 'pl-10'}`} value={form.password} onChange={onChange('password')} />
              </div>
            </div>
            <div>
              <label className="label">{lang === 'ar' ? 'الباقة المختارة' : 'Forfait choisi'}</label>
              <select className="input" value={form.plan} onChange={onChange('plan')}>
                <option value="trial">🎁 {t.free_trial} (0 MAD)</option>
                <option value="standard">{t.standard} — 199 MAD</option>
                <option value="pro">{t.pro} — 399 MAD</option>
                <option value="enterprise">{t.enterprise} — 799 MAD</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full py-2.5">
              <UserPlus size={18} /> {t.register}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Vous avez déjà un compte ?'}{' '}
            <Link to="/login" className="text-brand-600 hover:underline font-medium">{t.login}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

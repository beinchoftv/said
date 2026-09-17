import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package2, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useApp } from '../contexts/AppContext.jsx';

export default function LoginPage() {
  const { t, lang, loginSupplier, loginAdmin } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState('supplier'); // supplier | admin
  const [email, setEmail] = useState('demo@stockjomla.ma');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (role === 'supplier') {
      const res = loginSupplier(email, password);
      if (res.ok) return navigate('/dashboard');
      if (res.error === 'blocked') setError(lang === 'ar' ? 'تم حظر هذا الحساب. تواصل مع الإدارة.' : 'Ce compte est bloqué. Contactez l\'administration.');
      else setError(lang === 'ar' ? 'بيانات الدخول غير صحيحة. جرب demo@stockjomla.ma / demo123' : 'Identifiants incorrects. Essayez demo@stockjomla.ma / demo123');
    } else {
      if (loginAdmin(email, password).ok) return navigate('/admin');
      setError(lang === 'ar' ? 'بيانات المسؤول غير صحيحة. جرب admin@stockjomla.ma / admin123' : 'Identifiants admin incorrects. Essayez admin@stockjomla.ma / admin123');
    }
  };

  const fillAdmin = () => {
    setRole('admin');
    setEmail('admin@stockjomla.ma');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="card w-full max-w-md p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-600 text-white items-center justify-center mb-3">
              <Package2 size={28} />
            </div>
            <h1 className="text-2xl font-bold">{t.login}</h1>
            <p className="text-sm text-slate-500 mt-1">{t.tagline}</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setRole('supplier')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'supplier' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {lang === 'ar' ? 'مورد' : 'Fournisseur'}
            </button>
            <button
              type="button"
              onClick={fillAdmin}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'admin' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {lang === 'ar' ? 'مسؤول' : 'Administrateur'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} dir="ltr" />
            </div>
            <div>
              <label className="label">{lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}</label>
              <input type="password" required className="input" value={password} onChange={e => setPassword(e.target.value)} dir="ltr" />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-800">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-2.5">
              <LogIn size={18} /> {t.login}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            {lang === 'ar' ? 'ليس لديك حساب؟' : 'Pas encore de compte ?'}{' '}
            <Link to="/register" className="text-brand-600 hover:underline font-medium inline-flex items-center gap-1">
              <UserPlus size={14} /> {t.register}
            </Link>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'ar' ? 'حسابات تجريبية:' : 'Comptes de démo :'}</div>
            <div>👤 {lang === 'ar' ? 'مورد' : 'Fournisseur'}: <code className="text-brand-600">demo@stockjomla.ma / demo123</code></div>
            <div>🛡️ {lang === 'ar' ? 'مسؤول' : 'Admin'}: <code className="text-brand-600">admin@stockjomla.ma / admin123</code></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

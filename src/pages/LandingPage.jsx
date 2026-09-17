import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, TrendingUp, Package, FileText, MessageCircle, Globe2, Headphones, Zap, ShieldCheck } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useApp } from '../contexts/AppContext.jsx';

export default function LandingPage() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [billing] = useState('monthly');

  const plansData = [
    {
      id: 'trial',
      name: t.free_trial,
      price: '0',
      priceNote: t.free_trial_desc,
      highlight: false,
      cta: t.start_trial_btn,
      features: [t.feat_products, t.feat_orders, t.feat_invoices, t.feat_whatsapp, t.feat_catalog],
      badge: '🎁 ' + t.free_days,
    },
    {
      id: 'standard',
      name: t.standard,
      price: '199',
      priceNote: t.standard_price + ' ' + t.per_month,
      highlight: false,
      cta: t.choose_plan,
      features: [t.feat_products, t.feat_orders, t.feat_invoices],
    },
    {
      id: 'pro',
      name: t.pro,
      price: '399',
      priceNote: t.pro_price + ' ' + t.per_month,
      highlight: true,
      cta: t.choose_plan,
      features: [t.feat_products, t.feat_orders, t.feat_invoices, t.feat_whatsapp, t.feat_catalog],
    },
    {
      id: 'enterprise',
      name: t.enterprise,
      price: '799',
      priceNote: t.enterprise_price + ' ' + t.per_month,
      highlight: false,
      cta: t.choose_plan,
      features: [t.feat_products, t.feat_orders, t.feat_invoices, t.feat_whatsapp, t.feat_catalog, t.feat_domain, t.feat_support],
    },
  ];

  const featuresIcons = [
    { icon: Package, title: lang === 'ar' ? 'إدارة المنتجات' : 'Gestion des produits', desc: lang === 'ar' ? 'أضف منتجاتك بأسعار الجملة والتجزئة مع صور وفئات.' : 'Ajoutez vos produits en gros et détail avec images et catégories.' },
    { icon: FileText, title: lang === 'ar' ? 'فواتير PDF' : 'Factures PDF', desc: lang === 'ar' ? 'أصدر فواتير احترافية جاهزة للطباعة والمشاركة.' : 'Générez des factures PDF professionnelles à imprimer et partager.' },
    { icon: MessageCircle, title: lang === 'ar' ? 'طلبات واتساب' : 'Commandes WhatsApp', desc: lang === 'ar' ? 'زبائنك يرسلون الطلبات مباشرة إلى واتسابك.' : 'Vos clients envoient leurs commandes directement sur votre WhatsApp.' },
    { icon: Globe2, title: lang === 'ar' ? 'دومين خاص' : 'Domaine personnalisé', desc: lang === 'ar' ? 'اجعل كتالوجك على نطاقك الخاص (باقة Enterprise).' : 'Votre catalogue sur votre propre domaine (forfait Enterprise).' },
    { icon: TrendingUp, title: lang === 'ar' ? 'لوحة تحكم ذكية' : 'Tableau de bord', desc: lang === 'ar' ? 'تابع مبيعاتك وطلباتك من مكان واحد.' : 'Suivez vos ventes et commandes depuis un seul endroit.' },
    { icon: ShieldCheck, title: lang === 'ar' ? 'دفع آمن' : 'Paiement sécurisé', desc: lang === 'ar' ? 'دفع بنكي معتمد عبر CIH والتجاري وفا بنك.' : 'Paiement bancaire via CIH et Attijariwafa Bank.' },
  ];

  const handlePlanClick = (planId) => {
    navigate('/register?plan=' + planId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-emerald-500/10 dark:from-brand-900/40 dark:to-emerald-900/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center relative">
          <div className="text-center lg:text-start space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium">
              <Sparkles size={16} /> {lang === 'ar' ? 'منصة مغربية 100%' : 'Plateforme 100% marocaine'} 🇲🇦
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              {t.hero_title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              {t.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button onClick={() => navigate('/register')} className="btn-primary text-base px-6 py-3">
                <Zap size={18} /> {t.start_trial}
              </button>
              <a href="#pricing" className="btn-secondary text-base px-6 py-3">{t.see_pricing}</a>
            </div>
            <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Check size={16} className="text-emerald-500" />{lang === 'ar' ? 'بدون بطاقة بنكية' : 'Sans carte bancaire'}</span>
              <span className="flex items-center gap-1"><Check size={16} className="text-emerald-500" />{lang === 'ar' ? '7 أيام مجانية' : '7 jours gratuits'}</span>
              <span className="flex items-center gap-1"><Check size={16} className="text-emerald-500" />{lang === 'ar' ? 'دعم عربي/فرنسي' : 'AR / FR'}</span>
            </div>
          </div>

          <div className="relative">
            <div className="card p-4 sm:p-6 shadow-xl rotate-1 hover:rotate-0 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop"
                alt="Dashboard preview"
                className="rounded-lg w-full h-auto"
                loading="lazy"
              />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-900/30">
                  <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">500+</div>
                  <div className="text-xs text-slate-500">{lang === 'ar' ? 'مورد' : 'Fournisseurs'}</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">12K+</div>
                  <div className="text-xs text-slate-500">{lang === 'ar' ? 'طلبية' : 'Commandes'}</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">24/7</div>
                  <div className="text-xs text-slate-500">{lang === 'ar' ? 'دعم' : 'Support'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              {lang === 'ar' ? 'كل ما تحتاجه لإدارة تجارتك' : 'Tout ce qu\'il faut pour gérer votre commerce'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'حل متكامل للموردين وتجار الجملة في المغرب، من إدارة المنتجات إلى استلام الطلبات عبر الواتساب.'
                : 'Solution complète pour fournisseurs et grossistes au Maroc, de la gestion produits à la réception de commandes via WhatsApp.'}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresIcons.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 grid place-items-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t.pricing_title}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.pricing_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plansData.map(plan => (
              <div
                key={plan.id}
                className={`card p-6 flex flex-col relative ${plan.highlight ? 'ring-2 ring-brand-500 shadow-xl scale-[1.02]' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ {t.most_popular}
                  </div>
                )}
                {plan.badge && (
                  <div className="inline-block self-start badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 mb-2">
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.price !== '0' && <span className="text-slate-500 text-sm"> MAD{t.per_month}</span>}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 h-10">{plan.priceNote}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handlePlanClick(plan.id)} className={plan.highlight ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">{t.demo_note}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {lang === 'ar' ? 'ابدأ رقمنة تجارتك اليوم' : 'Digitalisez votre commerce dès aujourd\'hui'}
          </h2>
          <p className="text-brand-100 mb-6 max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'انضم إلى مئات الموردين المغاربة الذين يثقون في ستوك جملة لإدارة أعمالهم.'
              : 'Rejoignez des centaines de fournisseurs marocains qui font confiance à StockJomla.'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 text-base px-6 py-3">
              {t.start_trial}
            </Link>
            <Link to="/login" className="btn bg-white/10 text-white hover:bg-white/20 border border-white/30 text-base px-6 py-3">
              {t.login}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

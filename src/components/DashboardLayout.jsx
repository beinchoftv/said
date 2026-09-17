import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe, Package2, LayoutDashboard, Package, ShoppingCart, FileText, Settings, Globe2, LogOut, Menu, X, Megaphone, AlertTriangle, Lock } from 'lucide-react';
import { useApp } from '../contexts/AppContext.jsx';

export default function DashboardLayout({ children }) {
  const { t, lang, toggleLang, toggleTheme, theme, currentSupplier, isSubscriptionActive, trialDaysLeft, logout, announcements } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = location.pathname.startsWith('/admin');

  const adminLinks = [
    { to: '/admin', label: t.dashboard, icon: LayoutDashboard, end: true },
    { to: '/admin/suppliers', label: t.suppliers, icon: Package2 },
    { to: '/admin/domains', label: t.domain_requests, icon: Globe2 },
    { to: '/admin/announcements', label: t.announcements, icon: Megaphone },
  ];

  const supplierLinks = [
    { to: '/dashboard', label: t.dashboard, icon: LayoutDashboard, end: true },
    { to: '/dashboard/products', label: t.products, icon: Package },
    { to: '/dashboard/orders', label: t.orders, icon: ShoppingCart },
    { to: '/dashboard/invoices', label: t.invoices, icon: FileText },
    { to: '/dashboard/domain', label: t.domain, icon: Globe2 },
    { to: '/dashboard/settings', label: t.settings, icon: Settings },
  ];

  const links = isAdmin ? adminLinks : supplierLinks;

  const daysLeft = currentSupplier ? trialDaysLeft(currentSupplier) : 0;
  const isTrial = currentSupplier?.plan === 'trial';
  const locked = !isAdmin && currentSupplier && !isSubscriptionActive(currentSupplier);

  const userLabel = isAdmin ? 'Admin' : (lang === 'fr' ? currentSupplier?.storeNameFr : currentSupplier?.storeNameAr);

  const Sidebar = () => (
    <aside className="w-64 flex-shrink-0 border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-400">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center">
            <Package2 size={18} />
          </div>
          <span>{t.brand}</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon;
          const active = link.end ? location.pathname === link.to : location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} /> {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button onClick={() => { logout(); navigate('/'); }} className="w-full btn-ghost justify-start">
          <LogOut size={18} /> {t.logout}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950" dir={t.dir}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full"><Sidebar /></div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full flex"><Sidebar /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="md:hidden btn-ghost !p-2">
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg truncate">
                {isAdmin ? t.admin_dashboard : t.supplier_dashboard}
              </h2>
              <p className="text-xs text-slate-500 truncate">{userLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={toggleLang} className="btn-ghost !p-2" title={t.language}>
              <Globe size={18} />
              <span className="hidden sm:inline text-xs font-bold">{lang.toUpperCase()}</span>
            </button>
            <button onClick={toggleTheme} className="btn-ghost !p-2" title={theme === 'dark' ? t.light_mode : t.dark_mode}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {!isAdmin && currentSupplier && (
              <Link to={`/catalog/${currentSupplier.id}`} target="_blank" rel="noopener" className="btn-secondary !py-1.5 !px-3 text-sm">
                {t.view_catalog}
              </Link>
            )}
          </div>
        </header>

        {/* Trial banner for suppliers */}
        {!isAdmin && currentSupplier && isTrial && !locked && daysLeft <= 3 && (
          <div className={`px-4 sm:px-6 py-2 text-sm flex items-center gap-2 ${daysLeft === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'}`}>
            <AlertTriangle size={16} />
            <span className="flex-1">{t.trial_days_left.replace('{days}', daysLeft)}</span>
            {daysLeft > 0 && (
              <Link to="/payment" className="font-semibold underline">{t.subscribe_now}</Link>
            )}
          </div>
        )}
        {!isAdmin && currentSupplier && currentSupplier.plan !== 'trial' && !currentSupplier.receipt && (
          <div className="px-4 sm:px-6 py-2 text-sm flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            <AlertTriangle size={16} />
            <span className="flex-1">{lang === 'ar' ? 'لم تقم برفع إشعار الدفع بعد.' : 'Vous n\'avez pas encore envoyé votre reçu de paiement.'}</span>
            <Link to="/payment" className="font-semibold underline">{t.upload_receipt}</Link>
          </div>
        )}
        {!isAdmin && currentSupplier && currentSupplier.receipt && !currentSupplier.receiptApproved && (
          <div className="px-4 sm:px-6 py-2 text-sm flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <AlertTriangle size={16} />
            <span>{t.waiting_approval}</span>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 relative">
          {/* Announcements */}
          {!isAdmin && announcements && announcements.length > 0 && (
            <div className="mb-4 space-y-2">
              {announcements.slice(0, 1).map(a => (
                <div key={a.id} className="card p-3 border-s-4 border-s-brand-500 flex items-start gap-3 bg-brand-50/60 dark:bg-brand-900/10">
                  <Megaphone size={18} className="text-brand-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{lang === 'fr' ? a.textFr : a.textAr}</p>
                </div>
              ))}
            </div>
          )}

          {locked ? (
            <div className="absolute inset-4 sm:inset-6 z-10 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur grid place-items-center p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 grid place-items-center mx-auto mb-4">
                  <Lock size={36} />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t.trial_expired}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{t.expired_msg}</p>
                <Link to="/payment" className="btn-primary px-6 py-3">{t.subscribe_now}</Link>
              </div>
            </div>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  );
}

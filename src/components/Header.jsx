import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe, Menu, X, Package2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext.jsx';

export default function Header() {
  const { t, toggleLang, toggleTheme, theme, currentUser, logout, lang } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onCatalog = location.pathname.startsWith('/catalog/');
  const onDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/invoice/');

  // In dashboard pages, we render a dashboard-specific header, skip this one
  if (onDashboard) return null;

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center">
            <Package2 size={20} />
          </div>
          <span>{t.brand}</span>
        </Link>

        {!onCatalog && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400">{t.home}</Link>
            <a href="/#pricing" className="hover:text-brand-600 dark:hover:text-brand-400">{t.pricing}</a>
            {currentUser?.role === 'supplier' && (
              <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">{t.dashboard}</Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400">{t.admin_dashboard}</Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="btn-ghost !p-2" title={t.language}>
            <Globe size={18} />
            <span className="hidden sm:inline text-xs font-bold">{lang.toUpperCase()}</span>
          </button>
          <button onClick={toggleTheme} className="btn-ghost !p-2" title={theme === 'dark' ? t.light_mode : t.dark_mode}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost">{t.login}</Link>
              <Link to="/register" className="btn-primary">{t.register}</Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              {currentUser.role === 'supplier' && (
                <Link to="/dashboard" className="btn-secondary">{t.dashboard}</Link>
              )}
              {currentUser.role === 'admin' && (
                <Link to="/admin" className="btn-secondary">{t.admin_dashboard}</Link>
              )}
              <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost">{t.logout}</button>
            </div>
          )}

          <button className="md:hidden btn-ghost !p-2" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 bg-white dark:bg-slate-950">
          {!onCatalog && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">{t.home}</Link>
              <a href="/#pricing" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">{t.pricing}</a>
            </>
          )}
          {!currentUser ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">{t.login}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full">{t.register}</Link>
            </>
          ) : (
            <>
              {currentUser.role === 'supplier' && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">{t.dashboard}</Link>
              )}
              {currentUser.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 font-medium">{t.admin_dashboard}</Link>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="btn-ghost w-full">{t.logout}</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

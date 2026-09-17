import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Send, ArrowLeft, Package2, X, MessageCircle, ChevronRight, Store as StoreIcon, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header.jsx';
import { useApp } from '../contexts/AppContext.jsx';

export default function PublicCatalog() {
  const { supplierId } = useParams();
  const { t, lang, suppliers, addOrder } = useApp();
  const supplier = suppliers.find(s => s.id === supplierId);

  const [cart, setCart] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!supplier) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center p-6">
          <div className="card p-8 text-center">
            <Package2 size={48} className="mx-auto text-slate-400 mb-3" />
            <p className="mb-4">{lang === 'ar' ? 'لم يتم العثور على الكتالوج.' : 'Catalogue introuvable.'}</p>
            <Link to="/" className="btn-primary">{t.go_back}</Link>
          </div>
        </main>
      </div>
    );
  }

  const storeName = lang === 'fr' ? (supplier.storeNameFr || supplier.storeNameAr) : (supplier.storeNameAr || supplier.storeNameFr);
  const products = supplier.products;
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart(c => {
    const n = { ...c };
    if ((n[id] || 0) <= 1) delete n[id]; else n[id]--;
    return n;
  });
  const remove = (id) => setCart(c => { const n = { ...c }; delete n[id]; return n; });

  const cartItems = useMemo(() => Object.entries(cart).map(([pid, qty]) => {
    const p = products.find(x => x.id === pid);
    return p ? { p, qty } : null;
  }).filter(Boolean), [cart, products]);

  const total = cartItems.reduce((s, ci) => s + ci.p.wholesalePrice * ci.qty, 0);

  const submitOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    const itemsArr = cartItems.map(ci => ({ productId: ci.p.id, qty: ci.qty }));
    const lines = cartItems.map(ci => {
      const name = lang === 'fr' ? (ci.p.nameFr || ci.p.nameAr) : (ci.p.nameAr || ci.p.nameFr);
      return `• ${name} x${ci.qty} = ${ci.p.wholesalePrice * ci.qty} MAD`;
    }).join('%0A');
    const intro = lang === 'ar'
      ? `🛒 *طلب جديد*%0A👤 ${form.name}%0A📞 ${form.phone}%0A📍 ${form.city}%0A%0A${lines}%0A%0A💰 *المجموع:* ${total} MAD`
      : `🛒 *Nouvelle commande*%0A👤 ${form.name}%0A📞 ${form.phone}%0A📍 ${form.city}%0A%0A${lines}%0A%0A💰 *Total:* ${total} MAD`;
    // Save to supplier orders (admin visibility)
    addOrder(supplier.id, {
      customerName: form.name,
      customerNameFr: form.name,
      customerPhone: form.phone.replace(/\D/g, ''),
      customerCityAr: form.city,
      customerCityFr: form.city,
      items: itemsArr,
    });
    // Open WhatsApp
    window.open(`https://wa.me/${supplier.whatsapp}?text=${intro}`, '_blank');
    setSubmitted(true);
    setCart({});
    setCartOpen(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-950">
        <Header />
        <main className="flex-1 grid place-items-center p-6">
          <div className="card p-8 text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 grid place-items-center mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.order_received}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{t.order_received_msg}</p>
            <a
              href={`https://wa.me/${supplier.whatsapp}`}
              target="_blank"
              rel="noopener"
              className="btn-whatsapp w-full !py-3 mb-2"
            >
              <MessageCircle size={18} /> {lang === 'ar' ? 'فتح واتساب' : 'Ouvrir WhatsApp'}
            </a>
            <button onClick={() => setSubmitted(false)} className="btn-ghost w-full">{t.continue_shopping}</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-24">
        {/* Store banner */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <Link to="/" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4">
              <ArrowLeft size={16} /> {t.home}
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 grid place-items-center">
                <StoreIcon size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{storeName}</h1>
                <p className="text-white/80 text-sm">{t.catalog_title} · {products.length} {t.products}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {products.length === 0 ? (
            <div className="card p-12 text-center text-slate-500">{t.no_data}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => {
                const name = lang === 'fr' ? (p.nameFr || p.nameAr) : (p.nameAr || p.nameFr);
                const desc = lang === 'fr' ? (p.descFr || p.descAr) : (p.descAr || p.descFr);
                const cat = lang === 'fr' ? (p.categoryFr || p.categoryAr) : (p.categoryAr || p.categoryFr);
                const inCart = cart[p.id] || 0;
                return (
                  <div key={p.id} className="card overflow-hidden flex flex-col group">
                    <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      {p.image ? <img src={p.image} alt={name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full grid place-items-center text-slate-400"><Package2 size={32} /></div>}
                      {cat && <span className="absolute top-2 start-2 badge bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 text-xs">{cat}</span>}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{name}</h3>
                      {desc && <p className="text-xs text-slate-500 line-clamp-2 mb-2">{desc}</p>}
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-brand-600 dark:text-brand-400">{p.wholesalePrice} <small>MAD</small></div>
                          {p.retailPrice > 0 && <div className="text-xs text-slate-400 line-through">{p.retailPrice} MAD</div>}
                        </div>
                        {inCart === 0 ? (
                          <button onClick={() => addToCart(p.id)} className="btn-primary !p-2" title={t.add_to_cart}>
                            <Plus size={16} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button onClick={() => dec(p.id)} className="btn-secondary !p-1.5"><Minus size={14} /></button>
                            <span className="w-6 text-center text-sm font-bold">{inCart}</span>
                            <button onClick={() => addToCart(p.id)} className="btn-primary !p-1.5"><Plus size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 end-4 z-40 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-2xl px-5 py-3 flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          <span className="font-bold">{cartCount}</span>
          <ChevronRight size={18} className="rtl:flip" />
        </button>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setCartOpen(false)}>
          <div className="flex-1 bg-black/50" />
          <div className={`w-full sm:w-[440px] bg-white dark:bg-slate-900 h-full flex flex-col ${cartOpen ? 'animate-fade-in' : ''}`} onClick={e => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingCart size={20} /> {t.cart}</h3>
              <button onClick={() => setCartOpen(false)} className="btn-ghost !p-2"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" />
                  {t.cart_empty}
                </div>
              ) : (
                <>
                  {cartItems.map(ci => {
                    const name = lang === 'fr' ? (ci.p.nameFr || ci.p.nameAr) : (ci.p.nameAr || ci.p.nameFr);
                    return (
                      <div key={ci.p.id} className="flex gap-3 items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {ci.p.image && <img src={ci.p.image} alt={name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{name}</div>
                          <div className="text-xs text-slate-500">{ci.p.wholesalePrice} MAD</div>
                          <div className="flex items-center gap-1 mt-1">
                            <button onClick={() => dec(ci.p.id)} className="btn-secondary !p-1 !h-7 !w-7"><Minus size={12} /></button>
                            <span className="w-6 text-center text-sm font-bold">{ci.qty}</span>
                            <button onClick={() => addToCart(ci.p.id)} className="btn-primary !p-1 !h-7 !w-7"><Plus size={12} /></button>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="font-bold">{ci.p.wholesalePrice * ci.qty} MAD</div>
                          <button onClick={() => remove(ci.p.id)} className="text-red-500 text-xs mt-1 flex items-center gap-1"><Trash2 size={12} />{t.remove}</button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-3 font-bold text-lg">
                    <span>{t.subtotal}</span>
                    <span className="text-brand-600">{total} MAD</span>
                  </div>
                </>
              )}
            </div>
            {cartItems.length > 0 && (
              <form onSubmit={submitOrder} className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-semibold">{t.order_summary}</h4>
                <input required className="input" placeholder={t.your_name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input required type="tel" className="input" placeholder={t.your_phone} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} dir="ltr" />
                <input required className="input" placeholder={t.your_city} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                <button type="submit" className="btn-whatsapp w-full !py-3 text-base">
                  <Send size={18} /> {t.send_order}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

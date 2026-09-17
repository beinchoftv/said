import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { translations, plans } from '../i18n/translations.js';

const AppContext = createContext(null);
const TRIAL_DAYS = 7;

const defaultSampleProducts = [
  {
    id: 'p1',
    nameAr: 'قهوة بن العربي 500غ',
    nameFr: 'Café Ben Arabi 500g',
    descAr: 'قهوة مغربية أصلية، تحميص متوسط',
    descFr: 'Café marocain authentique, torréfaction moyenne',
    wholesalePrice: 45,
    retailPrice: 65,
    categoryAr: 'مواد غذائية',
    categoryFr: 'Alimentaire',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1559525839-d9acfd056bd6?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'p2',
    nameAr: 'زيت الزيتون البكر 1 لتر',
    nameFr: 'Huile d\'olive extra vierge 1L',
    descAr: 'زيت زيتون بكر ممتاز من منطقة فاس',
    descFr: 'Huile d\'olive extra vierge de la région de Fès',
    wholesalePrice: 85,
    retailPrice: 120,
    categoryAr: 'مواد غذائية',
    categoryFr: 'Alimentaire',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'p3',
    nameAr: 'صابون بلدي بالزيتون 250غ',
    nameFr: 'Savon traditionnel à l\'huile d\'olive 250g',
    descAr: 'صابون بلدي طبيعي 100%',
    descFr: 'Savon traditionnel 100% naturel',
    wholesalePrice: 15,
    retailPrice: 25,
    categoryAr: 'مواد تجميل',
    categoryFr: 'Cosmétique',
    stock: 500,
    image: 'https://images.unsplash.com/photo-1607006677018-33e8cf793c9c?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'p4',
    nameAr: 'شاي أخضر بالنعناع 200غ',
    nameFr: 'Thé vert à la menthe 200g',
    descAr: 'شاي أخضر فاخر مع نعناع طبيعي',
    descFr: 'Thé vert premium à la menthe naturelle',
    wholesalePrice: 30,
    retailPrice: 45,
    categoryAr: 'مشروبات',
    categoryFr: 'Boissons',
    stock: 300,
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'p5',
    nameAr: 'عسل حر طبيعي 1 كغ',
    nameFr: 'Miel pur 1kg',
    descAr: 'عسل طبيعي من جبال الأطلس',
    descFr: 'Miel naturel des montagnes de l\'Atlas',
    wholesalePrice: 180,
    retailPrice: 250,
    categoryAr: 'مواد غذائية',
    categoryFr: 'Alimentaire',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'p6',
    nameAr: 'زعفران مغربي 5غ',
    nameFr: 'Safran marocain 5g',
    descAr: 'زعفران تالوين درجة أولى',
    descFr: 'Safran de Taliouine, première qualité',
    wholesalePrice: 120,
    retailPrice: 180,
    categoryAr: 'توابل',
    categoryFr: 'Épices',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80&auto=format&fit=crop',
  },
];

// Initial demo state
const makeInitialDemoSupplier = () => ({
  id: 'sup_demo',
  storeNameAr: 'متجر البركة للجملة',
  storeNameFr: 'Baraka Wholesale Store',
  email: 'demo@stockjomla.ma',
  password: 'demo123',
  whatsapp: '212661234567',
  plan: 'trial',
  planStart: new Date(Date.now() - (TRIAL_DAYS - 3) * 24 * 60 * 60 * 1000).toISOString(), // 3 days left
  blocked: false,
  receipt: null,       // { file, uploadedAt }
  receiptApproved: false,
  customDomain: null,
  domainStatus: 'none', // none | pending | active
  domainRequestedAt: null,
  products: defaultSampleProducts,
  orders: [
    {
      id: 'ord_1',
      customerName: 'أحمد العلوي',
      customerNameFr: 'Ahmed Alaoui',
      customerPhone: '212661112233',
      customerCityAr: 'الدار البيضاء',
      customerCityFr: 'Casablanca',
      items: [{ productId: 'p1', qty: 10 }, { productId: 'p2', qty: 5 }],
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      source: 'whatsapp',
    },
    {
      id: 'ord_2',
      customerName: 'فاطمة الزهراء',
      customerNameFr: 'Fatima Zahra',
      customerPhone: '212662223344',
      customerCityAr: 'الرباط',
      customerCityFr: 'Rabat',
      items: [{ productId: 'p3', qty: 20 }, { productId: 'p5', qty: 3 }],
      status: 'confirmed',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      source: 'whatsapp',
    },
  ],
});

const makeInitialAdmin = () => ({
  id: 'admin_1',
  email: 'admin@stockjomla.ma',
  password: 'admin123',
});

const STORAGE_KEY = 'stockjomla_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function getDaysLeft(planStart) {
  if (!planStart) return TRIAL_DAYS;
  const start = new Date(planStart).getTime();
  const now = Date.now();
  const elapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - elapsed);
}

export function AppProvider({ children }) {
  const initial = loadState();

  const [lang, setLang] = useState(initial?.lang || 'ar');
  const [theme, setTheme] = useState(initial?.theme || 'light');
  const [currentUser, setCurrentUser] = useState(initial?.currentUser || null); // {id, role: 'supplier'|'admin'}
  const [suppliers, setSuppliers] = useState(initial?.suppliers || [makeInitialDemoSupplier()]);
  const [admin, setAdmin] = useState(initial?.admin || makeInitialAdmin());
  const [announcements, setAnnouncements] = useState(initial?.announcements || [
    { id: 'an1', textAr: 'مرحباً بكم في ستوك جملة! نسخة تجريبية لتوضيح كامل مسار العمل.', textFr: 'Bienvenue sur StockJomla ! Ceci est une démo du parcours complet.', createdAt: new Date().toISOString() }
  ]);

  // Persist to localStorage
  useEffect(() => {
    saveState({ lang, theme, currentUser, suppliers, admin, announcements });
  }, [lang, theme, currentUser, suppliers, admin, announcements]);

  // Apply dir and theme to <html>
  useEffect(() => {
    const t = translations[lang];
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const t = useMemo(() => translations[lang], [lang]);

  const toggleLang = useCallback(() => setLang(l => l === 'ar' ? 'fr' : 'ar'), []);
  const toggleTheme = useCallback(() => setTheme(th => th === 'dark' ? 'light' : 'dark'), []);

  // --- Auth ---
  const loginSupplier = useCallback((email, password) => {
    const s = suppliers.find(x => x.email === email && x.password === password);
    if (s) {
      if (s.blocked) return { ok: false, error: 'blocked' };
      setCurrentUser({ id: s.id, role: 'supplier' });
      return { ok: true };
    }
    return { ok: false, error: 'invalid' };
  }, [suppliers]);

  const loginAdmin = useCallback((email, password) => {
    if (admin.email === email && admin.password === password) {
      setCurrentUser({ id: admin.id, role: 'admin' });
      return { ok: true };
    }
    return { ok: false };
  }, [admin]);

  const registerSupplier = useCallback((data) => {
    const id = 'sup_' + Math.random().toString(36).slice(2, 8);
    const newSup = {
      id,
      storeNameAr: data.storeNameAr || data.storeName,
      storeNameFr: data.storeNameFr || data.storeName,
      email: data.email,
      password: data.password,
      whatsapp: data.whatsapp || '212600000000',
      plan: 'trial',
      planStart: new Date().toISOString(),
      blocked: false,
      receipt: null,
      receiptApproved: false,
      customDomain: null,
      domainStatus: 'none',
      domainRequestedAt: null,
      products: [],
      orders: [],
    };
    setSuppliers(prev => [...prev, newSup]);
    setCurrentUser({ id, role: 'supplier' });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  // --- Supplier accessors/updaters ---
  const currentSupplier = useMemo(() => {
    if (currentUser?.role !== 'supplier') return null;
    return suppliers.find(s => s.id === currentUser.id) || null;
  }, [currentUser, suppliers]);

  const updateSupplier = useCallback((id, patch) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  }, []);

  // Trial/plan active?
  const isSubscriptionActive = useCallback((sup) => {
    if (!sup) return false;
    if (sup.blocked) return false;
    if (sup.plan === 'trial') {
      return getDaysLeft(sup.planStart) > 0;
    }
    // Paid plans are active if receipt is approved
    return sup.receiptApproved === true;
  }, []);

  const trialDaysLeft = useCallback((sup) => {
    if (!sup || sup.plan !== 'trial') return 0;
    return getDaysLeft(sup.planStart);
  }, []);

  // Product CRUD
  const addProduct = (supId, product) => {
    const id = 'p_' + Math.random().toString(36).slice(2, 8);
    setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, products: [...s.products, { ...product, id }] } : s));
  };
  const updateProduct = (supId, prodId, patch) => {
    setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, products: s.products.map(p => p.id === prodId ? { ...p, ...patch } : p) } : s));
  };
  const deleteProduct = (supId, prodId) => {
    setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, products: s.products.filter(p => p.id !== prodId) } : s));
  };

  // Orders
  const addOrder = (supId, order) => {
    const id = 'ord_' + Math.random().toString(36).slice(2, 8);
    setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, orders: [{ ...order, id, createdAt: new Date().toISOString(), status: 'pending', source: 'whatsapp' }, ...s.orders] } : s));
    return id;
  };
  const updateOrderStatus = (supId, ordId, status) => {
    setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, orders: s.orders.map(o => o.id === ordId ? { ...o, status } : o) } : s));
  };

  // Receipt upload
  const uploadReceipt = (supId, fileMeta) => {
    updateSupplier(supId, { receipt: { name: fileMeta.name, size: fileMeta.size, uploadedAt: new Date().toISOString() }, receiptApproved: false });
  };

  // Domain request
  const requestDomain = (supId, domain) => {
    updateSupplier(supId, { customDomain: domain, domainStatus: 'pending', domainRequestedAt: new Date().toISOString() });
  };

  // Profile update
  const updateProfile = (supId, patch) => updateSupplier(supId, patch);

  // Plan selection
  const selectPlan = (supId, plan) => {
    updateSupplier(supId, { plan, receipt: null, receiptApproved: false });
  };

  // Admin actions
  const approveReceipt = (supId) => updateSupplier(supId, { receiptApproved: true });
  const rejectReceipt = (supId) => updateSupplier(supId, { receipt: null, receiptApproved: false });
  const toggleBlock = (supId) => setSuppliers(prev => prev.map(s => s.id === supId ? { ...s, blocked: !s.blocked } : s));
  const extendTrialDays = (supId, days = 7) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id !== supId) return s;
      const newStart = new Date(Date.now() - (TRIAL_DAYS - days) * 24 * 3600 * 1000).toISOString();
      return { ...s, plan: 'trial', planStart: newStart, receipt: null, receiptApproved: false };
    }));
  };
  const approveDomain = (supId) => updateSupplier(supId, { domainStatus: 'active' });
  const rejectDomain = (supId) => updateSupplier(supId, { domainStatus: 'none', customDomain: null });

  const publishAnnouncement = (textAr, textFr) => {
    const id = 'an_' + Math.random().toString(36).slice(2, 8);
    setAnnouncements(prev => [{ id, textAr, textFr, createdAt: new Date().toISOString() }, ...prev]);
  };

  const value = {
    // config
    lang, setLang, toggleLang, theme, setTheme, toggleTheme, t, dir: t.dir, plans,
    // auth
    currentUser, currentSupplier, isSubscriptionActive, trialDaysLeft,
    loginSupplier, loginAdmin, registerSupplier, logout,
    // data
    suppliers, admin, announcements,
    // supplier ops
    addProduct, updateProduct, deleteProduct,
    addOrder, updateOrderStatus,
    uploadReceipt, requestDomain, updateProfile, selectPlan,
    // admin ops
    approveReceipt, rejectReceipt, toggleBlock, extendTrialDays, approveDomain, rejectDomain,
    publishAnnouncement,
    // helpers
    getLocalizedName: (item, field = 'name') => lang === 'fr' ? item[field + 'Fr'] || item[field + 'Ar'] : item[field + 'Ar'] || item[field + 'Fr'],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

# StockJomla 🇲🇦

**منصة إدارة الموردين وتجار الجملة في المغرب**
**Plateforme de gestion des fournisseurs et grossistes au Maroc**

A complete SaaS demo built with **React + Vite + Tailwind CSS** featuring:

- ✅ Arabic **RTL** / French **LTR** toggle (Cairo + Inter fonts)
- ✅ **Dark / Light** mode
- ✅ Landing page with pricing (Trial / Standard 199 MAD / Pro 399 MAD / Enterprise 799 MAD)
- ✅ Authentication (Supplier & Admin), with demo accounts preloaded
- ✅ **Bank transfer payment flow** (CIH / Attijariwafa Bank) with receipt upload (LocalStorage)
- ✅ Supplier Dashboard: Products CRUD, Orders pipeline, PDF-ready Invoices (print view), WhatsApp dispatcher
- ✅ **Custom Domain** tab for Enterprise users with CNAME setup guide + simulated iframe preview
- ✅ Public retailer catalog (guest, no account needed) with cart → WhatsApp order dispatch
- ✅ Subscription expiration logic with **auto-lock overlay** + renewal banners
- ✅ **Super Admin Dashboard**: approve receipts, block/unblock suppliers, extend trials, approve custom domains, broadcast announcements to all dashboards
- ✅ Privacy Policy & Terms of Service modals (bilingual AR/FR)
- ✅ State persisted in LocalStorage so the entire flow (Trial → Expiration → Payment → Domain → Orders) can be demonstrated end-to-end

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Supplier (demo store with sample products & orders) | `demo@stockjomla.ma` | `demo123` |
| Super Admin | `admin@stockjomla.ma` | `admin123` |

## Quick start

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build
```

## Flow to demonstrate

1. Visit home → switch language/dark mode, see pricing.
2. Log in as supplier (`demo@stockjomla.ma` / `demo123`) → see the trial banner (3 days remaining).
3. Browse **Products**, add a new one.
4. Open the public catalog (button in topbar, no login needed) — add items to cart, fill name/phone/city, click **"Send via WhatsApp"** (a pre-filled order goes to the supplier's WhatsApp number and the order is saved to the dashboard).
5. Back in **Orders**, confirm/ship/cancel orders, open the **printable invoice**.
6. Go to **Payment**, choose Pro/Enterprise, upload a fake receipt (any file), submit — the status goes to *Pending approval*; the dashboard banner updates.
7. Log out, log in as **admin** → approve the receipt (or reject/block/extend trial); in **Domain Requests** approve a domain request.
8. As supplier, go to **Domain** tab (only active for Enterprise after receipt approval) — request a domain like `catalog.brand.ma`, preview the iframe-simulated public catalog, approve it from admin, and see the *Active* domain status.
9. Wait for the trial to expire (or set the `planStart` far in the past from DevTools) → the dashboard is locked with a renewal CTA.
10. Publish an **announcement** from the admin; it shows up at the top of every supplier dashboard.

## Project structure

```
src/
├── App.jsx                  # Router
├── main.jsx                 # Entry + AppProvider
├── index.css                # Tailwind + custom components
├── i18n/translations.js     # All AR/FR strings + plan metadata
├── contexts/AppContext.jsx  # Global state (auth, suppliers, admin, announcements, LocalStorage)
├── components/              # Header, Footer, LegalModal, DashboardLayout
└── pages/
    ├── LandingPage.jsx      # Hero + features + pricing + CTA
    ├── LoginPage.jsx        # Supplier/Admin login
    ├── RegisterPage.jsx     # Supplier signup (preselects plan from ?plan=)
    ├── PaymentPage.jsx      # CIH / Attijariwafa bank info + receipt upload
    ├── PublicCatalog.jsx    # Guest-facing catalog, cart, WhatsApp dispatch
    ├── InvoicePage.jsx      # Printable bilingual invoice
    ├── SupplierDashboard.jsx + pages/supplier/{Overview,ProductsPage,OrdersPage,InvoicesPage,DomainPage,SettingsPage}.jsx
    └── AdminDashboard.jsx  + pages/admin/{Overview,SuppliersPage,DomainsPage,AnnouncementsPage}.jsx
```

## Tech notes

- Routing: `react-router-dom` v6
- Icons: `lucide-react`
- Placeholder imagery: Unsplash (random product imagery)
- Persistence: `localStorage` (key `stockjomla_state_v1`) — clear it to reset the demo.
- WhatsApp integration: opens `https://wa.me/<number>?text=...` with the pre-filled message — works on both desktop (web.whatsapp.com) and mobile.
- RTL: `<html dir="rtl">` is toggled automatically; Tailwind logical properties (`ms-`, `me-`, `start-`, `end-`) handle directional spacing.

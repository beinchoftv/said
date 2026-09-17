import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';

const emptyProduct = {
  nameAr: '', nameFr: '', descAr: '', descFr: '',
  wholesalePrice: 0, retailPrice: 0, categoryAr: '', categoryFr: '',
  stock: 0, image: '',
};

export default function ProductsPage() {
  const { t, lang, currentSupplier, addProduct, updateProduct, deleteProduct } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  if (!currentSupplier) return null;

  const openAdd = () => { setEditingId(null); setForm(emptyProduct); setModalOpen(true); };
  const openEdit = (p) => { setEditingId(p.id); setForm({ ...p }); setModalOpen(true); };

  const save = (e) => {
    e.preventDefault();
    if (editingId) updateProduct(currentSupplier.id, editingId, form);
    else addProduct(currentSupplier.id, form);
    setModalOpen(false);
  };

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.products} <span className="text-slate-400 font-normal">({currentSupplier.products.length})</span></h1>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> {t.add_product}
        </button>
      </div>

      {currentSupplier.products.length === 0 ? (
        <div className="card p-12 text-center">
          <ImageOff size={48} className="mx-auto text-slate-400 mb-3" />
          <p className="text-slate-500 mb-4">{t.no_data}</p>
          <button onClick={openAdd} className="btn-primary">{t.add_product}</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentSupplier.products.map(p => {
            const name = lang === 'fr' ? (p.nameFr || p.nameAr) : (p.nameAr || p.nameFr);
            const cat = lang === 'fr' ? (p.categoryFr || p.categoryAr) : (p.categoryAr || p.categoryFr);
            return (
              <div key={p.id} className="card overflow-hidden flex flex-col group">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-400"><ImageOff size={32} /></div>
                  )}
                  <div className="absolute top-2 end-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => openEdit(p)} className="bg-white dark:bg-slate-800 w-8 h-8 rounded-full grid place-items-center shadow hover:bg-slate-100 dark:hover:bg-slate-700"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm(lang === 'ar' ? 'تأكيد الحذف؟' : 'Confirmer la suppression ?')) deleteProduct(currentSupplier.id, p.id); }} className="bg-white dark:bg-slate-800 w-8 h-8 rounded-full grid place-items-center shadow hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <span className="absolute bottom-2 start-2 badge bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200">{cat || '—'}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold mb-1 line-clamp-2">{name}</h3>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <div className="text-lg font-bold text-brand-600 dark:text-brand-400">{p.wholesalePrice} MAD</div>
                      <div className="text-xs text-slate-500 line-through">{p.retailPrice} MAD</div>
                    </div>
                    <div className="text-xs text-slate-500 text-end">
                      <div>{t.stock_qty}</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{p.stock}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <form onSubmit={save} className="card w-full max-w-2xl p-6 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingId ? t.edit : t.add_product}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t.product_name} (AR)</label>
                <input required className="input" value={form.nameAr} onChange={onChange('nameAr')} />
              </div>
              <div>
                <label className="label">{t.product_name} (FR)</label>
                <input className="input" value={form.nameFr} onChange={onChange('nameFr')} dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t.product_desc} (AR)</label>
                <textarea className="input min-h-[70px]" value={form.descAr} onChange={onChange('descAr')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t.product_desc} (FR)</label>
                <textarea className="input min-h-[70px]" value={form.descFr} onChange={onChange('descFr')} dir="ltr" />
              </div>
              <div>
                <label className="label">{t.wholesale_price} (MAD)</label>
                <input type="number" min="0" step="0.5" required className="input" value={form.wholesalePrice} onChange={onChange('wholesalePrice')} />
              </div>
              <div>
                <label className="label">{t.retail_price} (MAD)</label>
                <input type="number" min="0" step="0.5" className="input" value={form.retailPrice} onChange={onChange('retailPrice')} />
              </div>
              <div>
                <label className="label">{t.product_category} (AR)</label>
                <input className="input" value={form.categoryAr} onChange={onChange('categoryAr')} />
              </div>
              <div>
                <label className="label">{t.product_category} (FR)</label>
                <input className="input" value={form.categoryFr} onChange={onChange('categoryFr')} dir="ltr" />
              </div>
              <div>
                <label className="label">{t.stock_qty}</label>
                <input type="number" min="0" className="input" value={form.stock} onChange={onChange('stock')} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t.product_image}</label>
                <input className="input" value={form.image} onChange={onChange('image')} placeholder="https://..." dir="ltr" />
                {form.image && <img src={form.image} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">{t.cancel}</button>
              <button type="submit" className="btn-primary">{t.save}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

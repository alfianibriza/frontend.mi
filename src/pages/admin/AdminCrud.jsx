import { useState, useEffect, useMemo } from 'react';
import MediaPickerModal from '../../components/common/MediaPickerModal';
import { 
  Edit, Trash2, X, Plus, Search, Check, AlertCircle, 
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

/**
 * Modern Generic Admin CRUD Component
 * Fully mobile responsive with dual card/table views, live search, and media picker.
 */
const AdminCrud = ({ title, icon, api, fields, imageField = null }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = () => {
    setLoading(true);
    api.getAll({ limit: 100 })
      .then(res => setItems(res.data.data || []))
      .catch((err) => {
        console.error('Failed to load data:', err);
        showToast('Gagal memuat data', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const openCreate = () => {
    setEditItem(null);
    const emptyForm = {};
    fields.forEach(f => { emptyForm[f.name] = f.defaultValue !== undefined ? f.defaultValue : ''; });
    if (imageField) emptyForm[imageField] = '';
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    const formData = {};
    fields.forEach(f => { formData[f.name] = item[f.name] !== undefined && item[f.name] !== null ? item[f.name] : ''; });
    if (imageField && item[imageField]) {
      formData[imageField] = item[imageField];
    }
    setForm(formData);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await api.update(editItem.id, form);
        showToast('Data berhasil diperbarui');
      } else {
        await api.create(form);
        showToast('Data baru berhasil ditambahkan');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan data.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      await api.delete(deleteConfirmItem.id);
      showToast('Data berhasil dihapus');
      setDeleteConfirmItem(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus data.', 'error');
    }
  };

  // Filtered items based on search query across all fields
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item => {
      return fields.some(f => {
        const val = item[f.name];
        return val && String(val).toLowerCase().includes(q);
      });
    });
  }, [items, searchQuery, fields]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Check className="w-4 h-4 text-emerald-600" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-xs">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-outfit">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Kelola daftar dan detail data {title.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={openCreate} 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari dalam ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 shrink-0 self-end sm:self-center">
          <span className="bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700">
            Total: <strong>{filteredItems.length}</strong> data
          </span>
        </div>
      </div>

      {/* Content Section: Mobile Cards & Desktop Table */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-500">Memuat data {title.toLowerCase()}...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">#</th>
                    {imageField && (
                      <th className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Foto</th>
                    )}
                    {fields.slice(0, 4).map(f => (
                      <th key={f.name} className="px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {f.label}
                      </th>
                    ))}
                    <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredItems.map((item, i) => (
                    <tr key={item.id} className="hover:bg-primary-50/20 transition-colors">
                      <td className="px-5 py-4 text-xs font-semibold text-gray-400">{i + 1}</td>
                      {imageField && (
                        <td className="px-5 py-4">
                          {item[imageField] ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                              <img 
                                src={item[imageField].startsWith('http') ? item[imageField] : `${API_BASE}${item[imageField]}`} 
                                alt="" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Data&background=f1f5f9&color=64748b'; }}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                              <ImageIcon className="w-4 h-4 opacity-50" />
                            </div>
                          )}
                        </td>
                      )}
                      {fields.slice(0, 4).map((f, idx) => (
                        <td key={f.name} className={`px-5 py-4 ${idx === 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                          {f.name === imageField && item[f.name] ? (
                            <img 
                              src={item[f.name].startsWith('http') ? item[f.name] : `${API_BASE}${item[f.name]}`} 
                              alt="" 
                              className="w-10 h-10 rounded-lg object-cover" 
                            />
                          ) : (
                            <span className="line-clamp-2">{String(item[f.name] || '-')}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEdit(item)} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmItem(item)} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (Shown on screens < md) */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item, i) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  {imageField && item[imageField] && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img 
                        src={item[imageField].startsWith('http') ? item[imageField] : `${API_BASE}${item[imageField]}`} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Data&background=f1f5f9&color=64748b'; }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">#{i + 1}</span>
                    <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                      {String(item[fields[0]?.name] || 'Item')}
                    </h3>
                    {fields.slice(1, 3).map(f => item[f.name] ? (
                      <p key={f.name} className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        <strong className="font-semibold text-gray-600">{f.label}:</strong> {String(item[f.name])}
                      </p>
                    ) : null)}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-50">
                  <button 
                    onClick={() => openEdit(item)} 
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => setDeleteConfirmItem(item)} 
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
            {icon || <Search className="w-8 h-8" />}
          </div>
          <h3 className="text-base font-bold text-gray-800">
            {searchQuery ? 'Data Tidak Ditemukan' : `Belum Ada Data ${title}`}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm">
            {searchQuery 
              ? `Tidak ada hasil yang sesuai dengan kata kunci "${searchQuery}".`
              : `Mulai tambahkan data ${title.toLowerCase()} baru dengan menekan tombol Tambah Data di atas.`
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      <AnimatePresence>
        {showForm && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto" 
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2.5 font-outfit">
                  <span className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-sm">
                    {editItem ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                  <span>{editItem ? 'Ubah Data' : 'Tambah Data Baru'} {title}</span>
                </h2>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <div className="overflow-y-auto p-6 space-y-5">
                <form id="crud-form" onSubmit={handleSubmit} className="space-y-4">
                  {fields.map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea 
                          className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                          rows={4} 
                          value={form[f.name] || ''} 
                          onChange={e => setForm({...form, [f.name]: e.target.value})} 
                          required={f.required} 
                          placeholder={`Masukkan ${f.label.toLowerCase()}...`} 
                        />
                      ) : f.type === 'select' ? (
                        <select 
                          className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                          value={form[f.name] || ''} 
                          onChange={e => setForm({...form, [f.name]: e.target.value})}
                          required={f.required}
                        >
                          {f.options?.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={f.type || 'text'} 
                          className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                          value={form[f.name] || ''} 
                          onChange={e => setForm({...form, [f.name]: e.target.value})} 
                          required={f.required} 
                          placeholder={`Masukkan ${f.label.toLowerCase()}...`} 
                        />
                      )}
                    </div>
                  ))}

                  {/* Image Field / Media Picker */}
                  {imageField && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Pilih Gambar / Media
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-1 w-full space-y-2">
                          <input 
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                            value={form[imageField] || ''} 
                            onChange={(e) => setForm({ ...form, [imageField]: e.target.value })}
                            placeholder="URL gambar atau pilih dari pustaka media..." 
                          />
                          <button 
                            type="button" 
                            onClick={() => setIsMediaPickerOpen(true)} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4 text-primary-600" />
                            <span>Buka Pustaka Media</span>
                          </button>
                        </div>

                        {form[imageField] ? (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-gray-200 overflow-hidden bg-white shrink-0 shadow-xs relative">
                            <img 
                              src={form[imageField].startsWith('http') ? form[imageField] : `${API_BASE}${form[imageField]}`} 
                              className="w-full h-full object-cover" 
                              alt="Preview" 
                              onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=Err&background=f1f5f9'; }} 
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center shrink-0 text-gray-400 text-xs gap-1">
                            <ImageIcon className="w-5 h-5 opacity-40" />
                            <span>Preview</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  form="crud-form"
                  disabled={submitting} 
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmItem(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-outfit mb-1">Hapus Data Ini?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Data yang sudah dihapus tidak dapat dipulihkan kembali. Apakah Anda yakin ingin melanjutkan?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmItem(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={(url) => setForm({ ...form, [imageField]: url })} 
      />
    </div>
  );
};

export default AdminCrud;

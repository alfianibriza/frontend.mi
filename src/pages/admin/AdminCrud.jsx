import { useState, useEffect } from 'react';
import MediaPickerModal from '../../components/common/MediaPickerModal';
import { Edit, Trash2, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

/**
 * Generic Admin CRUD Page
 * Reusable component for managing any resource (news, facilities, alumni, etc.)
 */
const AdminCrud = ({ title, icon, api, fields, imageField = null }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    api.getAll({ limit: 100 })
      .then(res => setItems(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditItem(null);
    const emptyForm = {};
    fields.forEach(f => { emptyForm[f.name] = f.defaultValue || ''; });
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    const formData = {};
    fields.forEach(f => { formData[f.name] = item[f.name] || ''; });
    // Also populate the imageField if it exists
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
      let data = form;

      if (editItem) {
        await api.update(editItem.id, data);
      } else {
        await api.create(data);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    try {
      await api.delete(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {icon && <span className="text-primary-600 flex items-center justify-center">{icon}</span>}
          {title}
        </h1>
        <button onClick={openCreate} className="btn-primary text-sm">+ Tambah</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[2rem]">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                {icon && <span className="text-primary-600 bg-primary-50 p-2.5 rounded-xl">{icon}</span>}
                {editItem ? 'Edit' : 'Tambah'} {title}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 md:p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(f => (
                  <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea className="input-field bg-gray-50 focus:bg-white transition-all shadow-sm" rows={5} value={form[f.name] || ''} onChange={e => setForm({...form, [f.name]: e.target.value})} required={f.required} placeholder={`Masukkan ${f.label.toLowerCase()}...`} />
                    ) : f.type === 'select' ? (
                      <select className="input-field bg-gray-50 focus:bg-white transition-all shadow-sm" value={form[f.name] || ''} onChange={e => setForm({...form, [f.name]: e.target.value})}>
                        {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input type={f.type || 'text'} className="input-field bg-gray-50 focus:bg-white transition-all shadow-sm" value={form[f.name] || ''} onChange={e => setForm({...form, [f.name]: e.target.value})} required={f.required} placeholder={`Masukkan ${f.label.toLowerCase()}...`} />
                    )}
                  </div>
                ))}

                {imageField && (
                  <div className="md:col-span-2 bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Upload File / Gambar</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1 w-full">
                        <input 
                          className="input-field bg-white shadow-sm" 
                          value={form[imageField] || ''} 
                          onChange={(e) => setForm({ ...form, [imageField]: e.target.value })}
                          placeholder="Masukkan URL atau pilih dari pustaka media..." 
                        />
                        <button type="button" onClick={() => setIsMediaPickerOpen(true)} className="mt-3 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium flex items-center gap-2">
                          Pilih Media
                        </button>
                      </div>
                      {form[imageField] ? (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border border-gray-200 overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm relative group">
                          <img src={form[imageField].startsWith('/') ? `${API_BASE}${form[imageField]}` : form[imageField]} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Preview</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center shrink-0 text-gray-400 text-sm flex-col gap-2">
                          <span className="text-2xl text-gray-300">+</span>
                          <span className="text-xs">Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 mt-2">
                  <button type="submit" disabled={submitting} className="px-8 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium flex-1 shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2 sm:text-lg order-1 sm:order-2">
                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium sm:text-lg order-2 sm:order-1">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
      ) : items.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  {fields.slice(0, 4).map(f => <th key={f.name} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{f.label}</th>)}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    {fields.slice(0, 4).map(f => (
                      <td key={f.name} className="px-4 py-3 text-sm text-gray-700">
                        {f.name === imageField && item[f.name] ? (
                          <img src={item[f.name].startsWith('http://') || item[f.name].startsWith('https://') ? item[f.name] : `${API_BASE}${item[f.name]}`} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <span className="line-clamp-1">{String(item[f.name] || '-').substring(0, 60)}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"><Trash2 className="w-3 h-3" /> Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center flex flex-col items-center">
          <div className="text-primary-400 mb-4 opacity-50 [&>svg]:w-16 [&>svg]:h-16">
            {icon}
          </div>
          <p className="text-gray-500 mt-4">Belum ada data. Klik "+ Tambah" untuk menambahkan.</p>
        </div>
      )}

      <MediaPickerModal 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={(url) => setForm({ ...form, [imageField]: url })} 
      />
    </div>
  );
};

export default AdminCrud;

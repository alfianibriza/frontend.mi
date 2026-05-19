import { useState, useEffect } from 'react';
import { pmbApi } from '../../api';
import { ClipboardList, Clock, CheckCircle2, XCircle, Check, X, Plus, Edit, Trash2 } from 'lucide-react';

const AdminPmb = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ student_name: '', gender: 'L', previous_school: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadData = () => {
    setLoading(true);
    pmbApi.getAll({ limit: 100 })
      .then(res => setItems(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id, status) => {
    try { 
      await pmbApi.updateStatus(id, { status }); 
      loadData(); 
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await pmbApi.delete(id);
      setDeleteConfirm(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus pendaftar');
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('student_name', form.student_name);
      formData.append('gender', form.gender);
      formData.append('previous_school', form.previous_school || '-');
      // Berikan nilai default untuk field wajib agar lolos validasi backend
      formData.append('parent_name', '-');
      formData.append('phone', '-');
      
      const res = await pmbApi.register(formData);
      if (res.data.success) {
        await pmbApi.updateStatus(res.data.data.id, { status: 'accepted' });
        setIsModalOpen(false);
        setForm({ student_name: '', gender: 'L', previous_school: '' });
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menambahkan pendaftar');
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-primary-600" /> Data Pendaftar PMB
        </h1>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-primary-600/20">
          <Plus className="w-4 h-4" /> Input Siswa Diterima
        </button>
      </div>


      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">No. Daftar</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Asal Sekolah</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Orang Tua</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-primary-50/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-gray-600">{item.registration_number}</td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800">{item.student_name}</span>
                    <span className="block text-xs text-gray-400 mt-0.5">{item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{item.previous_school || '-'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {item.parent_name !== '-' ? (
                      <>
                        <span>{item.parent_name}</span>
                        <span className="block text-xs text-gray-400 mt-0.5">{item.phone}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Input Manual Admin</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      item.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 
                      item.status === 'rejected' ? 'bg-red-50 text-red-700' : 
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status === 'accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                       item.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                       <Clock className="w-3.5 h-3.5" />}
                      {item.status === 'accepted' ? 'Diterima' : item.status === 'rejected' ? 'Ditolak' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex gap-1.5 justify-end">
                      {item.status !== 'accepted' && (
                        <button onClick={() => updateStatus(item.id, 'accepted')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Terima">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button onClick={() => updateStatus(item.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Tolak">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setDeleteConfirm(item)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Belum ada pendaftar atau siswa yang diinput.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary-600" /> Input Siswa Diterima
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleManualAdd} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Siswa *</label>
                  <input className="input-field" value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})} placeholder="Masukkan nama lengkap" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Kelamin *</label>
                    <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Asal Sekolah</label>
                    <input className="input-field" value={form.previous_school} onChange={e => setForm({...form, previous_school: e.target.value})} placeholder="TK/RA..." />
                  </div>
                </div>
                
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs flex gap-2 items-start mt-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Siswa yang diinput melalui form ini akan otomatis ditambahkan ke daftar Pengumuman Siswa Diterima.</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">Batal</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium shadow-md shadow-primary-600/20 disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Hapus Data</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Yakin ingin menghapus data <strong>{deleteConfirm.student_name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPmb;

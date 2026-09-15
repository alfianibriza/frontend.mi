import { useState, useEffect, useMemo } from 'react';
import { pmbApi } from '../../api';
import { 
  ClipboardList, Clock, CheckCircle2, XCircle, Check, X, 
  Plus, Trash2, Search, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPmb = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, accepted, pending, rejected

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ student_name: '', gender: 'L', previous_school: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = () => {
    setLoading(true);
    pmbApi.getAll({ limit: 100 })
      .then(res => setItems(res.data.data || []))
      .catch((err) => {
        console.error('Failed to load PMB:', err);
        showToast('Gagal memuat data pendaftar PMB', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const updateStatus = async (id, status) => {
    try { 
      await pmbApi.updateStatus(id, { status }); 
      showToast(`Status pendaftar berhasil diubah menjadi ${status === 'accepted' ? 'Diterima' : 'Ditolak'}`);
      loadData(); 
    } catch (err) {
      showToast('Gagal memperbarui status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await pmbApi.delete(id);
      setDeleteConfirm(null);
      showToast('Data pendaftar berhasil dihapus');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus pendaftar', 'error');
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
      formData.append('parent_name', '-');
      formData.append('phone', '-');
      
      const res = await pmbApi.register(formData);
      if (res.data.success) {
        await pmbApi.updateStatus(res.data.data.id, { status: 'accepted' });
        setIsModalOpen(false);
        setForm({ student_name: '', gender: 'L', previous_school: '' });
        showToast('Siswa berhasil ditambahkan dan berstatus Diterima');
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan pendaftar', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Status metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const accepted = items.filter(i => i.status === 'accepted').length;
    const pending = items.filter(i => i.status === 'pending' || !i.status).length;
    const rejected = items.filter(i => i.status === 'rejected').length;
    return { total, accepted, pending, rejected };
  }, [items]);

  // Filter and search
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchFilter = 
        activeFilter === 'all' ? true :
        activeFilter === 'accepted' ? item.status === 'accepted' :
        activeFilter === 'rejected' ? item.status === 'rejected' :
        (item.status === 'pending' || !item.status);

      if (!matchFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.student_name?.toLowerCase().includes(q) ||
        item.registration_number?.toLowerCase().includes(q) ||
        item.previous_school?.toLowerCase().includes(q) ||
        item.parent_name?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q)
      );
    });
  }, [items, activeFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
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
            {toast.type === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-outfit">
              Data Pendaftar PMB
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Verifikasi dan kelola berkas pendaftaran calon santri baru
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Input Siswa Diterima</span>
        </button>
      </div>

      {/* Status Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'all'
              ? 'bg-primary-50/70 border-primary-300 ring-2 ring-primary-500/20 shadow-xs'
              : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Pendaftar</span>
          <span className="text-2xl font-extrabold text-gray-900 font-outfit mt-1 block">{metrics.total}</span>
        </button>

        <button
          onClick={() => setActiveFilter('accepted')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'accepted'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Diterima</span>
          <span className="text-2xl font-extrabold text-emerald-700 font-outfit mt-1 block">{metrics.accepted}</span>
        </button>

        <button
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}
        >
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Menunggu</span>
          <span className="text-2xl font-extrabold text-amber-700 font-outfit mt-1 block">{metrics.pending}</span>
        </button>

        <button
          onClick={() => setActiveFilter('rejected')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === 'rejected'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-500/20 shadow-xs'
              : 'bg-white border-gray-100 hover:bg-gray-50'
          }`}
        >
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">Ditolak</span>
          <span className="text-2xl font-extrabold text-red-700 font-outfit mt-1 block">{metrics.rejected}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, no. daftar, asal sekolah, orang tua..."
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

        <div className="text-xs font-semibold text-gray-500 shrink-0 self-end sm:self-center">
          Menampilkan <strong>{filteredItems.length}</strong> calon siswa
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-xs flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-500">Memuat data pendaftar PMB...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">No. Reg</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Calon Siswa</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Wali / No. Telp</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-primary-50/20 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-gray-500">
                        {item.registration_number || '-'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900 block">{item.student_name}</span>
                        <span className="inline-block text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md mt-1">
                          {item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.previous_school || '-'}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.parent_name && item.parent_name !== '-' ? (
                          <>
                            <span className="font-medium text-gray-900 block">{item.parent_name}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-primary-500" />
                              {item.phone}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Input Manual Admin</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                          item.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 
                          item.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200/60' : 
                          'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {item.status === 'accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                           item.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                           <Clock className="w-3.5 h-3.5" />}
                          <span>{item.status === 'accepted' ? 'Diterima' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'accepted' && (
                            <button 
                              onClick={() => updateStatus(item.id, 'accepted')} 
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer" 
                              title="Setujui dan Terima"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Terima</span>
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button 
                              onClick={() => updateStatus(item.id, 'rejected')} 
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer" 
                              title="Tolak Pendaftaran"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Tolak</span>
                            </button>
                          )}
                          <button 
                            onClick={() => setDeleteConfirm(item)} 
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" 
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 block mb-0.5">
                      {item.registration_number || 'REG-MANUAL'}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">
                      {item.student_name}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold shrink-0 ${
                    item.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 
                    item.status === 'rejected' ? 'bg-red-50 text-red-700' : 
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {item.status === 'accepted' ? 'Diterima' : item.status === 'rejected' ? 'Ditolak' : 'Pending'}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Jenis Kelamin:</span>
                    <span className="font-semibold text-gray-700">{item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asal Sekolah:</span>
                    <span className="font-semibold text-gray-700">{item.previous_school || '-'}</span>
                  </div>
                  {item.parent_name && item.parent_name !== '-' && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orang Tua/Wali:</span>
                      <span className="font-semibold text-gray-700">{item.parent_name} ({item.phone})</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {item.status !== 'accepted' && (
                    <button 
                      onClick={() => updateStatus(item.id, 'accepted')} 
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Terima</span>
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button 
                      onClick={() => updateStatus(item.id, 'rejected')} 
                      className="flex-1 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setDeleteConfirm(item)} 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800">
            {searchQuery ? 'Pendaftar Tidak Ditemukan' : 'Belum Ada Pendaftar'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm">
            {searchQuery
              ? `Tidak ada calon siswa dengan kata kunci "${searchQuery}".`
              : 'Belum ada pendaftaran masuk dari formulir publik maupun input manual.'
            }
          </p>
        </div>
      )}

      {/* Manual Input Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-outfit">
                  <span className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </span>
                  <span>Input Siswa Diterima</span>
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleManualAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nama Siswa Lengkap *
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                    value={form.student_name} 
                    onChange={e => setForm({...form, student_name: e.target.value})} 
                    placeholder="Contoh: Muhammad Rayhan" 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Jenis Kelamin *
                    </label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                      value={form.gender} 
                      onChange={e => setForm({...form, gender: e.target.value})}
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Asal Sekolah
                    </label>
                    <input 
                      className="w-full px-4 py-3 bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                      value={form.previous_school} 
                      onChange={e => setForm({...form, previous_school: e.target.value})} 
                      placeholder="TK/RA..." 
                    />
                  </div>
                </div>
                
                <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs flex gap-2.5 items-start border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Siswa yang diinput melalui formulir ini akan langsung diverifikasi dan ditampilkan di tabel <strong>Pengumuman Siswa Diterima</strong> pada laman PMB publik.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 disabled:opacity-50 transition-all"
                  >
                    {saving ? 'Menyimpan...' : 'Tambahkan Siswa'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100" 
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-outfit mb-1">Hapus Data Pendaftar?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Yakin ingin menghapus data calon santri <strong>{deleteConfirm.student_name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm.id)} 
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPmb;

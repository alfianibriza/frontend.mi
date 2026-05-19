import { useState, useEffect } from 'react';
import { pmbSettingApi } from '../../api';
import MediaPickerModal from '../../components/common/MediaPickerModal';
import {
  ClipboardList, Plus, Edit, Trash2, X, Save, Info,
  Download, UserCheck, Eye, EyeOff, FileText, ChevronDown,
  Sparkles, RefreshCw, AlertTriangle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const SECTION_OPTIONS = [
  { value: 'informasi', label: 'Informasi', icon: Info, color: 'blue' },
  { value: 'unduh_pendaftaran', label: 'Unduh Pendaftaran', icon: Download, color: 'emerald' },
  { value: 'pengumuman', label: 'Pengumuman Diterima', icon: UserCheck, color: 'amber' },
];

const getSectionMeta = (key) => SECTION_OPTIONS.find(s => s.value === key) || SECTION_OPTIONS[0];

const AdminPmbSettings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterSection, setFilterSection] = useState('');
  const [form, setForm] = useState({
    section_key: 'informasi',
    title: '',
    content: '',
    file_url: '',
    file_name: '',
    academic_year: '',
    is_active: true,
    sort_order: 0
  });

  const loadData = () => {
    setLoading(true);
    pmbSettingApi.getAllAdmin()
      .then(res => setItems(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleInit = async () => {
    setSaving(true);
    try {
      await pmbSettingApi.init();
      loadData();
    } catch {}
    setSaving(false);
  };

  const openCreate = () => {
    const year = new Date().getFullYear();
    setForm({
      section_key: 'informasi',
      title: '',
      content: '',
      file_url: '',
      file_name: '',
      academic_year: `${year}/${year + 1}`,
      is_active: true,
      sort_order: 0
    });
    setIsNew(true);
    setEditItem({});
  };

  const openEdit = (item) => {
    setForm({
      section_key: item.section_key || 'informasi',
      title: item.title || '',
      content: item.content || '',
      file_url: item.file_url || '',
      file_name: item.file_name || '',
      academic_year: item.academic_year || '',
      is_active: item.is_active !== undefined ? item.is_active : true,
      sort_order: item.sort_order || 0
    });
    setIsNew(false);
    setEditItem(item);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert('Judul wajib diisi!');
    setSaving(true);
    try {
      if (isNew) {
        await pmbSettingApi.create(form);
      } else {
        await pmbSettingApi.update(editItem.id, form);
      }
      setEditItem(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await pmbSettingApi.delete(id);
      setDeleteConfirm(null);
      loadData();
    } catch {}
  };

  const toggleActive = async (item) => {
    try {
      await pmbSettingApi.update(item.id, { is_active: !item.is_active });
      loadData();
    } catch {}
  };

  const filteredItems = filterSection
    ? items.filter(i => i.section_key === filterSection)
    : items;

  const sectionCounts = SECTION_OPTIONS.reduce((acc, s) => {
    acc[s.value] = items.filter(i => i.section_key === s.value).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-primary-600" /> Kelola PMB
        </h1>
        <div className="flex gap-2">
          {items.length === 0 && (
            <button onClick={handleInit} disabled={saving} className="px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-amber-500/20 disabled:opacity-50">
              <Sparkles className="w-4 h-4" /> {saving ? 'Memuat...' : 'Inisialisasi Default'}
            </button>
          )}
          <button onClick={openCreate} className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-primary-600/20">
            <Plus className="w-4 h-4" /> Tambah Konten
          </button>
        </div>
      </div>

      {/* Section Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterSection('')}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            !filterSection ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Semua ({items.length})
        </button>
        {SECTION_OPTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.value}
              onClick={() => setFilterSection(s.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filterSection === s.value
                  ? `bg-${s.color}-500 text-white shadow-lg`
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
              style={filterSection === s.value ? {
                background: s.color === 'blue' ? '#3b82f6' : s.color === 'emerald' ? '#10b981' : '#f59e0b'
              } : {}}
            >
              <Icon className="w-4 h-4" />
              {s.label} ({sectionCounts[s.value] || 0})
            </button>
          );
        })}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map(item => {
            const meta = getSectionMeta(item.section_key);
            const Icon = meta.icon;
            return (
              <div key={item.id} className={`bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all ${!item.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4 p-5">
                  {/* Section Badge */}
                  <div className={`p-3 rounded-xl shrink-0`} style={{
                    background: meta.color === 'blue' ? '#eff6ff' : meta.color === 'emerald' ? '#ecfdf5' : '#fffbeb'
                  }}>
                    <Icon className="w-5 h-5" style={{
                      color: meta.color === 'blue' ? '#3b82f6' : meta.color === 'emerald' ? '#10b981' : '#f59e0b'
                    }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                      {!item.is_active && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium shrink-0">NONAKTIF</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md font-medium">{meta.label}</span>
                      {item.academic_year && <span>TA {item.academic_year}</span>}
                      {item.file_url && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <FileText className="w-3 h-3" /> File terlampir
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => toggleActive(item)} className={`p-2 rounded-lg transition-colors ${item.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`} title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                      {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteConfirm(item)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 mb-1">Belum Ada Konten PMB</h3>
          <p className="text-sm text-gray-400 mb-4">Klik tombol "Inisialisasi Default" untuk membuat template awal, atau tambahkan konten secara manual.</p>
          <div className="flex justify-center gap-3">
            <button onClick={handleInit} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm hover:bg-amber-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Inisialisasi Default
            </button>
            <button onClick={openCreate} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm hover:bg-primary-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Manual
            </button>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[2rem]">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-primary-600 bg-primary-50 p-2.5 rounded-xl">
                  {isNew ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                </span>
                {isNew ? 'Tambah Konten PMB' : 'Edit Konten PMB'}
              </h2>
              <button onClick={() => setEditItem(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-6">
              {/* Section Key */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Konten *</label>
                <div className="grid grid-cols-3 gap-2">
                  {SECTION_OPTIONS.map(s => {
                    const Icon = s.icon;
                    const isSelected = form.section_key === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setForm({ ...form, section_key: s.value })}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Academic Year */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Judul *</label>
                  <input className="input-field bg-gray-50 focus:bg-white" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Judul konten..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun Ajaran</label>
                  <input className="input-field bg-gray-50 focus:bg-white" value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })} placeholder="2026/2027" />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Konten {form.section_key === 'informasi' || form.section_key === 'pengumuman' ? '(HTML)' : ''}
                </label>
                <textarea
                  className="input-field bg-gray-50 focus:bg-white font-mono text-sm"
                  rows={8}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Isi konten di sini..."
                />
              </div>

              {/* File URL - shown for unduh_pendaftaran */}
              {form.section_key === 'unduh_pendaftaran' && (
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> File Unduhan
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">URL File</label>
                      <div className="flex gap-2">
                        <input
                          className="input-field bg-white flex-1"
                          value={form.file_url}
                          onChange={e => setForm({ ...form, file_url: e.target.value })}
                          placeholder="URL file atau pilih dari pustaka media..."
                        />
                        <button type="button" onClick={() => setIsMediaPickerOpen(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap">
                          Pilih Media
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nama File (ditampilkan ke user)</label>
                      <input
                        className="input-field bg-white"
                        value={form.file_name}
                        onChange={e => setForm({ ...form, file_name: e.target.value })}
                        placeholder="contoh: Formulir-Pendaftaran-PMB-2026.pdf"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sort Order & Active */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan</label>
                  <input type="number" className="input-field bg-gray-50 focus:bg-white" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      form.is_active
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-gray-50 text-gray-500'
                    }`}
                  >
                    {form.is_active ? <><Eye className="w-4 h-4" /> Aktif (Ditampilkan)</> : <><EyeOff className="w-4 h-4" /> Nonaktif (Disembunyikan)</>}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium flex-1 shadow-lg shadow-primary-600/20 flex justify-center items-center gap-2 sm:text-lg disabled:opacity-50 order-1 sm:order-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Menyimpan...' : isNew ? 'Simpan' : 'Simpan Perubahan'}
                </button>
                <button onClick={() => setEditItem(null)} className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium sm:text-lg order-2 sm:order-1">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Hapus Konten</h3>
                <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Yakin ingin menghapus <strong>"{deleteConfirm.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium text-sm">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium text-sm flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setForm({ ...form, file_url: url })}
      />
    </div>
  );
};

export default AdminPmbSettings;

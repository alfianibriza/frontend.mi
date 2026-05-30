import { Routes, Route, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ClipboardList, Clock, CheckCircle2, XCircle, Building2, Edit, 
  Users, Trash2, Newspaper, GraduationCap, Trophy, Activity, 
  School, Calendar, Check, X, Plus
} from 'lucide-react';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import MediaPickerModal from './components/common/MediaPickerModal';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');


// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NewsPage from './pages/public/NewsPage';
import NewsDetail from './pages/public/NewsDetail';
import ProfilePage from './pages/public/ProfilePage';
import FacilityPage from './pages/public/FacilityPage';
import PmbPage from './pages/public/PmbPage';
import PrestasiPage from './pages/public/PrestasiPage';
import AlumniPage from './pages/public/AlumniPage';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminCrud from './pages/admin/AdminCrud';
import AdminBeranda from './pages/admin/AdminBeranda';
import AdminMedia from './pages/admin/AdminMedia';
import AdminPmb from './pages/admin/AdminPmb';
import AdminPmbSettings from './pages/admin/AdminPmbSettings';

// API
import { newsApi, profileApi, teacherApi, achievementApi, extracurricularApi, facilityApi, alumniApi, scheduleApi, userApi, pmbApi, homeSettingApi } from './api';

/** Public Layout: Navbar + Content + Footer */
const PublicLayout = () => (
  <>
    <Navbar />
    <main><Outlet /></main>
    <Footer />
  </>
);

/** Admin Layout: Sidebar + Content */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="text-sm text-gray-500">Admin Panel</h2>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
};

// Field configs for admin CRUD pages
const newsFields = [
  { name: 'title', label: 'Judul', required: true },
  { name: 'content', label: 'Konten', type: 'textarea', required: true },
  { name: 'author', label: 'Penulis', required: true },
];

const teacherFields = [
  { name: 'name', label: 'Nama', required: true },
  { name: 'position', label: 'Jabatan' },
  { name: 'subject', label: 'Mata Pelajaran' },
  { name: 'education', label: 'Pendidikan' },
  { name: 'sort_order', label: 'Urutan', type: 'number', defaultValue: 0 },
];

const achievementFields = [
  { name: 'title', label: 'Judul Prestasi', required: true },
  { name: 'description', label: 'Deskripsi', type: 'textarea' },
  { name: 'level', label: 'Tingkat', type: 'select', options: [{ value: '', label: '-- Pilih Tingkat --' }, { value: 'Kecamatan', label: 'Kecamatan' }, { value: 'Kabupaten', label: 'Kabupaten' }, { value: 'Provinsi', label: 'Provinsi' }, { value: 'Nasional', label: 'Nasional' }, { value: 'Internasional', label: 'Internasional' }] },
  { name: 'year', label: 'Tahun' },
];

const ekskulFields = [
  { name: 'name', label: 'Nama Ekskul', required: true },
  { name: 'description', label: 'Deskripsi', type: 'textarea' },
  { name: 'schedule', label: 'Jadwal' },
  { name: 'coach', label: 'Pelatih' },
];

const facilityFields = [
  { name: 'name', label: 'Nama Fasilitas', required: true },
  { name: 'description', label: 'Deskripsi', type: 'textarea' },
  { name: 'quantity', label: 'Jumlah', type: 'number', defaultValue: 1 },
  { name: 'condition', label: 'Kondisi', type: 'select', options: [{ value: 'baik', label: 'Baik' }, { value: 'cukup', label: 'Cukup' }, { value: 'kurang', label: 'Kurang' }] },
];

const alumniFields = [
  { name: 'name', label: 'Nama', required: true },
  { name: 'graduation_year', label: 'Tahun Lulus', required: true },
  { name: 'current_activity', label: 'Aktivitas Saat Ini' },
  { name: 'testimonial', label: 'Testimoni', type: 'textarea' },
];

const scheduleFields = [
  { name: 'class_name', label: 'Kelas', required: true },
  { name: 'subject', label: 'Mata Pelajaran', required: true },
  { name: 'teacher', label: 'Guru', required: true },
  { name: 'day', label: 'Hari', type: 'select', options: [{ value: 'Senin', label: 'Senin' }, { value: 'Selasa', label: 'Selasa' }, { value: 'Rabu', label: 'Rabu' }, { value: 'Kamis', label: 'Kamis' }, { value: 'Jumat', label: 'Jumat' }, { value: 'Sabtu', label: 'Sabtu' }] },
  { name: 'time_start', label: 'Jam Mulai', required: true },
  { name: 'time_end', label: 'Jam Selesai', required: true },
];



/** Admin Profile Page */
const AdminProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', image: '' });
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const loadData = () => { profileApi.getAll().then(res => setProfiles(res.data.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try { await profileApi.update(editItem.id, form); setEditItem(null); loadData(); } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><School className="w-8 h-8 text-primary-600" /> Kelola Profil</h1>
      {editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6" onClick={() => setEditItem(null)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[2rem]">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                 <span className="text-primary-600 bg-primary-50 p-2.5 rounded-xl"><Edit className="w-5 h-5"/></span> Edit: {editItem.title}
              </h2>
              <button onClick={() => setEditItem(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Judul</label>
                  <input className="input-field bg-gray-50 focus:bg-white transition-all shadow-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Konten (HTML)</label>
                  <textarea className="input-field bg-gray-50 focus:bg-white transition-all shadow-sm" rows={12} value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
                </div>
                
                <div className="bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Upload File / Gambar</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-1 w-full">
                      <input 
                        className="input-field bg-white shadow-sm" 
                        value={form.image || ''} 
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="Masukkan URL atau pilih dari pustaka media..." 
                      />
                      <button type="button" onClick={() => setIsMediaPickerOpen(true)} className="mt-3 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium flex items-center gap-2">
                        Pilih Media
                      </button>
                    </div>
                    {form.image ? (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border border-gray-200 overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm relative group">
                        <img src={form.image.startsWith('/') ? `${API_BASE}${form.image}` : form.image} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
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

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 mt-2">
                  <button onClick={handleSave} className="px-8 py-3.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium flex-1 shadow-lg shadow-primary-600/20 flex justify-center items-center gap-2 sm:text-lg order-1 sm:order-2">
                    Simpan Perubahan
                  </button>
                  <button onClick={() => setEditItem(null)} className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium sm:text-lg order-2 sm:order-1">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading ? <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div> : (
        <div className="space-y-4">
          {profiles.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
              <div><h3 className="font-semibold text-gray-800">{p.title}</h3><p className="text-sm text-gray-500">{p.section_key}</p></div>
              <button onClick={() => { setEditItem(p); setForm({ title: p.title, content: p.content || '', image: p.image || '' }); }} className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</button>
            </div>
          ))}
          {profiles.length === 0 && <p className="text-center text-gray-500 py-10">Jalankan seeder terlebih dahulu.</p>}
        </div>
      )}
      <MediaPickerModal 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={(url) => setForm({ ...form, image: url })} 
      />
    </div>
  );
};

/** Admin Users Page */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const loadData = () => { userApi.getAll({ limit: 100 }).then(res => setUsers(res.data.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => { if (confirm('Yakin ingin menghapus user ini?')) { try { await userApi.delete(id); loadData(); } catch {} } };

  const openCreateModal = () => {
    setEditItem(null);
    setForm({ name: '', email: '', password: '', role: 'user' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditItem(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
    setForm({ name: '', email: '', password: '', role: 'user' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        // Update: only send password if filled
        const updateData = { name: form.name, email: form.email, role: form.role };
        if (form.password) updateData.password = form.password;
        await userApi.update(editItem.id, updateData);
      } else {
        await userApi.create(form);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || (editItem ? 'Gagal mengupdate user' : 'Gagal menambahkan user'));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Users className="w-8 h-8 text-primary-600" /> Kelola Users</h1>
        <button onClick={openCreateModal} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center gap-2 font-medium">
          <Plus className="w-5 h-5" /> Tambah User
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {editItem ? (
                  <><span className="text-primary-600 bg-primary-50 p-1.5 rounded-lg"><Edit className="w-4 h-4" /></span> Edit User</>
                ) : (
                  <><span className="text-primary-600 bg-primary-50 p-1.5 rounded-lg"><Plus className="w-4 h-4" /></span> Tambah User Baru</>
                )}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input required className="input-field bg-gray-50" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input required type="email" className="input-field bg-gray-50" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contoh@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password {editItem && <span className="text-xs text-gray-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input 
                  type="password" 
                  minLength={form.password ? 6 : undefined}
                  className="input-field bg-gray-50" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required={!editItem}
                  placeholder={editItem ? '••••••••' : 'Minimal 6 karakter'}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select className="input-field bg-gray-50" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-md shadow-primary-600/20 transition-all flex items-center gap-2">
                  {editItem ? <><Check className="w-4 h-4" /> Update</> : <><Plus className="w-4 h-4" /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div> : (
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b"><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nama</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Email</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Role</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(u)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit user">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Hapus user">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-10 text-center text-gray-400">Belum ada user.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/berita/:slug" element={<NewsDetail />} />
        <Route path="/profil/:section" element={<ProfilePage />} />
        <Route path="/prestasi" element={<PrestasiPage />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/fasilitas" element={<FacilityPage />} />
        <Route path="/pmb" element={<PmbPage />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/beranda" element={<AdminBeranda />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/berita" element={<AdminCrud title="Kelola Berita" icon={<Newspaper className="w-8 h-8" />} api={newsApi} fields={newsFields} imageField="thumbnail" />} />
        <Route path="/admin/profil" element={<AdminProfile />} />
        <Route path="/admin/guru" element={<AdminCrud title="Kelola Guru" icon={<Users className="w-8 h-8" />} api={teacherApi} fields={teacherFields} imageField="photo" />} />
        <Route path="/admin/prestasi" element={<AdminCrud title="Kelola Prestasi" icon={<Trophy className="w-8 h-8" />} api={achievementApi} fields={achievementFields} imageField="image" />} />
        <Route path="/admin/ekskul" element={<AdminCrud title="Kelola Ekskul" icon={<Activity className="w-8 h-8" />} api={extracurricularApi} fields={ekskulFields} imageField="image" />} />
        <Route path="/admin/fasilitas" element={<AdminCrud title="Kelola Sarpras" icon={<Building2 className="w-8 h-8" />} api={facilityApi} fields={facilityFields} imageField="image" />} />
        <Route path="/admin/pmb-settings" element={<AdminPmbSettings />} />
        <Route path="/admin/pmb" element={<AdminPmb />} />
        <Route path="/admin/alumni" element={<AdminCrud title="Kelola Alumni" icon={<GraduationCap className="w-8 h-8" />} api={alumniApi} fields={alumniFields} imageField="photo" />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default App;

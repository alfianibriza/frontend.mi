import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi, pmbApi, userApi, alumniApi } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Newspaper, ClipboardList, Users, GraduationCap, 
  LayoutDashboard, Building2, Lightbulb, ArrowRight,
  Plus, Image as ImageIcon, Home, Settings,
  Calendar, School
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ news: 0, pmb: 0, users: 0, alumni: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [n, p, u, a] = await Promise.all([
          newsApi.getAll({ limit: 1 }),
          pmbApi.getAll({ limit: 1 }),
          userApi.getAll({ limit: 1 }),
          alumniApi.getAll({ limit: 1 }),
        ]);
        setStats({
          news: n.data.pagination?.totalItems || 0,
          pmb: p.data.pagination?.totalItems || 0,
          users: u.data.pagination?.totalItems || 0,
          alumni: a.data.pagination?.totalItems || 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const cards = [
    { 
      label: 'Total Warta Berita', 
      value: stats.news, 
      icon: Newspaper, 
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      link: '/admin/berita',
      desc: 'Artikel & kabar kegiatan'
    },
    { 
      label: 'Pendaftar PMB', 
      value: stats.pmb, 
      icon: ClipboardList, 
      color: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700',
      link: '/admin/pmb',
      desc: 'Siswa mendaftar online'
    },
    { 
      label: 'Pengguna Sistem', 
      value: stats.users, 
      icon: Users, 
      color: 'from-purple-500 to-violet-600',
      badgeBg: 'bg-purple-50 text-purple-700',
      link: '/admin/users',
      desc: 'Pengelola akun admin'
    },
    { 
      label: 'Jejaring Alumni', 
      value: stats.alumni, 
      icon: GraduationCap, 
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700',
      link: '/admin/alumni',
      desc: 'Profil lulusan tercatat'
    },
  ];

  const quickActions = [
    { title: 'Tulis Berita Baru', path: '/admin/berita', icon: Newspaper, color: 'bg-emerald-500 text-white' },
    { title: 'Data Pendaftar PMB', path: '/admin/pmb', icon: ClipboardList, color: 'bg-blue-500 text-white' },
    { title: 'Kelola Beranda', path: '/admin/beranda', icon: Home, color: 'bg-indigo-500 text-white' },
    { title: 'Pustaka Media', path: '/admin/media', icon: ImageIcon, color: 'bg-purple-500 text-white' },
    { title: 'Kelola Profil Sekolah', path: '/admin/profil', icon: School, color: 'bg-amber-500 text-white' },
    { title: 'Konten Info PMB', path: '/admin/pmb-settings', icon: Settings, color: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-emerald-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-3 border border-white/10">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
              Selamat Datang, {user?.name || 'Administrator'}! 👋
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-1.5 max-w-xl">
              Panel administrasi terpadu MI Al-Ghazali. Pantau metrik sekolah, verifikasi pendaftaran, dan perbarui informasi secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/berita"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Buat Berita</span>
            </Link>
            <Link
              to="/admin/pmb"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Data PMB</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 font-outfit flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary-600" />
            <span>Ringkasan Data Sekolah</span>
          </h2>
          {loading && (
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span>Memperbarui data...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                to={c.link}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.badgeBg}`}>
                      Aktif
                    </span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-outfit">
                    {c.value}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-1">
                    {c.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                  <span>Kelola Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 font-outfit mb-4">
          Akses Cepat Pengelolaan
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-200 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gray-700 group-hover:text-primary-700 leading-tight">
                  {action.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info & Tips Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-6 sm:p-7 border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-emerald-950 font-outfit">Petunjuk Pembaruan Konten</h3>
          </div>
          <p className="text-sm text-emerald-800/90 leading-relaxed mb-4">
            Setiap perubahan data (Berita, Guru, Prestasi, Profil, dan Foto Beranda) yang disimpan di panel ini akan langsung tersinkronisasi dan tampil di halaman publik pengunjung.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-700">
            <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/50">⚡ Sinkronisasi Cepat</span>
            <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/50">📱 Responsif Seluler</span>
            <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/50">🔒 Akses Terlindungi</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-800 font-outfit">Status Operasional PMB</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pendaftaran Peserta Didik Baru (PMB) aktif melayani registrasi online. Anda dapat memeriksa berkas pendaftar dan memperbarui status penerimaan sewaktu-waktu.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Tersambung ke database sekolah</span>
            <Link to="/admin/pmb" className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
              <span>Buka Menu PMB</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

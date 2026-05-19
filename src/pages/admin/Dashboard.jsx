import { useState, useEffect } from 'react';
import { newsApi, pmbApi, userApi, alumniApi } from '../../api';
import { Newspaper, ClipboardList, Users, GraduationCap, LayoutDashboard, Building, Lightbulb } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ news: 0, pmb: 0, users: 0, alumni: 0 });

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
      } catch { }
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Berita', value: stats.news, icon: Newspaper, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Pendaftar PMB', value: stats.pmb, icon: ClipboardList, color: 'from-blue-500 to-blue-700' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-purple-500 to-purple-700' },
    { label: 'Data Alumni', value: stats.alumni, icon: GraduationCap, color: 'from-amber-500 to-amber-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2"><LayoutDashboard className="w-8 h-8 text-primary-600" /> Dashboard Admin</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{c.value}</p>
              <p className="text-sm text-gray-500 mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-gray-500" /> Selamat Datang di Admin Panel</h2>
        <p className="text-gray-600">Gunakan sidebar di sebelah kiri untuk mengelola konten website MI Al-Ghazali.</p>
        <div className="mt-6 p-4 bg-primary-50 rounded-xl flex gap-3">
          <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0" />
          <p className="text-sm text-primary-700"><strong>Tips:</strong> Semua data yang Anda kelola di sini akan langsung tampil di website publik.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

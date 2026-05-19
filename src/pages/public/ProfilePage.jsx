import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileApi, teacherApi, achievementApi, extracurricularApi } from '../../api';

const sectionMap = {
  'sejarah': { key: 'sejarah', icon: '' },
  'visi-misi': { key: 'visi_misi', icon: '' },
  'program-kerja': { key: 'program_kerja', icon: '' },
  'filosofi-logo': { key: 'filosofi_logo', icon: '' },
  'guru': { key: 'ptk', icon: '' },
  'prestasi': { key: 'prestasi', icon: '' },
  'ekstrakurikuler': { key: 'ekskul', icon: '' },
};

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ProfilePage = () => {
  const { section } = useParams();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cfg = sectionMap[section] || { key: section, icon: '📄' };

  useEffect(() => {
    setLoading(true);
    setProfile(null);
    setItems([]);
    const load = async () => {
      try {
        if (section === 'guru') {
          const res = await teacherApi.getAll({ limit: 100 });
          setItems(res.data.data);
        } else if (section === 'prestasi') {
          const res = await achievementApi.getAll({ limit: 100 });
          setItems(res.data.data);
        } else if (section === 'ekstrakurikuler') {
          const res = await extracurricularApi.getAll({ limit: 100 });
          setItems(res.data.data);
        } else {
          const res = await profileApi.getByKey(cfg.key);
          setProfile(res.data.data);
        }
      } catch { }
      setLoading(false);
    };
    load();
  }, [section]);

  const title = profile?.title || section?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Profil';

  return (
    <div className="pt-20 min-h-screen">
      <div className="hero-gradient py-16 pattern-dots">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-5xl mb-4 block">{cfg.icon}</span>
          <h1 className="text-4xl font-bold text-white">{title}</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
        ) : section === 'guru' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((t, i) => (
              <div key={t.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
                  {t.photo ? <img src={t.photo.startsWith('/') ? `${API_BASE}${t.photo}` : t.photo} alt={t.name} className="w-full h-full object-cover" /> : <span className="text-6xl">👨‍🏫</span>}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800">{t.name}</h3>
                  <p className="text-sm text-primary-600">{t.position}</p>
                  {t.subject && <p className="text-xs text-gray-500 mt-1">{t.subject}</p>}
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Belum ada data guru.</p>}
          </div>
        ) : section === 'prestasi' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a, i) => (
              <div key={a.id} className="bg-white rounded-2xl shadow-md p-6 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{a.title}</h3>
                    <p className="text-sm text-primary-600 mt-1">{a.level} • {a.year}</p>
                    {a.description && <p className="text-sm text-gray-500 mt-2">{a.description}</p>}
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Belum ada data prestasi.</p>}
          </div>
        ) : section === 'ekstrakurikuler' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((e, i) => (
              <div key={e.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
                  {e.image ? <img src={e.image.startsWith('/') ? `${API_BASE}${e.image}` : e.image} alt={e.name} className="w-full h-full object-cover" /> : <span className="text-5xl">⚽</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800">{e.name}</h3>
                  {e.schedule && <p className="text-sm text-primary-600 mt-1">📅 {e.schedule}</p>}
                  {e.coach && <p className="text-sm text-gray-500 mt-1">🧑‍🏫 {e.coach}</p>}
                  {e.description && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{e.description}</p>}
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Belum ada data ekstrakurikuler.</p>}
          </div>
        ) : profile ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              {profile.image && <img src={profile.image.startsWith('/') ? `${API_BASE}${profile.image}` : profile.image} alt={profile.title} className="w-full max-h-96 object-cover rounded-xl mb-8" />}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: profile.content || '<p>Konten belum tersedia.</p>' }} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-gray-500">Konten belum tersedia.</p></div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileApi, teacherApi, achievementApi, extracurricularApi } from '../../api';
import { BookOpen, Compass, Target, Sparkles, Users, Trophy, Activity, Calendar, User, FileText } from 'lucide-react';

const sectionMap = {
  'sejarah': { key: 'sejarah', label: 'Sejarah Singkat', icon: BookOpen },
  'visi-misi': { key: 'visi_misi', label: 'Visi & Misi', icon: Compass },
  'program-kerja': { key: 'program_kerja', label: 'Program Kerja', icon: Target },
  'filosofi-logo': { key: 'filosofi_logo', label: 'Filosofi Logo', icon: Sparkles },
  'guru': { key: 'ptk', label: 'Guru & Tenaga Kependidikan', icon: Users },
  'prestasi': { key: 'prestasi', label: 'Prestasi Siswa', icon: Trophy },
  'ekstrakurikuler': { key: 'ekskul', label: 'Kegiatan Ekstrakurikuler', icon: Activity },
};

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const ProfilePage = () => {
  const { section } = useParams();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cfg = sectionMap[section] || { key: section, label: 'Profil Madrasah', icon: FileText };
  const IconComponent = cfg.icon;

  useEffect(() => {
    setLoading(true);
    setProfile(null);
    setItems([]);
    const load = async () => {
      try {
        if (section === 'guru') {
          const res = await teacherApi.getAll({ limit: 100 });
          setItems(res.data.data || []);
        } else if (section === 'prestasi') {
          const res = await achievementApi.getAll({ limit: 100 });
          setItems(res.data.data || []);
        } else if (section === 'ekstrakurikuler') {
          const res = await extracurricularApi.getAll({ limit: 100 });
          setItems(res.data.data || []);
        } else {
          const res = await profileApi.getByKey(cfg.key);
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
        if (section === 'ekstrakurikuler') {
          setItems([{ id: 999, name: 'Error Loading Data', description: err.message || 'Unknown error occurred' }]);
        }
      }
      setLoading(false);
    };
    load();
  }, [section]);

  const title = profile?.title || cfg.label || section?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Profil';

  return (
    <div className="pt-20 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="hero-gradient py-14 sm:py-20 pattern-dots relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-emerald-200 mb-4 border border-white/15 shadow-inner">
            <IconComponent className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight font-outfit">
            {title}
          </h1>
          <p className="text-primary-100/90 text-sm sm:text-base max-w-xl mx-auto">
            Mengenal lebih dekat MI Al-Ghazali, madrasah unggul bernuansa islami dan berwawasan masa depan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat data...</p>
          </div>
        ) : section === 'guru' ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((t, i) => (
              <div 
                key={t.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {t.photo ? (
                    <img 
                      src={t.photo.startsWith('/') ? `${API_BASE}${t.photo}` : t.photo} 
                      alt={t.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-primary-300" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 text-center flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug mb-1">{t.name}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-primary-600">{t.position}</p>
                  {t.subject && <p className="text-xs text-gray-400 mt-1">{t.subject}</p>}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Belum ada data guru yang tersedia.</p>
              </div>
            )}
          </div>
        ) : section === 'prestasi' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a, i) => (
              <div 
                key={a.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                      <Trophy className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-md">
                        {a.level || 'Madrasah'}
                      </span>
                      {a.year && <span className="text-xs text-gray-400 ml-2">{a.year}</span>}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-primary-600 transition-colors leading-snug">
                    {a.title}
                  </h3>
                  {a.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {a.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Belum ada data prestasi yang terdaftar.</p>
              </div>
            )}
          </div>
        ) : section === 'ekstrakurikuler' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((e, i) => (
              <div 
                key={e.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                  {e.image ? (
                    <img 
                      src={e.image.startsWith('/') ? `${API_BASE}${e.image}` : e.image} 
                      alt={e.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                      <Activity className="w-12 h-12 text-primary-300" />
                    </div>
                  )}
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {e.name}
                    </h3>
                    {e.schedule && (
                      <p className="flex items-center gap-1.5 text-xs text-primary-700 font-medium mb-1">
                        <Calendar className="w-3.5 h-3.5 text-primary-500" />
                        {e.schedule}
                      </p>
                    )}
                    {e.coach && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        Pembina: {e.coach}
                      </p>
                    )}
                    {e.description && (
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed mt-2">
                        {e.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Belum ada data ekstrakurikuler.</p>
              </div>
            )}
          </div>
        ) : profile ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-12">
              {profile.image && (
                <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
                  <img 
                    src={profile.image.startsWith('/') ? `${API_BASE}${profile.image}` : profile.image} 
                    alt={profile.title} 
                    className="w-full max-h-[420px] object-cover" 
                  />
                </div>
              )}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans" 
                dangerouslySetInnerHTML={{ __html: profile.content || '<p>Konten belum tersedia.</p>' }} 
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold text-lg">Konten Belum Tersedia</p>
            <p className="text-gray-400 text-sm mt-1">Halaman ini sedang dalam proses pembaruan informasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

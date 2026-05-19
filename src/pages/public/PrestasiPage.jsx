import { useState, useEffect } from 'react';
import { achievementApi } from '../../api';
import { Trophy, Search, X, Filter, Award, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const LEVELS = [
  { value: '', label: 'Semua', icon: '', color: 'from-primary-500 to-primary-700' },
  { value: 'Kecamatan', label: 'Kecamatan', icon: '', color: 'from-emerald-500 to-emerald-700' },
  { value: 'Kabupaten', label: 'Kabupaten', icon: '', color: 'from-blue-500 to-blue-700' },
  { value: 'Provinsi', label: 'Provinsi', icon: '', color: 'from-purple-500 to-purple-700' },
  { value: 'Nasional', label: 'Nasional', icon: '', color: 'from-red-500 to-red-700' },
];

const getLevelBadge = (level) => {
  const found = LEVELS.find(l => l.value === level);
  if (!found) return { icon: '🏆', color: 'from-gray-500 to-gray-700', label: level || 'Lainnya' };
  return found;
};

const PrestasiPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (activeLevel) params.level = activeLevel;
    if (searchQuery) params.search = searchQuery;

    achievementApi.getAll(params)
      .then(res => setItems(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [activeLevel, searchQuery]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Count per level for stats
  const [allItems, setAllItems] = useState([]);
  useEffect(() => {
    achievementApi.getAll({ limit: 200 })
      .then(res => setAllItems(res.data.data))
      .catch(() => { });
  }, []);

  const levelCounts = LEVELS.reduce((acc, l) => {
    acc[l.value] = l.value === '' ? allItems.length : allItems.filter(i => i.level === l.value).length;
    return acc;
  }, {});

  return (
    <div className="pt-20 min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="hero-gradient py-16 md:py-20 pattern-dots relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-[0.04] select-none">🏆</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Trophy className="w-4 h-4 text-accent-300" />
              <span className="text-sm text-white/90 font-medium">Daftar Prestasi Siswa</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Prestasi & Penghargaan
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Kumpulan prestasi membanggakan yang diraih oleh siswa-siswi kami di berbagai tingkat kompetisi
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10"
          >
            {LEVELS.filter(l => l.value !== '').map(l => (
              <div key={l.value} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3 text-center min-w-[100px]">
                <span className="text-2xl block mb-1">{l.icon}</span>
                <p className="text-2xl font-bold text-white">{levelCounts[l.value] || 0}</p>
                <p className="text-xs text-white/60">{l.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6"
        >
          {/* Search Bar */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari prestasi berdasarkan judul atau deskripsi..."
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">Filter Tingkat:</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {LEVELS.map(l => (
              <button
                key={l.value}
                onClick={() => setActiveLevel(l.value)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeLevel === l.value
                  ? `bg-gradient-to-r ${l.color} text-white shadow-lg shadow-primary-500/20 scale-[1.02]`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <span className="text-base">{l.icon}</span>
                {l.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeLevel === l.value ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                  {levelCounts[l.value] || 0}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat data prestasi...</p>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Menampilkan <span className="font-semibold text-gray-700">{items.length}</span> prestasi
                {activeLevel && <> tingkat <span className="font-semibold text-primary-600">{activeLevel}</span></>}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => {
                const badge = getLevelBadge(item.level);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    onClick={() => setSelectedItem(item)}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image or Gradient Header */}
                    {item.image ? (
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={item.image.startsWith('/') ? `${API_BASE}${item.image}` : item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${badge.color} shadow-lg`}>
                            <span>{badge.icon}</span> {badge.label}
                          </span>
                        </div>
                        {item.year && (
                          <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                            {item.year}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`h-3 bg-gradient-to-r ${badge.color}`} />
                    )}

                    {/* Content */}
                    <div className="p-5">
                      {!item.image && (
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${badge.color}`}>
                            <span>{badge.icon}</span> {badge.label}
                          </span>
                          {item.year && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" /> {item.year}
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className="font-bold text-gray-800 text-lg leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.image && item.year && !item.image && null}
                      {item.image && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          {item.year && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {item.year}
                            </span>
                          )}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                      )}
                      <div className="flex items-center gap-1 mt-4 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                        Lihat Detail <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Belum Ada Data Prestasi</h3>
            <p className="text-sm text-gray-400 text-center max-w-md">
              {activeLevel
                ? `Belum ada prestasi untuk tingkat "${activeLevel}". Coba pilih tingkat lainnya.`
                : 'Belum ada data prestasi yang ditambahkan.'}
            </p>
            {activeLevel && (
              <button onClick={() => setActiveLevel('')} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                ← Tampilkan Semua
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header Image */}
              {selectedItem.image ? (
                <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                  <img
                    src={selectedItem.image.startsWith('/') ? `${API_BASE}${selectedItem.image}` : selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-5 right-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{selectedItem.title}</h2>
                  </div>
                </div>
              ) : (
                <div className={`relative px-6 md:px-8 py-8 bg-gradient-to-r ${getLevelBadge(selectedItem.level).color} shrink-0`}>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="text-5xl mb-3">{getLevelBadge(selectedItem.level).icon}</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{selectedItem.title}</h2>
                </div>
              )}

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 md:p-8">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedItem.level && (
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      Tingkat {selectedItem.level}
                    </div>
                  )}
                  {selectedItem.year && (
                    <div className="inline-flex items-center gap-2 bg-accent-50 text-accent-700 px-4 py-2 rounded-xl text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Tahun {selectedItem.year}
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-sm font-medium">
                    <Award className="w-4 h-4" />
                    Prestasi
                  </div>
                </div>

                {/* Description */}
                {selectedItem.description ? (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Deskripsi</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedItem.description}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-gray-400 text-sm italic">Belum ada deskripsi untuk prestasi ini.</p>
                  </div>
                )}

                {/* Close Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrestasiPage;

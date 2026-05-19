import { useState, useEffect } from 'react';
import { alumniApi } from '../../api';
import { GraduationCap, Search, X, Briefcase, Calendar, Quote, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const AlumniPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 100 };
    if (searchQuery) params.search = searchQuery;

    alumniApi.getAll(params)
      .then(res => setItems(res.data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [searchQuery]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-16 md:py-20 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-[0.04] select-none">🎓</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <GraduationCap className="w-4 h-4 text-accent-300" />
              <span className="text-sm text-white/90 font-medium">Jejaring Alumni</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Profil Alumni
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Menjalin tali silaturahmi dan jejak kesuksesan para alumni MI Al-Ghazali di berbagai bidang
            </p>
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
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari alumni berdasarkan nama atau tahun lulus..."
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat data alumni...</p>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Menampilkan <span className="font-semibold text-gray-700">{items.length}</span> alumni
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Photo */}
                  <div className="aspect-[4/5] overflow-hidden relative bg-gray-100 shrink-0">
                    {item.photo ? (
                      <img
                        src={item.photo.startsWith('/') ? `${API_BASE}${item.photo}` : item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) + '&background=random' }}
                      />
                    ) : (
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&size=256`} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Badge on Photo */}
                    {item.graduation_year && (
                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Lulus {item.graduation_year}
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary-300 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {item.current_activity ? (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                        <Briefcase className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">{item.current_activity}</span>
                      </div>
                    ) : (
                       <div className="mb-3"></div>
                    )}
                    
                    {item.testimonial && (
                      <div className="mt-auto pt-4 border-t border-gray-50 relative">
                        <Quote className="absolute top-2 left-0 w-6 h-6 text-gray-100 rotate-180" />
                        <p className="text-xs text-gray-500 italic line-clamp-3 relative z-10 pl-2">
                          "{item.testimonial}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Belum Ada Data Alumni</h3>
            <p className="text-sm text-gray-400 text-center max-w-md">
              Belum ada profil alumni yang ditambahkan atau tidak ditemukan alumni yang sesuai dengan pencarian.
            </p>
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
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              {/* Image Side */}
              <div className="w-full md:w-2/5 aspect-square md:aspect-auto relative shrink-0 bg-gray-100">
                {selectedItem.photo ? (
                  <img
                    src={selectedItem.photo.startsWith('/') ? `${API_BASE}${selectedItem.photo}` : selectedItem.photo}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedItem.name) + '&background=random' }}
                  />
                ) : (
                   <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedItem.name)}&background=random&size=512`} 
                      alt={selectedItem.name} 
                      className="w-full h-full object-cover" 
                    />
                )}
                
                {/* Mobile close button (absolute over image) */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="md:hidden absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-4 left-5 right-5 md:hidden text-white">
                  <h2 className="text-2xl font-bold leading-tight">{selectedItem.name}</h2>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
                {/* Desktop close button */}
                <div className="hidden md:flex justify-end mb-2">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="hidden md:block mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 leading-tight">{selectedItem.name}</h2>
                </div>

                <div className="space-y-4 mb-8">
                  {selectedItem.graduation_year && (
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary-600/80 uppercase tracking-wider">Tahun Lulus</p>
                        <p className="text-sm font-medium text-gray-800">{selectedItem.graduation_year}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.current_activity && (
                    <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-accent-600/80 uppercase tracking-wider">Aktivitas Saat Ini</p>
                        <p className="text-sm font-medium text-gray-800">{selectedItem.current_activity}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedItem.testimonial && (
                  <div className="mt-auto">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Testimoni</h3>
                    <div className="relative bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <Quote className="absolute -top-3 -left-2 w-8 h-8 text-primary-200 rotate-180" />
                      <p className="text-gray-600 italic leading-relaxed relative z-10 text-sm">
                        "{selectedItem.testimonial}"
                      </p>
                    </div>
                  </div>
                )}
                
                 {/* Mobile Close Button (bottom) */}
                 <div className="mt-6 md:hidden flex justify-end">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm w-full"
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

export default AlumniPage;

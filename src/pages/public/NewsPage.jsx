import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../../api';
import { Search, Calendar, ChevronRight, ChevronLeft, Newspaper, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    newsApi.getAll({ page, limit: 9, search: searchParams.get('search') || '' })
      .then(res => { setNews(res.data.data || []); setPagination(res.data.pagination || {}); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search, page: 1 });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="hero-gradient py-14 sm:py-20 pattern-dots relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-4 border border-white/15">
            <Newspaper className="w-3.5 h-3.5" />
            Warta & Informasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight font-outfit">
            Kabar MI Al-Ghazali
          </h1>
          <p className="text-primary-100/90 text-sm sm:text-base max-w-xl mx-auto">
            Dapatkan informasi terkini seputar kegiatan, agenda penting, dan prestasi madrasah kami.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 border-0"
                placeholder="Cari berita atau kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  type="button" 
                  onClick={() => { setSearch(''); setSearchParams({ page: 1 }); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-white text-primary-900 hover:bg-primary-50 shadow-lg transition-all shrink-0 min-h-[44px]"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat berita terbaru...</p>
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {news.map((item, i) => (
                <Link 
                  key={item.id} 
                  to={`/berita/${item.slug}`} 
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail.startsWith('http://') || item.thumbnail.startsWith('https://') ? item.thumbnail : `${API_BASE}${item.thumbnail}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100/60 flex items-center justify-center">
                        <Newspaper className="w-10 h-10 text-primary-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-primary-700 shadow-sm uppercase tracking-wider">
                        Berita
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-primary-500" />
                        <span>{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {item.content?.replace(/<[^>]*>/g, '').substring(0, 110)}...
                      </p>
                    </div>
                    <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                      Baca Berita <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setSearchParams({ page: page - 1, search })}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSearchParams({ page: i + 1, search })} 
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      pagination.page === i + 1 
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setSearchParams({ page: page + 1, search })}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-lg mx-auto">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold text-lg">Belum Ada Berita</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? `Tidak ditemukan berita yang cocok dengan "${search}"` : 'Belum ada warta yang dipublikasikan.'}
            </p>
            {search && (
              <button 
                onClick={() => { setSearch(''); setSearchParams({ page: 1 }); }}
                className="mt-4 text-sm font-semibold text-primary-600 hover:underline"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;

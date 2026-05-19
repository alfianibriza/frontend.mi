import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../../api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

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
      .then(res => { setNews(res.data.data); setPagination(res.data.pagination); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [page, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search, page: 1 });
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="hero-gradient py-16 pattern-dots">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Berita & Informasi</h1>
          <p className="text-primary-100">Kabar terbaru dari MI Al-Ghazali</p>
          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex gap-2">
            <input type="text" className="input-field flex-1 !rounded-xl" placeholder="Cari berita..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit" className="btn-primary !bg-white !text-primary-700">Cari</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
        ) : news.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <Link key={item.id} to={`/berita/${item.slug}`} className="group card-hover bg-white rounded-2xl overflow-hidden shadow-md animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
                    {item.thumbnail ? <img src={item.thumbnail.startsWith('http://') || item.thumbnail.startsWith('https://') ? item.thumbnail : `${API_BASE}${item.thumbnail}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <span className="text-5xl">📰</span>}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-primary-600 font-medium mb-2">{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                  </div>
                </Link>
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button key={i} onClick={() => setSearchParams({ page: i + 1, search })} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${pagination.page === i + 1 ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-primary-50 border'}`}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl"></span>
            <p className="text-gray-500 mt-4 text-lg">Belum ada berita.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;

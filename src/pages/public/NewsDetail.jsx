import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../../api';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

  useEffect(() => {
    newsApi.getBySlug(slug).then(res => setNews(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;
  if (!news) return <div className="min-h-screen pt-20 flex items-center justify-center"><p className="text-gray-500">Berita tidak ditemukan</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient pt-32 pb-24 pattern-dots">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/berita" className="inline-flex items-center gap-2 text-primary-100 hover:text-white transition-colors mb-6 text-sm font-medium">
            ← Kembali ke Berita
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {news.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-primary-200 font-medium">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              {news.author}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 pb-20 -mt-16 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100">
          {news.thumbnail && (
            <div className="rounded-2xl overflow-hidden mb-10 shadow-lg border border-gray-100">
              <img src={news.thumbnail.startsWith('http://') || news.thumbnail.startsWith('https://') ? news.thumbnail : `${API_BASE}${news.thumbnail}`} alt={news.title} className="w-full aspect-[16/9] object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          )}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../../api';
import { ArrowLeft, Calendar, User, Share2, Check } from 'lucide-react';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

  useEffect(() => {
    newsApi.getBySlug(slug).then(res => setNews(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-50/50">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400 mt-4">Memuat artikel...</p>
    </div>
  );

  if (!news) return (
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center px-4 text-center bg-gray-50/50">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400 text-2xl font-bold">404</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Berita Tidak Ditemukan</h2>
      <p className="text-sm text-gray-500 mb-6">Artikel atau warta yang Anda tuju mungkin sudah dipindahkan atau dihapus.</p>
      <Link to="/berita" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-colors">
        Kembali ke Berita
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <div className="hero-gradient pt-8 pb-20 sm:pb-24 pattern-dots relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link 
            to="/berita" 
            className="inline-flex items-center gap-2 text-primary-100/90 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all mb-6 text-xs sm:text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Berita</span>
          </Link>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight font-outfit">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-primary-100/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-300" />
              {new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-300" />
              {news.author || 'Humas MI Al-Ghazali'}
            </span>
            <div className="ml-auto">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 -mt-10 sm:-mt-14 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-100">
          {news.thumbnail && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-100">
              <img 
                src={news.thumbnail.startsWith('http://') || news.thumbnail.startsWith('https://') ? news.thumbnail : `${API_BASE}${news.thumbnail}`} 
                alt={news.title} 
                className="w-full aspect-[16/9] object-cover" 
              />
            </div>
          )}
          <div 
            className="prose prose-base sm:prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-headings:font-outfit prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-2xl" 
            dangerouslySetInnerHTML={{ __html: news.content }} 
          />
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

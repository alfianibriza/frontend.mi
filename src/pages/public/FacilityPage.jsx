import { useState, useEffect } from 'react';
import { facilityApi } from '../../api';

const FacilityPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

  useEffect(() => {
    facilityApi.getAll({ limit: 50 }).then(res => setFacilities(res.data.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 min-h-screen">
      <div className="hero-gradient py-16 pattern-dots">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sarana & Prasarana</h1>
          <p className="text-primary-100">Fasilitas MI Al-Ghazali</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
        ) : facilities.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <div key={f.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
                  {f.image ? <img src={f.image.startsWith('http://') || f.image.startsWith('https://') ? f.image : `${API_BASE}${f.image}`} alt={f.name} className="w-full h-full object-cover" /> : <span className="text-5xl">🏫</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800">{f.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${f.condition === 'baik' ? 'bg-green-100 text-green-700' : f.condition === 'cukup' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{f.condition}</span>
                    <span className="text-xs text-gray-500">Jumlah: {f.quantity}</span>
                  </div>
                  {f.description && <p className="text-sm text-gray-500 mt-3 line-clamp-3">{f.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : <div className="text-center py-20"><span className="text-6xl"></span><p className="text-gray-500 mt-4">Belum ada data fasilitas.</p></div>}
      </div>
    </div>
  );
};

export default FacilityPage;

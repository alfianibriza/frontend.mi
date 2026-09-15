import { useState, useEffect } from 'react';
import { facilityApi } from '../../api';
import { Building2, CheckCircle2, Layers, Sparkles } from 'lucide-react';

const FacilityPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCondition, setFilterCondition] = useState('all');
  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

  useEffect(() => {
    facilityApi.getAll({ limit: 50 })
      .then(res => setFacilities(res.data.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filteredFacilities = filterCondition === 'all' 
    ? facilities 
    : facilities.filter(f => f.condition?.toLowerCase() === filterCondition);

  return (
    <div className="pt-20 min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="hero-gradient py-14 sm:py-20 pattern-dots relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-4 border border-white/15">
            <Building2 className="w-3.5 h-3.5" />
            Sarana & Prasarana
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight font-outfit">
            Fasilitas Pembelajaran
          </h1>
          <p className="text-primary-100/90 text-sm sm:text-base max-w-xl mx-auto">
            Dukungan fasilitas yang memadai dan modern untuk menunjang kegiatan belajar mengajar peserta didik.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Condition Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Semua Fasilitas' },
              { id: 'baik', label: 'Kondisi Baik' },
              { id: 'cukup', label: 'Kondisi Cukup' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCondition(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
                  filterCondition === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-gray-400 px-3">
            Total: <span className="text-gray-700 font-bold">{filteredFacilities.length}</span> fasilitas
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat data fasilitas...</p>
          </div>
        ) : filteredFacilities.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFacilities.map((f, i) => (
              <div 
                key={f.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                  {f.image ? (
                    <img 
                      src={f.image.startsWith('http://') || f.image.startsWith('https://') ? f.image : `${API_BASE}${f.image}`} 
                      alt={f.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100/60 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-primary-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider ${
                      f.condition === 'baik' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : f.condition === 'cukup' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {f.condition || 'Baik'}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                        {f.name}
                      </h3>
                      {f.quantity && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full shrink-0">
                          {f.quantity} unit
                        </span>
                      )}
                    </div>
                    {f.description && (
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed">
                        {f.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold text-lg">Tidak Ada Fasilitas</p>
            <p className="text-gray-400 text-sm mt-1">Belum ada data sarana prasarana yang terdaftar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityPage;

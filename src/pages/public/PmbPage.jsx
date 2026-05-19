import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pmbSettingApi } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, Download, UserCheck, FileText, Calendar, 
  ChevronRight, ExternalLink, Search, X, Users,
  CheckCircle2, GraduationCap, ClipboardList, Sparkles
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const TABS = [
  { id: 'informasi', label: 'Informasi', icon: Info, color: 'from-blue-500 to-blue-700' },
  { id: 'unduh_pendaftaran', label: 'Unduh Pendaftaran', icon: Download, color: 'from-emerald-500 to-emerald-700' },
  { id: 'pengumuman', label: 'Siswa Diterima', icon: UserCheck, color: 'from-amber-500 to-amber-700' },
];

const PmbPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'informasi');
  const [settings, setSettings] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync tab from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'informasi') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      pmbSettingApi.getAll().catch(() => ({ data: { data: [] } })),
      pmbSettingApi.getAccepted().catch(() => ({ data: { data: [] } })),
    ]).then(([settingsRes, acceptedRes]) => {
      setSettings(settingsRes.data.data || []);
      setAcceptedStudents(acceptedRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const getSectionData = (key) => settings.filter(s => s.section_key === key);
  const infoData = getSectionData('informasi');
  const downloadData = getSectionData('unduh_pendaftaran');
  const announcementData = getSectionData('pengumuman');

  const filteredStudents = acceptedStudents.filter(s =>
    s.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.previous_school?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentYear = new Date().getFullYear();
  const academicYear = settings.find(s => s.academic_year)?.academic_year || `${currentYear}/${currentYear + 1}`;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="hero-gradient py-16 md:py-24 pattern-dots relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-[0.04] select-none">📋</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <GraduationCap className="w-4 h-4 text-accent-300" />
              <span className="text-sm text-white/90 font-medium">Tahun Ajaran {academicYear}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit">
              Penerimaan Murid Baru
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Informasi lengkap mengenai pendaftaran siswa baru MI Al-Ghazali
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4 text-center min-w-[120px]">
              <ClipboardList className="w-6 h-6 text-blue-300 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{downloadData.length}</p>
              <p className="text-xs text-white/60">Berkas Unduhan</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4 text-center min-w-[120px]">
              <CheckCircle2 className="w-6 h-6 text-emerald-300 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{acceptedStudents.length}</p>
              <p className="text-xs text-white/60">Siswa Diterima</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex gap-2"
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-[1.02]`
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat data PMB...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* TAB: Informasi */}
            {activeTab === 'informasi' && (
              <motion.div
                key="informasi"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {infoData.length > 0 ? (
                  <div className="space-y-6">
                    {infoData.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4 flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Info className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-white">{item.title}</h2>
                            {item.academic_year && (
                              <p className="text-blue-100 text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> TA {item.academic_year}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="p-6 md:p-8">
                          <div
                            className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                              prose-headings:text-gray-800 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                              prose-h3:text-base prose-h3:text-primary-700
                              prose-ul:space-y-1.5 prose-li:text-gray-600
                              prose-strong:text-gray-800 prose-p:mb-3"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Info} message="Belum ada informasi PMB yang dipublikasikan." />
                )}
              </motion.div>
            )}

            {/* TAB: Unduh Pendaftaran */}
            {activeTab === 'unduh_pendaftaran' && (
              <motion.div
                key="unduh"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {downloadData.length > 0 ? (
                  <div className="space-y-6">
                    {downloadData.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-4 flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-white">{item.title}</h2>
                            {item.academic_year && (
                              <p className="text-emerald-100 text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> TA {item.academic_year}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="p-6 md:p-8">
                          {item.content && (
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{item.content}</p>
                          )}
                          {item.file_url ? (
                            <a
                              href={item.file_url.startsWith('/') ? `${API_BASE}${item.file_url}` : item.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 group"
                            >
                              <div className="p-2 bg-white/20 rounded-xl">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold">{item.file_name || 'Unduh Formulir'}</p>
                                <p className="text-emerald-100 text-xs">Klik untuk mengunduh file</p>
                              </div>
                              <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                              <p className="text-sm text-amber-700">File belum tersedia. Silakan hubungi pihak sekolah untuk informasi lebih lanjut.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Download} message="Belum ada berkas pendaftaran yang tersedia untuk diunduh." />
                )}
              </motion.div>
            )}

            {/* TAB: Nama-nama yang Diterima */}
            {activeTab === 'pengumuman' && (
              <motion.div
                key="pengumuman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Announcement Header */}
                {announcementData.length > 0 && announcementData.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-700 px-6 py-4 flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{item.title}</h2>
                        {item.academic_year && (
                          <p className="text-amber-100 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> TA {item.academic_year}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.content && (
                      <div className="p-6">
                        <div
                          className="prose prose-sm max-w-none text-gray-600 prose-strong:text-gray-800"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* Search & Students List */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  {/* Search Bar */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama siswa, nomor pendaftaran, atau asal sekolah..."
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Menampilkan <span className="font-semibold text-gray-600">{filteredStudents.length}</span> dari <span className="font-semibold text-gray-600">{acceptedStudents.length}</span> siswa diterima
                    </p>
                  </div>

                  {/* Students Table */}
                  {filteredStudents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Pendaftaran</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">L/P</th>
                            <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                            <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredStudents.map((student, i) => (
                            <motion.tr
                              key={student.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="hover:bg-primary-50/30 transition-colors"
                            >
                              <td className="px-5 py-4 text-sm text-gray-400 font-medium">{i + 1}</td>
                              <td className="px-5 py-4">
                                <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                                  {student.registration_number}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">{student.student_name?.[0]}</span>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-800">{student.student_name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  student.gender === 'L' 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'bg-pink-50 text-pink-700'
                                }`}>
                                  {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-600">{student.previous_school || '-'}</td>
                              <td className="px-5 py-4 text-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Diterima
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">
                        {searchQuery ? 'Tidak Ditemukan' : 'Belum Ada Data'}
                      </h3>
                      <p className="text-sm text-gray-400 text-center max-w-md">
                        {searchQuery
                          ? `Tidak ada siswa yang cocok dengan pencarian "${searchQuery}".`
                          : 'Belum ada pengumuman nama siswa yang diterima. Silakan cek kembali nanti.'}
                      </p>
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                          ← Tampilkan Semua
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-gray-300" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">Belum Ada Data</h3>
    <p className="text-sm text-gray-400 text-center max-w-md">{message}</p>
  </div>
);

export default PmbPage;

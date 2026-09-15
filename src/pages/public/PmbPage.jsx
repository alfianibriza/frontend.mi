import { useState, useEffect } from 'react';
import { pmbSettingApi } from '../../api';
import { motion } from 'framer-motion';
import { 
  Info, Download, UserCheck, FileText, Calendar, 
  Search, X, Users, CheckCircle2, GraduationCap, ClipboardList, Sparkles
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const PmbPage = () => {
  const [settings, setSettings] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Main Content Area - Full Width & Spacious */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-4">Memuat data PMB...</p>
          </div>
        ) : (
          <>
            {/* SECTION 1: Informasi PMB */}
            <section id="informasi" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-sm">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 font-outfit">Informasi & Ketentuan Pendaftaran</h2>
                  <p className="text-sm text-gray-500">Panduan lengkap, syarat pendaftaran, dan jadwal pelaksanaan PMB</p>
                </div>
              </div>

              {infoData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {infoData.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Info className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                        </div>
                        {item.academic_year && (
                          <span className="text-xs font-semibold px-2.5 py-1 bg-white/15 text-blue-100 rounded-lg">
                            TA {item.academic_year}
                          </span>
                        )}
                      </div>
                      <div className="p-6 sm:p-8 flex-1">
                        <div
                          className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                            prose-headings:text-gray-800 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
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
            </section>

            {/* SECTION 2: Unduh Berkas Pendaftaran */}
            <section id="unduh_pendaftaran" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl shadow-sm">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 font-outfit">Unduh Berkas & Formulir Pendaftaran</h2>
                  <p className="text-sm text-gray-500">Unduh dokumen formulir pendaftaran dan brosur resmi</p>
                </div>
              </div>

              {downloadData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {downloadData.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between p-6 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <FileText className="w-6 h-6" />
                          </div>
                          {item.academic_year && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                              TA {item.academic_year}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        {item.content && (
                          <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed line-clamp-3">{item.content}</p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        {item.file_url ? (
                          <a
                            href={item.file_url.startsWith('/') ? `${API_BASE}${item.file_url}` : item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-sm hover:shadow transition-all group min-h-[44px]"
                          >
                            <span className="text-xs sm:text-sm font-semibold truncate">
                              {item.file_name || 'Unduh Berkas'}
                            </span>
                            <Download className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform shrink-0" />
                          </a>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-700">File belum tersedia</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Download} message="Belum ada berkas pendaftaran yang tersedia untuk diunduh." />
              )}
            </section>

            {/* SECTION 3: Pengumuman Siswa Diterima */}
            <section id="pengumuman" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-2xl shadow-sm">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 font-outfit">Pengumuman Siswa Diterima</h2>
                  <p className="text-sm text-gray-500">Daftar calon peserta didik yang telah dinyatakan diterima</p>
                </div>
              </div>

              {/* Announcement Header */}
              {announcementData.length > 0 && announcementData.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <div className="relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama siswa, nomor pendaftaran, atau asal sekolah..."
                      className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Menampilkan <span className="font-semibold text-gray-700">{filteredStudents.length}</span> dari <span className="font-semibold text-gray-700">{acceptedStudents.length}</span> siswa diterima
                  </p>
                </div>

                {/* Students View: Mobile Cards & Desktop Table */}
                {filteredStudents.length > 0 ? (
                  <div>
                    {/* Mobile Card List */}
                    <div className="md:hidden divide-y divide-gray-100">
                      {filteredStudents.map((student) => (
                        <div key={student.id} className="p-4 space-y-2 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white text-xs font-bold">{student.student_name?.[0]}</span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{student.student_name}</p>
                                <span className="text-[11px] font-mono text-gray-500">{student.registration_number}</span>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Diterima
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                            <span>Asal: {student.previous_school || '-'}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              student.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                            }`}>
                              {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Pendaftaran</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">L/P</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                            <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredStudents.map((student, i) => (
                            <motion.tr
                              key={student.id}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.02 }}
                              className="hover:bg-primary-50/30 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-gray-400 font-medium">{i + 1}</td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                                  {student.registration_number}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs font-bold">{student.student_name?.[0]}</span>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900">{student.student_name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  student.gender === 'L' 
                                    ? 'bg-blue-50 text-blue-700' 
                                    : 'bg-pink-50 text-pink-700'
                                }`}>
                                  {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{student.previous_school || '-'}</td>
                              <td className="px-6 py-4 text-center">
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
            </section>
          </>
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

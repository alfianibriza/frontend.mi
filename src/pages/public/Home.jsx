import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import {
  GraduationCap, Users, Calendar, Trophy, ArrowRight, Star, BookOpen, Heart,
  ShieldCheck, ChevronRight, Newspaper, Award, Target
} from 'lucide-react';
import { newsApi, profileApi, homeSettingApi } from '../../api';

import 'swiper/css';
import 'swiper/css/pagination';

// Map icon string ke komponen
const ICON_MAP = { GraduationCap, Users, Calendar, Trophy, BookOpen, Heart, ShieldCheck, Star, Award, Target };

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [homeSettings, setHomeSettings] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

  useEffect(() => {
    newsApi.getAll({ limit: 3 }).then(res => setLatestNews(res.data.data)).catch(() => { });
    homeSettingApi.getAll().then(res => setHomeSettings(res.data.data)).catch(() => { });
  }, []);

  // Fallback data jika belum ada setting
  const slides = homeSettings?.hero_slides?.is_active !== false && homeSettings?.hero_slides?.content?.length
    ? homeSettings.hero_slides.content
    : [
      { image: 'https://scontent.fsub8-1.fna.fbcdn.net/v/t39.30808-6/698783644_3530569720423316_6896522779560118604_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFwrxSN1QMGbNzW34ax4kJ0-Ed3vbWRK5H4R3e9tZErkeHT-jttw2U9LStY6hBW2wGTogFepvG12rlzN4yQ-PzF&_nc_ohc=N6-ScvEXH3gQ7kNvwGnvbfq&_nc_oc=Adr58iS2Cjsf0HRwfgBOpZBS2abSJahSe3-OhTaA0lwZk00cISVFMqB5C-_jLpnFcMU&_nc_zt=23&_nc_ht=scontent.fsub8-1.fna&_nc_gid=tSlxfL14vuSYR88gl0zIrA&_nc_ss=7b2a8&oh=00_Af6olvpt1qGkBbt-fDMnt4dJIF9nwjcHiSEblvpjx4Gv1g&oe=6A11D46C', title: 'Membangun Generasi Rabbani', subtitle: 'MI Al-Ghazali berkomitmen mencetak generasi yang cerdas dan berakhlakul karimah.' },
      { image: 'https://scontent.fsub8-2.fna.fbcdn.net/v/t1.6435-9/80667113_1497538390393136_5771742773677916160_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEtTZmjWfWcxUKzrQzCE16WE2fkbbyAq28TZ-RtvICrby1M4wDv9nXNFOUA8dKesxHYj8-euo88qKfoR3xtkUhc&_nc_ohc=1WTmHjatidsQ7kNvwFQqIaI&_nc_oc=AdrNyqZ0L4yA0cCTbuwXvJ9PIZtZ64iKwZUj4wpuRkVme6OIvxPGhFLzlv_G8PfrqDs&_nc_zt=23&_nc_ht=scontent.fsub8-2.fna&_nc_gid=gCq0nhL0fsP5acWcJoOtNw&_nc_ss=7b2a8&oh=00_Af6C2pONfRzgXpw5x5wi6stsP_8lRvivOl4UjeVLPmBreg&oe=6A334388', title: 'Lingkungan Belajar Nyaman', subtitle: 'Fasilitas modern yang mendukung kreativitas dan kenyamanan siswa dalam belajar.' },
      { image: 'https://scontent.fsub8-1.fna.fbcdn.net/v/t39.30808-6/480565390_3026131640867129_2999879050540469774_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGDvSOwPZk_F9TBwyxSgdVpwMAAT7ChotvAwABPsKGi24vb3jTTjARV2smnxCWOc_r2zSfi1hUedjouOL2E1QaM&_nc_ohc=4hUKdYtqLK0Q7kNvwEf1ZRJ&_nc_oc=AdooEBjAxcVxhQkpFhGkcIGDP0V6b60XkNXHdonHI8zfjMSF_wkgTBniunL7CTbuh3o&_nc_zt=23&_nc_ht=scontent.fsub8-1.fna&_nc_gid=KCblL7JF_yjDqEpJ07CWHg&_nc_ss=7b2a8&oh=00_Af50sBwzSG2VMu5kBtej-RhrBW20PFWYYODwhe8HshPYMQ&oe=6A11ABC0', title: 'Eksplorasi Bakat & Minat', subtitle: 'Berbagai kegiatan ekstrakurikuler untuk mengembangkan potensi setiap anak.' }
    ];

  const stats = homeSettings?.stats?.is_active !== false && homeSettings?.stats?.content?.length
    ? homeSettings.stats.content
    : [
      { label: 'Murid Aktif', value: '320+', icon: 'GraduationCap', color: 'bg-blue-500' },
      { label: 'PTK', value: '25+', icon: 'Users', color: 'bg-green-500' },
      { label: 'Alumni Sukses', value: '1000+', icon: 'Calendar', color: 'bg-amber-500' },
      { label: 'Prestasi', value: '50+', icon: 'Trophy', color: 'bg-purple-500' },
    ];

  const programData = homeSettings?.programs?.is_active !== false && homeSettings?.programs?.content
    ? homeSettings.programs.content
    : {
      section_title: 'Program Unggulan Kami',
      section_subtitle: 'Menyediakan berbagai program inovatif untuk mendukung perkembangan akademik dan spiritual siswa.',
      items: [
        { title: "Tahfidz Al-Qur'an", desc: "Program hafalan Al-Qur'an dengan metode yang menyenangkan bagi anak-anak.", icon: 'BookOpen', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Karakter Islami', desc: 'Pembentukan adab dan akhlak mulia berlandaskan nilai-nilai Al-Ghazali.', icon: 'Heart', color: 'text-rose-600', bg: 'bg-rose-50' },
        { title: 'Kurikulum Cinta', desc: 'Penerapan kurikulum terbaru yang fokus pada pengembangan potensi minat bakat.', icon: 'ShieldCheck', color: 'text-sky-600', bg: 'bg-sky-50' }
      ]
    };

  const ctaData = homeSettings?.cta?.is_active !== false && homeSettings?.cta?.content
    ? homeSettings.cta.content
    : {
      title: 'Mulai Perjalanan Pendidikan Terbaik Putra-Putri Anda',
      subtitle: 'Bergabunglah bersama keluarga besar MI Al-Ghazali dan berikan fondasi pendidikan yang kuat berbasis nilai Islam dan karakter unggul.',
      primary_button: { text: 'Daftar Sekarang', link: '/pmb' },
      secondary_button: { text: 'Lihat Fasilitas', link: '/fasilitas' }
    };

  const announcement = homeSettings?.announcement?.is_active !== false && homeSettings?.announcement?.content
    ? homeSettings.announcement.content
    : { text: 'Pendaftaran Siswa Baru TA 2024/2025 Telah Dibuka!', is_visible: true };

  const greetingData = homeSettings?.headmaster_greeting?.content || {
    title: 'Membentuk Karakter Unggul & Beradab',
    text: 'Assalamualaikum Wr. Wb. MI Al-Ghazali terus berkomitmen untuk memberikan pendidikan terbaik bagi putra-putri bangsa dengan mengintegrasikan nilai-nilai keislaman dan kurikulum modern.',
    name: 'K. Moh. Bakri, S.Ag.',
    role: 'Kepala Madrasah',
    image_url: 'https://images.unsplash.com/photo-1577896851231-70ef1469759e?q=80&w=2070&auto=format&fit=crop',
    experience: '20+',
    experience_label: 'Tahun Pengalaman'
  };

  const getImageSrc = (img) => {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return `${API_BASE}${img}`;
    return `${API_BASE}/${img}`;
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Slider */}
      <section className="relative h-[85vh] lg:h-screen">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <img src={getImageSrc(slide.image)} alt={slide.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-2xl"
                    >
                      {announcement.is_visible && (
                        <div className="inline-flex items-center gap-2 bg-primary-600/20 backdrop-blur-md px-4 py-2 rounded-full text-primary-400 text-sm font-semibold mb-6 border border-primary-500/30">
                          <Star className="w-4 h-4 fill-primary-400" />
                          {announcement.text}
                        </div>
                      )}
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        {slide.title.split(' ').map((word, i) => (
                          <span key={i} className={i === 2 ? 'text-primary-400' : ''}>{word} </span>
                        ))}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link to="/pmb" className="btn-primary !px-8 !py-4 shadow-2xl shadow-primary-600/40 group">
                          Daftar Sekarang
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {/* <Link to="/profil/sejarah" className="btn-secondary !bg-white/10 !text-white !border-white/20 backdrop-blur-md hover:!bg-white/20 !px-8 !py-4">
                          Kenali Kami
                        </Link>*/}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Stats Section */}
      {homeSettings?.stats?.is_active !== false && (
        <section className="relative -mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => {
              const Icon = ICON_MAP[stat.icon] || GraduationCap;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 border border-gray-100"
                >
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sambutan Section */}
      {homeSettings?.headmaster_greeting?.is_active !== false && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-50">
                  <img src={getImageSrc(greetingData.image_url)} alt={greetingData.name} className="w-full aspect-[4/5] object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 z-20 bg-primary-600 text-white p-8 rounded-[2rem] shadow-2xl hidden md:block">
                  <p className="text-3xl font-bold mb-1">{greetingData.experience}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">{greetingData.experience_label}</p>
                </div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-60" />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-primary-700" />
                  Sambutan Kepala Madrasah
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  {greetingData.title.split(' ').map((word, i) => {
                    // Let's assume the last 2 words should be highlighted (like "Unggul & Beradab")
                    // This is a simple heuristic. A better way might be needed if title length varies greatly.
                    // For now, I'll just keep the original logic for "Unggul & Beradab"
                    return <span key={i} className={i > 1 ? 'text-primary-600' : ''}>{word} </span>
                  })}
                </h2>
                <div className="prose prose-lg text-gray-600 italic mb-10 leading-relaxed">
                  <p className="relative">
                    <span className="absolute -top-4 -left-6 text-6xl text-primary-100 font-serif">"</span>
                    {greetingData.text}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200">
                    <Users className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{greetingData.name}</h4>
                    <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">{greetingData.role}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Programs Section */}
      {homeSettings?.programs?.is_active !== false && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{programData.section_title}</h2>
              <p className="text-gray-600 text-lg">{programData.section_subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {programData.items?.map((prog, i) => {
                const Icon = ICON_MAP[prog.icon] || BookOpen;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                    <div className={`w-16 h-16 ${prog.bg} ${prog.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{prog.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{prog.desc}</p>
                    <Link to="/profil/program-kerja" className={`inline-flex items-center font-bold ${prog.color} hover:underline`}>
                      Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Latest News Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Warta Al-Ghazali</h2>
              <p className="text-gray-600 text-lg">Ikuti perkembangan terbaru mengenai kegiatan, prestasi, dan informasi penting lainnya dari sekolah kami.</p>
            </div>
            <Link to="/berita" className="btn-secondary !py-3 !px-6 flex items-center gap-2 group">
              Lihat Semua Berita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {latestNews.map((news, i) => (
                <motion.div key={news.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/berita/${news.slug}`} className="group block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {news.thumbnail ? (
                        <img src={news.thumbnail.startsWith('/') ? `${API_BASE}${news.thumbnail}` : news.thumbnail} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                          <Newspaper className="w-12 h-12 text-primary-300" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary-700 shadow-sm uppercase tracking-wider">Kegiatan</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-4 leading-tight">{news.title}</h3>
                      <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed mb-6">{news.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                      <span className="inline-flex items-center text-sm font-bold text-primary-600">Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Belum ada berita terbaru saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {homeSettings?.cta?.is_active !== false && (
        <section className="py-24 px-4">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto hero-gradient rounded-[3.5rem] p-8 md:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] -ml-48 -mb-48" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">{ctaData.title}</h2>
              <p className="text-primary-100 text-lg md:text-xl mb-12 leading-relaxed opacity-90">{ctaData.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to={ctaData.primary_button?.link || '/pmb'} className="btn-primary !bg-white !text-primary-800 !px-10 !py-5 !text-lg !rounded-2xl shadow-2xl hover:scale-105 transition-transform group">
                  {ctaData.primary_button?.text || 'Daftar Sekarang'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={ctaData.secondary_button?.link || '/fasilitas'} className="btn-secondary !border-white/30 !text-white !bg-transparent backdrop-blur-md hover:!bg-white/10 !px-10 !py-5 !text-lg !rounded-2xl transition-all">
                  {ctaData.secondary_button?.text || 'Lihat Fasilitas'}
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Home;

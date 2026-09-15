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
      <section className="relative h-[88vh] lg:h-screen min-h-[560px]">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, index) => {
            const isVideo = slide.media_type === 'video' && slide.video_url;
            let videoId = null;
            if (isVideo) {
              const match = slide.video_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
              videoId = match ? match[1] : null;
            }

            return (
            <SwiperSlide key={index} data-swiper-autoplay={slide.duration ? slide.duration * 1000 : 5000}>
              <div className="relative h-full w-full overflow-hidden bg-gray-950">
                {isVideo && videoId ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1`}
                      title={slide.title}
                      className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-w-[100%] min-h-[100%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ border: 0 }}
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                ) : (
                  <img src={getImageSrc(slide.image)} alt={slide.title} className="h-full w-full object-cover scale-105 animate-pulse duration-1000" style={{ animationDuration: '8s' }} />
                )}
                {/* Modern Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/60 to-gray-950/30 lg:bg-gradient-to-r lg:from-gray-950/90 lg:via-gray-950/50 lg:to-transparent" />
                
                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center pt-16 lg:pt-0">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      className="max-w-2xl text-left"
                    >
                      {announcement.is_visible && (
                        <div className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-primary-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-primary-400/30 max-w-full">
                          <Star className="w-3.5 h-3.5 fill-primary-400 shrink-0" />
                          <span className="truncate">{announcement.text}</span>
                        </div>
                      )}

                      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6 tracking-tight">
                        {slide.title.split(' ').map((word, i) => (
                          <span key={i} className={i === 2 ? 'text-primary-400' : ''}>{word} </span>
                        ))}
                      </h1>

                      <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-xl opacity-90">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link 
                          to="/pmb" 
                          className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold text-white bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all duration-200 group min-h-[44px]"
                        >
                          Daftar Siswa Baru
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                          to="/profil/visi-misi" 
                          className="inline-flex items-center justify-center px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-medium text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-200 min-h-[44px]"
                        >
                          Kenali Kami
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      {/* Stats Section */}
      {homeSettings?.stats?.is_active !== false && (
        <section className="relative -mt-14 sm:-mt-20 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = ICON_MAP[stat.icon] || GraduationCap;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg shadow-gray-200/40 flex flex-col items-center text-center border border-gray-100 hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-0.5 tracking-tight">{stat.value}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sambutan Section */}
      {homeSettings?.headmaster_greeting?.is_active !== false && (
        <section className="py-16 sm:py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Photo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5 }} 
                className="lg:col-span-5 relative max-w-md mx-auto lg:max-w-none w-full"
              >
                <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <img 
                    src={getImageSrc(greetingData.image_url)} 
                    alt={greetingData.name} 
                    className="w-full aspect-[4/5] object-cover" 
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-36 h-36 bg-primary-100/60 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-accent-100/60 rounded-full blur-2xl pointer-events-none" />
              </motion.div>

              {/* Text */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider border border-primary-100">
                  <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                  Sambutan Kepala Madrasah
                </div>
                
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                  {greetingData.title.split(' ').map((word, i) => {
                    return <span key={i} className={i > 1 ? 'text-primary-600' : ''}>{word} </span>;
                  })}
                </h2>

                <div className="text-gray-600 italic mb-8 leading-relaxed text-base sm:text-lg border-l-4 border-primary-400 pl-4 sm:pl-6 py-1 bg-primary-50/20 rounded-r-2xl">
                  <p className="relative">
                    "{greetingData.text}"
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50/80 p-3 sm:p-4 rounded-2xl border border-gray-100 w-fit">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{greetingData.name}</h4>
                    <p className="text-xs sm:text-sm font-medium text-primary-600 uppercase tracking-wider">{greetingData.role}</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* Programs Section */}
      {homeSettings?.programs?.is_active !== false && (
        <section className="py-16 sm:py-24 bg-gray-50/60 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                Keunggulan Madrasah
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4 tracking-tight">
                {programData.section_title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {programData.section_subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {programData.items?.map((prog, i) => {
                const Icon = ICON_MAP[prog.icon] || BookOpen;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
                  >
                    <div>
                      <div className={`w-14 h-14 ${prog.bg} ${prog.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{prog.title}</h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">{prog.desc}</p>
                    </div>
                    <Link 
                      to="/profil/program-kerja" 
                      className={`inline-flex items-center text-sm font-semibold ${prog.color} hover:underline mt-auto`}
                    >
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
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                Informasi & Kabar
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-2 tracking-tight">Warta Al-Ghazali</h2>
              <p className="text-gray-600 text-sm sm:text-base">Ikuti perkembangan kegiatan, prestasi, dan informasi penting madrasah.</p>
            </div>
            <Link 
              to="/berita" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all self-start sm:self-auto min-h-[44px]"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((news, i) => (
                <motion.div 
                  key={news.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link 
                    to={`/berita/${news.slug}`} 
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      {news.thumbnail ? (
                        <img 
                          src={news.thumbnail.startsWith('/') ? `${API_BASE}${news.thumbnail}` : news.thumbnail} 
                          alt={news.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100/50 flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-primary-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-primary-700 shadow-sm uppercase tracking-wider">
                          Kegiatan
                        </span>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2.5">
                          <Calendar className="w-3.5 h-3.5 text-primary-500" />
                          <span>{new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
                          {news.title}
                        </h3>
                        <p className="text-gray-500 line-clamp-2 text-xs sm:text-sm leading-relaxed mb-4">
                          {news.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                      </div>
                      <span className="inline-flex items-center text-xs sm:text-sm font-bold text-primary-600 group-hover:translate-x-0.5 transition-transform">
                        Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Belum ada berita terbaru saat ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {homeSettings?.cta?.is_active !== false && (
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="max-w-7xl mx-auto bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 rounded-3xl p-8 sm:p-14 md:p-16 relative overflow-hidden text-center shadow-xl border border-primary-700/50"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                {ctaData.title}
              </h2>
              <p className="text-primary-100 text-sm sm:text-lg mb-8 sm:mb-10 leading-relaxed opacity-90">
                {ctaData.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Link 
                  to={ctaData.primary_button?.link || '/pmb'} 
                  className="inline-flex items-center justify-center px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold bg-white text-primary-900 hover:bg-gray-100 shadow-xl hover:scale-105 transition-all group min-h-[44px]"
                >
                  {ctaData.primary_button?.text || 'Daftar Sekarang'}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to={ctaData.secondary_button?.link || '/fasilitas'} 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold border border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all min-h-[44px]"
                >
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

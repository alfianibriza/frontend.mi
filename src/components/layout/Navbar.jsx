import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, School, GraduationCap, Newspaper, LayoutGrid, X, 
  ChevronDown, ChevronRight, LayoutDashboard, LogOut, 
  Sparkles, BookOpen, Trophy, Users, Award, FileText, 
  Building2, Phone, MapPin, LogIn, Calendar
} from 'lucide-react';

const Navbar = () => {
  const [activeSheet, setActiveSheet] = useState(null); // 'profile' | 'menu' | null
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { logoUrl, schoolName, schoolSubtitle, phone, address } = useSiteSettings();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Realtime clock timer (updates every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Realtime Masehi & Hijriyah
  const formatDates = (date) => {
    let masehiFull;
    let masehiShort;
    let hijri;
    let timeStr;

    try {
      masehiFull = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);

      masehiShort = new Intl.DateTimeFormat('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      masehiFull = date.toLocaleDateString('id-ID');
      masehiShort = masehiFull;
    }

    try {
      hijri = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
      if (!hijri.includes('H')) {
        hijri += ' H';
      }
    } catch {
      try {
        hijri = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(date);
        if (!hijri.includes('H')) {
          hijri += ' H';
        }
      } catch {
        hijri = '';
      }
    }

    try {
      timeStr = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date).replace(/\./g, ':');
    } catch {
      timeStr = date.toLocaleTimeString();
    }

    return { masehiFull, masehiShort, hijri, timeStr };
  };

  const dates = formatDates(currentDateTime);

  // Close bottom sheets on route changes
  useEffect(() => {
    setActiveSheet(null);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const profileLinks = [
    { path: '/profil/visi-misi', label: 'Visi & Misi', desc: 'Arah dan tujuan madrasah', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
    { path: '/profil/sejarah', label: 'Sejarah Singkat', desc: 'Perjalanan & rekam jejak', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { path: '/profil/program-kerja', label: 'Program Unggulan', desc: 'Rencana kerja akademik', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
    { path: '/profil/guru', label: 'PTK (Guru & Staff)', desc: 'Tenaga pendidik profesional', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { path: '/profil/ekstrakurikuler', label: 'Ekstrakurikuler', desc: 'Pengembangan minat bakat', icon: Award, color: 'text-rose-600 bg-rose-50' },
    { path: '/profil/filosofi-logo', label: 'Filosofi Lambang', desc: 'Makna logo madrasah', icon: School, color: 'text-teal-600 bg-teal-50' },
  ];

  const studentLinks = [
    { path: '/prestasi', label: 'Prestasi Siswa', desc: 'Raihan kejuaraan & penghargaan', icon: Trophy, color: 'text-amber-600 bg-amber-50' },
    { path: '/alumni', label: 'Jejak Alumni', desc: 'Kiprah & profil lulusan', icon: GraduationCap, color: 'text-primary-600 bg-primary-50' },
  ];

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { 
      label: 'Profil', 
      path: '/profil',
      children: profileLinks.map(p => ({ path: p.path, label: p.label, icon: p.icon }))
    },
    { path: '/berita', label: 'Berita' },
    { 
      label: 'Kesiswaan',
      path: '/kesiswaan',
      children: studentLinks.map(s => ({ path: s.path, label: s.label, icon: s.icon }))
    },
    { path: '/fasilitas', label: 'Sarpras' },
  ];

  const isLightNav = !isHome || scrolled;

  return (
    <>
      {/* ============================================================ */}
      {/* 1. TOP NAVBAR (Desktop & Mobile Header)                       */}
      {/* ============================================================ */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isLightNav 
          ? 'bg-white/95 backdrop-blur-xl shadow-xs border-b border-gray-100/90 py-2.5 sm:py-3' 
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-3 sm:py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-12">
            
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <img 
                src={logoUrl || '/favicon.svg'} 
                alt={schoolName} 
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300 shrink-0" 
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + '/favicon.svg') {
                    e.currentTarget.src = '/favicon.svg';
                  }
                }}
              />
              <div className="min-w-0">
                <h1 className={`text-sm sm:text-base lg:text-lg font-bold leading-tight tracking-tight truncate transition-colors ${
                  isLightNav ? 'text-gray-900' : 'text-white'
                }`}>
                  {schoolName}
                </h1>
                <p className={`text-[10px] sm:text-xs font-medium -mt-0.5 truncate transition-colors ${
                  isLightNav ? 'text-primary-600' : 'text-primary-200'
                }`}>
                  {schoolSubtitle}
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links (Hidden on mobile) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-gray-100/60 p-1 rounded-2xl border border-gray-200/50 backdrop-blur-md">
              {navLinks.map((link, i) => (
                link.children ? (
                  <div key={i} className="relative group">
                    <button 
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all duration-200 ${
                        isActive(link.path)
                          ? 'bg-white text-primary-600 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-60" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 pointer-events-none group-hover:pointer-events-auto">
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-2 overflow-hidden space-y-0.5">
                        {link.children.map((child, j) => {
                          const Icon = child.icon;
                          const active = isActive(child.path);
                          return (
                            <Link 
                              key={j} 
                              to={child.path} 
                              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                active
                                  ? 'bg-primary-50 text-primary-700 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                              }`}
                            >
                              {Icon && (
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                  active ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    key={i} 
                    to={link.path} 
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      isActive(link.path) 
                        ? 'bg-white text-primary-600 shadow-xs' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Actions (Right): Realtime Date & PMB */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Realtime Gregorian & Hijri Date Badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-right transition-colors ${
                isLightNav 
                  ? 'bg-emerald-50/70 border-emerald-200/60 text-gray-800 shadow-2xs' 
                  : 'bg-black/35 backdrop-blur-md border-white/15 text-white'
              }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isLightNav ? 'bg-emerald-100/90 text-emerald-700' : 'bg-white/15 text-emerald-300'
                }`}>
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-right leading-tight">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={`text-[11px] font-bold ${
                      isLightNav ? 'text-emerald-800' : 'text-emerald-300'
                    }`}>
                      {dates.hijri}
                    </span>
                    <span className="text-[10px] opacity-40">•</span>
                    <span className={`text-[10px] font-semibold tabular-nums ${
                      isLightNav ? 'text-gray-700' : 'text-white/90'
                    }`}>
                      {dates.timeStr}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium ${
                    isLightNav ? 'text-gray-500' : 'text-white/70'
                  }`}>
                    {dates.masehiFull}
                  </span>
                </div>
              </div>

              <Link 
                to="/pmb" 
                className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-emerald-600 text-white hover:opacity-95 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Daftar PMB</span>
              </Link>

              {/* User Profile / Admin Link (when authenticated) */}
              {isAuthenticated && (
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:border-primary-300 transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden z-50"
                      >
                        <div className="px-3 py-2 border-b border-gray-50 mb-1">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Masuk sebagai</p>
                          <p className="text-xs font-semibold text-gray-800 truncate">{user?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            onClick={() => setProfileDropdownOpen(false)} 
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-primary-600" /> 
                            <span>Panel Admin</span>
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setProfileDropdownOpen(false); }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> 
                          <span>Keluar (Logout)</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Top Header Right: Realtime Gregorian & Hijri Date */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <div className={`flex flex-col items-end text-right px-2.5 py-1 rounded-xl border transition-colors ${
                isLightNav 
                  ? 'bg-emerald-50/80 border-emerald-200/60 text-gray-800' 
                  : 'bg-black/40 backdrop-blur-md border-white/20 text-white'
              }`}>
                <div className="flex items-center gap-1">
                  <Calendar className={`w-2.5 h-2.5 ${isLightNav ? 'text-emerald-700' : 'text-emerald-300'}`} />
                  <span className={`text-[10px] font-bold leading-tight ${
                    isLightNav ? 'text-emerald-800' : 'text-emerald-200'
                  }`}>
                    {dates.hijri}
                  </span>
                </div>
                <span className={`text-[8.5px] font-medium leading-tight mt-0.5 ${
                  isLightNav ? 'text-gray-600' : 'text-white/80'
                }`}>
                  {dates.masehiShort} • {dates.timeStr}
                </span>
              </div>

              {isAuthenticated && (
                <Link
                  to={isAdmin ? "/admin" : "/"}
                  className="w-7 h-7 rounded-xl bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs"
                  title="Panel Admin"
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on Mobile)   */}
      {/* ============================================================ */}
      <nav 
        id="mobile-bottom-nav"
        aria-label="Navigasi Mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-gray-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]"
      >
        <div className="grid grid-cols-5 items-end max-w-md mx-auto relative">
          
          {/* Item 1: Beranda */}
          <Link
            to="/"
            onClick={() => setActiveSheet(null)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              isActive('/') && !location.pathname.startsWith('/profil') && !location.pathname.startsWith('/berita') && !location.pathname.startsWith('/kesiswaan') && !location.pathname.startsWith('/fasilitas') && !location.pathname.startsWith('/pmb')
                ? 'text-primary-600 font-bold scale-105' 
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <div className="relative">
              <Home className="w-5 h-5" />
              {isActive('/') && !location.pathname.startsWith('/profil') && !location.pathname.startsWith('/berita') && !location.pathname.startsWith('/kesiswaan') && !location.pathname.startsWith('/fasilitas') && !location.pathname.startsWith('/pmb') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Beranda</span>
          </Link>

          {/* Item 2: Profil (Interactive Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setActiveSheet(activeSheet === 'profile' ? null : 'profile')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              location.pathname.startsWith('/profil') || activeSheet === 'profile'
                ? 'text-primary-600 font-bold scale-105' 
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <div className="relative">
              <School className="w-5 h-5" />
              {(location.pathname.startsWith('/profil') || activeSheet === 'profile') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Profil</span>
          </button>

          {/* Item 3: PMB (Elevated Center Highlight Button) */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <Link
              to="/pmb"
              onClick={() => setActiveSheet(null)}
              className="group relative flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                isActive('/pmb')
                  ? 'bg-gradient-to-tr from-primary-700 via-primary-600 to-emerald-500 shadow-primary-600/40 ring-4 ring-primary-100'
                  : 'bg-gradient-to-tr from-primary-600 via-primary-700 to-emerald-600 shadow-primary-600/30 ring-4 ring-white'
              }`}>
                <GraduationCap className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className={`text-[10px] mt-1 font-bold ${
                isActive('/pmb') ? 'text-primary-600 font-extrabold' : 'text-gray-700'
              }`}>
                PMB
              </span>
            </Link>
          </div>

          {/* Item 4: Berita */}
          <Link
            to="/berita"
            onClick={() => setActiveSheet(null)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              location.pathname.startsWith('/berita')
                ? 'text-primary-600 font-bold scale-105' 
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <div className="relative">
              <Newspaper className="w-5 h-5" />
              {location.pathname.startsWith('/berita') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Berita</span>
          </Link>

          {/* Item 5: Menu / Lainnya (Bottom Sheet with Sarpras, Kesiswaan, Kontak, etc.) */}
          <button
            type="button"
            onClick={() => setActiveSheet(activeSheet === 'menu' ? null : 'menu')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeSheet === 'menu' || location.pathname.startsWith('/prestasi') || location.pathname.startsWith('/alumni') || location.pathname.startsWith('/fasilitas')
                ? 'text-primary-600 font-bold scale-105' 
                : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <div className="relative">
              <LayoutGrid className="w-5 h-5" />
              {(activeSheet === 'menu' || location.pathname.startsWith('/prestasi') || location.pathname.startsWith('/alumni') || location.pathname.startsWith('/fasilitas')) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Menu</span>
          </button>

        </div>
      </nav>

      {/* ============================================================ */}
      {/* 3. MOBILE BOTTOM SHEET: PROFIL MADRASAH                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeSheet === 'profile' && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Slide-up Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 pb-24 max-h-[80vh] overflow-y-auto z-10"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900">Profil Madrasah</h3>
                  <p className="text-xs text-gray-500">Mengenal lebih dekat {schoolName}</p>
                </div>
                <button 
                  onClick={() => setActiveSheet(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profileLinks.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setActiveSheet(null)}
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                        active 
                          ? 'bg-primary-50/80 border-primary-200 text-primary-900' 
                          : 'bg-gray-50/70 border-gray-100 hover:bg-gray-100/70 text-gray-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-gray-900 flex items-center justify-between">
                          <span>{item.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 4. MOBILE BOTTOM SHEET: MENU LENGKAP (Kesiswaan, Sarpras, etc)*/}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeSheet === 'menu' && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Slide-up Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 pb-24 max-h-[85vh] overflow-y-auto z-10"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900">Menu & Layanan</h3>
                  <p className="text-xs text-gray-500">Navigasi cepat & informasi sekolah</p>
                </div>
                <button 
                  onClick={() => setActiveSheet(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Section 1: Kesiswaan & Sarpras */}
              <div className="space-y-4 mb-5">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Kesiswaan & Sarpras</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      to="/prestasi"
                      onClick={() => setActiveSheet(null)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-100/80 hover:bg-amber-100/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-gray-900">Prestasi</p>
                        <p className="text-[10px] text-gray-500 truncate">Raihan Juara</p>
                      </div>
                    </Link>

                    <Link
                      to="/alumni"
                      onClick={() => setActiveSheet(null)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100/80 hover:bg-blue-100/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-gray-900">Alumni</p>
                        <p className="text-[10px] text-gray-500 truncate">Jejak Lulusan</p>
                      </div>
                    </Link>

                    <Link
                      to="/fasilitas"
                      onClick={() => setActiveSheet(null)}
                      className="col-span-2 flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 hover:bg-emerald-100/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-gray-900">Sarana & Prasarana</p>
                        <p className="text-[10px] text-gray-500">Ruang kelas, perpustakaan, laboratorium, dan sarana ibadah</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>

                {/* Section 2: Hubungi Kami & Alamat */}
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Informasi Madrasah</p>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2 text-xs">
                    {address && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{address}</span>
                      </div>
                    )}
                    {phone && (
                      <a href={`tel:${phone}`} className="flex items-center gap-2 text-primary-700 font-semibold hover:underline">
                        <Phone className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                        <span className="text-[11px]">{phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Section 3: Akun Pengguna / Admin */}
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Akses Sistem</p>
                  {isAuthenticated ? (
                    <div className="bg-primary-50/60 rounded-2xl p-3.5 border border-primary-100 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-gray-900 truncate">{user?.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{isAdmin ? 'Administrator' : user?.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setActiveSheet(null)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-xs"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Buka Panel Dashboard Admin</span>
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setActiveSheet(null); }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setActiveSheet(null)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                    >
                      <LogIn className="w-4 h-4 text-primary-600" />
                      <span>Masuk ke Akun Staf / Admin</span>
                    </Link>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

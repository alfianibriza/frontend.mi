import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, LayoutDashboard, LogOut, 
  Sparkles, BookOpen, GraduationCap, Building2, Newspaper, 
  UserCheck, Trophy, Users, Award, FileText
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { logoUrl, hasLogo, schoolName, schoolSubtitle } = useSiteSettings();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const toggleMobileSubmenu = (label) => {
    setMobileExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { 
      label: 'Profil', 
      children: [
        { path: '/profil/sejarah', label: 'Sejarah', icon: BookOpen },
        { path: '/profil/visi-misi', label: 'Visi & Misi', icon: Sparkles },
        { path: '/profil/program-kerja', label: 'Program Kerja', icon: FileText },
        { path: '/profil/guru', label: 'PTK (Guru & Staff)', icon: Users },
        { path: '/profil/ekstrakurikuler', label: 'Ekstrakurikuler', icon: Award },
        { path: '/profil/filosofi-logo', label: 'Filosofi Logo', icon: BookOpen },
      ]
    },
    { path: '/berita', label: 'Berita' },
    { 
      label: 'Kesiswaan',
      children: [
        { path: '/prestasi', label: 'Prestasi Siswa', icon: Trophy },
        { path: '/alumni', label: 'Jejak Alumni', icon: GraduationCap },
      ]
    },
    { path: '/fasilitas', label: 'Sarpras' },
    { 
      label: 'PMB',
      badge: 'Buka',
      children: [
        { path: '/pmb', label: 'Informasi PMB', icon: BookOpen },
        { path: '/pmb?tab=unduh_pendaftaran', label: 'Unduh Formulir', icon: FileText },
        { path: '/pmb?tab=pengumuman', label: 'Siswa Diterima', icon: UserCheck },
      ]
    },
  ];

  // Dynamic navbar background styling
  const isLightNav = !isHome || scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLightNav 
        ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80 py-2.5' 
        : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            {hasLogo ? (
              <img 
                src={logoUrl} 
                alt={schoolName} 
                className="w-10 h-10 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform duration-300 bg-white/90 p-0.5" 
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 text-white font-bold text-lg">
                MI
              </div>
            )}
            <div className="min-w-0">
              <h1 className={`text-base sm:text-lg font-bold leading-tight truncate transition-colors ${
                isLightNav ? 'text-gray-900' : 'text-white'
              }`}>
                {schoolName}
              </h1>
              <p className={`text-[11px] sm:text-xs font-medium -mt-0.5 truncate transition-colors ${
                isLightNav ? 'text-primary-600' : 'text-primary-200'
              }`}>
                {schoolSubtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              link.children ? (
                <div key={i} className="relative group">
                  <button className={`px-3.5 py-2 text-sm font-medium rounded-xl flex items-center gap-1.5 transition-all duration-200 ${
                    isLightNav 
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/60' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}>
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-500 text-white leading-none">
                        {link.badge}
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 overflow-hidden">
                      {link.children.map((child, j) => {
                        const Icon = child.icon;
                        return (
                          <Link 
                            key={j} 
                            to={child.path} 
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50/80 hover:text-primary-600 rounded-xl transition-colors group/item"
                          >
                            {Icon && (
                              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover/item:bg-primary-100 group-hover/item:text-primary-600 transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <span className="font-medium">{child.label}</span>
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
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(link.path) 
                      ? (isLightNav ? 'text-primary-600 bg-primary-50 font-semibold' : 'text-white bg-white/20 font-semibold') 
                      : (isLightNav ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/60' : 'text-white/90 hover:text-white hover:bg-white/10')
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Desktop Right Actions: PMB Button & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/pmb" 
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Daftar PMB</span>
            </Link>

            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${
                    isLightNav ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-medium text-gray-400">Login sebagai</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setProfileOpen(false)} 
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl font-medium transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-600" /> 
                          <span>Panel Admin</span>
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setProfileOpen(false); }} 
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> 
                        <span>Keluar (Logout)</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/pmb"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-600 text-white shadow-sm flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>PMB</span>
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label="Buka Menu"
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors ${
                isLightNav 
                  ? 'text-gray-800 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100 overflow-hidden shadow-2xl absolute top-full left-0 right-0"
          >
            <div className="px-4 py-5 space-y-1.5 max-h-[82vh] overflow-y-auto">
              
              {navLinks.map((link, i) => (
                link.children ? (
                  <div key={i} className="rounded-xl overflow-hidden bg-gray-50/60 border border-gray-100/60">
                    <button
                      onClick={() => toggleMobileSubmenu(link.label)}
                      className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-500 text-white">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        mobileExpanded[link.label] ? 'rotate-180 text-primary-600' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {mobileExpanded[link.label] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-2 pb-2 space-y-1 border-t border-gray-100/80 pt-2"
                        >
                          {link.children.map((child, j) => {
                            const Icon = child.icon;
                            return (
                              <Link 
                                key={j} 
                                to={child.path} 
                                onClick={() => setIsOpen(false)} 
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                              >
                                {Icon && <Icon className="w-4 h-4 text-primary-600 shrink-0" />}
                                <span className="font-medium">{child.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    key={i} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className={`min-h-[44px] flex items-center px-3.5 py-2.5 text-sm rounded-xl font-medium transition-colors ${
                      isActive(link.path) 
                        ? 'text-primary-600 bg-primary-50 font-semibold' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}

              {/* Mobile Auth & Fast Actions */}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2.5">
                {isAuthenticated ? (
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{isAdmin ? 'Administrator' : user?.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsOpen(false)} 
                        className="flex items-center gap-2 w-full py-2 px-3 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Buka Panel Admin</span>
                      </Link>
                    )}
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }} 
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <Link 
                      to="/pmb" 
                      onClick={() => setIsOpen(false)} 
                      className="w-full min-h-[44px] flex items-center justify-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition-colors"
                    >
                      Daftar PMB
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

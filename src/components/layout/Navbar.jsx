import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { logoUrl, hasLogo, schoolName, schoolSubtitle } = useSiteSettings();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { 
      label: 'Profil', 
      children: [
        { path: '/profil/sejarah', label: 'Sejarah' },
        { path: '/profil/visi-misi', label: 'Visi & Misi' },
        { path: '/profil/program-kerja', label: 'Program Kerja' },
        { path: '/profil/guru', label: 'PTK (Guru & Staff)' },
        { path: '/profil/ekstrakurikuler', label: 'Ekstrakurikuler' },
        { path: '/profil/filosofi-logo', label: 'Filosofi Logo' },
      ]
    },
    { path: '/berita', label: 'Berita' },
    { 
      label: 'Kesiswaan',
      children: [
        { path: '/prestasi', label: 'Prestasi' },
        { path: '/alumni', label: 'Alumni' },
      ]
    },
    { path: '/fasilitas', label: 'Sarpras' },
    { 
      label: 'PMB',
      children: [
        { path: '/pmb', label: 'Informasi PMB' },
        { path: '/pmb?tab=unduh_pendaftaran', label: 'Unduh Pendaftaran' },
        { path: '/pmb?tab=pengumuman', label: 'Siswa Diterima' },
      ]
    },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {hasLogo ? (
              <img src={logoUrl} alt={schoolName} className="w-10 h-10 rounded-xl object-contain shadow-lg group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">MI</span>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold leading-tight transition-colors ${scrolled ? 'text-gray-800' : 'text-gray-900 lg:text-white'}`}>{schoolName}</h1>
              <p className={`text-xs -mt-0.5 transition-colors ${scrolled ? 'text-primary-600' : 'text-primary-700 lg:text-primary-200'}`}>{schoolSubtitle}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              link.children ? (
                <div key={i} className="relative group">
                  <button className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1 transition-colors ${scrolled ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                    {link.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 overflow-hidden">
                    <div className="py-2">
                      {link.children.map((child, j) => (
                        <Link key={j} to={child.path} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={i} to={link.path} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(link.path) ? (scrolled ? 'text-primary-600 bg-primary-50' : 'text-white bg-white/20') : (scrolled ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50' : 'text-white/90 hover:text-white hover:bg-white/10')}`}>
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-semibold">{user?.name?.[0]}</span>
                  </div>
                  <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'}`}>{user?.name}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                        </Link>
                      )}
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className={`text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg ${scrolled ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-white text-primary-700 hover:bg-gray-50'}`}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-900 hover:bg-black/5'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 overflow-hidden shadow-xl absolute top-full left-0 right-0"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link, i) => (
                link.children ? (
                  <div key={i} className="mb-2">
                    <p className="px-3 py-2 text-xs font-semibold text-primary-600 uppercase tracking-wider">{link.label}</p>
                    <div className="pl-2 border-l-2 border-primary-100 ml-3 space-y-1">
                      {link.children.map((child, j) => (
                        <Link key={j} to={child.path} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={i} to={link.path} onClick={() => setIsOpen(false)} className={`block px-3 py-2.5 text-sm rounded-lg ${isActive(link.path) ? 'text-primary-600 bg-primary-50 font-medium' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`}>
                    {link.label}
                  </Link>
                )
              ))}
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                       <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-lg font-semibold">{user?.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</p>
                      </div>
                    </div>
                    {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"><LayoutDashboard className="w-4 h-4" /> Dashboard Admin</Link>}
                    <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"><LogOut className="w-4 h-4" /> Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md">
                    Login
                  </Link>
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

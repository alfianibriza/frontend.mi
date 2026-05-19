import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Newspaper,
  School,
  Users,
  Trophy,
  Activity,
  Building2,
  ClipboardList,
  GraduationCap,
  Calendar,
  UserCog,
  LogOut,
  ChevronLeft,
  Menu,
  Home,
  Image as ImageIcon,
  Settings
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { logoUrl, hasLogo, schoolName } = useSiteSettings();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/beranda', label: 'Kelola Beranda', icon: Home },
    { path: '/admin/berita', label: 'Kelola Berita', icon: Newspaper },
    { path: '/admin/media', label: 'Pustaka Media', icon: ImageIcon },
    { path: '/admin/profil', label: 'Kelola Profil', icon: School },
    { path: '/admin/guru', label: 'Kelola Guru', icon: Users },
    { path: '/admin/prestasi', label: 'Kelola Prestasi', icon: Trophy },
    { path: '/admin/ekskul', label: 'Kelola Ekskul', icon: Activity },
    { path: '/admin/fasilitas', label: 'Kelola Sarpras', icon: Building2 },
    { path: '/admin/pmb-settings', label: 'Konten PMB', icon: Settings },
    { path: '/admin/pmb', label: 'Data Pendaftar', icon: ClipboardList },
    { path: '/admin/alumni', label: 'Kelola Alumni', icon: GraduationCap },
    { path: '/admin/users', label: 'Kelola Users', icon: UserCog },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <>
      {/* Overlay mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            {hasLogo ? (
              <img src={logoUrl} alt={schoolName} className="w-10 h-10 rounded-xl object-contain shadow-lg group-hover:scale-110 transition-transform" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">MI</span>
              </div>
            )}
            <div>
              <h2 className="text-white font-bold text-base tracking-tight">{schoolName}</h2>
              <p className="text-[10px] text-primary-400 font-semibold uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1.5 overflow-y-auto no-scrollbar" style={{ height: 'calc(100vh - 160px)' }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={i}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group ${active
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">{user?.name?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-semibold truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

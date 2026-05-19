import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const Footer = () => {
  const { logoUrl, hasLogo, schoolName, schoolSubtitle, address, phone, email, motto } = useSiteSettings();
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {hasLogo ? (
                <img src={logoUrl} alt={schoolName} className="w-10 h-10 rounded-xl object-contain" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">MI</span>
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-lg">{schoolName}</h3>
                <p className="text-xs text-gray-400">{schoolSubtitle}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{motto || 'Terwujudnya generasi Islam yang berakhlak mulia, cerdas, dan berprestasi.'}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Menu</h4>
            <ul className="space-y-2">
              {[{ to: '/', label: 'Beranda' }, { to: '/berita', label: 'Berita' }, { to: '/profil/sejarah', label: 'Profil' }, { to: '/fasilitas', label: 'Sarpras' }, { to: '/pmb', label: 'PMB' }].map((link, i) => (
                <li key={i}><Link to={link.to} className="text-sm hover:text-primary-400 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Profil */}
          <div>
            <h4 className="text-white font-semibold mb-4">Profil</h4>
            <ul className="space-y-2">
              {[{ to: '/profil/visi-misi', label: 'Visi & Misi' }, { to: '/profil/guru', label: 'Guru & Staff' }, { to: '/prestasi', label: 'Prestasi' }, { to: '/profil/ekstrakurikuler', label: 'Ekstrakurikuler' }].map((link, i) => (
                <li key={i}><Link to={link.to} className="text-sm hover:text-primary-400 transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"> {address || 'Jl. Pendidikan No. 1, Indonesia'}</li>
              <li className="flex items-start gap-2"> {phone || '(021) 1234-5678'}</li>
              <li className="flex items-start gap-2"> {email || 'info@mialghazali.sch.id'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {schoolName}. All rights reserved.</p>
          <p className="text-xs text-gray-600">dalam pengembangan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

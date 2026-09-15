import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const { logoUrl, schoolName, schoolSubtitle, address, phone, email, motto } = useSiteSettings();

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={logoUrl || '/favicon.svg'} 
                alt={schoolName} 
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform duration-300" 
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + '/favicon.svg') {
                    e.currentTarget.src = '/favicon.svg';
                  }
                }}
              />
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{schoolName}</h3>
                <p className="text-xs text-primary-400">{schoolSubtitle}</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {motto || 'Terwujudnya generasi Islam yang berakhlak mulia, cerdas, berkarakter, dan berprestasi.'}
            </p>
            <div className="pt-2">
              <Link 
                to="/pmb" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              >
                <span>Penerimaan Murid Baru (PMB)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/berita', label: 'Warta Madrasah' },
                { to: '/fasilitas', label: 'Sarana & Prasarana' },
                { to: '/prestasi', label: 'Prestasi Siswa' },
                { to: '/alumni', label: 'Jejak Alumni' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-400 hover:text-white transition-colors block py-0.5">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profil Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Profil Sekolah</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/profil/sejarah', label: 'Sejarah Singkat' },
                { to: '/profil/visi-misi', label: 'Visi & Misi' },
                { to: '/profil/guru', label: 'Dewan Guru & Staff' },
                { to: '/profil/ekstrakurikuler', label: 'Ekstrakurikuler' },
                { to: '/profil/program-kerja', label: 'Program Unggulan' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-400 hover:text-white transition-colors block py-0.5">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{address || 'Jl. Pendidikan No. 1, Indonesia'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{phone || '(021) 1234-5678'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{email || 'info@mialghazali.sch.id'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {schoolName}. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-gray-400 transition-colors">Portal Staf & Guru</Link>
            <span>•</span>
            <Link to="/pmb" className="hover:text-primary-400 transition-colors">Info Pendaftaran</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

/**
 * =============================================================
 * CONTEXT: SITE SETTINGS (Logo, Nama Madrasah, Kontak, dll)
 * =============================================================
 * 
 * Context global yang menyediakan data pengaturan situs
 * (logo, nama sekolah, kontak) ke seluruh komponen.
 * Digunakan oleh Navbar, Footer, AdminSidebar, dan favicon/title.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { homeSettingApi } from '../api';

const SiteSettingsContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

export const SiteSettingsProvider = ({ children }) => {
  const [logoData, setLogoData] = useState({
    logo_url: '',
    favicon_url: '',
    school_name: 'MI Al-Ghazali',
    school_subtitle: 'Madrasah Ibtidaiyah'
  });

  const [schoolInfo, setSchoolInfo] = useState({
    school_name: 'MI Al-Ghazali',
    school_subtitle: 'Madrasah Ibtidaiyah',
    address: 'Jl. Pendidikan No. 1, Indonesia',
    phone: '(021) 1234-5678',
    email: 'info@mialghazali.sch.id',
    motto: 'Terwujudnya generasi Islam yang berakhlak mulia, cerdas, dan berprestasi.'
  });

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `${API_BASE}${path}`;
    return `${API_BASE}/${path}`;
  };

  const parseContent = (content) => {
    if (typeof content === 'string') {
      try { return JSON.parse(content); } catch { return {}; }
    }
    return content || {};
  };

  const loadSettings = async () => {
    try {
      const res = await homeSettingApi.getAll();
      const data = res.data.data || {};

      // Load logo data
      if (data.logo) {
        const content = parseContent(data.logo.content);
        setLogoData(prev => ({ ...prev, ...content }));
        if (content.favicon_url) {
          updateFavicon(getFullUrl(content.favicon_url));
        }
      }

      // Load school info
      if (data.school_info) {
        const content = parseContent(data.school_info.content);
        setSchoolInfo(prev => ({ ...prev, ...content }));
        // Update browser tab title
        if (content.school_name) {
          document.title = `${content.school_name} | ${content.school_subtitle || 'Madrasah Ibtidaiyah'}`;
        }
      }
    } catch {
      // Gunakan default jika gagal
    }
  };

  const updateFavicon = (url) => {
    if (!url) return;
    const existing = document.querySelectorAll("link[rel*='icon']");
    existing.forEach(el => el.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = url;
    document.head.appendChild(link);

    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = url;
    document.head.appendChild(appleLink);
  };

  const refreshSettings = () => {
    loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const logoUrl = getFullUrl(logoData.logo_url);
  const faviconUrl = getFullUrl(logoData.favicon_url);

  // Prioritas: school_info > logo > default
  const schoolName = schoolInfo.school_name || logoData.school_name || 'MI Al-Ghazali';
  const schoolSubtitle = schoolInfo.school_subtitle || logoData.school_subtitle || 'Madrasah Ibtidaiyah';

  return (
    <SiteSettingsContext.Provider value={{
      logoUrl,
      faviconUrl,
      schoolName,
      schoolSubtitle,
      hasLogo: !!logoData.logo_url,
      // School info
      address: schoolInfo.address || '',
      phone: schoolInfo.phone || '',
      email: schoolInfo.email || '',
      motto: schoolInfo.motto || '',
      refreshSettings
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      logoUrl: '',
      faviconUrl: '',
      schoolName: 'MI Al-Ghazali',
      schoolSubtitle: 'Madrasah Ibtidaiyah',
      hasLogo: false,
      address: '',
      phone: '',
      email: '',
      motto: '',
      refreshSettings: () => {}
    };
  }
  return context;
};

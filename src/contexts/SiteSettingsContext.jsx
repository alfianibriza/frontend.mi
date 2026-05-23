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
    const normalizedPath = path.replace(/\\/g, '/');
    if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://')) return normalizedPath;
    if (normalizedPath.startsWith('/')) return `${API_BASE}${normalizedPath}`;
    return `${API_BASE}/${normalizedPath}`;
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
        // Use logo_url as favicon if favicon_url is not set
        const faviconSrc = (content.favicon_url && content.favicon_url.trim()) || content.logo_url;
        const logoSrc = content.logo_url;
        setLogoData(prev => ({ ...prev, ...content }));
        if (faviconSrc) {
          updateFavicon(getFullUrl(faviconSrc));
        } else if (logoSrc) {
          updateFavicon(getFullUrl(logoSrc));
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
    
    // Remove ALL existing favicon-related links
    const selectors = [
      "link[rel='icon']",
      "link[rel='shortcut icon']",
      "link[rel='apple-touch-icon']",
      "link[rel*='icon']"
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // Determine MIME type from URL
    const getIconType = (iconUrl) => {
      const lower = iconUrl.toLowerCase().split('?')[0];
      if (lower.endsWith('.svg')) return 'image/svg+xml';
      if (lower.endsWith('.ico')) return 'image/x-icon';
      if (lower.endsWith('.png')) return 'image/png';
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
      if (lower.endsWith('.webp')) return 'image/webp';
      return 'image/png'; // default
    };

    // Cache buster to force browser refresh
    const cacheBuster = 'v=' + Date.now();
    const faviconHref = url + (url.includes('?') ? '&' : '?') + cacheBuster;
    const iconType = getIconType(url);

    // Standard favicon (rel="icon")
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = iconType;
    link.href = faviconHref;
    document.head.appendChild(link);

    // Legacy shortcut icon for older browsers
    const shortcutLink = document.createElement('link');
    shortcutLink.rel = 'shortcut icon';
    shortcutLink.type = iconType;
    shortcutLink.href = faviconHref;
    document.head.appendChild(shortcutLink);

    // Apple touch icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = faviconHref;
    document.head.appendChild(appleLink);
  };

  const refreshSettings = () => {
    loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const logoUrl = getFullUrl(logoData.logo_url);
  const faviconUrl = getFullUrl(logoData.favicon_url || logoData.logo_url);

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
      refreshSettings: () => { }
    };
  }
  return context;
};

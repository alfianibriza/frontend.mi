import { useState, useEffect, useRef } from 'react';
import { homeSettingApi } from '../../api';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { Save, Upload, Plus, Trash2, Eye, EyeOff, Image, Type, BarChart3, Megaphone, Sparkles, RefreshCw, ChevronDown, ChevronUp, GripVertical, Shield, Building2, UserCircle, Video } from 'lucide-react';
import MediaPickerModal from '../../components/common/MediaPickerModal';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const getFullUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
};

const ICON_OPTIONS = [
  'GraduationCap', 'Users', 'Calendar', 'Trophy', 'BookOpen', 'Heart', 'ShieldCheck', 'Star', 'Award', 'Target'
];

const COLOR_OPTIONS = [
  { value: 'bg-blue-500', label: 'Biru' }, { value: 'bg-green-500', label: 'Hijau' },
  { value: 'bg-amber-500', label: 'Kuning' }, { value: 'bg-purple-500', label: 'Ungu' },
  { value: 'bg-red-500', label: 'Merah' }, { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-indigo-500', label: 'Indigo' }, { value: 'bg-teal-500', label: 'Teal' },
];

const TEXT_COLOR_OPTIONS = [
  { value: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Emerald' },
  { value: 'text-rose-600', bg: 'bg-rose-50', label: 'Rose' },
  { value: 'text-sky-600', bg: 'bg-sky-50', label: 'Sky' },
  { value: 'text-purple-600', bg: 'bg-purple-50', label: 'Purple' },
  { value: 'text-amber-600', bg: 'bg-amber-50', label: 'Amber' },
  { value: 'text-blue-600', bg: 'bg-blue-50', label: 'Blue' },
];

const SectionCard = ({ title, icon: Icon, children, isActive, onToggle, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-white rounded-2xl shadow-md border overflow-hidden transition-all ${isActive === false ? 'opacity-60 border-gray-200' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {onToggle && (
            <button onClick={e => { e.stopPropagation(); onToggle(); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {isActive ? <><Eye className="w-3 h-3 inline mr-1" />Aktif</> : <><EyeOff className="w-3 h-3 inline mr-1" />Nonaktif</>}
            </button>
          )}
          {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-5">{children}</div>}
    </div>
  );
};

const AdminBeranda = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
  const { refreshSettings } = useSiteSettings();

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const loadData = async () => {
    try {
      const res = await homeSettingApi.getAll();
      const raw = res.data.data || {};
      // Safety parse: jika content masih berupa string, parse ke object
      for (const key of Object.keys(raw)) {
        if (raw[key]?.content && typeof raw[key].content === 'string') {
          try { raw[key].content = JSON.parse(raw[key].content); } catch { /* keep as-is */ }
        }
      }
      setSettings(raw);
    } catch { showToast('Gagal memuat data', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleInit = async () => {
    try {
      await homeSettingApi.init();
      showToast('Data beranda berhasil diinisialisasi!');
      loadData();
    } catch { showToast('Gagal inisialisasi', 'error'); }
  };

  const saveSection = async (key) => {
    setSaving(p => ({ ...p, [key]: true }));
    try {
      await homeSettingApi.update(key, { content: settings[key].content, is_active: settings[key].is_active });
      showToast(`Section "${settings[key].title}" berhasil disimpan!`);
    } catch { showToast('Gagal menyimpan', 'error'); }
    finally { setSaving(p => ({ ...p, [key]: false })); }
  };

  const updateContent = (key, content) => {
    setSettings(p => ({ ...p, [key]: { ...p[key], content } }));
  };

  const toggleActive = async (key) => {
    const newVal = !settings[key].is_active;
    setSettings(p => ({ ...p, [key]: { ...p[key], is_active: newVal } }));
    try { await homeSettingApi.update(key, { is_active: newVal }); showToast(`Section ${newVal ? 'diaktifkan' : 'dinonaktifkan'}`); }
    catch { showToast('Gagal update status', 'error'); }
  };

  const handleMediaSelect = (url) => {
    if (mediaPickerTarget === 'logo_url') {
      updateContent('logo', { ...settings.logo.content, logo_url: url, favicon_url: url });
      showToast('Logo berhasil dipilih!');
    } else if (mediaPickerTarget === 'greeting_image') {
      updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, image_url: url });
      showToast('Foto sambutan berhasil dipilih!');
    } else if (mediaPickerTarget === 'slide_image' && uploadingFor !== null && settings.hero_slides) {
      const slides = [...settings.hero_slides.content];
      slides[uploadingFor] = { ...slides[uploadingFor], image: url };
      updateContent('hero_slides', slides);
      showToast('Gambar slide berhasil dipilih!');
      setUploadingFor(null);
    }
  };

  const saveLogoSection = async () => {
    setSaving(p => ({ ...p, logo: true }));
    try {
      await homeSettingApi.update('logo', { content: settings.logo.content, is_active: settings.logo.is_active });
      refreshSettings(); // Update logo & favicon di seluruh situs
      showToast('Logo madrasah berhasil disimpan!');
    } catch { showToast('Gagal menyimpan logo', 'error'); }
    finally { setSaving(p => ({ ...p, logo: false })); }
  };

  const saveSchoolInfo = async () => {
    setSaving(p => ({ ...p, school_info: true }));
    try {
      await homeSettingApi.update('school_info', { content: settings.school_info.content, is_active: settings.school_info.is_active });
      refreshSettings(); // Update nama & alamat di seluruh situs + tab title
      showToast('Identitas madrasah berhasil disimpan!');
    } catch { showToast('Gagal menyimpan', 'error'); }
    finally { setSaving(p => ({ ...p, school_info: false })); }
  };

  const saveGreetingSection = async () => {
    setSaving(p => ({ ...p, headmaster_greeting: true }));
    try {
      await homeSettingApi.update('headmaster_greeting', { content: settings.headmaster_greeting.content, is_active: settings.headmaster_greeting.is_active });
      showToast('Sambutan Kepala Madrasah berhasil disimpan!');
    } catch { showToast('Gagal menyimpan', 'error'); }
    finally { setSaving(p => ({ ...p, headmaster_greeting: false })); }
  };

  const isEmpty = Object.keys(settings).length === 0;

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium text-white animate-pulse ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Kelola Beranda</h1>
          <p className="text-sm text-gray-500 mt-1">Kustomisasi tampilan halaman utama website</p>
        </div>
        {isEmpty && (
          <button onClick={handleInit} className="btn-primary flex items-center gap-2 !py-3">
            <Sparkles className="w-4 h-4" /> Inisialisasi Data Default
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-2">Belum ada pengaturan beranda.</p>
          <p className="text-gray-400 text-sm">Klik tombol "Inisialisasi Data Default" untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* LOGO MADRASAH */}
          {settings.logo && (
            <SectionCard title="Atur Logo Madrasah" icon={Shield} defaultOpen>
              <div className="space-y-5">
                {/* Logo Utama & Favicon */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                  <h4 className="text-sm font-bold text-gray-700">Logo Website & Tab Browser</h4>
                  <p className="text-xs text-gray-500">Satu logo ini akan otomatis tampil di Navbar, Footer, Sidebar Admin, dan sebagai ikon tab browser (favicon).</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {settings.logo.content?.logo_url ? (
                        <>
                          <img src={getFullUrl(settings.logo.content.logo_url)} alt="Logo" className="w-full h-full object-contain p-1" onError={e => { e.target.style.display = 'none'; if(e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'block'; }} />
                          <span className="text-red-400 text-[10px] text-center" style={{ display: 'none' }}>Error</span>
                        </>
                      ) : (
                        <span className="text-gray-300 text-xs text-center">Belum ada<br />logo</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input className="input-field text-sm py-2" value={settings.logo.content?.logo_url || ''} onChange={e => updateContent('logo', { ...settings.logo.content, logo_url: e.target.value, favicon_url: e.target.value })} placeholder="Masukkan URL logo atau pilih..." />
                        <button onClick={() => { setMediaPickerTarget('logo_url'); setIsMediaPickerOpen(true); }} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 flex items-center justify-center gap-2 whitespace-nowrap">
                          <Upload className="w-4 h-4" /> Pilih Media
                        </button>
                      </div>
                      {settings.logo.content?.logo_url && (
                        <button onClick={() => updateContent('logo', { ...settings.logo.content, logo_url: '', favicon_url: '' })} className="px-4 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg">
                          Hapus Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nama Sekolah */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Madrasah</label>
                    <input className="input-field" value={settings.logo.content?.school_name || ''} onChange={e => updateContent('logo', { ...settings.logo.content, school_name: e.target.value })} placeholder="MI Al-Ghazali" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                    <input className="input-field" value={settings.logo.content?.school_subtitle || ''} onChange={e => updateContent('logo', { ...settings.logo.content, school_subtitle: e.target.value })} placeholder="Madrasah Ibtidaiyah" />
                  </div>
                </div>
              </div>
              <button onClick={saveLogoSection} disabled={saving.logo} className="btn-primary mt-4 flex items-center gap-2">
                {saving.logo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Logo
              </button>
            </SectionCard>
          )}

          {/* IDENTITAS MADRASAH */}
          {settings.school_info && (
            <SectionCard title="Atur Nama & Alamat Madrasah" icon={Building2} defaultOpen>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Madrasah</label>
                    <input className="input-field" value={settings.school_info.content?.school_name || ''} onChange={e => updateContent('school_info', { ...settings.school_info.content, school_name: e.target.value })} placeholder="MI Al-Ghazali" />
                    <p className="text-[10px] text-gray-400 mt-1">Akan tampil di Navbar, Footer, Sidebar, dan Tab Browser</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle / Jenjang</label>
                    <input className="input-field" value={settings.school_info.content?.school_subtitle || ''} onChange={e => updateContent('school_info', { ...settings.school_info.content, school_subtitle: e.target.value })} placeholder="Madrasah Ibtidaiyah" />
                    <p className="text-[10px] text-gray-400 mt-1">Tampil di bawah nama madrasah</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Alamat Lengkap</label>
                  <textarea className="input-field" rows={2} value={settings.school_info.content?.address || ''} onChange={e => updateContent('school_info', { ...settings.school_info.content, address: e.target.value })} placeholder="Jl. Pendidikan No. 1, Indonesia" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">No. Telepon</label>
                    <input className="input-field" value={settings.school_info.content?.phone || ''} onChange={e => updateContent('school_info', { ...settings.school_info.content, phone: e.target.value })} placeholder="(021) 1234-5678" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input className="input-field" type="email" value={settings.school_info.content?.email || ''} onChange={e => updateContent('school_info', { ...settings.school_info.content, email: e.target.value })} placeholder="info@mialghazali.sch.id" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Motto / Tagline Madrasah</label>
                  <textarea className="input-field" rows={2} value={settings.school_info.content?.motto || ''} onChange={e => updateContent('school_info', { ...settings.school_info.content, motto: e.target.value })} placeholder="Terwujudnya generasi Islam yang..." />
                  <p className="text-[10px] text-gray-400 mt-1">Tampil di bagian Footer website</p>
                </div>
              </div>
              <button onClick={saveSchoolInfo} disabled={saving.school_info} className="btn-primary mt-4 flex items-center gap-2">
                {saving.school_info ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Identitas
              </button>
            </SectionCard>
          )}

          {/* SAMBUTAN KEPALA SEKOLAH */}
          {settings.headmaster_greeting && (
            <SectionCard title="Atur Sambutan Kepala" icon={UserCircle} isActive={settings.headmaster_greeting.is_active} onToggle={() => toggleActive('headmaster_greeting')} defaultOpen>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                    {settings.headmaster_greeting.content?.image_url ? (
                      <img src={getFullUrl(settings.headmaster_greeting.content.image_url)} alt="Foto Kepala Madrasah" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <span className="text-gray-400 text-xs text-center">Belum ada<br />foto</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input className="input-field text-sm py-2" value={settings.headmaster_greeting.content?.image_url || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, image_url: e.target.value })} placeholder="Masukkan URL foto atau pilih..." />
                      <button onClick={() => { setMediaPickerTarget('greeting_image'); setIsMediaPickerOpen(true); }} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 flex items-center justify-center gap-2 whitespace-nowrap">
                        Pilih Foto
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Gunakan foto potrait resolusi tinggi.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Kepala Madrasah</label>
                    <input className="input-field" value={settings.headmaster_greeting.content?.name || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, name: e.target.value })} placeholder="Ust. H. Ahmad Fauzi, M.Pd" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Jabatan / Role</label>
                    <input className="input-field" value={settings.headmaster_greeting.content?.role || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, role: e.target.value })} placeholder="Kepala Madrasah" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Judul Sambutan</label>
                    <input className="input-field" value={settings.headmaster_greeting.content?.title || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, title: e.target.value })} placeholder="Membentuk Karakter Unggul & Beradab" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Angka Exp</label>
                      <input className="input-field" value={settings.headmaster_greeting.content?.experience || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, experience: e.target.value })} placeholder="20+" />
                    </div>
                    <div className="w-2/3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label Exp</label>
                      <input className="input-field" value={settings.headmaster_greeting.content?.experience_label || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, experience_label: e.target.value })} placeholder="Tahun Pengalaman" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Teks Sambutan</label>
                  <textarea className="input-field" rows={4} value={settings.headmaster_greeting.content?.text || ''} onChange={e => updateContent('headmaster_greeting', { ...settings.headmaster_greeting.content, text: e.target.value })} placeholder="Assalamualaikum Wr. Wb..." />
                </div>
              </div>
              <button onClick={saveGreetingSection} disabled={saving.headmaster_greeting} className="btn-primary mt-4 flex items-center gap-2">
                {saving.headmaster_greeting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Sambutan
              </button>
            </SectionCard>
          )}

          {/* HERO SLIDES */}
          {settings.hero_slides && (
            <SectionCard title="Hero Slides" icon={Image} isActive={settings.hero_slides.is_active} onToggle={() => toggleActive('hero_slides')} defaultOpen>
              <div className="space-y-4">
                {settings.hero_slides.content?.map((slide, i) => {
                  const mediaType = slide.media_type || 'image';
                  return (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600">Slide {i + 1}</span>
                      <button onClick={() => { const s = [...settings.hero_slides.content]; s.splice(i, 1); updateContent('hero_slides', s); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Judul</label>
                      <input className="input-field" value={slide.title} onChange={e => { const s = [...settings.hero_slides.content]; s[i] = { ...s[i], title: e.target.value }; updateContent('hero_slides', s); }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                      <textarea className="input-field" rows={2} value={slide.subtitle} onChange={e => { const s = [...settings.hero_slides.content]; s[i] = { ...s[i], subtitle: e.target.value }; updateContent('hero_slides', s); }} />
                    </div>
                    {/* Media Type Selector */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tipe Media</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { const s = [...settings.hero_slides.content]; s[i] = { ...s[i], media_type: 'image' }; updateContent('hero_slides', s); }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${mediaType === 'image' ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                          <Image className="w-3.5 h-3.5" /> Gambar
                        </button>
                        <button
                          onClick={() => { const s = [...settings.hero_slides.content]; s[i] = { ...s[i], media_type: 'video' }; updateContent('hero_slides', s); }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${mediaType === 'video' ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                          <Video className="w-3.5 h-3.5" /> Video YouTube
                        </button>
                      </div>
                    </div>
                    {/* Media Input */}
                    {mediaType === 'video' ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Link YouTube</label>
                        <input className="input-field text-sm" value={slide.video_url || ''} onChange={e => { const s = [...settings.hero_slides.content]; s[i] = { ...s[i], video_url: e.target.value }; updateContent('hero_slides', s); }} placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..." />
                        <p className="text-[10px] text-gray-400 mt-1">Mendukung format: youtube.com/watch?v=ID, youtu.be/ID, atau youtube.com/embed/ID</p>
                        {slide.video_url && (() => {
                          const match = slide.video_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
                          const videoId = match?.[1];
                          return videoId ? (
                            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: '16/9', maxHeight: '160px' }}>
                              <iframe src={`https://www.youtube.com/embed/${videoId}`} title="Preview" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            </div>
                          ) : <p className="text-xs text-red-400 mt-1">URL YouTube tidak valid</p>;
                        })()}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Gambar</label>
                        <div className="flex items-center gap-3">
                          <input className="input-field flex-1 text-sm" value={slide.image || ''} onChange={e => { const s = [...settings.hero_slides.content]; s[i] = { ...s[i], image: e.target.value }; updateContent('hero_slides', s); }} placeholder="URL atau path gambar" />
                          <button onClick={() => { setUploadingFor(i); setMediaPickerTarget('slide_image'); setIsMediaPickerOpen(true); }} className="px-3 py-2.5 bg-primary-50 text-primary-600 rounded-xl text-xs font-medium hover:bg-primary-100 flex items-center gap-1 whitespace-nowrap">
                            <Upload className="w-3 h-3" /> Pilih
                          </button>
                        </div>
                        {slide.image && (
                          <img src={getFullUrl(slide.image)} alt="" className="mt-2 h-24 rounded-lg object-cover" onError={e => e.target.style.display = 'none'} />
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
                <button onClick={() => updateContent('hero_slides', [...(settings.hero_slides.content || []), { image: '', video_url: '', media_type: 'image', title: 'Slide Baru', subtitle: 'Deskripsi slide baru' }])} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Slide
                </button>
              </div>
              <button onClick={() => saveSection('hero_slides')} disabled={saving.hero_slides} className="btn-primary mt-4 flex items-center gap-2">
                {saving.hero_slides ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Hero Slides
              </button>
            </SectionCard>
          )}

          {/* STATISTIK */}
          {settings.stats && (
            <SectionCard title="Statistik" icon={BarChart3} isActive={settings.stats.is_active} onToggle={() => toggleActive('stats')}>
              <div className="space-y-3">
                {settings.stats.content?.map((stat, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                      <input className="input-field" value={stat.label} onChange={e => { const s = [...settings.stats.content]; s[i] = { ...s[i], label: e.target.value }; updateContent('stats', s); }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nilai</label>
                      <input className="input-field" value={stat.value} onChange={e => { const s = [...settings.stats.content]; s[i] = { ...s[i], value: e.target.value }; updateContent('stats', s); }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                      <select className="input-field" value={stat.icon} onChange={e => { const s = [...settings.stats.content]; s[i] = { ...s[i], icon: e.target.value }; updateContent('stats', s); }}>
                        {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Warna</label>
                        <select className="input-field" value={stat.color} onChange={e => { const s = [...settings.stats.content]; s[i] = { ...s[i], color: e.target.value }; updateContent('stats', s); }}>
                          {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <button onClick={() => { const s = [...settings.stats.content]; s.splice(i, 1); updateContent('stats', s); }} className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => updateContent('stats', [...(settings.stats.content || []), { label: 'Label Baru', value: '0+', icon: 'Star', color: 'bg-blue-500' }])} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Statistik
                </button>
              </div>
              <button onClick={() => saveSection('stats')} disabled={saving.stats} className="btn-primary mt-4 flex items-center gap-2">
                {saving.stats ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Statistik
              </button>
            </SectionCard>
          )}

          {/* PROGRAM UNGGULAN */}
          {settings.programs && (
            <SectionCard title="Program Unggulan" icon={Sparkles} isActive={settings.programs.is_active} onToggle={() => toggleActive('programs')}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Judul Section</label>
                    <input className="input-field" value={settings.programs.content?.section_title || ''} onChange={e => updateContent('programs', { ...settings.programs.content, section_title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle Section</label>
                    <input className="input-field" value={settings.programs.content?.section_subtitle || ''} onChange={e => updateContent('programs', { ...settings.programs.content, section_subtitle: e.target.value })} />
                  </div>
                </div>
                {settings.programs.content?.items?.map((prog, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600">Program {i + 1}</span>
                      <button onClick={() => { const items = [...settings.programs.content.items]; items.splice(i, 1); updateContent('programs', { ...settings.programs.content, items }); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul</label>
                        <input className="input-field" value={prog.title} onChange={e => { const items = [...settings.programs.content.items]; items[i] = { ...items[i], title: e.target.value }; updateContent('programs', { ...settings.programs.content, items }); }} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                        <select className="input-field" value={prog.icon} onChange={e => { const items = [...settings.programs.content.items]; items[i] = { ...items[i], icon: e.target.value }; updateContent('programs', { ...settings.programs.content, items }); }}>
                          {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi</label>
                      <textarea className="input-field" rows={2} value={prog.desc} onChange={e => { const items = [...settings.programs.content.items]; items[i] = { ...items[i], desc: e.target.value }; updateContent('programs', { ...settings.programs.content, items }); }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Warna</label>
                      <select className="input-field" value={prog.color} onChange={e => { const items = [...settings.programs.content.items]; const opt = TEXT_COLOR_OPTIONS.find(o => o.value === e.target.value); items[i] = { ...items[i], color: e.target.value, bg: opt?.bg || 'bg-gray-50' }; updateContent('programs', { ...settings.programs.content, items }); }}>
                        {TEXT_COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                <button onClick={() => { const items = [...(settings.programs.content?.items || []), { title: 'Program Baru', desc: 'Deskripsi program baru', icon: 'Star', color: 'text-emerald-600', bg: 'bg-emerald-50' }]; updateContent('programs', { ...settings.programs.content, items }); }} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Program
                </button>
              </div>
              <button onClick={() => saveSection('programs')} disabled={saving.programs} className="btn-primary mt-4 flex items-center gap-2">
                {saving.programs ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Program
              </button>
            </SectionCard>
          )}

          {/* CTA */}
          {settings.cta && (
            <SectionCard title="Call to Action" icon={Megaphone} isActive={settings.cta.is_active} onToggle={() => toggleActive('cta')}>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Judul CTA</label>
                  <input className="input-field" value={settings.cta.content?.title || ''} onChange={e => updateContent('cta', { ...settings.cta.content, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle CTA</label>
                  <textarea className="input-field" rows={3} value={settings.cta.content?.subtitle || ''} onChange={e => updateContent('cta', { ...settings.cta.content, subtitle: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500">Tombol Utama</label>
                    <input className="input-field" placeholder="Teks tombol" value={settings.cta.content?.primary_button?.text || ''} onChange={e => updateContent('cta', { ...settings.cta.content, primary_button: { ...settings.cta.content.primary_button, text: e.target.value } })} />
                    <input className="input-field" placeholder="Link (misal: /pmb)" value={settings.cta.content?.primary_button?.link || ''} onChange={e => updateContent('cta', { ...settings.cta.content, primary_button: { ...settings.cta.content.primary_button, link: e.target.value } })} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500">Tombol Sekunder</label>
                    <input className="input-field" placeholder="Teks tombol" value={settings.cta.content?.secondary_button?.text || ''} onChange={e => updateContent('cta', { ...settings.cta.content, secondary_button: { ...settings.cta.content.secondary_button, text: e.target.value } })} />
                    <input className="input-field" placeholder="Link (misal: /fasilitas)" value={settings.cta.content?.secondary_button?.link || ''} onChange={e => updateContent('cta', { ...settings.cta.content, secondary_button: { ...settings.cta.content.secondary_button, link: e.target.value } })} />
                  </div>
                </div>
              </div>
              <button onClick={() => saveSection('cta')} disabled={saving.cta} className="btn-primary mt-4 flex items-center gap-2">
                {saving.cta ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan CTA
              </button>
            </SectionCard>
          )}

          {/* ANNOUNCEMENT */}
          {settings.announcement && (
            <SectionCard title="Pengumuman Banner" icon={Type} isActive={settings.announcement.is_active} onToggle={() => toggleActive('announcement')}>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Teks Pengumuman</label>
                  <input className="input-field" value={settings.announcement.content?.text || ''} onChange={e => updateContent('announcement', { ...settings.announcement.content, text: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-gray-500">Tampilkan di Hero:</label>
                  <button onClick={() => updateContent('announcement', { ...settings.announcement.content, is_visible: !settings.announcement.content?.is_visible })} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${settings.announcement.content?.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {settings.announcement.content?.is_visible ? 'Ya' : 'Tidak'}
                  </button>
                </div>
              </div>
              <button onClick={() => saveSection('announcement')} disabled={saving.announcement} className="btn-primary mt-4 flex items-center gap-2">
                {saving.announcement ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Pengumuman
              </button>
            </SectionCard>
          )}
        </div>
      )}

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default AdminBeranda;

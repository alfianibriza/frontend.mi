import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  GraduationCap,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { logoUrl, hasLogo, schoolName, schoolSubtitle, motto } = useSiteSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Silakan periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* LEFT SIDE: Brand Showcase & Institutional Identity (Desktop) */}
      {/* ========================================================= */}
      <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#064e3b] via-[#063f31] to-[#022c22] text-white p-10 xl:p-14 flex-col justify-between overflow-hidden shadow-2xl z-10">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Core & Highlights */}
        <div className="relative z-10 py-6">
          {/* Logo Standalone (No Box) */}
          <div className="mb-6">
            {hasLogo && logoUrl ? (
              <img 
                src={logoUrl} 
                alt={schoolName} 
                className="w-24 h-24 object-contain drop-shadow-md" 
              />
            ) : (
              <span className="text-4xl font-black font-outfit text-white tracking-wider">MI</span>
            )}
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight font-outfit mb-2">
            {schoolName}
          </h1>
          <p className="text-sm font-medium text-emerald-100/80 mb-8">
            {schoolSubtitle || 'Madrasah Ibtidaiyah Unggulan'}
          </p>

          {/* School Vision / Tagline Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 mb-8 text-xs sm:text-sm text-emerald-50/90 leading-relaxed relative">
            <span className="text-2xl text-emerald-300 font-serif leading-none absolute top-3 left-3 opacity-40">“</span>
            <p className="italic pl-4">
              {motto || 'Membina insan yang beriman, bertakwa, berakhlak mulia, cerdas, terampil, dan berprestasi.'}
            </p>
          </div>

          {/* System Highlights */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-emerald-100/90">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>Manajemen Akademik, Guru, dan Siswa Terpadu</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-emerald-100/90">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <Layers className="w-4 h-4" />
              </div>
              <span>Penerimaan Murid Baru (PPDB Online) Real-time</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-emerald-100/90">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Pengaturan Konten Website, Berita & Galeri Kegiatan</span>
            </div>
          </div>
        </div>

        {/* Bottom: Institutional Security Stamp */}
        <div className="relative z-10 pt-6 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sistem Terenkripsi & Terverifikasi</span>
          </div>
          <span>v2.5 • Madrasah Digital</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: Modern Clean Authentication Panel */}
      {/* ========================================================= */}
      <div className="flex-1 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-5 sm:p-10 lg:p-14 min-h-screen">
        
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl shadow-xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            Admin Portal
          </span>
        </div>

        {/* Centered Form Wrapper */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-7 sm:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.07)] border border-slate-100"
          >
            {/* Header with Clean Logo on Mobile/Tablet */}
            <div className="text-center sm:text-left mb-7">
              {/* Standalone Logo for Mobile Screen */}
              <div className="flex justify-center sm:justify-start lg:hidden mb-4">
                {hasLogo && logoUrl ? (
                  <img src={logoUrl} alt={schoolName} className="w-16 h-16 object-contain" />
                ) : (
                  <span className="text-2xl font-black font-outfit text-emerald-700">MI</span>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wide mb-2">
                <span>Selamat Datang</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">
                Masuk Administrator
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                Silakan masukkan kredensial resmi untuk mengakses panel pengelolaan {schoolName}.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm px-4 py-3 rounded-2xl mb-6 flex items-start gap-2.5"
              >
                <span className="shrink-0 text-base leading-none">⚠️</span>
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Akun
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/90 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-medium" 
                    placeholder="nama@mialghazali.sch.id" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button 
                    type="button" 
                    onClick={() => alert('Untuk mereset kata sandi administrator, silakan hubungi Administrator IT Madrasah atau superadmin.')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="w-full pl-10 pr-11 py-3 bg-slate-50/90 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-medium" 
                    placeholder="••••••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                  />
                  <span className="text-xs text-gray-600 font-medium">Ingat perangkat ini</span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-600 active:scale-[0.99] shadow-lg shadow-emerald-700/20 hover:shadow-emerald-600/30 transition-all duration-200 disabled:opacity-60 cursor-pointer min-h-[46px] mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </motion.div>

          {/* Help & Support Info */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Kendala login? Hubungi Tim Administrasi Madrasah.</span>
            </p>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="text-center py-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {schoolName}. Hak Cipta Dilindungi.</p>
        </div>

      </div>

    </div>
  );
};

export default Login;


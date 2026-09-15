import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { logoUrl, hasLogo, schoolName } = useSiteSettings();
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

  const handleFillDemo = () => {
    setEmail('admin@mialghazali.sch.id');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient pattern-dots px-4 py-12 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-7 sm:p-9">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary-600/20">
              {hasLogo ? (
                <img src={logoUrl} alt={schoolName} className="w-9 h-9 object-contain" />
              ) : (
                <span className="text-white font-extrabold text-xl font-outfit">MI</span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-outfit tracking-tight">Portal Madrasah</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Masuk untuk mengelola sistem {schoolName}</p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                  placeholder="admin@mialghazali.sch.id" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full pl-10 pr-11 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-primary-600 hover:bg-primary-500 active:scale-[0.99] shadow-lg shadow-primary-600/30 transition-all disabled:opacity-50 min-h-[44px]"
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

          {/* Demo Credentials Box with Autofill button */}
          <div className="mt-6 p-3.5 bg-primary-50/60 rounded-2xl border border-primary-100 flex items-center justify-between gap-2">
            <div className="text-xs">
              <div className="flex items-center gap-1 font-bold text-primary-900">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>Akun Demo Admin</span>
              </div>
              <p className="text-[11px] text-primary-700/80 mt-0.5">admin@mialghazali.sch.id</p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 text-xs font-bold text-primary-700 hover:text-white bg-white hover:bg-primary-600 border border-primary-200 hover:border-primary-600 rounded-lg shadow-sm transition-all shrink-0"
            >
              Isi Otomatis
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

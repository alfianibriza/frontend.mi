import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { mediaApi } from '../../api';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || (import.meta.env.PROD ? 'https://api.mialghazali.sch.id' : 'http://localhost:5000');

const getFullUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
};

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const res = await mediaApi.getAll();
      setMedia(res.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch media:', err);
      setError('Gagal memuat pustaka media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      await mediaApi.upload(formData);
      showNotification('File berhasil diupload');
      fetchMedia();
    } catch (err) {
      console.error('Upload failed:', err);
      showNotification(err.response?.data?.message || 'Gagal mengupload file', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus file ini?')) return;

    try {
      await mediaApi.delete(filename);
      if (selectedFile?.name === filename) {
        setSelectedFile(null);
      }
      showNotification('File berhasil dihapus');
      fetchMedia();
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification('Gagal menghapus file', 'error');
    }
  };

  const copyToClipboard = (url) => {
    // Determine full URL if it's a relative path
    const fullUrl = url.startsWith('/') 
      ? `${API_BASE}${url}`
      : url;
      
    navigator.clipboard.writeText(fullUrl)
      .then(() => showNotification('URL disalin ke clipboard'))
      .catch(() => showNotification('Gagal menyalin URL', 'error'));
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMedia = media.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      {/* Header & Actions */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pustaka Media</h1>
            <p className="text-gray-500 mt-1 text-sm">Kelola semua file dan gambar yang diupload</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Cari file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
              />
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload File
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*,.pdf"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Media Grid */}
          <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${selectedFile ? 'hidden lg:block' : ''}`}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p>Memuat media...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-500">
                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                <p>{error}</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-600">Tidak ada media</p>
                <p className="text-sm">Upload file untuk melihatnya di sini</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <motion.div
                    key={item.name}
                    layoutId={item.name}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedFile(item)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${selectedFile?.name === item.name ? 'border-primary-500' : 'border-transparent bg-gray-100 hover:border-primary-200'}`}
                  >
                    {item.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                      <>
                        <img 
                          src={getFullUrl(item.url)} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex-col items-center justify-center text-gray-400 bg-gray-50" style={{ display: 'none' }}>
                          <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                          <span className="text-xs font-medium px-2 text-center break-all line-clamp-2">{item.name}</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-medium px-2 text-center break-all line-clamp-2">{item.name}</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                      <p className="text-white text-xs truncate font-medium drop-shadow-md">{item.name}</p>
                      <p className="text-white/80 text-[10px] drop-shadow-md">{formatSize(item.size)}</p>
                    </div>

                    {selectedFile?.name === item.name && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Detail Panel */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-80 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                  {/* Close button on mobile */}
                  <div className="lg:hidden p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Detail File</h3>
                    <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-gray-200 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Preview Image */}
                  <div className="aspect-square bg-gray-100 p-4 flex items-center justify-center border-b border-gray-100 relative group">
                    {selectedFile.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                      <>
                        <img 
                          src={getFullUrl(selectedFile.url)} 
                          alt={selectedFile.name} 
                          className="max-w-full max-h-full object-contain drop-shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="flex flex-col items-center justify-center text-gray-400" style={{ display: 'none' }}>
                          <AlertCircle className="w-10 h-10 mb-2 text-red-300" />
                          <span className="text-xs text-red-400">Gagal memuat gambar</span>
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-20 h-20 text-gray-300" />
                    )}
                    
                    <a 
                      href={getFullUrl(selectedFile.url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur text-gray-700 hover:text-primary-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Buka di tab baru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* File Info */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 break-all leading-tight">{selectedFile.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(selectedFile.createdAt)}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Ukuran</span>
                        <span className="text-sm font-medium text-gray-900">{formatSize(selectedFile.size)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Tipe</span>
                        <span className="text-sm font-medium text-gray-900 uppercase">
                          {selectedFile.name.split('.').pop()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 mb-1 block">URL File</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={selectedFile.url} 
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none"
                        />
                        <button 
                          onClick={() => copyToClipboard(selectedFile.url)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex-shrink-0"
                          title="Salin URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 mt-2">
                      <button 
                        onClick={() => handleDelete(selectedFile.name)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus File
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 ${
              notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5 text-green-400" />}
            <span className="font-medium text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMedia;

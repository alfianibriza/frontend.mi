import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  X, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { mediaApi } from '../../api';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const MediaPickerModal = ({ isOpen, onClose, onSelect }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedFile(null);
    }
  }, [isOpen]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await mediaApi.upload(formData);
      await fetchMedia();
      
      // Auto select the newly uploaded file
      const newFile = res.data.data;
      setSelectedFile(newFile);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Gagal mengupload file: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onSelect(selectedFile.url); // Pass back the URL
      onClose();
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = media.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    item.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) // Only show images for picker
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-500" />
                Pilih dari Pustaka Media
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-5 border-b border-gray-100">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Cari gambar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition-all text-sm"
                />
              </div>

              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl font-medium transition-colors border border-primary-200 disabled:opacity-50 whitespace-nowrap"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="text-sm">Upload Baru</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            {/* Content area with split view if item selected */}
            <div className="flex flex-1 overflow-hidden min-h-[400px]">
              
              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="w-8 h-8 border-3 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4" />
                    <p className="text-sm">Memuat media...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full text-red-500">
                    <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                    <p className="text-sm">{error}</p>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-base font-medium text-gray-600">Tidak ada gambar</p>
                    <p className="text-xs mt-1">Upload gambar untuk memilihnya</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filteredMedia.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => setSelectedFile(item)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedFile?.name === item.name 
                            ? 'border-primary-500 shadow-md transform scale-[0.98]' 
                            : 'border-transparent bg-gray-100 hover:border-primary-300'
                        }`}
                      >
                        <img 
                          src={item.url.startsWith('/') ? `${API_BASE}${item.url}` : item.url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        
                        {selectedFile?.name === item.name && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] truncate">{item.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selection Sidebar */}
              {selectedFile && (
                <div className="w-72 border-l border-gray-100 bg-white flex flex-col hidden sm:flex">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800 text-sm">Preview</h3>
                  </div>
                  
                  <div className="p-4 flex-1 overflow-y-auto">
                    <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden mb-4 border border-gray-200">
                      <img 
                        src={selectedFile.url.startsWith('/') ? `${API_BASE}${selectedFile.url}` : selectedFile.url} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Nama File</p>
                        <p className="text-sm font-medium text-gray-900 break-all">{selectedFile.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Ukuran</p>
                        <p className="text-sm font-medium text-gray-900">{formatSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedFile ? '1 gambar dipilih' : 'Tidak ada gambar yang dipilih'}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={!selectedFile}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                >
                  Pilih Gambar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MediaPickerModal;

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, Info, X, AlertCircle, Sparkles, Zap, Clock } from 'lucide-react';
import type { Category, Shop, ServiceDetail } from '../App';

type ServiceDetailPageProps = {
  shop: Shop;
  category: Category;
  onSubmit: (detail: ServiceDetail, file: File | null) => void;
  onBack: () => void;
};

export function ServiceDetailPage({ shop, category, onSubmit, onBack }: ServiceDetailPageProps) {
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail>({
    pages: 1,
    copies: 1,
    bindingType: 'none',
    deliveryPackage: 'normal'
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePages, setFilePages] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const estimatedPages = estimatePageCount(selectedFile);
      setFilePages(estimatedPages);
      setServiceDetail({ 
        ...serviceDetail, 
        pages: estimatedPages 
      });
    }
  };

  const estimatePageCount = (file: File): number => {
    const fileSize = file.size;
    
    if (file.type === 'application/pdf') {
      return Math.max(1, Math.ceil(fileSize / 50000));
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return Math.max(1, Math.ceil(fileSize / 30000));
    } else if (file.type.includes('image')) {
      return 1;
    } else {
      return Math.max(1, Math.ceil(fileSize / 40000));
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePages(0);
    setServiceDetail({ ...serviceDetail, pages: 1 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('Harap upload file terlebih dahulu!');
      return;
    }

    if (!serviceDetail.paperSize && (category.id === 'print' || category.id === 'typing')) {
      alert('Harap pilih ukuran kertas!');
      return;
    }

    if (!serviceDetail.colorType && category.id === 'print') {
      alert('Harap pilih jenis cetakan!');
      return;
    }

    if (!serviceDetail.copies || serviceDetail.copies < 1) {
      alert('Jumlah rangkap minimal 1!');
      return;
    }

    onSubmit(serviceDetail, file);
  };

  const calculatePrice = () => {
    if (!file) return null;
    
    let basePrice = shop.basePrice;
    const pages = serviceDetail.pages || 1;
    const copies = serviceDetail.copies || 1;
    const colorMultiplier = serviceDetail.colorType === 'color' ? 2 : 1;
    
    let subtotal = 0;
    let bannerArea = 0;
    let photoBasePrice = 0;
    
    if (category.id === 'photo') {
      if (serviceDetail.photoSize === '2x3') {
        photoBasePrice = 10000;
      } else if (serviceDetail.photoSize === '3x4') {
        photoBasePrice = 15000;
      } else if (serviceDetail.photoSize === '4x6') {
        photoBasePrice = 20000;
      } else if (serviceDetail.photoSize === 'Custom') {
        const width = serviceDetail.customPhotoWidth || 0;
        const height = serviceDetail.customPhotoHeight || 0;
        const area = width * height;
        photoBasePrice = Math.round(area * 1250);
      }
      subtotal = photoBasePrice * copies;
    } else if (category.id === 'banner') {
      const length = serviceDetail.bannerLength || 0;
      const width = serviceDetail.bannerWidth || 0;
      bannerArea = length * width;
      const pricePerMeter = 100000;
      subtotal = Math.round(bannerArea * pricePerMeter);
    } else {
      subtotal = basePrice * pages * copies * colorMultiplier;
    }
    
    let bindingFee = 0;
    if (serviceDetail.bindingType === 'regular') {
      bindingFee = 5000;
    } else if (serviceDetail.bindingType === 'book') {
      bindingFee = 20000;
    }
    
    let packageMultiplier = 1;
    let packageAdjustment = 0;
    if (serviceDetail.deliveryPackage === 'express') {
      packageMultiplier = 1.5;
      packageAdjustment = subtotal * 0.5;
    } else if (serviceDetail.deliveryPackage === 'economy') {
      packageMultiplier = 0.8;
      packageAdjustment = subtotal * -0.2;
    }
    
    subtotal = subtotal * packageMultiplier;
    
    const adminFee = 1000;
    const total = subtotal + bindingFee + adminFee;
    
    return {
      basePrice,
      pages,
      copies,
      colorMultiplier,
      subtotal: Math.round(subtotal),
      bindingFee,
      packageMultiplier,
      packageAdjustment: Math.round(packageAdjustment),
      adminFee,
      total: Math.round(total),
      bannerArea: bannerArea > 0 ? bannerArea : undefined,
      photoBasePrice: photoBasePrice > 0 ? photoBasePrice : undefined
    };
  };

  const priceInfo = calculatePrice();
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Detail Layanan</h1>
              <p className="text-gray-400">{shop.name} - {category.name}</p>
            </div>
            {priceInfo && (
              <div className="text-right">
                <p className="text-gray-400 mb-1">Total Harga</p>
                <p className="text-3xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Rp {priceInfo.total.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Info Card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">🏪</span>
                </div>
                <div>
                  <h3 className="text-white mb-1">{shop.name}</h3>
                  <div className="text-blue-100">{category.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 mb-1">Harga Dasar</div>
                <div className="text-white">Rp {shop.basePrice.toLocaleString()}/lembar</div>
              </div>
            </div>
          </div>

          {/* STEP 1: Upload File */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-1">Step 1: Upload File</h3>
                <p className="text-gray-400">Upload dokumen yang ingin dicetak</p>
              </div>
            </div>

            <div className="space-y-4">
              {!file ? (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-800/30">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white mb-2">Klik untuk upload file</p>
                    <p className="text-gray-400">Mendukung: PDF, Word, JPG, PNG</p>
                    <p className="text-gray-500 text-sm mt-2">Maksimal 10 MB</p>
                  </label>
                </div>
              ) : (
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white mb-2">✅ File berhasil diupload</div>
                        <div className="text-gray-300 mb-1">{file.name}</div>
                        <div className="text-gray-400">
                          Ukuran: {(file.size / 1024).toFixed(2)} KB
                        </div>
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-green-500/30">
                          <div className="text-green-400">
                            <strong>📄 Jumlah Halaman Terdeteksi: {filePages} halaman</strong>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            Sistem otomatis menghitung halaman dari file Anda
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30"
                      title="Hapus file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {!file && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-blue-400 mb-1">
                        <strong>Catatan Penting:</strong>
                      </p>
                      <p className="text-gray-400 text-sm">
                        Harga akan muncul setelah Anda mengupload file. Sistem akan otomatis menghitung jumlah halaman dari file yang diupload.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: Service Options */}
          {file && (
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Step 2: Pilih Detail Layanan</h3>
                  <p className="text-gray-400">Kustomisasi sesuai kebutuhan Anda</p>
                </div>
              </div>

              {/* Paper Size */}
              {(category.id === 'print' || category.id === 'typing') && (
                <div className="mb-6">
                  <label className="block text-white mb-3">
                    Ukuran Kertas *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['A4', 'F4', 'A3', 'Legal'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setServiceDetail({ ...serviceDetail, paperSize: size })}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          serviceDetail.paperSize === size
                            ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                            : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <div>{size}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Type */}
              {category.id === 'print' && (
                <div className="mb-6">
                  <label className="block text-white mb-3">
                    Jenis Cetakan *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ ...serviceDetail, colorType: 'bw' })}
                      className={`p-5 border-2 rounded-xl transition-all ${
                        serviceDetail.colorType === 'bw'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">⚫ Hitam Putih</div>
                      <div className="text-sm text-gray-400">Harga normal</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ ...serviceDetail, colorType: 'color' })}
                      className={`p-5 border-2 rounded-xl transition-all ${
                        serviceDetail.colorType === 'color'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">🌈 Berwarna</div>
                      <div className="text-sm text-gray-400">Harga x2</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Size */}
              {category.id === 'photo' && (
                <>
                  <div className="mb-6">
                    <label className="block text-white mb-3">
                      Ukuran Pas Foto
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { size: '2x3', price: 'Rp 10.000' },
                        { size: '3x4', price: 'Rp 15.000' },
                        { size: '4x6', price: 'Rp 20.000' },
                        { size: 'Custom', price: 'Hitung' }
                      ].map((item) => (
                        <button
                          key={item.size}
                          type="button"
                          onClick={() => setServiceDetail({ ...serviceDetail, photoSize: item.size })}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            serviceDetail.photoSize === item.size
                              ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                              : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="mb-1">{item.size}</div>
                          <div className="text-sm text-gray-400">{item.price}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      💡 Harga tertera adalah per lembar foto
                    </p>
                  </div>

                  {/* Custom Photo Size Input */}
                  {serviceDetail.photoSize === 'Custom' && (
                    <div className="mb-6 p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                      <label className="block text-white mb-3">
                        📐 Ukuran Custom (dalam cm)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">
                            Lebar (cm)
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="0.1"
                            value={serviceDetail.customPhotoWidth || ''}
                            onChange={(e) => setServiceDetail({ 
                              ...serviceDetail, 
                              customPhotoWidth: parseFloat(e.target.value) || 0
                            })}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder="Contoh: 3"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">
                            Tinggi (cm)
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="0.1"
                            value={serviceDetail.customPhotoHeight || ''}
                            onChange={(e) => setServiceDetail({ 
                              ...serviceDetail, 
                              customPhotoHeight: parseFloat(e.target.value) || 0
                            })}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            placeholder="Contoh: 4"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Photo Background */}
                  <div className="mb-6">
                    <label className="block text-white mb-3">
                      🎨 Pilih Latar Belakang Foto
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { value: 'white', label: 'Putih', color: 'bg-white text-gray-900 border-white' },
                        { value: 'red', label: 'Merah', color: 'bg-red-500 text-white border-red-500' },
                        { value: 'blue', label: 'Biru', color: 'bg-blue-500 text-white border-blue-500' },
                        { value: 'custom', label: 'Custom', color: 'bg-gradient-to-br from-purple-400 to-pink-400 text-white border-purple-400' },
                      ].map((bg) => (
                        <button
                          key={bg.value}
                          type="button"
                          onClick={() => setServiceDetail({ ...serviceDetail, photoBackground: bg.value })}
                          className={`p-4 border-2 rounded-xl transition-all ${bg.color} ${
                            serviceDetail.photoBackground === bg.value
                              ? 'ring-4 ring-blue-500 scale-105'
                              : 'hover:scale-105'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Jumlah Rangkap */}
              {category.id !== 'banner' && (
                <div className="mb-6">
                  <label className="block text-white mb-3">
                    Jumlah Rangkap / Eksemplar *
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ 
                        ...serviceDetail, 
                        copies: Math.max(1, (serviceDetail.copies || 1) - 1) 
                      })}
                      className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all text-white w-16 h-16 flex items-center justify-center text-2xl"
                    >
                      −
                    </button>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="1"
                        value={serviceDetail.copies || 1}
                        onChange={(e) => setServiceDetail({ 
                          ...serviceDetail, 
                          copies: Math.max(1, parseInt(e.target.value) || 1) 
                        })}
                        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl text-white"
                      />
                      <p className="text-gray-400 text-sm text-center mt-2">
                        Berapa banyak eksemplar yang Anda butuhkan?
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ 
                        ...serviceDetail, 
                        copies: (serviceDetail.copies || 1) + 1 
                      })}
                      className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all text-white w-16 h-16 flex items-center justify-center text-2xl shadow-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Banner Size */}
              {category.id === 'banner' && (
                <div className="mb-6 p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <label className="block text-white mb-3">
                    📏 Ukuran Banner/Baliho (Panjang x Lebar) *
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">
                        Panjang (meter)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={serviceDetail.bannerLength || ''}
                        onChange={(e) => setServiceDetail({ 
                          ...serviceDetail, 
                          bannerLength: parseFloat(e.target.value) || 0
                        })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        placeholder="Contoh: 2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">
                        Lebar (meter)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={serviceDetail.bannerWidth || ''}
                        onChange={(e) => setServiceDetail({ 
                          ...serviceDetail, 
                          bannerWidth: parseFloat(e.target.value) || 0
                        })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        placeholder="Contoh: 1.5"
                      />
                    </div>
                  </div>
                  {serviceDetail.bannerLength && serviceDetail.bannerWidth && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="text-blue-400">
                        <strong>📐 Luas Total: {(serviceDetail.bannerLength * serviceDetail.bannerWidth).toFixed(2)} m²</strong>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        Ukuran: {serviceDetail.bannerLength}m x {serviceDetail.bannerWidth}m
                      </div>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm mt-3">
                    💡 Masukkan ukuran banner dalam meter (contoh: 2.5 x 1.5 meter)
                  </p>
                </div>
              )}

              {/* Paper Type */}
              {(category.id === 'print' || category.id === 'typing') && (
                <div className="mb-6">
                  <label className="block text-white mb-3">
                    Jenis Kertas
                  </label>
                  <select
                    value={serviceDetail.paperType || ''}
                    onChange={(e) => setServiceDetail({ ...serviceDetail, paperType: e.target.value })}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="">Pilih jenis kertas (opsional)</option>
                    <option value="hvs70">HVS 70 gram (Standard)</option>
                    <option value="hvs80">HVS 80 gram (Tebal)</option>
                    <option value="buffalo">Buffalo (Premium)</option>
                    <option value="artpaper">Art Paper (Glossy)</option>
                  </select>
                </div>
              )}

              {/* Opsi Jilid */}
              {(category.id === 'print' || category.id === 'typing') && (
                <div className="mb-6">
                  <label className="block text-white mb-3">
                    📚 Opsi Jilid (Opsional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ ...serviceDetail, bindingType: 'none' })}
                      className={`p-5 border-2 rounded-xl transition-all ${
                        (serviceDetail.bindingType === 'none' || !serviceDetail.bindingType)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">📄 Tidak Dijilid</div>
                      <div className="text-sm text-gray-400">Gratis</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ ...serviceDetail, bindingType: 'regular' })}
                      className={`p-5 border-2 rounded-xl transition-all ${
                        serviceDetail.bindingType === 'regular'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">📒 Jilid Biasa</div>
                      <div className="text-sm text-gray-400">+Rp 5.000</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setServiceDetail({ ...serviceDetail, bindingType: 'book' })}
                      className={`p-5 border-2 rounded-xl transition-all ${
                        serviceDetail.bindingType === 'book'
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">📕 Jilid Buku</div>
                      <div className="text-sm text-gray-400">+Rp 20.000</div>
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    💡 Pilih jilid jika Anda ingin dokumen Anda dijilid
                  </p>
                </div>
              )}

              {/* Paket Layanan */}
              <div className="mb-6">
                <label className="block text-white mb-3">
                  🚀 Pilih Paket Layanan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceDetail({ ...serviceDetail, deliveryPackage: 'economy' })}
                    className={`p-5 border-2 rounded-xl transition-all text-left ${
                      serviceDetail.deliveryPackage === 'economy'
                        ? 'border-green-500 bg-green-500/20 text-green-400 shadow-lg'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5" />
                      <div className="text-lg">Hemat</div>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">3-4 hari kerja</div>
                    <div className="text-sm text-green-400">Diskon 20%</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setServiceDetail({ ...serviceDetail, deliveryPackage: 'normal' })}
                    className={`p-5 border-2 rounded-xl transition-all text-left ${
                      serviceDetail.deliveryPackage === 'normal'
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5" />
                      <div className="text-lg">Normal</div>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">1-2 hari kerja</div>
                    <div className="text-sm text-blue-400">Harga standar</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setServiceDetail({ ...serviceDetail, deliveryPackage: 'express' })}
                    className={`p-5 border-2 rounded-xl transition-all text-left ${
                      serviceDetail.deliveryPackage === 'express'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5" />
                      <div className="text-lg">Kilat</div>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">Selesai hari ini</div>
                    <div className="text-sm text-purple-400">+50% biaya</div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-white mb-3">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={serviceDetail.notes || ''}
                  onChange={(e) => setServiceDetail({ ...serviceDetail, notes: e.target.value })}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white min-h-[100px]"
                  placeholder="Tambahkan catatan atau permintaan khusus..."
                />
              </div>
            </div>
          )}

          {/* Price Summary */}
          {priceInfo && (
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
              <h3 className="text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Rincian Harga
              </h3>
              
              <div className="space-y-3 mb-6">
                {category.id === 'photo' && priceInfo.photoBasePrice && (
                  <div className="flex justify-between text-gray-300">
                    <span>Harga Foto ({serviceDetail.photoSize || ''})</span>
                    <span>Rp {priceInfo.photoBasePrice.toLocaleString()}</span>
                  </div>
                )}
                
                {category.id === 'banner' && priceInfo.bannerArea && (
                  <div className="flex justify-between text-gray-300">
                    <span>Luas Banner ({priceInfo.bannerArea.toFixed(2)} m²)</span>
                    <span>Rp 100.000/m²</span>
                  </div>
                )}
                
                {category.id !== 'photo' && category.id !== 'banner' && (
                  <>
                    <div className="flex justify-between text-gray-300">
                      <span>Halaman</span>
                      <span>{priceInfo.pages} halaman</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Rangkap</span>
                      <span>{priceInfo.copies}x</span>
                    </div>
                  </>
                )}
                
                {category.id !== 'banner' && (
                  <div className="flex justify-between text-gray-300">
                    <span>Rangkap/Eksemplar</span>
                    <span>{priceInfo.copies}x</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rp {priceInfo.subtotal.toLocaleString()}</span>
                </div>
                
                {priceInfo.bindingFee > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Biaya Jilid</span>
                    <span>Rp {priceInfo.bindingFee.toLocaleString()}</span>
                  </div>
                )}
                
                {priceInfo.packageAdjustment !== 0 && (
                  <div className={`flex justify-between ${priceInfo.packageAdjustment > 0 ? 'text-purple-400' : 'text-green-400'}`}>
                    <span>
                      {serviceDetail.deliveryPackage === 'express' ? 'Biaya Kilat (+50%)' : 'Diskon Hemat (-20%)'}
                    </span>
                    <span>
                      {priceInfo.packageAdjustment > 0 ? '+' : ''}Rp {priceInfo.packageAdjustment.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-300">
                  <span>Biaya Admin</span>
                  <span>Rp {priceInfo.adminFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-white">Total Pembayaran</span>
                  <span className="text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Rp {priceInfo.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file}
            className="w-full p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl text-lg"
          >
            {file ? 'Lanjut ke Jadwal Pengambilan' : 'Upload File Terlebih Dahulu'}
          </button>
        </form>
      </div>
    </div>
  );
}

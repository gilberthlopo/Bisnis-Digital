import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Check, Info } from 'lucide-react';
import type { Shop, ServiceDetail } from '../App';

type PaymentPageProps = {
  shop: Shop;
  serviceDetail: ServiceDetail;
  scheduleData: { date: string; time: string };
  fileName?: string;
  onSubmit: (paymentMethod: string, totalPrice: number) => void;
  onBack: () => void;
};

export function PaymentPage({ 
  shop, 
  serviceDetail, 
  scheduleData, 
  fileName,
  onSubmit, 
  onBack 
}: PaymentPageProps) {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const calculatePrice = () => {
    let basePrice = shop.basePrice;
    const pages = serviceDetail.pages || 1;
    const copies = serviceDetail.copies || 1;
    const colorMultiplier = serviceDetail.colorType === 'color' ? 2 : 1;
    
    let subtotal = basePrice * pages * copies * colorMultiplier;
    
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
    };
  };

  const priceBreakdown = calculatePrice();
  const totalPrice = priceBreakdown.total;

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      icon: Smartphone,
      description: 'Scan & bayar dengan berbagai e-wallet',
    },
    {
      id: 'bank',
      name: 'Transfer Bank',
      icon: CreditCard,
      description: 'BCA, Mandiri, BNI, BRI',
    },
    {
      id: 'cod',
      name: 'Bayar di Tempat',
      icon: Wallet,
      description: 'Bayar cash saat pengambilan',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      alert('Harap pilih metode pembayaran!');
      return;
    }

    if (!agreedToTerms) {
      alert('Harap setujui syarat dan ketentuan!');
      return;
    }

    onSubmit(selectedPayment, totalPrice);
  };

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
              <h1 className="text-3xl mb-2">Pembayaran & Konfirmasi</h1>
              <p className="text-gray-400">Periksa detail pesanan Anda</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">Total</p>
              <p className="text-3xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Rp {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white">Ringkasan Pesanan</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-800">
                <span className="text-gray-400">🏪 Toko</span>
                <span className="text-white">{shop.name}</span>
              </div>
              
              {fileName && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">📄 File</span>
                  <span className="text-white truncate max-w-xs">{fileName}</span>
                </div>
              )}

              {serviceDetail.paperSize && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">📏 Ukuran Kertas</span>
                  <span className="text-white">{serviceDetail.paperSize}</span>
                </div>
              )}

              {serviceDetail.colorType && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">🎨 Jenis Cetakan</span>
                  <span className="text-white">
                    {serviceDetail.colorType === 'bw' ? 'Hitam Putih' : 'Berwarna'}
                  </span>
                </div>
              )}

              {serviceDetail.photoSize && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">📸 Ukuran Foto</span>
                  <span className="text-white">{serviceDetail.photoSize}</span>
                </div>
              )}

              {serviceDetail.pages && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">📋 Jumlah Halaman</span>
                  <span className="text-white">{serviceDetail.pages}</span>
                </div>
              )}

              {serviceDetail.copies && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">📋 Rangkap</span>
                  <span className="text-white">{serviceDetail.copies}</span>
                </div>
              )}

              {serviceDetail.bindingType && serviceDetail.bindingType !== 'none' && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">📚 Jilid</span>
                  <span className="text-white">
                    {serviceDetail.bindingType === 'regular' && '📒 Jilid Biasa (+Rp 5.000)'}
                    {serviceDetail.bindingType === 'book' && '📕 Jilid Buku (+Rp 20.000)'}
                  </span>
                </div>
              )}

              {serviceDetail.deliveryPackage && (
                <div className="flex justify-between pb-4 border-b border-gray-800">
                  <span className="text-gray-400">🚀 Paket Layanan</span>
                  <span className="text-white">
                    {serviceDetail.deliveryPackage === 'express' && '⚡ Express (+50%)'}
                    {serviceDetail.deliveryPackage === 'normal' && '🚶 Normal (Standar)'}
                    {serviceDetail.deliveryPackage === 'economy' && '🐢 Hemat (-20%)'}
                  </span>
                </div>
              )}

              <div className="flex justify-between pb-4 border-b border-gray-800">
                <span className="text-gray-400">📅 Tanggal Pengambilan</span>
                <span className="text-white">
                  {new Date(scheduleData.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex justify-between pb-4 border-b border-gray-800">
                <span className="text-gray-400">⏰ Waktu Pengambilan</span>
                <span className="text-white">{scheduleData.time} WIB</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-white mb-6 flex items-center gap-2">
              💰 Detail Pembayaran
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-blue-100">
                <span>Subtotal Cetak</span>
                <span>Rp {priceBreakdown.subtotal.toLocaleString()}</span>
              </div>

              {priceBreakdown.bindingFee > 0 && (
                <div className="flex justify-between text-blue-100">
                  <span>Biaya Jilid</span>
                  <span>Rp {priceBreakdown.bindingFee.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-blue-100">
                <span>Biaya Admin</span>
                <span>Rp {priceBreakdown.adminFee.toLocaleString()}</span>
              </div>

              <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                <span className="text-white text-lg">Total Pembayaran</span>
                <div className="text-right">
                  <div className="text-2xl text-white">
                    Rp {totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white">Pilih Metode Pembayaran</h3>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedPayment === method.id;
                
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-6 border-2 rounded-2xl transition-all text-left hover:shadow-lg ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20 shadow-xl'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg scale-110'
                          : 'bg-gray-700'
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`mb-1 ${
                          isSelected ? 'text-blue-400' : 'text-white'
                        }`}>
                          {method.name}
                        </div>
                        <div className="text-gray-400">
                          {method.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Instructions */}
          {selectedPayment && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-blue-400 mb-3">📋 Instruksi Pembayaran</h4>
                  <div className="text-gray-400">
                    {selectedPayment === 'qris' && (
                      <div className="space-y-2">
                        <p className="mb-3">Kode QRIS akan ditampilkan setelah konfirmasi. Scan dan bayar melalui aplikasi e-wallet Anda.</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">GoPay</span>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">OVO</span>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">DANA</span>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">ShopeePay</span>
                        </div>
                      </div>
                    )}
                    {selectedPayment === 'bank' && (
                      <div className="space-y-2">
                        <p className="mb-3">Detail rekening tujuan akan dikirim via email. Silakan transfer dan upload bukti pembayaran.</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">BCA</span>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">Mandiri</span>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">BNI</span>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700">BRI</span>
                        </div>
                      </div>
                    )}
                    {selectedPayment === 'cod' && (
                      <div>
                        <p>Anda dapat membayar langsung di toko saat mengambil pesanan. Pastikan membawa uang pas untuk mempercepat transaksi.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-6 h-6 text-blue-600 border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-gray-400 cursor-pointer">
                <span className="text-white">Saya telah memeriksa dan menyetujui detail pesanan di atas.</span> Saya memahami bahwa pesanan tidak dapat dibatalkan setelah dikonfirmasi dan pembayaran dilakukan. Dengan melanjutkan, saya menyetujui syarat dan ketentuan yang berlaku.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl hover:shadow-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
            disabled={!selectedPayment || !agreedToTerms}
          >
            <div className="flex items-center justify-center gap-3">
              <Check className="w-6 h-6" />
              <span>Konfirmasi & Buat Pesanan</span>
              <span className="px-3 py-1 bg-white/20 rounded-lg">
                Rp {totalPrice.toLocaleString()}
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

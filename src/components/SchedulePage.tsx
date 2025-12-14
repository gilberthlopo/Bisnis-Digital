import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, AlertCircle, Star, CheckCircle, Sparkles } from 'lucide-react';
import type { Shop } from '../App';

type SchedulePageProps = {
  shop: Shop;
  deliveryPackage?: 'express' | 'normal' | 'economy';
  onSubmit: (date: string, time: string) => void;
  onBack: () => void;
};

export function SchedulePage({ shop, deliveryPackage = 'normal', onSubmit, onBack }: SchedulePageProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  const getProcessingInfo = () => {
    switch (deliveryPackage) {
      case 'express':
        return { hours: 1, label: '< 1 jam', minHours: 0 };
      case 'normal':
        return { hours: 2, label: '1-2 jam', minHours: 1 };
      case 'economy':
        return { hours: 4, label: '3-4 jam', minHours: 3 };
      default:
        return { hours: 2, label: '1-2 jam', minHours: 1 };
    }
  };

  const processingInfo = getProcessingInfo();

  const getMinDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const getEarliestPickupTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + processingInfo.hours);
    return now;
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const validateSchedule = () => {
    if (!selectedDate || !selectedTime) {
      setError('Harap pilih tanggal dan waktu pengambilan');
      return false;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const minDateTime = getEarliestPickupTime();

    if (selectedDateTime < minDateTime) {
      setError(`Jadwal pengambilan minimal ${processingInfo.label} dari sekarang`);
      return false;
    }

    const [openPart = '00:00', closePart = '23:59'] = shop.openHours.split(' - ');
    const [openHour = 0] = openPart.split(':').map(Number);
    const [closeHour = 24] = closePart.split(':').map(Number);
    const [selectedHour = NaN] = selectedTime.split(':').map(Number);

    if (isNaN(selectedHour) || selectedHour < openHour || selectedHour >= closeHour) {
      setError(`Waktu di luar jam operasional toko (${shop.openHours})`);
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateSchedule()) {
      onSubmit(selectedDate, selectedTime);
    }
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
          <div>
            <h1 className="text-3xl mb-2">Pilih Jadwal Pengambilan</h1>
            <p className="text-gray-400">Tentukan kapan Anda akan mengambil pesanan</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Info */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl">🏪</span>
                </div>
                <div>
                  <h3 className="text-white mb-1">{shop.name}</h3>
                  <div className="flex items-center gap-2 text-blue-100">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span>Toko Terpercaya</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-blue-100">Jam Operasional</span>
                  </div>
                  <div className="text-white">{shop.openHours}</div>
                </div>
                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-blue-100">Estimasi Pengerjaan</span>
                  </div>
                  <div className="text-white">{shop.estimatedTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-blue-400 mb-4">⚠️ Perhatian Penting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 border border-blue-500/30">1</div>
                    <p className="text-gray-400">Jadwal pengambilan minimal {processingInfo.label} dari sekarang</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 border border-blue-500/30">2</div>
                    <p className="text-gray-400">Pastikan waktu sesuai jam operasional toko</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 border border-blue-500/30">3</div>
                    <p className="text-gray-400">Toko memerlukan waktu untuk memproses pesanan</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400 border border-blue-500/30">4</div>
                    <p className="text-gray-400">Jika terlambat mengambil, harap hubungi toko</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-1">Pilih Tanggal Pengambilan</h3>
                <p className="text-gray-400">
                  Paket {deliveryPackage === 'express' ? '⚡ Express' : deliveryPackage === 'economy' ? '🐢 Hemat' : '🚶 Normal'} - Siap dalam {processingInfo.label}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full pl-14 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
                required
              />
            </div>

            <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <p className="text-green-400">
                📅 Tanggal tersedia: {new Date(getMinDate()!).toLocaleDateString('id-ID', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })} - {new Date(getMaxDate()!).toLocaleDateString('id-ID', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-1">Pilih Waktu Pengambilan</h3>
                <p className="text-gray-400">Pilih jam yang sesuai dengan jadwal Anda</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                const isPeakHour = ['12:00', '13:00', '17:00', '18:00'].includes(time);
                
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`relative p-4 border-2 rounded-xl transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {isPeakHour && !isSelected && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full border-2 border-gray-900" />
                    )}
                    <Clock className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                    <div className={isSelected ? 'text-white' : 'text-white'}>
                      {time}
                    </div>
                    {isPeakHour && !isSelected && (
                      <div className="text-xs text-orange-400 mt-1">Ramai</div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2" />
                <div className="text-gray-400">
                  <span className="text-orange-400">Jam sibuk</span> - Toko mungkin lebih ramai pada jam ini
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-green-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white">✓ Jadwal Pengambilan Dikonfirmasi</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-green-100">
                      <Calendar className="w-5 h-5" />
                      <span>Tanggal</span>
                    </div>
                    <div className="text-white">
                      {new Date(selectedDate).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-green-100">
                      <Clock className="w-5 h-5" />
                      <span>Waktu</span>
                    </div>
                    <div className="text-white">Pukul {selectedTime} WIB</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex items-center justify-center gap-3">
              <span>Lanjut ke Pembayaran</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

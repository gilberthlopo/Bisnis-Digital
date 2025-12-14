import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit, Save, Award, Package, Star } from 'lucide-react';
import type { User as UserType, Order } from '../App';

type ProfilePageProps = {
  user: UserType;
  orders: Order[];
  onUpdateProfile: (name: string, email: string, phone: string, address: string) => void;
  onBack: () => void;
};

export function ProfilePage({ user, orders, onUpdateProfile, onBack }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, email, phone, address);
    setIsEditing(false);
  };

  // Calculate statistics
  const userOrders = orders.filter(order => order.userId === user.id);
  const totalOrders = userOrders.length;
  const completedOrders = userOrders.filter(order => order.status === 'completed').length;
  const totalSpent = userOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  const rewardPoints = completedOrders * 10;

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
            <h1 className="text-3xl mb-2">Profil Saya</h1>
            <p className="text-gray-400">Kelola informasi profil Anda</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
              
              <div className="relative text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl text-white mb-2">{user.name}</h2>
                <p className="text-blue-100 capitalize mb-4">{user.role}</p>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Bergabung {new Date(user.createdAt || Date.now()).toLocaleDateString('id-ID', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-white mb-4">Statistik</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-gray-400">Total Pesanan</span>
                  </div>
                  <span className="text-white text-xl">{totalOrders}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Star className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-gray-400">Selesai</span>
                  </div>
                  <span className="text-white text-xl">{completedOrders}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-400">Poin Reward</span>
                  </div>
                  <span className="text-white text-xl">{rewardPoints}</span>
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-green-100">Total Pengeluaran</span>
              </div>
              <div className="text-3xl text-white">
                Rp {totalSpent.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl">Informasi Pribadi</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profil
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all"
                  >
                    Batal
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-white mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <span>Nama Lengkap</span>
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      required
                    />
                  ) : (
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-white">
                      {name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span>Email</span>
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      required
                    />
                  ) : (
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-white">
                      {email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span>No. Telepon</span>
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="08xxxxxxxxxx"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-white">
                      {phone || '-'}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-white mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span>Alamat</span>
                    </div>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white min-h-[100px] resize-none"
                      placeholder="Masukkan alamat lengkap Anda"
                    />
                  ) : (
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-white min-h-[100px]">
                      {address || '-'}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <button
                    type="submit"
                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

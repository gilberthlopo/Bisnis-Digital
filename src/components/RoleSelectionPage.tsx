import { Store, Shield, Users, ArrowLeft, Printer } from 'lucide-react';

export type Role = 'customer' | 'shop' | 'admin';

type RoleSelectionPageProps = {
  onSelectRole: (role: Role) => void;
  onBack?: () => void;
};

export function RoleSelectionPage({ onSelectRole, onBack }: RoleSelectionPageProps) {
  const roles = [
    {
      id: 'customer' as Role,
      name: 'Pelanggan',
      icon: Users,
      description: 'Pesan layanan percetakan dan fotocopy dari berbagai toko',
      color: 'from-blue-500 via-blue-600 to-cyan-500',
      features: [
        'Pesan layanan dari berbagai toko',
        'Lacak status pesanan real-time',
        'Dapatkan poin reward',
        'Lihat promo menarik'
      ]
    },
    {
      id: 'shop' as Role,
      name: 'Toko',
      icon: Store,
      description: 'Kelola toko dan layanan yang Anda tawarkan',
      color: 'from-emerald-500 via-green-600 to-teal-500',
      features: [
        'Kelola kategori layanan',
        'Terima dan proses pesanan',
        'Atur harga dan stok',
        'Lihat statistik toko'
      ]
    },
    {
      id: 'admin' as Role,
      name: 'Admin',
      icon: Shield,
      description: 'Kelola seluruh sistem dan pengguna',
      color: 'from-purple-500 via-purple-600 to-pink-500',
      features: [
        'Kelola semua toko',
        'Kelola semua pengguna',
        'Monitor seluruh pesanan',
        'Kelola promo sistem'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          {/* Back Button */}
          {onBack && (
            <div className="mb-8">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl hover:bg-gray-800/50 hover:border-gray-700 transition-all text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Halaman Utama</span>
              </button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Printer className="w-9 h-9 text-white" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                BeresinAja
              </span>
            </div>
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Selamat Datang
            </h1>
            <p className="text-gray-400 text-xl">
              Pilih role untuk melanjutkan ke sistem
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              
              return (
                <button
                  key={role.id}
                  onClick={() => onSelectRole(role.id)}
                  className="group relative bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden hover:scale-105 text-left shadow-xl hover:shadow-2xl"
                >
                  {/* Hover Gradient Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Glow Effect on Hover */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`inline-block p-4 bg-gradient-to-br ${role.color} rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl mb-3 text-white">{role.name}</h2>
                    
                    {/* Description */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow Indicator */}
                    <div className="mt-8 pt-6 border-t border-gray-800 group-hover:border-gray-700 transition-colors">
                      <div className="flex items-center justify-between text-gray-400 group-hover:text-blue-400 transition-colors">
                        <span>Masuk sebagai {role.name}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Notice */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-6 max-w-2xl">
              <p className="text-gray-400">
                💡 <span className="text-white">Tip:</span> Pilih role sesuai dengan kebutuhan Anda. Anda dapat logout dan masuk dengan role berbeda kapan saja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

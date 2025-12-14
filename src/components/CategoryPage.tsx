import {
  Printer,
  FileText,
  Camera,
  Image,
  BookOpen,
  ScanLine,
  ShoppingBag,
  User,
  LogOut,
  TrendingUp,
  Clock,
  Star,
  Tag,
  Gift,
  Zap,
  Award,
  Calendar,
  ArrowRight,
  Package,
} from "lucide-react";
import type { User as UserType, Category, Order } from "../App";

type CategoryPageProps = {
  user: UserType;
  orders: Order[];
  onCategorySelect: (category: Category) => void;
  onViewOrders: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
};

const categories: Category[] = [
  { id: "print", name: "Print & Fotocopy", icon: "printer" },
  { id: "typing", name: "Jasa Ketik", icon: "file-text" },
  { id: "photo", name: "Cetak Pas Foto", icon: "camera" },
  {
    id: "banner",
    name: "Cetak Baliho / Banner",
    icon: "image",
  },
  {
    id: "binding",
    name: "Penjilidan / Hard Cover",
    icon: "book-open",
  },
  { id: "scan", name: "Scan Dokumen", icon: "scan-line" },
];

const iconMap = {
  printer: Printer,
  "file-text": FileText,
  camera: Camera,
  image: Image,
  "book-open": BookOpen,
  "scan-line": ScanLine,
};

export function CategoryPage({
  user,
  orders,
  onCategorySelect,
  onViewOrders,
  onLogout,
  onViewProfile,
}: CategoryPageProps) {
  // Calculate statistics
  const totalOrders = orders.filter(
    (order) => order.userId === user.id,
  ).length;
  const processingOrders = orders.filter(
    (order) =>
      order.userId === user.id &&
      ["pending", "processing"].includes(order.status),
  ).length;
  const completedOrders = orders.filter(
    (order) =>
      order.userId === user.id && order.status === "completed",
  ).length;
  const rewardPoints = completedOrders * 10; // 10 points per completed order

  // Get recent activities
  const recentActivities = orders
    .filter((order) => order.userId === user.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Printer className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  BeresinAja
                </h1>
                <p className="text-gray-400 text-sm">
                  Halo, {user.name}! 👋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onViewOrders}
                className="relative p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:bg-gray-800/50 hover:border-gray-700 transition-all"
                title="Pesanan Saya"
              >
                <ShoppingBag className="w-5 h-5" />
                {processingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                    {processingOrders}
                  </span>
                )}
              </button>
              <button
                onClick={onViewProfile}
                className="p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:bg-gray-800/50 hover:border-gray-700 transition-all"
                title="Profil"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:bg-red-900/30 hover:border-red-800 transition-all"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={onViewOrders}
            className="group relative bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all hover:scale-105 text-left shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Pesanan</p>
              <p className="text-3xl text-white mb-2">{totalOrders}</p>
              <p className="text-gray-500 text-sm">Pesanan keseluruhan</p>
            </div>
          </button>

          <button
            onClick={onViewOrders}
            className="group relative bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all hover:scale-105 text-left shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                {processingOrders > 0 && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-1">Dalam Proses</p>
              <p className="text-3xl text-white mb-2">{processingOrders}</p>
              <p className="text-gray-500 text-sm">Sedang dikerjakan</p>
            </div>
          </button>

          <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <Gift className="w-6 h-6 text-white/60" />
              </div>
              <p className="text-blue-100 text-sm mb-1">Poin Reward</p>
              <p className="text-3xl text-white mb-2">{rewardPoints}</p>
              <p className="text-blue-100 text-sm">
                {completedOrders} pesanan selesai ✨
              </p>
            </div>
          </div>
        </div>

        {/* Category Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl text-white mb-2">Layanan Kami</h2>
            <p className="text-gray-400">Pilih layanan yang Anda butuhkan</p>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Semua layanan tersedia</span>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent =
              iconMap[category.icon as keyof typeof iconMap];
            const gradients = [
              "from-blue-500 to-blue-600",
              "from-purple-500 to-purple-600",
              "from-pink-500 to-pink-600",
              "from-cyan-500 to-cyan-600",
              "from-indigo-500 to-indigo-600",
              "from-violet-500 to-violet-600",
            ];

            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="group relative bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105 text-left shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className="relative flex items-center gap-4">
                  <div
                    className={`p-5 bg-gradient-to-br ${gradients[index]} rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Mulai dari Rp 1.000
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Promo Banner */}
        <div className="mb-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-100 text-sm">
                  Promo Spesial Mahasiswa
                </span>
              </div>
              <h3 className="text-3xl text-white mb-3">
                Diskon Hingga 20% untuk Pesanan Pertama!
              </h3>
              <p className="text-blue-100 mb-6 max-w-md">
                Dapatkan potongan harga spesial untuk pemesanan pertama kamu. 
                Berlaku untuk semua layanan. Buruan pesan sekarang!
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => {
                    const firstCategory = categories[0];
                    if (firstCategory) onCategorySelect(firstCategory);
                  }}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
                >
                  Klaim Promo Sekarang
                </button>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <Calendar className="w-4 h-4" />
                  Berlaku sampai akhir bulan
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🎉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl text-white mb-1">
                Produk Promo ⚡
              </h3>
              <p className="text-gray-400">
                Dapatkan harga spesial untuk layanan pilihan
              </p>
            </div>
            <button
              onClick={() => { const c = categories[0]; if (c) onCategorySelect(c); }}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Print Skripsi",
                price: "Rp 180/lembar",
                originalPrice: "Rp 225",
                discount: "20%",
                icon: "📄",
                categoryId: "print",
              },
              {
                name: "Cetak Pas Foto",
                price: "Rp 8.000",
                originalPrice: "Rp 10.000",
                discount: "15%",
                icon: "📸",
                categoryId: "photo",
              },
              {
                name: "Jilid Hard Cover",
                price: "Rp 25.000",
                originalPrice: "Rp 30.000",
                discount: "10%",
                icon: "📚",
                categoryId: "binding",
              },
              {
                name: "Print Banner A3",
                price: "Rp 35.000",
                originalPrice: "Rp 50.000",
                discount: "25%",
                icon: "🖼️",
                categoryId: "banner",
              },
            ].map((product, index) => {
              const category = categories.find(
                (c) => c.id === product.categoryId,
              );
              const gradients = [
                "from-blue-500 to-blue-600",
                "from-purple-500 to-purple-600",
                "from-pink-500 to-pink-600",
                "from-cyan-500 to-cyan-600",
              ];

              return (
                <button
                  key={index}
                  onClick={() =>
                    category && onCategorySelect(category)
                  }
                  className="group relative bg-gray-900/50 backdrop-blur-md rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105 text-left shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-3xl">
                        {product.icon}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs border border-pink-500/30">
                      -{product.discount}
                    </span>
                  </div>
                  <h4 className="text-white text-lg mb-3">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-blue-400 font-semibold">
                      {product.price}
                    </p>
                    <span className="text-gray-500 line-through text-sm">
                      {product.originalPrice}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800 text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Pesan Sekarang →
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl text-white mb-1">
                Aktivitas Terakhir
              </h3>
              <p className="text-gray-400">
                Riwayat pesanan terbaru Anda
              </p>
            </div>
            {recentActivities.length > 0 && (
              <button
                onClick={onViewOrders}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2 group"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {recentActivities.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-12 border-2 border-dashed border-gray-800 shadow-xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-white text-lg mb-2">
                  Belum ada aktivitas
                </p>
                <p className="text-gray-400 mb-6">
                  Mulai pesan layanan untuk melihat riwayat aktivitas
                </p>
                <button
                  onClick={() =>
                    { const c = categories[0]; if (c) onCategorySelect(c); }
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105"
                >
                  Mulai Memesan
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const statusColors = {
                  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                  ready: "bg-green-500/20 text-green-400 border-green-500/30",
                  completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
                  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
                };

                const statusLabels = {
                  pending: "Menunggu Pembayaran",
                  processing: "Sedang Diproses",
                  ready: "Siap Diambil",
                  completed: "Selesai",
                  rejected: "Ditolak",
                };

                return (
                  <button
                    key={activity.id}
                    onClick={onViewOrders}
                    className="w-full group bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-[1.02] text-left shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white text-lg">
                            {activity.category}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${statusColors[activity.status]}`}
                          >
                            {statusLabels[activity.status]}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Order ID: {activity.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 text-lg mb-1">
                          Rp {activity.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(activity.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <div className="text-gray-400 text-sm">
                        📍 Pengambilan:{" "}
                        {new Date(activity.pickupDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        • {activity.pickupTime}
                      </div>
                      <div className="text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Lihat Detail
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  Store,
} from "lucide-react";
import type { User as UserType, Category, Order, Shop } from "../App";

type CategoryPageProps = {
  user: UserType;
  orders: Order[];
  shops: Shop[];
  categories: Category[];
  onCategorySelect: (category: Category) => void;
  onViewOrders: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
};

const iconMap: Record<string, any> = {
  printer: Printer,
  "file-text": FileText,
  camera: Camera,
  image: Image,
  book: BookOpen,
  "file-search": ScanLine,
};

export function CategoryPage({
  user,
  orders,
  shops,
  categories,
  onCategorySelect,
  onViewOrders,
  onLogout,
  onViewProfile,
}: CategoryPageProps) {
  // Calculate statistics
  const totalOrders = orders.filter(
    (order) => order.userId === user.id,
  ).length;
  // ... (stats logic same) ...
  const processingOrders = orders.filter(
    (order) =>
      order.userId === user.id &&
      ["pending", "processing"].includes(order.status),
  ).length;
  const completedOrders = orders.filter(
    (order) =>
      order.userId === user.id && order.status === "completed",
  ).length;
  const rewardPoints = completedOrders * 10;

  // Get recent activities
  const recentActivities = orders
    .filter((order) => order.userId === user.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  // Get Top Rated Shops
  const topShops = [...shops]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ... (Header same) ... */}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* ... (Stats Cards same) ... */}

        {/* Category Grid */}
        <div className="flex items-center justify-between mb-6">
          {/* ... (Title same) ... */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            // Fallback icon if not mapped
            const IconComponent = iconMap[category.icon] || Printer;
            // ... (rest of category mapping) ...

            // Re-using logic but inside the map
            const gradients = [
              "from-blue-500 to-blue-600",
              "from-purple-500 to-purple-600",
              "from-pink-500 to-pink-600",
              "from-cyan-500 to-cyan-600",
              "from-indigo-500 to-indigo-600",
              "from-violet-500 to-violet-600",
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="group relative bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105 text-left shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className="relative flex items-center gap-4">
                  <div
                    className={`p-5 bg-gradient-to-br ${gradient} rounded-2xl group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Lihat Daftar Toko
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Promo Banner (Static usage is fine as marketing) */}

        {/* Recommendation Section (Replaces Promo Products) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl text-white mb-1">
                Rekomendasi Toko 🏆
              </h3>
              <p className="text-gray-400">
                Toko dengan rating tertinggi pilihan pelanggan
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topShops.length > 0 ? topShops.map((shop, index) => (
              <div
                key={shop.id}
                className="group relative bg-gray-900/50 backdrop-blur-md rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105 text-left shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-yellow-500 text-sm font-bold">{shop.rating.toFixed(1)}</span>
                  </div>
                </div>
                <h4 className="text-white text-lg mb-1">{shop.name}</h4>
                <p className="text-gray-400 text-sm mb-3">
                  {shop.reviews} Ulasan
                </p>
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                  <span>🕒 {shop.openHours}</span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 col-span-4 text-center">Belum ada data toko.</p>
            )}
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
                  onClick={() => { const c = categories[0]; if (c) onCategorySelect(c); }
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

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Store,
} from "lucide-react";
import type { Category, Shop } from "../App";

type ShopListPageProps = {
  category: Category;
  shops: Shop[];
  onShopSelect: (shop: Shop) => void;
  onBack: () => void;
};

export function ShopListPage({
  category,
  shops,
  onShopSelect,
  onBack,
}: ShopListPageProps) {
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'nearest'>('popular');

  // Filter shops by category
  let filteredShops = shops.filter((shop) =>
    shop.categories.includes(category.id),
  );

  // Sort shops based on selected filter
  filteredShops = [...filteredShops].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.reviews - a.reviews;
      case 'rating':
        return b.rating - a.rating;
      case 'nearest':
        // Mock nearest - in real app would use geolocation
        return 0;
      default:
        return 0;
    }
  });

  const shopImages = {
    "shop-1": "🏪",
    "shop-2": "⚡",
    "shop-3": "🏰",
    "shop-4": "⭐",
    "shop-5": "🎯",
    "shop-6": "🎓",
  };

  const shopColors = {
    "shop-1": "from-blue-500 to-blue-600",
    "shop-2": "from-purple-500 to-purple-600",
    "shop-3": "from-pink-500 to-pink-600",
    "shop-4": "from-cyan-500 to-cyan-600",
    "shop-5": "from-indigo-500 to-indigo-600",
    "shop-6": "from-violet-500 to-violet-600",
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-3xl mb-2">{category.name}</h1>
          <p className="text-gray-400">
            {filteredShops.length} toko tersedia
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Filter & Sort */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl text-white">Urutkan Berdasarkan</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setSortBy('popular')}
              className={`px-5 py-3 rounded-xl transition-all border-2 flex items-center gap-2 ${
                sortBy === 'popular'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Terpopuler
              {sortBy === 'popular' && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">✓</span>
              )}
            </button>
            <button 
              onClick={() => setSortBy('rating')}
              className={`px-5 py-3 rounded-xl transition-all border-2 flex items-center gap-2 ${
                sortBy === 'rating'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-gray-600'
              }`}
            >
              <Star className="w-4 h-4" />
              Rating Tertinggi
              {sortBy === 'rating' && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">✓</span>
              )}
            </button>
            <button 
              onClick={() => setSortBy('nearest')}
              className={`px-5 py-3 rounded-xl transition-all border-2 flex items-center gap-2 ${
                sortBy === 'nearest'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-transparent shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-gray-600'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Terdekat
              {sortBy === 'nearest' && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">✓</span>
              )}
            </button>
          </div>
          <p className="text-gray-400 mt-3">
            Menampilkan {filteredShops.length} toko
          </p>
        </div>

        {/* Shop Grid - E-commerce Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop, index) => {
            const isTopRated = shop.rating >= 4.8;
            const isPopular = shop.reviews >= 300;
            
            // Colorful gradient combinations for cards
            const gradients = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500',
              'from-orange-500 to-red-500',
              'from-green-500 to-emerald-500',
              'from-indigo-500 to-purple-500',
              'from-pink-500 to-rose-500',
            ];
            
            const gradient = gradients[index % gradients.length];
            
            return (
              <button
                key={shop.id}
                onClick={() => onShopSelect(shop)}
                className="group bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 hover:border-gray-700 shadow-xl hover:shadow-2xl transition-all overflow-hidden hover:scale-105 text-left"
              >
                {/* Colorful Header with Gradient */}
                <div className={`relative h-32 bg-gradient-to-br ${gradient} p-6 overflow-hidden`}>
                  {/* Badge for featured shops */}
                  {(isTopRated || isPopular) && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-1 border border-white/30">
                      <Star className="w-3 h-3 text-white fill-white" />
                      <span className="text-white text-xs font-semibold">
                        {isTopRated && 'Top'}
                        {isPopular && !isTopRated && 'Popular'}
                      </span>
                    </div>
                  )}
                  
                  {/* Shop Icon/Emoji on Gradient */}
                  <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-gray-900">
                      <span className="text-4xl">
                        {shopImages[shop.id as keyof typeof shopImages]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-14">
                  {/* Shop Name */}
                  <h3 className="text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {shop.name}
                  </h3>
                  
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white">{shop.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({shop.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{shop.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-xs mb-1">Mulai dari</div>
                    <div className="text-2xl text-white">
                      Rp {shop.basePrice.toLocaleString()}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="line-clamp-1">{shop.address}</span>
                  </div>

                  {/* Open Hours */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{shop.openHours}</span>
                  </div>

                  {/* Categories/Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {shop.categories.slice(0, 3).map((cat, idx) => {
                      const badgeColors = [
                        "bg-blue-500/20 text-blue-400 border-blue-500/30",
                        "bg-purple-500/20 text-purple-400 border-purple-500/30",
                        "bg-pink-500/20 text-pink-400 border-pink-500/30",
                      ];
                      return (
                        <span
                          key={cat}
                          className={`px-3 py-1 rounded-full border text-xs ${badgeColors[idx % badgeColors.length]}`}
                        >
                          {cat}
                        </span>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <div className={`w-full py-3 px-4 bg-gradient-to-r ${gradient} text-white rounded-xl text-center font-semibold group-hover:shadow-lg transition-all flex items-center justify-center gap-2`}>
                    Pilih Toko
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
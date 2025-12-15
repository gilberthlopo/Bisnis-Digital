import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Store,
  Printer,
  Camera,
  FileText,
  Image,
  BookOpen,
  ScanLine,
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

  // Helper to pick a pleasant gradient based on category id
  const getGradientForCategory = (id: string) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-green-500 to-emerald-500",
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
    ];
    const hash = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[Math.abs(hash) % gradients.length];
  };

  // Helper to render a matching icon for a category
  const getIconForCategory = (name: string, props: any) => {
    const iconMap: Record<string, any> = {
      printer: Printer,
      "file-text": FileText,
      camera: Camera,
      image: Image,
      book: BookOpen,
      "file-search": ScanLine,
    };
    const IconComp = iconMap[name] || Printer;
    return <IconComp {...props} />;
  };

  // UI state for scroll and mount animations
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <div className={`relative border-b border-gray-800 bg-black/40 sticky top-0 z-50 transition-all ${scrolled ? 'backdrop-blur-md shadow-xl' : 'backdrop-blur-sm'}`}>
        <div className={`max-w-7xl mx-auto px-6 ${scrolled ? 'py-2' : 'py-4'} flex items-center justify-between gap-4 transition-all duration-300`}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Category icon with subtle gradient */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${getGradientForCategory(category.id)}`}>
                {getIconForCategory(category.icon, { className: "w-7 h-7 text-white" })}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold">{category.name}</h1>
                  <div className="text-xs px-3 py-1 rounded-full bg-white/6 text-white/90 border border-white/10">
                    {filteredShops.length} toko
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">Temukan layanan terbaik di dekat Anda</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-gray-300 hover:bg-gray-900/60 transition">Filter</button>
            <button className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-xl text-sm text-gray-300 hover:bg-gray-900/60 transition">Lihat di Peta</button>
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
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
              <div
                key={shop.id}
                role="button"
                tabIndex={0}
                onClick={() => onShopSelect(shop)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onShopSelect(shop); } }}
                style={{ transitionDelay: `${index * 75}ms` }}
                className={`group bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 hover:border-gray-700 shadow-xl hover:shadow-2xl transition-all overflow-hidden hover:scale-105 text-left transform will-change-transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
                  <div className="mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onShopSelect(shop); }}
                      className={`w-full py-3 px-4 bg-gradient-to-r ${gradient} text-white rounded-xl text-center font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                      aria-label={`Pilih ${shop.name}`}
                    >
                      Pilih Toko
                      <ChevronRight className="w-5 h-5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
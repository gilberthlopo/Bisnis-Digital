import { useState } from 'react';
import { ArrowLeft, Star, Send, Sparkles } from 'lucide-react';
import type { Shop, Order } from '../App';

type RatingPageProps = {
  shop: Shop;
  order: Order;
  onSubmit: (rating: number, review: string) => void;
  onBack: () => void;
};

export function RatingPage({ shop, order, onSubmit, onBack }: RatingPageProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Harap beri rating terlebih dahulu!');
      return;
    }

    onSubmit(rating, review);
  };

  const ratingLabels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];

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
            <h1 className="text-3xl mb-2">Rating & Review</h1>
            <p className="text-gray-400">Bagaimana pengalaman Anda?</p>
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
            
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">🏪</span>
              </div>
              <div>
                <h3 className="text-white mb-1">{shop.name}</h3>
                <div className="text-blue-100">Order #{order.id}</div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-1">Berikan Rating</h3>
                <p className="text-gray-400">Bintang berapa untuk layanan ini?</p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-16 h-16 transition-all ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="inline-block px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-400 text-lg">
                    {ratingLabels[rating]} ⭐
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-1">Tulis Review (Opsional)</h3>
                <p className="text-gray-400">Ceritakan pengalaman Anda</p>
              </div>
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Bagikan pengalaman Anda dengan toko ini... Apa yang Anda suka atau yang bisa ditingkatkan?"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white min-h-[200px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-500 text-sm">
                💡 Review yang detail membantu pengguna lain
              </p>
              <p className="text-gray-500 text-sm">
                {review.length}/500
              </p>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <p className="text-white mb-4">Saran review cepat:</p>
            <div className="flex flex-wrap gap-3">
              {[
                'Pelayanan cepat dan ramah',
                'Hasil cetak berkualitas',
                'Harga terjangkau',
                'Lokasi strategis',
                'Pengerjaan tepat waktu',
                'Staf yang helpful'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setReview(prev => prev ? `${prev} ${suggestion}.` : `${suggestion}.`)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all border border-gray-700 text-sm"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
            >
              Lewati
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Kirim Rating & Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

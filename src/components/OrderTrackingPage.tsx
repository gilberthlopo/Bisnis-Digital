import { useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, MessageCircle, MapPin, Calendar, Filter, Star, Info, Store, XCircle } from 'lucide-react';
import type { Order, Shop } from '../App';
import { ChatModal } from './ChatModal';

type OrderTrackingPageProps = {
  orders: Order[];
  shops: Shop[];
  currentOrder: Order | null;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onNavigateToRating: (order: Order) => void;
  onBack: () => void;
};

export function OrderTrackingPage({ 
  orders,
  shops,
  currentOrder,
  onStatusUpdate, 
  onNavigateToRating,
  onBack 
}: OrderTrackingPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(currentOrder);
  const [showChat, setShowChat] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');

  const getShopName = (shopId: string) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : 'Toko Tidak Diketahui';
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Menunggu',
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: Clock,
          description: 'Pesanan sedang menunggu konfirmasi toko',
        };
      case 'processing':
        return {
          label: 'Diproses',
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Package,
          description: 'Toko sedang memproses pesanan Anda',
        };
      case 'ready':
        return {
          label: 'Siap Diambil',
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: CheckCircle,
          description: 'Pesanan siap untuk diambil',
        };
      case 'completed':
        return {
          label: 'Selesai',
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: CheckCircle,
          description: 'Pesanan telah selesai',
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: XCircle,
          description: 'Pesanan ditolak oleh toko',
        };
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusFilters = [
    { value: 'all', label: 'Semua', count: orders.length },
    { value: 'pending', label: 'Menunggu', count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'Diproses', count: orders.filter(o => o.status === 'processing').length },
    { value: 'ready', label: 'Siap', count: orders.filter(o => o.status === 'ready').length },
    { value: 'completed', label: 'Selesai', count: orders.filter(o => o.status === 'completed').length },
    { value: 'rejected', label: 'Ditolak', count: orders.filter(o => o.status === 'rejected').length },
  ];

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
          <div>
            <h1 className="text-3xl mb-2">Pesanan Saya</h1>
            <p className="text-gray-400">Lacak dan kelola pesanan Anda</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-white">Filter Status</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value as any)}
                className={`px-5 py-3 rounded-xl transition-all border-2 flex items-center gap-2 ${
                  filterStatus === filter.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-gray-600'
                }`}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === filter.value 
                      ? 'bg-white/20' 
                      : 'bg-gray-700'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-12 border-2 border-dashed border-gray-800 shadow-xl">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-blue-400" />
              </div>
              <p className="text-white text-lg mb-2">Tidak ada pesanan</p>
              <p className="text-gray-400">
                {filterStatus === 'all' 
                  ? 'Belum ada pesanan yang dibuat' 
                  : `Tidak ada pesanan dengan status "${statusFilters.find(f => f.value === filterStatus)?.label}"`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl overflow-hidden hover:border-gray-700 transition-all"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white text-lg">Order #{order.id}</h3>
                            <p className="text-gray-400 text-sm">{order.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Store className="w-4 h-4" />
                          <span>{getShopName(order.shopId)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-white mb-1">
                          Rp {order.totalPrice.toLocaleString()}
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Tanggal Pemesanan</span>
                        </div>
                        <div className="text-white">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">Pengambilan</span>
                        </div>
                        <div className="text-white">
                          {new Date(order.pickupDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })} • {order.pickupTime}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Metode Pembayaran</span>
                        </div>
                        <div className="text-white capitalize">
                          {order.paymentMethod === 'qris' && '📱 QRIS'}
                          {order.paymentMethod === 'bank' && '🏦 Transfer Bank'}
                          {order.paymentMethod === 'cod' && '💵 Bayar di Tempat'}
                        </div>
                      </div>
                    </div>

                    {/* Status Description */}
                    <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-blue-400 mb-1">Status Pesanan</p>
                          <p className="text-gray-400 text-sm">{statusInfo.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {order.status === 'rejected' && order.rejectionReason && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                          <div>
                            <p className="text-red-400 mb-1">Alasan Penolakan</p>
                            <p className="text-gray-400 text-sm">{order.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="mb-6">
                      <h4 className="text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Timeline Pesanan
                      </h4>
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
                        
                        {/* Timeline Items */}
                        <div className="space-y-4">
                          {['pending', 'processing', 'ready', 'completed'].map((status, index) => {
                            const isActive = ['pending', 'processing', 'ready', 'completed'].indexOf(order.status) >= index;
                            const isCurrent = order.status === status;
                            const isRejected = order.status === 'rejected';
                            
                            return (
                              <div key={status} className="relative flex items-center gap-4">
                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                  isActive && !isRejected
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-gray-800 border-gray-700'
                                }`}>
                                  {isActive && !isRejected ? (
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  ) : (
                                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                                  )}
                                </div>
                                <div className={`flex-1 ${isActive && !isRejected ? 'text-white' : 'text-gray-500'}`}>
                                  <div className={isCurrent && !isRejected ? 'text-blue-400' : ''}>
                                    {status === 'pending' && 'Pesanan Diterima'}
                                    {status === 'processing' && 'Sedang Diproses'}
                                    {status === 'ready' && 'Siap Diambil'}
                                    {status === 'completed' && 'Pesanan Selesai'}
                                  </div>
                                  {isActive && !isRejected && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      {new Date(order.createdAt).toLocaleString('id-ID')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          
                          {/* Rejected Status */}
                          {order.status === 'rejected' && (
                            <div className="relative flex items-center gap-4">
                              <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-red-500 border-red-500">
                                <XCircle className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 text-red-400">
                                <div>Pesanan Ditolak</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(order.createdAt).toLocaleString('id-ID')}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
                      >
                        Lihat Detail
                      </button>
                      
                      <button
                        onClick={() => setShowChat(true)}
                        className="px-5 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all border border-gray-700 flex items-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat Toko
                      </button>

                      {order.status === 'completed' && !order.rating && (
                        <button
                          onClick={() => onNavigateToRating(order)}
                          className="px-5 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-all border border-yellow-500/30 flex items-center gap-2"
                        >
                          <Star className="w-5 h-5" />
                          Beri Rating
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && selectedOrder && (
        <ChatModal
          orderId={selectedOrder.id}
          shopName={getShopName(selectedOrder.shopId)}
          currentUserRole={'customer'}
          messages={[]}
          onSendMessage={() => {}}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

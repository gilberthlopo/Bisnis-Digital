import { useState, useEffect } from 'react';
import { ChatModal, type ChatMessage } from './ChatModal';
import { supabase } from '../utils/supabaseClient';
import { api } from '../services/api';
import {
  Store, ShoppingBag, TrendingUp, Settings,
  LogOut, Plus, Edit, Trash2, Check, X,
  Clock, Calendar, DollarSign, Package, Star,
  FileText, Image as ImageIcon, Printer, XCircle, AlertCircle, MessageCircle
} from 'lucide-react';
import type { User, Order, ServiceDetail, Shop } from '../App';

type ShopDashboardProps = {
  user: User;
  shops: Shop[];
  orders: Order[];
  users: User[];
  categories: any[]; // Using any to avoid importing Category type if not easily available, or better: Category[]
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateShops: (shops: Shop[]) => void;
  onLogout: () => void;
};

export function ShopDashboard({ user, shops, orders, users, categories, onUpdateOrders, onUpdateShops, onLogout }: ShopDashboardProps) {
  useEffect(() => {
    const myShop = shops.find((s) => s.userId === user.id);
    if (!myShop) return;

    const channel = supabase
      .channel(`orders:shop=${myShop.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `shop_id=eq.${myShop.id}` },
        (payload: any) => {
          const newOrder = payload.new;
          const mapped = {
            id: newOrder.id,
            userId: newOrder.user_id,
            shopId: newOrder.shop_id,
            category: newOrder.category,
            serviceDetail: newOrder.service_detail,
            fileName: newOrder.file_name ?? undefined,
            pickupDate: newOrder.pickup_date,
            pickupTime: newOrder.pickup_time,
            paymentMethod: newOrder.payment_method,
            totalPrice: Number(newOrder.total_price),
            status: newOrder.status,
            rejectionReason: newOrder.rejection_reason ?? undefined,
            createdAt: newOrder.created_at,
          } as Order;

          // avoid duplicates
          if (!orders.find((o) => o.id === mapped.id)) {
            onUpdateOrders([...orders, mapped]);
          }
        },
      )
      .subscribe();

    return () => {
      try {
        void supabase.removeChannel(channel);
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, shops, orders]);

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'ready' | 'completed'>('all');
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Edit Shop State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Shop>>({});

  // Initialize edit form when shop data available
  useEffect(() => {
    const shop = shops.find(s => s.userId === user.id);
    if (shop) {
      setEditForm(shop);
    }
  }, [shops, user.id]);

  // Load messages
  useEffect(() => {
    if (showChat && selectedOrder) {
      loadMessages(selectedOrder.id);
      const interval = setInterval(() => loadMessages(selectedOrder!.id), 5000);
      return () => clearInterval(interval);
    }
  }, [showChat, selectedOrder]);

  const loadMessages = async (orderId: string) => {
    try {
      const msgs = await api.getMessages(orderId);
      setChatMessages(msgs);
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const handleSendMessage = async (orderId: string, text: string, sender: 'customer' | 'shop') => {
    try {
      const newMsg = await api.sendMessage(orderId, text, sender);
      setChatMessages(prev => [...prev, newMsg]);
    } catch (e) {
      alert("Gagal mengirim pesan");
    }
  };

  const myShop = shops.find(s => s.userId === user.id);

  if (!myShop) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-white mb-4">Toko Tidak Ditemukan</h2>
          <p className="text-gray-400 mb-6">Akun Anda belum terhubung dengan toko manapun. Silakan hubungi admin.</p>
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter(order => order.shopId === myShop.id);
  const filteredOrders = orderFilter === 'all'
    ? myOrders
    : myOrders.filter(order => order.status === orderFilter);

  const pendingOrders = myOrders.filter(o => o.status === 'pending').length;
  const processingOrders = myOrders.filter(o => o.status === 'processing').length;
  const todayRevenue = myOrders
    .filter(o => o.status === 'completed' &&
      new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const totalRevenue = myOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status'], reason?: string) => {
    try {
      // 1. Update in Backend
      await api.updateOrderStatus(orderId, newStatus, reason);

      // 2. Update Local State
      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, rejectionReason: reason }
          : order
      );
      onUpdateOrders(updatedOrders);
      setShowOrderDetailModal(false);
      setSelectedOrder(null);
      setRejectionReason('');
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Gagal mengupdate status pesanan");
    }
  };

  const handleRejectOrder = () => {
    if (!selectedOrder) return;
    if (!rejectionReason.trim()) {
      alert('Harap masukkan alasan penolakan!');
      return;
    }
    handleUpdateStatus(selectedOrder.id, 'rejected', rejectionReason);
  };

  const getCustomerName = (userId: string) => {
    const customer = users.find(u => u.id === userId);
    return customer ? customer.name : 'Unknown';
  };

  const handleSaveShop = async () => {
    if (!myShop) return;
    try {
      const updatedShop = await api.updateShop(myShop.id, editForm);
      onUpdateShops(shops.map(s => s.id === myShop.id ? updatedShop : s));
      setIsEditing(false);
      alert("Pengaturan toko berhasil disimpan!");
    } catch (e) {
      console.error("Failed to update shop", e);
      alert("Gagal menyimpan perubahan.");
    }
  };

  const toggleCategory = (catId: string) => {
    const currentCats = editForm.categories || [];
    if (currentCats.includes(catId)) {
      setEditForm({ ...editForm, categories: currentCats.filter(c => c !== catId) });
    } else {
      setEditForm({ ...editForm, categories: [...currentCats, catId] });
    }
  };
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  {myShop.name}
                </h1>
                <p className="text-gray-400 text-sm">Dashboard Toko</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:bg-red-900/30 hover:border-red-800 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Pesanan', icon: ShoppingBag },
              { id: 'settings', label: 'Pengaturan', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.id === 'orders' && pendingOrders > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                      {pendingOrders}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Pesanan Pending</p>
                <p className="text-3xl text-white">{pendingOrders}</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Dalam Proses</p>
                <p className="text-3xl text-white">{processingOrders}</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-1">Pendapatan Hari Ini</p>
                <p className="text-2xl text-white">Rp {todayRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-green-100 text-sm mb-1">Total Pendapatan</p>
                <p className="text-2xl text-white">Rp {totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-white mb-4">Pesanan Terbaru</h3>
              <div className="space-y-3">
                {myOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-between hover:bg-gray-800 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetailModal(true);
                    }}
                  >
                    <div>
                      <p className="text-white">Order #{order.id}</p>
                      <p className="text-gray-400 text-sm">{getCustomerName(order.userId)} • {order.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">Rp {order.totalPrice.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'all', label: 'Semua', count: myOrders.length },
                  { value: 'pending', label: 'Pending', count: pendingOrders },
                  { value: 'processing', label: 'Diproses', count: processingOrders },
                  { value: 'ready', label: 'Siap', count: myOrders.filter(o => o.status === 'ready').length },
                  { value: 'completed', label: 'Selesai', count: myOrders.filter(o => o.status === 'completed').length },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setOrderFilter(filter.value as any)}
                    className={`px-5 py-3 rounded-xl transition-all border-2 ${orderFilter === filter.value
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700'
                      }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetailModal(true);
                  }}
                  className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl overflow-hidden cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white text-lg mb-2">Order #{order.id}</h3>
                        <p className="text-gray-400">{getCustomerName(order.userId)} • {order.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-white mb-1">Rp {order.totalPrice.toLocaleString()}</p>
                        <span className={`px-3 py-1 rounded-full text-sm border ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            order.status === 'ready' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              order.status === 'completed' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetailModal(true);
                          }}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Terima Pesanan
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetailModal(true);
                          }}
                          className="flex-1 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Tolak
                        </button>
                      </div>
                    )}

                    {order.status === 'processing' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'ready'); }}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        Tandai Siap Diambil
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'completed'); }}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        Selesaikan Pesanan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl">Pengaturan Toko</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profil
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(myShop); // Reset
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveShop}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Simpan
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Nama Toko</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-xl text-white font-medium">{myShop.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Nomor Telepon</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-lg text-white">{myShop.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Alamat</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                    />
                  ) : (
                    <p className="text-lg text-white leading-relaxed">{myShop.address}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Jam Operasional</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.openHours || ''}
                      onChange={(e) => setEditForm({ ...editForm, openHours: e.target.value })}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-lg text-white">{myShop.openHours}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Harga Dasar (Rp)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.basePrice || 0}
                      onChange={(e) => setEditForm({ ...editForm, basePrice: parseInt(e.target.value) })}
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-lg text-white">Rp {myShop.basePrice.toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-3 text-sm">Layanan yang Tersedia</label>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((cat) => {
                      const isSelected = (isEditing ? editForm.categories : myShop.categories)?.includes(cat.name);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => isEditing && toggleCategory(cat.name)}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${isEditing ? 'cursor-pointer' : ''} ${isSelected
                            ? 'bg-green-500/20 border-green-500/50'
                            : 'bg-gray-800/30 border-gray-700 opacity-60'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-500'
                            }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {cat.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && selectedOrder && (
        <ChatModal
          orderId={selectedOrder.id}
          shopName={getCustomerName(selectedOrder.userId)}
          currentUserRole="shop"
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedOrder && !showChat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl">Detail Pesanan #{selectedOrder.id}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChat(true)}
                    className="px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all flex items-center gap-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat Pelanggan
                  </button>
                  <button
                    onClick={() => {
                      setShowOrderDetailModal(false);
                      setSelectedOrder(null);
                      setRejectionReason('');
                    }}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 mb-1">Pelanggan</p>
                <p className="text-white">{getCustomerName(selectedOrder.userId)}</p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 mb-1">Detail Layanan</p>
                <div className="text-white text-sm space-y-1">
                  {selectedOrder.fileName && <div>File: {selectedOrder.fileName}</div>}
                  {selectedOrder.serviceDetail?.pages !== undefined && <div>Halaman: {selectedOrder.serviceDetail.pages}</div>}
                  {selectedOrder.serviceDetail?.copies !== undefined && <div>Rangkap: {selectedOrder.serviceDetail.copies}</div>}
                  {selectedOrder.serviceDetail?.colorType && <div>Jenis Cetakan: {selectedOrder.serviceDetail.colorType === 'bw' ? 'Hitam Putih' : 'Berwarna'}</div>}
                  {selectedOrder.serviceDetail?.bindingType && selectedOrder.serviceDetail.bindingType !== 'none' && (
                    <div>Jilid: {selectedOrder.serviceDetail.bindingType === 'regular' ? 'Jilid Biasa' : 'Jilid Buku'}</div>
                  )}
                  {selectedOrder.serviceDetail?.deliveryPackage && <div>Paket: {selectedOrder.serviceDetail.deliveryPackage}</div>}
                  {selectedOrder.serviceDetail?.notes && <div>Catatan: {selectedOrder.serviceDetail.notes}</div>}
                  {selectedOrder.serviceDetail?.bannerLength && selectedOrder.serviceDetail?.bannerWidth && (
                    <div>Banner: {selectedOrder.serviceDetail.bannerLength}m × {selectedOrder.serviceDetail.bannerWidth}m</div>
                  )}
                  {selectedOrder.serviceDetail?.customPhotoWidth && selectedOrder.serviceDetail?.customPhotoHeight && (
                    <div>Ukuran Foto: {selectedOrder.serviceDetail.customPhotoWidth}cm × {selectedOrder.serviceDetail.customPhotoHeight}cm</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 mb-1">Kategori</p>
                <p className="text-white">{selectedOrder.category}</p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 mb-1">Total Harga</p>
                <p className="text-2xl text-white">Rp {selectedOrder.totalPrice.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400 mb-1">Jadwal Pengambilan</p>
                <p className="text-white">
                  {new Date(selectedOrder.pickupDate).toLocaleDateString('id-ID')} • {selectedOrder.pickupTime}
                </p>
              </div>

              {selectedOrder.status === 'pending' && (
                <>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-blue-400 mb-1">Tindakan Diperlukan</p>
                        <p className="text-gray-400 text-sm">Terima atau tolak pesanan ini</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Alasan penolakan (jika menolak)..."
                      className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Terima Pesanan
                      </button>
                      <button
                        onClick={handleRejectOrder}
                        className="flex-1 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Tolak Pesanan
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

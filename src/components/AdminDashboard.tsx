import { useState } from 'react';
import { 
  Store, Users, ShoppingBag, TrendingUp, 
  Settings, LogOut, Tag, BarChart3, Edit, Trash2, 
  Plus, Search, Filter, X, Check, ArrowUpDown, Shield, Phone, MapPin, Clock
} from 'lucide-react';
import type { User, Shop, Order, Category } from '../App';

type AdminDashboardProps = {
  user: User;
  shops: Shop[];
  users: User[];
  orders: Order[];
  categories: Category[];
  onUpdateShops: (shops: Shop[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onLogout: () => void;
};

type PromoData = {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  isActive: boolean;
};

export function AdminDashboard({ user, shops, users, orders, categories, onUpdateShops, onUpdateUsers, onUpdateOrders, onUpdateCategories, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'orders' | 'users' | 'promos'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [showEditShopModal, setShowEditShopModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  
  // Form state for shop
  const [shopForm, setShopForm] = useState({
    name: '',
    owner: '',
    phone: '',
    address: '',
    openHours: '08:00 - 20:00',
    basePrice: 500,
    email: '',
    password: '',
    categories: [] as string[]
  });

  const availableCategories = [
    { id: 'print', name: 'Print & Fotocopy', icon: '🖨️' },
    { id: 'typing', name: 'Jasa Ketik', icon: '⌨️' },
    { id: 'photo', name: 'Cetak Pas Foto', icon: '📸' },
    { id: 'banner', name: 'Cetak Baliho / Banner', icon: '🖼️' },
    { id: 'binding', name: 'Penjilidan / Hard Cover', icon: '📚' },
    { id: 'scan', name: 'Scan Dokumen', icon: '📄' }
  ];

  // Handler untuk klik statistik card
  const handleStatsCardClick = (tab: 'shops' | 'users' | 'orders') => {
    setActiveTab(tab);
  };

  const stats = {
    totalShops: shops.length,
    activeShops: shops.filter(s => s.isActive).length,
    totalUsers: users.length,
    customerUsers: users.filter(u => u.role === 'customer').length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0)
  };

  const handleAddShop = () => {
    if (!shopForm.name || !shopForm.owner || !shopForm.email || !shopForm.password) {
      alert('Mohon lengkapi semua data!');
      return;
    }

    const newShopId = `shop-${Date.now()}`;
    const newUserId = `user-${Date.now()}`;

    // Create user account for shop
    const newUser: User = {
      id: newUserId,
      name: shopForm.owner,
      email: shopForm.email,
      password: shopForm.password,
      role: 'shop',
      phone: shopForm.phone,
      address: shopForm.address,
      isActive: true
    };

    // Create shop
    const newShop: Shop = {
      id: newShopId,
      name: shopForm.name,
      rating: 0,
      reviews: 0,
      basePrice: shopForm.basePrice,
      openHours: shopForm.openHours,
      estimatedTime: '30 menit - 1 jam',
      categories: shopForm.categories,
      owner: shopForm.owner,
      phone: shopForm.phone,
      address: shopForm.address,
      isActive: true,
      userId: newUserId
    };

    onUpdateShops([...shops, newShop]);
    onUpdateUsers([...users, newUser]);

    // Reset form
    setShopForm({
      name: '',
      owner: '',
      phone: '',
      address: '',
      openHours: '08:00 - 20:00',
      basePrice: 500,
      email: '',
      password: '',
      categories: []
    });
    setShowAddShopModal(false);

    alert(`✅ Toko "${shopForm.name}" berhasil ditambahkan!\n\nAkun login toko:\nEmail: ${shopForm.email}\nPassword: ${shopForm.password}\n\nPemilik toko bisa login menggunakan kredensial ini.`);
  };

  const handleEditShop = () => {
    if (!selectedShop) return;

    const updatedShop = {
      ...selectedShop,
      name: shopForm.name,
      owner: shopForm.owner,
      phone: shopForm.phone,
      address: shopForm.address,
      openHours: shopForm.openHours,
      basePrice: shopForm.basePrice,
      categories: shopForm.categories
    };

    onUpdateShops(shops.map(s => s.id === selectedShop.id ? updatedShop : s));
    setShowEditShopModal(false);
    setSelectedShop(null);
  };

  const handleDeleteShop = (shopId: string) => {
    if (window.confirm('Yakin ingin menghapus toko ini?')) {
      onUpdateShops(shops.filter(s => s.id !== shopId));
    }
  };

  const handleToggleShopStatus = (shopId: string) => {
    onUpdateShops(shops.map(s => 
      s.id === shopId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const openEditModal = (shop: Shop) => {
    setSelectedShop(shop);
    setShopForm({
      name: shop.name,
      owner: shop.owner,
      phone: shop.phone,
      address: shop.address,
      openHours: shop.openHours,
      basePrice: shop.basePrice,
      email: '',
      password: '',
      categories: shop.categories
    });
    setShowEditShopModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-sm">Kelola sistem BeresinAja</p>
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
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'shops', label: 'Toko', icon: Store },
              { id: 'users', label: 'Pengguna', icon: Users },
              { id: 'orders', label: 'Pesanan', icon: ShoppingBag },
              { id: 'promos', label: 'Promo', icon: Tag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab - Statistics Cards with Dark Theme */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
                  <Store className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Toko</p>
                <p className="text-3xl text-white">{shops.length}</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Pengguna</p>
                <p className="text-3xl text-white">{users.length}</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl">
                <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-4">
                  <ShoppingBag className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-gray-400 text-sm mb-1">Total Pesanan</p>
                <p className="text-3xl text-white">{orders.length}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl">
                <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-purple-100 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl text-white">
                  Rp {orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shops Tab */}
        {activeTab === 'shops' && (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-800 mb-2">Kelola Toko</h2>
                <p className="text-gray-600">{shops.length} toko terdaftar</p>
              </div>
              <button
                onClick={() => setShowAddShopModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Toko</span>
              </button>
            </div>

            {/* Shops List */}
            <div className="grid md:grid-cols-2 gap-6">
              {shops.map((shop) => (
                <div key={shop.id} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-gray-800">{shop.name}</h3>
                        <span className={`px-3 py-1 rounded-lg text-sm ${
                          shop.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {shop.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Pemilik: {shop.owner}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{shop.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{shop.openHours}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-gray-600">
                        <div>⭐ {shop.rating} ({shop.reviews} ulasan)</div>
                        <div>💰 Rp {shop.basePrice}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleShopStatus(shop.id)}
                        className={`p-3 rounded-xl transition-all ${
                          shop.isActive
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                        title={shop.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {shop.isActive ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => openEditModal(shop)}
                        className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteShop(shop.id)}
                        className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-2">Kelola Pengguna</h2>
              <p className="text-gray-600">{users.length} pengguna terdaftar</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 text-gray-700">Nama</th>
                    <th className="text-left p-4 text-gray-700">Email</th>
                    <th className="text-left p-4 text-gray-700">Role</th>
                    <th className="text-left p-4 text-gray-700">Pesanan</th>
                    <th className="text-left p-4 text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const userOrders = orders.filter(o => o.userId === u.id);
                    return (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">{u.name}</td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg text-sm ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' :
                            u.role === 'shop' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{userOrders.length} pesanan</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg text-sm ${
                            u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {u.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-2">Kelola Pesanan</h2>
              <p className="text-gray-600">{orders.length} pesanan total</p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => {
                const orderUser = users.find(u => u.id === order.userId);
                const orderShop = shops.find(s => s.id === order.shopId);
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                            <ShoppingBag className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-gray-800">{order.id}</div>
                            <div className="text-gray-600">{orderUser?.name || 'Unknown'} → {orderShop?.name || 'Unknown'}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-sm ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'ready' ? 'bg-purple-100 text-purple-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-gray-600">📦 Kategori: {order.category}</div>
                            <div className="text-gray-600">💰 Total: Rp {order.totalPrice.toLocaleString()}</div>
                            <div className="text-gray-600">💳 Pembayaran: {order.paymentMethod.toUpperCase()}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-gray-600">
                              📅 Pengambilan: {new Date(order.pickupDate).toLocaleDateString('id-ID')}
                            </div>
                            <div className="text-gray-600">⏰ Waktu: {order.pickupTime}</div>
                            <div className="text-gray-600">
                              🕒 Dibuat: {new Date(order.createdAt).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {orders.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                  <p className="text-gray-600">Belum ada pesanan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promos Tab */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-800 mb-2">Kelola Promo</h2>
                <p className="text-gray-600">Buat dan kelola promo untuk pengguna</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                <span>Tambah Promo</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
              <p className="text-gray-600">Fitur promo akan segera hadir</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Shop Modal */}
      {showAddShopModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-gray-800 mb-6">Tambah Toko Baru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nama Toko *</label>
                <input
                  type="text"
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="Contoh: Print Center A"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nama Pemilik *</label>
                <input
                  type="text"
                  value={shopForm.owner}
                  onChange={(e) => setShopForm({ ...shopForm, owner: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="Nama pemilik toko"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email untuk Login *</label>
                <input
                  type="email"
                  value={shopForm.email}
                  onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="email@toko.com"
                />
                <p className="text-gray-500 text-sm mt-1">Email ini akan digunakan pemilik toko untuk login</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={shopForm.password}
                  onChange={(e) => setShopForm({ ...shopForm, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="Password untuk login toko"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nomor Telepon *</label>
                <input
                  type="tel"
                  value={shopForm.phone}
                  onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Alamat *</label>
                <textarea
                  value={shopForm.address}
                  onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  placeholder="Alamat lengkap toko"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Jam Operasional</label>
                  <input
                    type="text"
                    value={shopForm.openHours}
                    onChange={(e) => setShopForm({ ...shopForm, openHours: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="08:00 - 20:00"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Harga Dasar (per lembar)</label>
                  <input
                    type="number"
                    value={shopForm.basePrice}
                    onChange={(e) => setShopForm({ ...shopForm, basePrice: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Kategori Layanan</label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (shopForm.categories.includes(category.id)) {
                          setShopForm({ ...shopForm, categories: shopForm.categories.filter(c => c !== category.id) });
                        } else {
                          setShopForm({ ...shopForm, categories: [...shopForm.categories, category.id] });
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        shopForm.categories.includes(category.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddShop}
                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Simpan & Buat Akun
              </button>
              <button
                onClick={() => {
                  setShowAddShopModal(false);
                  setShopForm({
                    name: '',
                    owner: '',
                    phone: '',
                    address: '',
                    openHours: '08:00 - 20:00',
                    basePrice: 500,
                    email: '',
                    password: '',
                    categories: []
                  });
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Shop Modal */}
      {showEditShopModal && selectedShop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-gray-800 mb-6">Edit Toko: {selectedShop.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nama Toko</label>
                <input
                  type="text"
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nama Pemilik</label>
                <input
                  type="text"
                  value={shopForm.owner}
                  onChange={(e) => setShopForm({ ...shopForm, owner: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={shopForm.phone}
                  onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={shopForm.address}
                  onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Jam Operasional</label>
                  <input
                    type="text"
                    value={shopForm.openHours}
                    onChange={(e) => setShopForm({ ...shopForm, openHours: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Harga Dasar</label>
                  <input
                    type="number"
                    value={shopForm.basePrice}
                    onChange={(e) => setShopForm({ ...shopForm, basePrice: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Kategori Layanan</label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (shopForm.categories.includes(category.id)) {
                          setShopForm({ ...shopForm, categories: shopForm.categories.filter(c => c !== category.id) });
                        } else {
                          setShopForm({ ...shopForm, categories: [...shopForm.categories, category.id] });
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        shopForm.categories.includes(category.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditShop}
                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Simpan Perubahan
              </button>
              <button
                onClick={() => {
                  setShowEditShopModal(false);
                  setSelectedShop(null);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
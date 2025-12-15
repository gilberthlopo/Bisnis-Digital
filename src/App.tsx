import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { api } from "./services/api";
import {
  RoleSelectionPage,
  type Role,
} from "./components/RoleSelectionPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { CategoryPage } from "./components/CategoryPage";
import { ShopListPage } from "./components/ShopListPage";
import { ServiceDetailPage } from "./components/ServiceDetailPage";
import { SchedulePage } from "./components/SchedulePage";
import { PaymentPage } from "./components/PaymentPage";
import { OrderTrackingPage } from "./components/OrderTrackingPage";
import { RatingPage } from "./components/RatingPage";
import { ProfilePage } from "./components/ProfilePage";
import { AdminDashboard } from "./components/AdminDashboard";
import { ShopDashboard } from "./components/ShopDashboard";
import { LandingPage } from "./components/LandingPage";
import { CustomerLayout } from "./components/layouts/CustomerLayout";
import type { ChatMessage } from "./components/ChatModal";

// ... Types definitions ...

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  nim?: string;
  role: Role;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  createdBy?: string;
};

export type Shop = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  basePrice: number;
  openHours: string;
  estimatedTime: string;
  categories: string[];
  owner: string;
  phone: string;
  address: string;
  isActive: boolean;
  userId?: string;
  services?: ShopService[];
};

export type ShopService = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
};

export type ServiceDetail = {
  paperSize?: string;
  colorType?: string;
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  photoSize?: string;
  isBinding?: boolean;
  bindingType?: "none" | "regular" | "book";
  deliveryPackage?: "express" | "normal" | "economy";
  bannerLength?: number;
  bannerWidth?: number;
  customPhotoWidth?: number;
  customPhotoHeight?: number;
  photoBackground?: string;
  notes?: string;
};

export type Order = {
  id: string;
  userId: string;
  shopId: string;
  category: string;
  serviceDetail: ServiceDetail;
  fileName?: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: string;
  totalPrice: number;
  status:
  | "pending"
  | "processing"
  | "ready"
  | "completed"
  | "rejected";
  rejectionReason?: string;
  rating?: number;
  review?: string;
  createdAt: string;
};

function AppContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scheduleData, setScheduleData] = useState<{ date: string; time: string; } | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // CENTRALIZED STATE
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load active shops and Check Session on mount
  useEffect(() => {
    const initApp = async () => {
      // 1. Load Shops
      try {
        const data = await api.getShops();
        setShops(data);
      } catch (e) {
        console.error("Failed to load shops", e);
      }

      // 2. Check LocalStorage for Session
      const savedUser = localStorage.getItem("beresinaja_user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          // Re-fetch data based on role
          if (parsedUser.role === 'admin' || parsedUser.role === 'shop') {
            const [u, s, o] = await Promise.all([
              api.getUsers(),
              api.getShops(),
              api.getOrders()
            ]);
            setUsers(u);
            setShops(s);
            setOrders(o);
          } else {
            // Customer
            const myOrders = await api.getOrders(parsedUser.id);
            setOrders(myOrders);
          }
        } catch (e) {
          console.error("Failed to restore session", e);
          localStorage.removeItem("beresinaja_user");
        }
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  const loadFullData = async () => {
    try {
      const [u, s, o] = await Promise.all([
        api.getUsers(),
        api.getShops(),
        api.getOrders()
      ]);
      setUsers(u);
      setShops(s);
      setOrders(o);
    } catch (e) {
      console.error("Failed to load full data", e);
    }
  };

  const [categories, setCategories] = useState<Category[]>([
    { id: "print", name: "Print & Fotocopy", icon: "printer", createdBy: "system" },
    { id: "typing", name: "Jasa Ketik", icon: "file-text", createdBy: "system" },
    { id: "photo", name: "Cetak Pas Foto", icon: "camera", createdBy: "system" },
    { id: "banner", name: "Cetak Baliho / Banner", icon: "image", createdBy: "system" },
    { id: "binding", name: "Penjilidan / Hard Cover", icon: "book", createdBy: "system" },
    { id: "scan", name: "Scan Dokumen", icon: "file-search", createdBy: "system" },
  ]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    navigate("/login");
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const loggedUser = await api.login(email, password);
      setUser(loggedUser);
      localStorage.setItem("beresinaja_user", JSON.stringify(loggedUser));

      if (loggedUser.role === 'admin' || loggedUser.role === 'shop') {
        await loadFullData();
      } else {
        const myOrders = await api.getOrders(loggedUser.id);
        setOrders(myOrders);
        const activeShops = await api.getShops();
        setShops(activeShops);
      }

      if (loggedUser.role === "admin") navigate("/admin");
      else if (loggedUser.role === "shop") navigate("/shop-dashboard");
      else navigate("/dashboard");

      return true;
    } catch (err: any) {
      alert(err.message || "Login failed");
      return false;
    }
  };

  const handleRegister = async (userData: Omit<User, "id" | "role">) => {
    const userToCreate = {
      ...userData,
      role: selectedRole || "customer",
      isActive: true,
    } as User;

    try {
      const newUser = await api.registerUser(userToCreate);
      setUsers([...users, newUser]);
      setUser(newUser);

      if (newUser.role === "admin") navigate("/admin");
      else if (newUser.role === "shop") navigate("/shop-dashboard");
      else navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration failed:", err);
      alert(`Registration failed: ${err.message}`);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    navigate(`/dashboard/shops/${category.id}`);
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    navigate(`/dashboard/service/${shop.id}`);
  };

  const handleServiceSubmit = (detail: ServiceDetail, file: File | null) => {
    setServiceDetail(detail);
    setUploadedFile(file);
    navigate("/dashboard/schedule");
  };

  const handleScheduleSubmit = (date: string, time: string) => {
    setScheduleData({ date, time });
    navigate("/dashboard/payment");
  };

  const handlePaymentSubmit = async (paymentMethod: string, totalPrice: number) => {
    if (!user || !selectedShop || !selectedCategory || !scheduleData) return;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      shopId: selectedShop.id,
      category: selectedCategory.name,
      serviceDetail,
      ...(uploadedFile?.name ? { fileName: uploadedFile.name } : {}),
      pickupDate: scheduleData.date,
      pickupTime: scheduleData.time,
      paymentMethod,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const createdOrder = await api.createOrder(newOrder);
      setCurrentOrder(createdOrder);
      setOrders([...orders, createdOrder]);
      navigate("/dashboard/orders");
    } catch (err) {
      console.error('Create order failed:', err);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((order) => order.id === orderId ? updatedOrder : order));
      if (currentOrder && currentOrder.id === orderId) setCurrentOrder(updatedOrder);
    } catch (err) {
      console.error('Update order failed:', err);
      alert("Failed to update status.");
    }
  };

  const navigateToRating = (order?: Order) => {
    const orderToRate = order || currentOrder;
    if (orderToRate) {
      setCurrentOrder(orderToRate);
      const shop = shops.find((s) => s.id === orderToRate.shopId);
      if (shop) setSelectedShop(shop);
      navigate("/dashboard/rating");
    }
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!currentOrder) return;
    try {
      const updatedOrder = await api.submitRating(currentOrder.id, rating, review);
      setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      alert("Terima kasih atas penilaian Anda!");
      navigate("/dashboard");

      // Reset flow
      setSelectedCategory(null);
      setSelectedShop(null);
      setServiceDetail({});
      setUploadedFile(null);
      setScheduleData(null);
      setCurrentOrder(null);
    } catch (e: any) {
      console.error("Failed to submit rating", e);
      alert("Gagal mengirim rating");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("beresinaja_user");
    navigate("/");
  };

  const handleUpdateProfile = async (name: string, email: string, phone: string, address: string) => {
    if (!user) return;
    try {
      const updatedUser = await api.updateUser(user.id, { name, email, phone, address });
      setUser(updatedUser);
      setUsers(users.map((u) => u.id === updatedUser.id ? updatedUser : u));
      alert("Profil berhasil diperbarui!");
    } catch (e: any) {
      console.error("Failed to check update profile", e);
      alert("Gagal memperbarui profil: " + (e.message || "Unknown error"));
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateToLogin={() => navigate("/role-selection")} shops={shops} />} />
      <Route path="/role-selection" element={<RoleSelectionPage onSelectRole={handleRoleSelect} onBack={() => navigate("/")} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onNavigateToRegister={() => navigate("/register")} onBack={() => navigate("/")} selectedRole={selectedRole || "customer"} />} />
      <Route path="/register" element={<RegisterPage onRegister={handleRegister} onBack={() => navigate("/login")} />} />

      {/* Customer Routes with Persistent Layout */}
      <Route path="/dashboard" element={
        isLoading ? (
          <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>
        ) : (
          <CustomerLayout user={user} orders={orders} onLogout={handleLogout} />
        )
      }>
        <Route index element={
          <CategoryPage
            user={user!}
            orders={orders.filter((o) => o?.userId === user?.id)}
            categories={categories}
            shops={shops}
            onCategorySelect={handleCategorySelect}
            onViewOrders={() => navigate("/dashboard/orders")}
            onLogout={handleLogout}
            onViewProfile={() => navigate("/dashboard/profile")}
          />
        } />
        <Route path="shops/:categoryId" element={
          selectedCategory ? (
            <ShopListPage
              category={selectedCategory}
              shops={shops.filter((s) => s.isActive)}
              onShopSelect={handleShopSelect}
              onBack={() => navigate("/dashboard")}
            />
          ) : <Navigate to="/dashboard" />
        } />
        <Route path="service/:shopId" element={
          selectedShop && selectedCategory ? (
            <ServiceDetailPage
              shop={selectedShop}
              category={selectedCategory}
              onSubmit={handleServiceSubmit}
              onBack={() => navigate(`/dashboard/shops/${selectedCategory.id}`)}
            />
          ) : <Navigate to="/dashboard" />
        } />
        <Route path="schedule" element={
          selectedShop ? (
            <SchedulePage
              shop={selectedShop}
              deliveryPackage={serviceDetail?.deliveryPackage}
              onSubmit={handleScheduleSubmit}
              onBack={() => navigate(`/dashboard/service/${selectedShop.id}`)}
            />
          ) : <Navigate to="/dashboard" />
        } />
        <Route path="payment" element={
          scheduleData && selectedShop ? (
            <PaymentPage
              shop={selectedShop}
              serviceDetail={serviceDetail}
              scheduleData={scheduleData}
              fileName={uploadedFile?.name}
              onSubmit={handlePaymentSubmit}
              onBack={() => navigate("/dashboard/schedule")}
            />
          ) : <Navigate to="/dashboard" />
        } />
        <Route path="orders" element={
          <OrderTrackingPage
            orders={orders.filter((o) => o?.userId === user?.id)}
            shops={shops}
            currentOrder={currentOrder}
            onStatusUpdate={handleOrderStatusUpdate}
            onNavigateToRating={navigateToRating}
            onBack={() => navigate("/dashboard")}
            onLogout={handleLogout}
            onViewProfile={() => navigate("/dashboard/profile")}
            user={user}
          />
        } />
        <Route path="rating" element={
          selectedShop && currentOrder ? (
            <RatingPage
              shop={selectedShop}
              order={currentOrder}
              onSubmit={handleRatingSubmit}
              onBack={() => navigate("/dashboard/orders")}
            />
          ) : <Navigate to="/dashboard/orders" />
        } />
        <Route path="profile" element={
          <ProfilePage
            user={user!}
            orders={orders.filter((o) => o?.userId === user?.id)}
            onBack={() => navigate("/dashboard")}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onViewOrders={() => navigate("/dashboard/orders")}
            onGoHome={() => navigate("/dashboard")}
          />
        } />
      </Route>

      {/* Admin & Shop Dashboard Routes (Refactored for Refresh Check) */}
      <Route path="/admin" element={
        isLoading ? (
          <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>
        ) : user && user.role === "admin" ? (
          <AdminDashboard
            user={user}
            shops={shops}
            users={users}
            orders={orders}
            categories={categories}
            onUpdateShops={setShops}
            onUpdateUsers={setUsers}
            onUpdateOrders={setOrders}
            onUpdateCategories={setCategories}
            onLogout={handleLogout}
          />
        ) : <Navigate to="/" />
      } />
      <Route path="/shop-dashboard" element={
        isLoading ? (
          <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>
        ) : user && user.role === "shop" ? (
          <ShopDashboard
            user={user}
            shops={shops}
            orders={orders.filter(o => shops.find(s => s.userId === user.id)?.id === o.shopId)}
            users={users}
            onUpdateOrders={setOrders}
            onUpdateShops={setShops}
            categories={categories}
            onLogout={handleLogout}
          />
        ) : <Navigate to="/" />
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
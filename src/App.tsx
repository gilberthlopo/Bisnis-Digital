import { useState, useEffect } from "react";
import { api } from "./services/api";
import { supabase, mapOrderFromDb, mapOrderToDb } from "./utils/supabaseClient";
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
import type { ChatMessage } from "./components/ChatModal";

// BeresinAja v1.0 - Local State Management (No Database)

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
  createdBy?: string; // 'system' or 'admin-xxx'
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
  userId?: string; // Link to user account for shop login
  services?: ShopService[]; // Custom services added by shop
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
  bindingType?: "none" | "regular" | "book"; // none = 0, regular = 5000, book = 20000
  deliveryPackage?: "express" | "normal" | "economy"; // express = +50%, normal = base, economy = -20%
  // Banner/Baliho fields
  bannerLength?: number; // panjang dalam meter
  bannerWidth?: number; // lebar dalam meter
  // Photo custom fields
  customPhotoWidth?: number; // lebar dalam cm
  customPhotoHeight?: number; // tinggi dalam cm
  photoBackground?: string; // warna latar: putih, merah, biru, custom
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

type Page =
  | "roleSelection"
  | "login"
  | "register"
  | "category"
  | "shopList"
  | "serviceDetail"
  | "schedule"
  | "payment"
  | "orderTracking"
  | "rating"
  | "profile"
  | "adminDashboard"
  | "shopDashboard"
  | "landingPage";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("landingPage");
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    null,
  );
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(
    null,
  );
  const [serviceDetail, setServiceDetail] =
    useState<ServiceDetail>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(
    null,
  );
  const [scheduleData, setScheduleData] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [currentOrder, setCurrentOrder] =
    useState<Order | null>(null);

  // CENTRALIZED STATE - Fetched from API
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load active shops on mount (guests can see shops)
  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await api.getShops();
        setShops(data);
      } catch (e) { console.error("Failed to load shops", e); }
    };
    loadShops();
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

  // Categories - Can be managed by admin
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
    setCurrentPage("login");
  };

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    try {
      const loggedUser = await api.login(email, password);
      setUser(loggedUser);

      // Load data based on role
      if (loggedUser.role === 'admin' || loggedUser.role === 'shop') {
        await loadFullData();
      } else {
        // Customer - load active shops and own orders
        const myOrders = await api.getOrders(loggedUser.id);
        setOrders(myOrders);
        // Re-fetch shops to be sure
        const activeShops = await api.getShops();
        setShops(activeShops);
      }

      // Route based on role
      if (loggedUser.role === "admin") {
        setCurrentPage("adminDashboard");
      } else if (loggedUser.role === "shop") {
        setCurrentPage("shopDashboard");
      } else {
        setCurrentPage("category");
      }
      return true;
    } catch (err: any) {
      alert(err.message || "Login failed");
      return false;
    }
  };

  const handleRegister = async (
    userData: Omit<User, "id" | "role">,
  ) => {
    const userToCreate = {
      ...userData,
      // id: "", // API handles ID
      role: selectedRole || "customer",
      isActive: true,
    } as User;

    try {
      const newUser = await api.registerUser(userToCreate);
      setUsers([...users, newUser]);
      setUser(newUser);

      // Route based on role
      if (newUser.role === "admin") {
        setCurrentPage("adminDashboard");
      } else if (newUser.role === "shop") {
        setCurrentPage("shopDashboard");
      } else {
        setCurrentPage("category");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      alert(`Registration failed: ${err.message}`);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage("shopList");
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    setCurrentPage("serviceDetail");
  };

  const handleServiceSubmit = (
    detail: ServiceDetail,
    file: File | null,
  ) => {
    setServiceDetail(detail);
    setUploadedFile(file);
    setCurrentPage("schedule");
  };

  const handleScheduleSubmit = (date: string, time: string) => {
    setScheduleData({ date, time });
    setCurrentPage("payment");
  };

  // Use API for order creation
  const handlePaymentSubmit = async (
    paymentMethod: string,
    totalPrice: number,
  ) => {
    if (
      !user ||
      !selectedShop ||
      !selectedCategory ||
      !scheduleData
    )
      return;

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
    } catch (err) {
      console.error('Create order failed:', err);
      // Fallback or alert user
      alert("Failed to create order. Please try again.");
    }

    setCurrentPage("orderTracking");
  };

  const handleOrderStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
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
    // Set currentOrder if provided (from OrderTrackingPage)
    const orderToRate = order || currentOrder;

    if (orderToRate) {
      setCurrentOrder(orderToRate);
      const shop = shops.find(
        (s) => s.id === orderToRate.shopId,
      );
      if (shop) {
        setSelectedShop(shop);
      }
    }
    setCurrentPage("rating");
  };

  const handleRatingSubmit = (
    rating: number,
    review: string,
  ) => {
    // In production, this would update the shop's rating
    console.log("Rating submitted:", rating, review);
    setCurrentPage("category");
    // Reset for new order
    setSelectedCategory(null);
    setSelectedShop(null);
    setServiceDetail({});
    setUploadedFile(null);
    setScheduleData(null);
    setCurrentOrder(null);
  };

  const handleLogout = () => {
    // Reset all state
    setUser(null);
    setSelectedRole(null);
    setSelectedCategory(null);
    setSelectedShop(null);
    setServiceDetail({});
    setUploadedFile(null);
    setScheduleData(null);
    setCurrentOrder(null);
    // Don't reset orders, users, shops - they persist in session
    setCurrentPage("roleSelection");
  };

  const handleUpdateProfile = (name: string, email: string, phone: string, address: string) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name,
      email,
      phone,
      address,
    };

    setUser(updatedUser);
    // Update in users array as well
    setUsers(
      users.map((u) =>
        u.id === updatedUser.id ? updatedUser : u,
      ),
    );
  };

  const handleSendMessage = (orderId: string, text: string, sender: 'customer' | 'shop') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    setChatMessages([...chatMessages, newMessage]);
  };

  const navigateBack = () => {
    switch (currentPage) {
      case "login":
        setCurrentPage("roleSelection");
        setSelectedRole(null);
        break;
      case "register":
        setCurrentPage("login");
        break;
      case "category":
        setCurrentPage("login");
        setUser(null);
        break;
      case "shopList":
        setCurrentPage("category");
        setSelectedCategory(null);
        break;
      case "serviceDetail":
        setCurrentPage("shopList");
        setSelectedShop(null);
        break;
      case "schedule":
        setCurrentPage("serviceDetail");
        setServiceDetail({});
        setUploadedFile(null);
        break;
      case "payment":
        setCurrentPage("schedule");
        setScheduleData(null);
        break;
      case "orderTracking":
        setCurrentPage("category");
        break;
      case "rating":
        setCurrentPage("orderTracking");
        break;
      case "profile":
        setCurrentPage("category");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === "roleSelection" && (
        <RoleSelectionPage
          onSelectRole={handleRoleSelect}
          onBack={() => setCurrentPage("landingPage")}
        />
      )}

      {currentPage === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={() =>
            setCurrentPage("register")
          }
          onBack={() => navigateBack()}
          selectedRole={selectedRole || "customer"}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage
          onRegister={handleRegister}
          onBack={navigateBack}
        />
      )}

      {currentPage === "category" && user && (
        <CategoryPage
          user={user}
          orders={orders.filter((o) => o.userId === user.id)}
          onCategorySelect={handleCategorySelect}
          onViewOrders={() => setCurrentPage("orderTracking")}
          onLogout={handleLogout}
          onViewProfile={() => setCurrentPage("profile")}
        />
      )}

      {currentPage === "profile" && user && (
        <ProfilePage
          user={user}
          orders={orders.filter((o) => o.userId === user.id)}
          onBack={navigateBack}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {currentPage === "shopList" && selectedCategory && (
        <ShopListPage
          category={selectedCategory}
          shops={shops.filter((s) => s.isActive)} // Only show active shops
          onShopSelect={handleShopSelect}
          onBack={navigateBack}
        />
      )}

      {currentPage === "serviceDetail" &&
        selectedShop &&
        selectedCategory && (
          <ServiceDetailPage
            shop={selectedShop}
            category={selectedCategory}
            onSubmit={handleServiceSubmit}
            onBack={navigateBack}
          />
        )}

      {currentPage === "schedule" && selectedShop && (
        <SchedulePage
          shop={selectedShop}
          deliveryPackage={serviceDetail?.deliveryPackage}
          onSubmit={handleScheduleSubmit}
          onBack={navigateBack}
        />
      )}

      {currentPage === "payment" &&
        scheduleData &&
        selectedShop && (
          <PaymentPage
            shop={selectedShop}
            serviceDetail={serviceDetail}
            scheduleData={scheduleData}
            fileName={uploadedFile?.name}
            onSubmit={handlePaymentSubmit}
            onBack={navigateBack}
          />
        )}

      {currentPage === "orderTracking" && (
        <OrderTrackingPage
          orders={orders.filter((o) => o.userId === user?.id)}
          shops={shops}
          currentOrder={currentOrder}
          onStatusUpdate={handleOrderStatusUpdate}
          onNavigateToRating={navigateToRating}
          onBack={() => setCurrentPage("category")}
        />
      )}

      {currentPage === "rating" &&
        selectedShop &&
        currentOrder && (
          <RatingPage
            shop={selectedShop}
            order={currentOrder}
            onSubmit={handleRatingSubmit}
            onBack={navigateBack}
          />
        )}

      {currentPage === "adminDashboard" && user && (
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
      )}

      {currentPage === "shopDashboard" && user && (
        <ShopDashboard
          user={user}
          shops={shops}
          orders={orders.filter((o) => {
            // Find shop associated with this user
            const userShop = shops.find(
              (s) => s.userId === user.id,
            );
            return userShop ? o.shopId === userShop.id : false;
          })}
          users={users}
          onUpdateOrders={setOrders}
          onUpdateShops={setShops}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "landingPage" && (
        <LandingPage onNavigateToLogin={() => setCurrentPage("roleSelection")} />
      )}
    </div>
  );
}
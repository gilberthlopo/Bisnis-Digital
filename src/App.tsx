import { useState } from "react";
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

  // CENTRALIZED STATE - All data stored here and shared across components
  const [users, setUsers] = useState<User[]>([
    {
      id: "admin-001",
      name: "Super Admin",
      email: "admin@beresinaja.com",
      password: "admin123",
      role: "admin",
      isActive: true,
    },
    // Customer User
    {
      id: "customer-001",
      name: "Gilberth Lopo",
      email: "gil@gmail.com",
      password: "gil123",
      role: "customer",
      phone: "081234567899",
      nim: "C1234567890",
      isActive: true,
    },
    // Shop Users
    {
      id: "shop-user-1",
      name: "Sky Thedens",
      email: "tes@skycom.com",
      password: "skycom123",
      role: "shop",
      phone: "081234567890",
      isActive: true,
    },
    {
      id: "shop-user-2",
      name: "Stevano",
      email: "tes@stevano.com",
      password: "stevano123",
      role: "shop",
      phone: "081234567891",
      isActive: true,
    },
    {
      id: "shop-user-3",
      name: "Istana FC",
      email: "tes@istana.com",
      password: "istana123",
      role: "shop",
      phone: "081234567892",
      isActive: true,
    },
    {
      id: "shop-user-4",
      name: "Bintang",
      email: "tes@bintang.com",
      password: "bintang123",
      role: "shop",
      phone: "081234567893",
      isActive: true,
    },
    {
      id: "shop-user-5",
      name: "Sitarda",
      email: "tes@sitarda.com",
      password: "sitarda123",
      role: "shop",
      phone: "081234567894",
      isActive: true,
    },
    {
      id: "shop-user-6",
      name: "Anugerah",
      email: "tes@anugerah.com",
      password: "anugerah123",
      role: "shop",
      phone: "081234567895",
      isActive: true,
    },
  ]);

  const [shops, setShops] = useState<Shop[]>([
    {
      id: "shop-1",
      name: "SKYCOM",
      rating: 4.8,
      reviews: 234,
      basePrice: 500,
      openHours: "08:00 - 20:00",
      estimatedTime: "1-2 jam",
      categories: ["print", "typing"],
      owner: "Sky Thedens",
      phone: "081234567890",
      address: "Jl. Kuanino",
      isActive: true,
      userId: "shop-user-1",
    },
    {
      id: "shop-2",
      name: "Stevano Printing Lanudal",
      rating: 4.9,
      reviews: 342,
      basePrice: 250,
      openHours: "07:00 - 22:00",
      estimatedTime: "30 menit - 1 jam",
      categories: ["print", "photo", "banner", "binding"],
      owner: "Stevano",
      phone: "081234567891",
      address: "Jl. Lanudal Raya No. 45",
      isActive: true,
      userId: "shop-user-2",
    },
    {
      id: "shop-3",
      name: "Istana Fotocopy",
      rating: 4.7,
      reviews: 289,
      basePrice: 250,
      openHours: "08:00 - 21:00",
      estimatedTime: "30 menit - 1 jam",
      categories: ["print", "photo", "banner", "binding"],
      owner: "Istana FC",
      phone: "081234567892",
      address: "Jl. Penfui",
      isActive: true,
      userId: "shop-user-3",
    },
    {
      id: "shop-4",
      name: "Bintang Jasa",
      rating: 4.6,
      reviews: 198,
      basePrice: 250,
      openHours: "08:00 - 20:00",
      estimatedTime: "1-2 jam",
      categories: ["print", "binding"],
      owner: "Bintang",
      phone: "081234567893",
      address: "Jl. Penfui",
      isActive: true,
      userId: "shop-user-4",
    },
    {
      id: "shop-5",
      name: "Sitarda Center",
      rating: 4.8,
      reviews: 276,
      basePrice: 250,
      openHours: "08:00 - 21:00",
      estimatedTime: "30 menit - 1 jam",
      categories: ["print", "photo", "binding"],
      owner: "Sitarda",
      phone: "081234567894",
      address: "Jl. Sitarda",
      isActive: true,
      userId: "shop-user-5",
    },
    {
      id: "shop-6",
      name: "Anugerah FotoCopy",
      rating: 4.9,
      reviews: 412,
      basePrice: 250,
      openHours: "07:30 - 22:00",
      estimatedTime: "30 menit - 1 jam",
      categories: ["print", "photo", "binding", "scan"],
      owner: "Anugerah",
      phone: "081234567895",
      address: "Jl. Bimoku",
      isActive: true,
      userId: "shop-user-6",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);

  // Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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

  const handleLogin = (
    email: string,
    password: string,
  ): boolean => {
    // Find user with matching credentials
    const foundUser = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.isActive !== false,
    );

    if (!foundUser) {
      return false; // Login failed
    }

    // Check if role matches
    if (foundUser.role !== selectedRole) {
      return false; // Role mismatch
    }

    setUser(foundUser);

    // Route based on role
    if (foundUser.role === "admin") {
      setCurrentPage("adminDashboard");
    } else if (foundUser.role === "shop") {
      setCurrentPage("shopDashboard");
    } else {
      setCurrentPage("category");
    }

    return true; // Login success
  };

  const handleRegister = (
    userData: Omit<User, "id" | "role">,
  ) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: selectedRole || "customer",
      isActive: true,
    };

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

  const handlePaymentSubmit = (
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

    setCurrentOrder(newOrder);
    setOrders([...orders, newOrder]);
    setCurrentPage("orderTracking");
  };

  const handleOrderStatusUpdate = (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order,
      ),
    );
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({ ...currentOrder, status: newStatus });
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
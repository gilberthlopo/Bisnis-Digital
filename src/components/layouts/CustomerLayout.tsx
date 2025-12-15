import { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Store, ShoppingBag, User, LogOut } from "lucide-react";
import type { User as UserType, Order } from "../../App";

interface CustomerLayoutProps {
    user: UserType | null;
    orders: Order[];
    onLogout: () => void;
}

export function CustomerLayout({ user, orders, onLogout }: CustomerLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    // If no user (and not loading, handled by App), redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Get active orders count (pending/processing/ready)
    const activeOrdersCount = orders.filter(
        (o) =>
            o.userId === user.id &&
            ["pending", "processing", "ready"].includes(o.status)
    ).length;

    const [showNotifications, setShowNotifications] = useState(false);

    // Derive notifications from orders
    const notifications = orders
        .filter(o => o.userId === user.id && ['ready', 'processing', 'rejected', 'completed'].includes(o.status))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) // Show top 5
        .map(order => {
            let message = "";
            let color = "";
            switch (order.status) {
                case 'ready':
                    message = `Pesanan #${order.id.slice(-4)} siap diambil! 🎁`;
                    color = "text-green-400";
                    break;
                case 'processing':
                    message = `Pesanan #${order.id.slice(-4)} sedang diproses 🛠️`;
                    color = "text-blue-400";
                    break;
                case 'rejected':
                    message = `Pesanan #${order.id.slice(-4)} dibatalkan/ditolak ❌`;
                    color = "text-red-400";
                    break;
                case 'completed':
                    message = `Pesanan #${order.id.slice(-4)} selesai. Terima kasih! ✅`;
                    color = "text-gray-400";
                    break;
                default:
                    message = `Update pada pesanan #${order.id.slice(-4)}`;
                    color = "text-white";
            }
            return { id: order.id, message, color, time: order.createdAt };
        });

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Persistent Navbar */}
            <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo / Brand - Match Screenshot Style */}
                    <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                    >
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <Store className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-blue-500">
                                BeresinAja
                            </h1>
                            <div className="flex items-center gap-1.5 animate-fade-in">
                                <span className="text-sm text-gray-400">Halo,</span>
                                <span className="text-sm font-semibold text-white">{user.name}!</span>
                                <span className="text-sm">👋</span>
                            </div>
                        </div>
                    </div>

                    {/* Setup Navigation Items */}
                    <div className="flex items-center gap-6">
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1 bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === "/dashboard"
                                    ? "bg-gray-800 text-white shadow-sm"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                    }`}
                            >
                                Beranda
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/orders")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${location.pathname.startsWith("/dashboard/orders")
                                    ? "bg-gray-800 text-white shadow-sm"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                    }`}
                            >
                                Pesanan
                                {activeOrdersCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Notification & Actions */}
                        <div className="flex items-center gap-4 pl-3 md:border-l border-gray-800 relative">
                            {/* Notification Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
                                >
                                    {notifications.length > 0 && (
                                        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0A0A]"></div>
                                    )}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                                        <div className="p-4 border-b border-gray-800">
                                            <h3 className="text-white font-semibold">Notifikasi</h3>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-gray-500 text-sm">
                                                    Belum ada notifikasi baru
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => {
                                                            navigate("/dashboard/orders");
                                                            setShowNotifications(false);
                                                        }}
                                                        className="p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                                                    >
                                                        <p className={`text-sm font-medium ${notif.color} mb-1`}>
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(notif.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Profile Button - Mobile & Desktop */}
                            <button
                                onClick={() => navigate("/dashboard/profile")}
                                className={`flex items-center gap-3 p-2 rounded-xl transition-all ${location.pathname === "/dashboard/profile"
                                    ? "bg-gray-800"
                                    : "hover:bg-gray-800/50"
                                    }`}
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-gray-800">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-white line-clamp-1 max-w-[100px]">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400">Customer</p>
                                </div>
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={onLogout}
                                className="p-2.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-colors"
                                title="Keluar"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

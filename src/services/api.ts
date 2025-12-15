import type { Order, User, Shop } from '../App';

const API_URL = '/api';

export const api = {
    // Auth
    login: async (email: string, password: string): Promise<User> => {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Login failed');
        }
        return res.json();
    },

    registerUser: async (user: Partial<User>): Promise<User> => {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Registration failed');
        }
        return res.json();
    },

    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${API_URL}/users`);
        return res.json();
    },

    updateUser: async (id: string, data: Partial<User>): Promise<User> => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
    },

    // Shops
    getShops: async (): Promise<Shop[]> => {
        const res = await fetch(`${API_URL}/shops`);
        if (!res.ok) throw new Error('Failed to fetch shops');
        const data = await res.json();
        return data.map((shop: any) => ({
            ...shop,
            rating: Number(shop.rating),
            basePrice: Number(shop.basePrice),
        }));
    },

    createShop: async (shopData: any, userData: any): Promise<{ shop: Shop; owner: User }> => {
        const res = await fetch(`${API_URL}/shops`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shopData, userData }),
        });
        if (!res.ok) throw new Error('Failed to create shop');
        return res.json();
    },

    updateShop: async (shopId: string, data: any): Promise<Shop> => {
        const res = await fetch(`${API_URL}/shops/${shopId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update shop');
        return res.json();
    },

    // Orders
    getOrders: async (userId?: string, shopId?: string): Promise<Order[]> => {
        const url = new URL(`${API_URL}/orders`, window.location.origin);
        if (userId) url.searchParams.append('userId', userId);
        if (shopId) url.searchParams.append('shopId', shopId);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        return data.map((item: any) => ({
            ...item,
            totalPrice: Number(item.totalPrice),
            rating: item.rating ? Number(item.rating) : undefined,
        }));
    },

    createOrder: async (order: Partial<Order>): Promise<Order> => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error('Failed to create order');
        const data = await res.json();
        return { ...data, totalPrice: Number(data.totalPrice) };
    },

    updateOrderStatus: async (id: string, status: string, rejectionReason?: string): Promise<Order> => {
        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, rejectionReason }),
        });
        if (!res.ok) throw new Error('Failed to update status');
        const data = await res.json();
        return { ...data, totalPrice: Number(data.totalPrice) };
    },

    submitRating: async (orderId: string, rating: number, review: string): Promise<Order> => {
        const res = await fetch(`${API_URL}/orders/${orderId}/rating`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, review }),
        });
        if (!res.ok) throw new Error('Failed to submit rating');
        const data = await res.json();
        return { ...data, totalPrice: Number(data.totalPrice) };
    },

    // Chat
    getMessages: async (orderId: string): Promise<any[]> => {
        const res = await fetch(`${API_URL}/orders/${orderId}/messages`);
        if (!res.ok) return [];
        const data = await res.json();
        // Map backend fields to frontend
        return data.map((msg: any) => ({
            id: msg.id,
            orderId: msg.order_id,
            sender: msg.sender,
            text: msg.content,
            timestamp: msg.created_at
        }));
    },

    sendMessage: async (orderId: string, text: string, sender: string): Promise<any> => {
        const res = await fetch(`${API_URL}/orders/${orderId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sender }),
        });
        if (!res.ok) throw new Error('Failed to send message');
        const msg = await res.json();
        return {
            id: msg.id,
            orderId: msg.order_id,
            sender: msg.sender,
            text: msg.content,
            timestamp: msg.created_at
        };
    }
};

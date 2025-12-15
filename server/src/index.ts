import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper for error handling
const handleError = (res: Response, error: unknown, msg: string) => {
    console.error(msg, error);
    res.status(500).json({ error: String(error) });
};

// --- AUTH ROUTES ---

app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || user.password !== password) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        res.json(user);
    } catch (error) {
        handleError(res, error, "Login failed");
    }
});

// --- USER ROUTES ---

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        handleError(res, error, "Fetch users failed");
    }
});

app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        // Check if email exists
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'customer', // Default role
                phone: data.phone,
                address: data.address
            }
        });
        res.json(newUser);
    } catch (error) {
        handleError(res, error, "Registration failed");
    }
});

// --- SHOP ROUTES ---

app.get('/api/shops', async (req: Request, res: Response) => {
    try {
        // Only active shops by default, or all if ?all=true
        // Actually Dashboard needs all shops.
        const shops = await prisma.shop.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(shops);
    } catch (error) {
        handleError(res, error, "Fetch shops failed");
    }
});

app.post('/api/shops', async (req: Request, res: Response) => {
    try {
        const { shopData, userData } = req.body;
        // Admin creates Shop AND User (Owner) at the same time usually, 
        // OR links to existing user. Based on AdminDashboard, it creates a new User.

        // 1. Create User (Owner)
        const owner = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'shop',
                phone: userData.phone,
                address: userData.address
            }
        });

        // 2. Create Shop
        const shop = await prisma.shop.create({
            data: {
                name: shopData.name,
                userId: owner.id,
                phone: shopData.phone,
                address: shopData.address,
                openHours: shopData.openHours,
                basePrice: shopData.basePrice,
                categories: shopData.categories,
                isActive: true,
                estimatedTime: '30 menit'
            } as any
        });

        res.json({ shop, owner });
    } catch (error) {
        handleError(res, error, "Create shop failed");
    }
});

app.put('/api/shops/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await prisma.shop.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                address: data.address,
                openHours: data.openHours,
                basePrice: data.basePrice,
                categories: data.categories,
                isActive: data.isActive
            }
        });
        res.json(updated);
    } catch (error) {
        handleError(res, error, "Update shop failed");
    }
});

// --- ORDER ROUTES ---

app.get('/api/orders', async (req: Request, res: Response) => {
    try {
        const { userId, shopId } = req.query;

        let where = {};
        if (userId) where = { ...where, userId: String(userId) };
        if (shopId) where = { ...where, shopId: String(shopId) };

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        handleError(res, error, "Fetch orders failed");
    }
});

app.post('/api/orders', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newOrder = await prisma.order.create({
            data: {
                userId: data.userId,
                shopId: data.shopId,
                category: data.category,
                serviceDetail: data.serviceDetail, // Json
                fileName: data.fileName,
                pickupDate: data.pickupDate,
                pickupTime: data.pickupTime,
                paymentMethod: data.paymentMethod,
                totalPrice: data.totalPrice,
                status: 'pending'
            }
        });
        res.json(newOrder);
    } catch (error) {
        handleError(res, error, "Create order failed");
    }
});


app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const updated = await prisma.order.update({
            where: { id },
            data: { status, rejectionReason }
        });
        res.json(updated);
    } catch (error) {
        handleError(res, error, "Update order status failed");
    }
});

app.patch('/api/orders/:id/rating', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, review } = req.body;

        // 1. Update Order
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { rating, review }
        });

        // 2. Recalculate Shop Rating
        if (updatedOrder.shopId) {
            const shopOrders = await prisma.order.findMany({
                where: {
                    shopId: updatedOrder.shopId,
                    rating: { not: null }
                }
            });

            const totalRating = shopOrders.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            const count = shopOrders.length;
            const average = count > 0 ? totalRating / count : 0;

            await prisma.shop.update({
                where: { id: updatedOrder.shopId },
                data: {
                    rating: average,
                    reviews: count
                }
            });
        }

        res.json(updatedOrder);
    } catch (error) {
        handleError(res, error, "Update rating failed");
    }
});

// --- CHAT ROUTES ---

app.get('/api/orders/:orderId/messages', async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        console.log(`[GET Messages] Fetching for order: ${orderId}`);
        const messages = await (prisma as any).messages.findMany({
            where: { order_id: orderId },
            orderBy: { created_at: 'asc' }
        });
        console.log(`[GET Messages] Found ${messages.length} messages`);
        res.json(messages);
    } catch (error) {
        handleError(res, error, "Fetch messages failed");
    }
});

app.post('/api/orders/:orderId/messages', async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { text, sender } = req.body;
        console.log(`[POST Message] Sending for order: ${orderId}, sender: ${sender}`);
        const newMessage = await (prisma as any).messages.create({
            data: {
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                order_id: orderId,
                content: text,
                sender: sender,
            }
        });
        console.log(`[POST Message] Saved: ${newMessage.id}`);
        res.json(newMessage);
    } catch (error) {
        handleError(res, error, "Send message failed");
    }
});

// --- SYSTEM ---

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Export app for Vercel
export default app;

// Start server only if run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helpers to map between DB (snake_case) and client (camelCase)
export function mapOrderFromDb(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    shopId: row.shop_id,
    category: row.category,
    serviceDetail: row.service_detail,
    fileName: row.file_name ?? undefined,
    pickupDate: row.pickup_date,
    pickupTime: row.pickup_time,
    paymentMethod: row.payment_method,
    totalPrice: Number(row.total_price),
    status: row.status,
    rejectionReason: row.rejection_reason ?? undefined,
    rating: row.rating ?? undefined,
    review: row.review ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapOrderToDb(order: any) {
  return {
    id: order.id,
    user_id: order.userId,
    shop_id: order.shopId,
    category: order.category,
    service_detail: order.serviceDetail,
    file_name: order.fileName ?? null,
    pickup_date: order.pickupDate,
    pickup_time: order.pickupTime,
    payment_method: order.paymentMethod,
    total_price: order.totalPrice,
    status: order.status,
    rejection_reason: order.rejectionReason ?? null,
    rating: order.rating ?? null,
    review: order.review ?? null,
    created_at: order.createdAt ?? new Date().toISOString(),
  };
}

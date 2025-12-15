-- Init schema for BeresinAja

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shops (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner text,
  user_id text,
  phone text,
  address text,
  base_price numeric DEFAULT 0,
  rating numeric DEFAULT 0,
  reviews integer DEFAULT 0,
  open_hours text,
  estimated_time text,
  categories text[] DEFAULT '{}',
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text,
  created_by text
);

CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  shop_id text REFERENCES shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  category text,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  shop_id text REFERENCES shops(id) ON DELETE SET NULL,
  category text,
  service_detail jsonb,
  file_name text,
  pickup_date text,
  pickup_time text,
  payment_method text,
  total_price numeric,
  status text DEFAULT 'pending',
  rejection_reason text,
  rating integer,
  review text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders (shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  sender text,
  content text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedules (
  id text PRIMARY KEY,
  shop_id text REFERENCES shops(id) ON DELETE CASCADE,
  date text,
  open_time text,
  close_time text
);

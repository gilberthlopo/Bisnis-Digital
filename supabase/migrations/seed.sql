-- Seed minimal data to match local app

INSERT INTO users (id, name, email, phone, role)
VALUES
  ('admin-001', 'Super Admin', 'admin@beresinaja.com', NULL, 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, phone, role)
VALUES
  ('customer-001', 'Gilberth Lopo', 'gil@gmail.com', '081234567899', 'customer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, phone, role)
VALUES
  ('shop-user-1', 'Sky Thedens', 'tes@skycom.com', '081234567890', 'shop'),
  ('shop-user-2', 'Stevano', 'tes@stevano.com', '081234567891', 'shop'),
  ('shop-user-3', 'Istana FC', 'tes@istana.com', '081234567892', 'shop'),
  ('shop-user-4', 'Bintang', 'tes@bintang.com', '081234567893', 'shop'),
  ('shop-user-5', 'Sitarda', 'tes@sitarda.com', '081234567894', 'shop'),
  ('shop-user-6', 'Anugerah', 'tes@anugerah.com', '081234567895', 'shop')
ON CONFLICT (id) DO NOTHING;

INSERT INTO shops (id, name, owner, user_id, phone, address, base_price, open_hours, estimated_time, categories)
VALUES
  ('shop-1', 'SKYCOM', 'Sky Thedens', 'shop-user-1', '081234567890', 'Jl. Kuanino', 500, '08:00 - 20:00', '1-2 jam', ARRAY['print','typing']),
  ('shop-2', 'Stevano Printing Lanudal', 'Stevano', 'shop-user-2', '081234567891', 'Jl. Lanudal Raya No. 45', 250, '07:00 - 22:00', '30 menit - 1 jam', ARRAY['print','photo','banner','binding']),
  ('shop-3', 'Istana Fotocopy', 'Istana FC', 'shop-user-3', '081234567892', 'Jl. Penfui', 250, '08:00 - 21:00', '30 menit - 1 jam', ARRAY['print','photo','banner','binding']),
  ('shop-4', 'Bintang Jasa', 'Bintang', 'shop-user-4', '081234567893', 'Jl. Penfui', 250, '08:00 - 20:00', '1-2 jam', ARRAY['print','binding']),
  ('shop-5', 'Sitarda Center', 'Sitarda', 'shop-user-5', '081234567894', 'Jl. Sitarda', 250, '08:00 - 21:00', '30 menit - 1 jam', ARRAY['print','photo','binding']),
  ('shop-6', 'Anugerah FotoCopy', 'Anugerah', 'shop-user-6', '081234567895', 'Jl. Bimoku', 250, '07:30 - 22:00', '30 menit - 1 jam', ARRAY['print','photo','binding','scan'])
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, icon, created_by)
VALUES
  ('print', 'Print & Fotocopy', 'printer', 'system'),
  ('typing', 'Jasa Ketik', 'file-text', 'system'),
  ('photo', 'Cetak Pas Foto', 'camera', 'system'),
  ('banner', 'Cetak Baliho / Banner', 'image', 'system'),
  ('binding', 'Penjilidan / Hard Cover', 'book', 'system'),
  ('scan', 'Scan Dokumen', 'file-search', 'system')
ON CONFLICT (id) DO NOTHING;

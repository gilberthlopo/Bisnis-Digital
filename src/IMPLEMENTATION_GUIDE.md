# Panduan Implementasi Fitur Baru - BeresinAja

## Ringkasan Perubahan

Berdasarkan permintaan, berikut adalah fitur-fitur yang akan diimplementasikan:

### 1. **Role Pengguna (Customer)**

#### A. Opsi Jilid dengan Harga Tambahan
- **Tidak Dijilid**: Rp 0 (default)
- **Jilid Biasa**: +Rp 5.000
- **Jilid Buku**: +Rp 20.000

#### B. Paket Layanan dengan Variasi Harga dan Waktu
- **Paket Express (Cepat)**: +50% dari harga normal, prioritas tertinggi
- **Paket Normal (Reguler)**: Harga normal, waktu standar  
- **Paket Economy (Hemat)**: -20% dari harga normal, waktu lebih lama

### 2. **Role Toko (Shop)**

#### A. Waktu Terima Pesanan
- Menampilkan waktu terima pesanan berdasarkan paket:
  - Express: "Segera" atau waktu terima < 1 jam
  - Normal: Waktu terima standar (1-2 jam)
  - Economy: Waktu terima lebih fleksibel (3-4 jam)

#### B. Tambah Layanan Baru
- Tombol "Tambah Layanan" harus berfungsi
- Form untuk menambah custom service dengan:
  - Nama layanan
  - Deskripsi
  - Harga
  - Kategori
  - Status aktif

#### C. Edit Layanan
- Fitur edit layanan yang sudah ada
- Modal/form untuk mengubah detail layanan

### 3. **Role Admin**

#### A. Kelola Kategori
- Admin dapat menambah kategori baru
- Kategori yang ditambahkan admin akan muncul di halaman customer
- Form tambah kategori dengan:
  - Nama kategori
  - Icon/emoji
  - Status

## File yang Akan Dimodifikasi

### 1. `/App.tsx`
✅ **SUDAH SELESAI**
- Menambahkan type `ShopService` 
- Menambahkan property `services` di type `Shop`
- Menambahkan fields baru di `ServiceDetail`: `bindingType`, `deliveryPackage`
- Menambahkan state `categories` yang dapat dikelola
- Menambahkan prop `categories` dan `onUpdateCategories` ke AdminDashboard
- Menambahkan prop `categories` ke CategoryPage
- Menambahkan prop `onUpdateShops` ke ShopDashboard

### 2. `/components/ServiceDetailPage.tsx`
❌ **BELUM DIUPDATE**

Perubahan yang diperlukan:
- Tambah UI untuk opsi jilid (setelah "Jumlah Rangkap")
- Tambah UI untuk pilih paket layanan
- Update fungsi `calculatePrice()` untuk include:
  - Biaya jilid berdasarkan `bindingType`
  - Adjustment harga berdasarkan `deliveryPackage`
- Update tampilan rincian harga

### 3. `/components/CategoryPage.tsx`
❌ **BELUM DIUPDATE**

Perubahan yang diperlukan:
- Terima prop `categories` dari App
- Ganti hardcoded categories array dengan prop
- Tampilkan semua kategori (sistem + yang ditambahkan admin)

### 4. `/components/AdminDashboard.tsx`
❌ **BELUM DIUPDATE**

Perubahan yang diperlukan:
- Terima prop `categories` dan `onUpdateCategories`
- Tambah tab/section baru "Kelola Kategori"
- Implementasi form tambah kategori baru
- Implementasi list & delete kategori (hanya kategori buatan admin)

### 5. `/components/ShopDashboard.tsx`
❌ **BELUM DIUPDATE**

Perubahan yang diperlukan:
- Terima prop `onUpdateShops`
- Tampilkan waktu terima pesanan berdasarkan paket di detail order
- Implementasi form tambah layanan baru (buat functional tombol "Tambah Layanan")
- Implementasi form edit layanan
- Update shop services ke state global

### 6. `/components/PaymentPage.tsx`
❌ **MUNGKIN PERLU UPDATE**

Perubahan yang diperlukan:
- Pastikan kalkulasi harga sudah include:
  - Binding fee
  - Package adjustment
- Update tampilan rincian biaya

## Detail Implementasi

### ServiceDetail Type (Sudah di App.tsx)

```typescript
export type ServiceDetail = {
  paperSize?: string;
  colorType?: string;
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  photoSize?: string;
  isBinding?: boolean;
  bindingType?: 'none' | 'regular' | 'book'; // none = 0, regular = 5000, book = 20000
  deliveryPackage?: 'express' | 'normal' | 'economy'; // express = +50%, normal = base, economy = -20%
};
```

### Kalkulasi Harga Baru

```typescript
const calculatePrice = () => {
  let basePrice = shop.basePrice;
  const pages = serviceDetail.pages || 1;
  const copies = serviceDetail.copies || 1;
  const colorMultiplier = serviceDetail.colorType === 'color' ? 2 : 1;
  
  // Base calculation
  let subtotal = basePrice * pages * copies * colorMultiplier;
  
  // Binding fee
  let bindingFee = 0;
  if (serviceDetail.bindingType === 'regular') {
    bindingFee = 5000;
  } else if (serviceDetail.bindingType === 'book') {
    bindingFee = 20000;
  }
  
  // Package adjustment
  let packageMultiplier = 1;
  if (serviceDetail.deliveryPackage === 'express') {
    packageMultiplier = 1.5; // +50%
  } else if (serviceDetail.deliveryPackage === 'economy') {
    packageMultiplier = 0.8; // -20%
  }
  
  subtotal = subtotal * packageMultiplier;
  
  const adminFee = 1000;
  const total = subtotal + bindingFee + adminFee;
  
  return {
    basePrice,
    pages,
    copies,
    colorMultiplier,
    subtotal,
    bindingFee,
    packageMultiplier,
    adminFee,
    total
  };
};
```

### UI untuk Opsi Jilid (ServiceDetailPage)

```tsx
{/* Opsi Jilid */}
<div className="mb-6">
  <label className="block text-gray-700 mb-3">
    📚 Opsi Jilid
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <button
      type="button"
      onClick={() => setServiceDetail({ ...serviceDetail, bindingType: 'none' })}
      className={`p-5 border-2 rounded-xl transition-all ${
        (serviceDetail.bindingType === 'none' || !serviceDetail.bindingType)
          ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-lg'
          : 'border-gray-300 hover:border-indigo-300'
      }`}
    >
      <div className="text-lg mb-1">📄 Tidak Dijilid</div>
      <div className="text-sm text-gray-600">Gratis</div>
    </button>
    
    <button
      type="button"
      onClick={() => setServiceDetail({ ...serviceDetail, bindingType: 'regular' })}
      className={`p-5 border-2 rounded-xl transition-all ${
        serviceDetail.bindingType === 'regular'
          ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-lg'
          : 'border-gray-300 hover:border-indigo-300'
      }`}
    >
      <div className="text-lg mb-1">📒 Jilid Biasa</div>
      <div className="text-sm text-gray-600">+Rp 5.000</div>
    </button>
    
    <button
      type="button"
      onClick={() => setServiceDetail({ ...serviceDetail, bindingType: 'book' })}
      className={`p-5 border-2 rounded-xl transition-all ${
        serviceDetail.bindingType === 'book'
          ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-lg'
          : 'border-gray-300 hover:border-indigo-300'
      }`}
    >
      <div className="text-lg mb-1">📕 Jilid Buku</div>
      <div className="text-sm text-gray-600">+Rp 20.000</div>
    </button>
  </div>
</div>
```

### UI untuk Paket Layanan (ServiceDetailPage)

```tsx
{/* Paket Layanan */}
<div className="mb-6">
  <label className="block text-gray-700 mb-3">
    🚀 Pilih Paket Layanan
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <button
      type="button"
      onClick={() => setServiceDetail({ ...serviceDetail, deliveryPackage: 'economy' })}
      className={`p-5 border-2 rounded-xl transition-all ${
        serviceDetail.deliveryPackage === 'economy'
          ? 'border-green-500 bg-green-50 text-green-600 shadow-lg'
          : 'border-gray-300 hover:border-green-300'
      }`}
    >
      <div className="text-lg mb-1">🐢 Hemat</div>
      <div className="text-sm text-gray-600 mb-2">Diskon 20%</div>
      <div className="text-xs text-gray-500">Waktu: 3-4 jam</div>
    </button>
    
    <button
      type="button"
      onClick={() => setServiceDetail({ ...serviceDetail, deliveryPackage: 'normal' })}
      className={`p-5 border-2 rounded-xl transition-all ${
        (serviceDetail.deliveryPackage === 'normal' || !serviceDetail.deliveryPackage)
          ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-lg'
          : 'border-gray-300 hover:border-indigo-300'
      }`}
    >
      <div className="text-lg mb-1">🚶 Normal</div>
      <div className="text-sm text-gray-600 mb-2">Harga Standar</div>
      <div className="text-xs text-gray-500">Waktu: 1-2 jam</div>
    </button>
    
    <button
      type="button"
      onClick={() => setServiceDetail({ ...serviceDetail, deliveryPackage: 'express' })}
      className={`p-5 border-2 rounded-xl transition-all ${
        serviceDetail.deliveryPackage === 'express'
          ? 'border-red-500 bg-red-50 text-red-600 shadow-lg'
          : 'border-gray-300 hover:border-red-300'
      }`}
    >
      <div className="text-lg mb-1">⚡ Express</div>
      <div className="text-sm text-gray-600 mb-2">+50% Harga</div>
      <div className="text-xs text-gray-500">Waktu: < 1 jam</div>
    </button>
  </div>
</div>
```

## Status Implementasi

- ✅ App.tsx - Type definitions dan state management
- ❌ ServiceDetailPage.tsx - UI binding & package options
- ❌ CategoryPage.tsx - Dynamic categories
- ❌ AdminDashboard.tsx - Category management
- ❌ ShopDashboard.tsx - Service management & delivery time
- ❌ PaymentPage.tsx - Price calculation update

## Next Steps

1. Update ServiceDetailPage dengan opsi jilid dan paket
2. Update CategoryPage untuk menggunakan dynamic categories
3. Update AdminDashboard dengan kelola kategori
4. Update ShopDashboard dengan kelola layanan dan waktu terima
5. Verify PaymentPage kalkulasi harga
6. Testing end-to-end semua fitur baru

---
**Note**: File ini adalah panduan implementasi. Setelah semua perubahan selesai, file ini dapat dihapus.

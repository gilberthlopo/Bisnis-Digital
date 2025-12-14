import { useState } from "react";
import { Button } from "./ui/button";
import {
  Printer,
  Camera,
  FileText,
  Zap,
  Clock,
  Shield,
  Star,
  ChevronRight,
  CheckCircle2,
  Users,
  Package,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

export function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
    alert("Terima kasih! Pesan Anda telah dikirim.");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                BeresinAja
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors">
                Layanan
              </a>
              <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
                Fitur
              </a>
              <a href="#partners" className="text-gray-300 hover:text-blue-400 transition-colors">
                Mitra
              </a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                Kontak
              </a>
              <Button
                onClick={onNavigateToLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                LOGIN
              </Button>
            </div>
            <Button
              onClick={onNavigateToLogin}
              className="md:hidden bg-blue-600 hover:bg-blue-700 text-white"
            >
              LOGIN
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                <span className="text-blue-400">✨ Platform Percetakan Modern</span>
              </div>
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                BERESINAJA
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  PRINTING SOLUTION
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Platform percetakan dan fotocopy terlengkap di kota Anda. 
                Cetak dokumen, pas foto, banner, hingga baliho dengan mudah dan cepat. 
                Tersedia berbagai pilihan toko terpercaya dengan harga terbaik.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span>Harga Terjangkau</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span>Proses Cepat</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span>Kualitas Terjamin</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={onNavigateToLogin}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
                >
                  MULAI SEKARANG
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-gray-900 bg-white hover:bg-gray-100"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  PELAJARI LEBIH LANJUT
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1613395450289-e560907d9308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVyJTIwb2ZmaWNlfGVufDF8fHx8MTc2NTU5NDE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Printer"
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center transform rotate-12 shadow-lg">
                <div className="text-center transform -rotate-12">
                  <div className="text-3xl">4.9</div>
                  <div className="text-xs text-blue-100">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Layanan yang Kami Sediakan
            </h2>
            <p className="text-gray-400 text-lg">
              Pilih jenis layanan percetakan yang Anda butuhkan
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Printer,
                title: "Print & Fotocopy",
                description: "Cetak dokumen dengan berbagai ukuran kertas dan pilihan warna",
                image: "https://images.unsplash.com/photo-1631016041959-0ed99b85fea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzY1NTk0MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                icon: Camera,
                title: "Cetak Pas Foto",
                description: "Cetak pas foto berbagai ukuran dengan pilihan background",
                image: "https://images.unsplash.com/photo-1666101041092-468eb2818c87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2NvcHklMjBtYWNoaW5lfGVufDF8fHx8MTc2NTU5NDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                icon: FileText,
                title: "Banner & Baliho",
                description: "Cetak banner dan baliho ukuran besar untuk promosi Anda",
                image: "https://images.unsplash.com/photo-1761251943873-38236831318b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHByaW50aW5nfGVufDF8fHx8MTc2NTU5NDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl mb-2">{service.title}</h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Mengapa Memilih BeresinAja?
            </h2>
            <p className="text-gray-400 text-lg">
              Kami menyediakan layanan terbaik untuk kebutuhan percetakan Anda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Proses Cepat",
                description: "Pesanan Anda diproses dengan cepat dan efisien",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: Shield,
                title: "Terpercaya",
                description: "Mitra toko yang sudah terverifikasi dan terpercaya",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Layanan pelanggan siap membantu kapan saja",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Star,
                title: "Kualitas Terbaik",
                description: "Hasil cetak berkualitas tinggi dengan harga terjangkau",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Users, value: "1000+", label: "Pengguna Aktif" },
                { icon: Package, value: "50+", label: "Mitra Toko" },
                { icon: FileText, value: "10K+", label: "Pesanan Selesai" },
                { icon: Star, value: "4.9", label: "Rating Rata-rata" },
              ].map((stat, index) => (
                <div key={index}>
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-white/80" />
                  <div className="text-4xl mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Mitra Toko Terpercaya
            </h2>
            <p className="text-gray-400 text-lg">
              Bekerja sama dengan toko-toko terbaik di kota Anda
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              "SKYCOM",
              "Stevano Printing",
              "Istana Fotocopy",
              "Bintang Jasa",
              "Sitarda Center",
              "Anugerah FC",
              "Express Print",
              "Digital Copy",
            ].map((partner, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    <Printer className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {partner}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">
              Hubungi Kami
            </h2>
            <p className="text-gray-400 text-lg">
              Ada pertanyaan? Jangan ragu untuk menghubungi kami
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Alamat</h3>
                    <p className="text-gray-400">
                      Jl. Kupang - Kota Kupang, NTT
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Telepon</h3>
                    <p className="text-gray-400">+62 812-3456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">Email</h3>
                    <p className="text-gray-400">info@beresinaja.com</p>
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="text-lg mb-4">Ikuti Kami</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, color: "from-blue-600 to-blue-700" },
                      { icon: Instagram, color: "from-pink-600 to-purple-700" },
                      { icon: Twitter, color: "from-sky-600 to-sky-700" },
                      { icon: Youtube, color: "from-red-600 to-red-700" },
                    ].map((social, index) => (
                      <button
                        key={index}
                        className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform`}
                      >
                        <social.icon className="w-5 h-5 text-white" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-300">
                    Pesan
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6"
                >
                  KIRIM PESAN
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 bg-black/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl">beresinaja.</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform percetakan dan fotocopy terlengkap untuk semua kebutuhan Anda.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Print & Fotocopy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Cetak Pas Foto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Banner & Baliho
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Penjilidan
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Mitra Toko
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Karir
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>
              © 2024 BeresinAja. All rights reserved. Made with ❤️ in Kupang, NTT
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
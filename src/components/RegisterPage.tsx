import { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Printer, Eye, EyeOff, Phone, CreditCard } from 'lucide-react';

type RegisterPageProps = {
  onRegister: (userData: { name: string; email: string; password: string; nim?: string; phone?: string; address?: string }) => void;
  onBack: () => void;
};

export function RegisterPage({ onRegister, onBack }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }

    onRegister({
      name,
      email,
      password,
      nim
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Curved Lines Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="curved-lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="0.5" fill="none"/>
              <path d="M0 75 Q 25 50, 50 75 T 100 75" stroke="white" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#curved-lines)" />
        </svg>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-3 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl hover:bg-gray-800/50 hover:border-gray-700 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-gray-300" />
        <span className="text-gray-300">Kembali</span>
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Register Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BeresinAja
              </span>
            </div>

            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl mb-2">CREATE ACCOUNT</h1>
              <p className="text-gray-400">
                Join us today and start printing!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* NIM Input */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  NIM (Opsional)
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Nomor Induk Mahasiswa"
                  className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 3 karakter"
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all pr-12"
                    required
                    minLength={3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    className="w-full px-4 py-3 bg-transparent border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all pr-12"
                    required
                    minLength={3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="text-sm text-gray-400">
                Dengan mendaftar, Anda menyetujui{' '}
                <span className="text-blue-400 hover:underline cursor-pointer">Syarat & Ketentuan</span> kami
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/20 transition-all hover:scale-[1.02] font-semibold"
              >
                Daftar Sekarang
              </button>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Glow Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-30" />
              
              {/* Main Circle */}
              <div className="relative w-[400px] h-[400px] bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                {/* Inner Circle */}
                <div className="w-[360px] h-[360px] bg-[#0A0A0A]/80 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/10">
                  <span className="text-[180px]">🎉</span>
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute top-10 right-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="absolute bottom-10 left-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="absolute top-1/2 -right-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-ping">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

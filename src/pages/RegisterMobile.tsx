import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Store, User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, TrendingUp, Shield, Zap } from "lucide-react";

const RegisterMobile = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const securityQuestions = [
    "Apa nama toko fashion pertama Anda?",
    "Apa nama kota tempat Anda lahir?",
    "Apa nama produk favorit pertama yang Anda jual?",
    "Apa nama sekolah menengah Anda?",
    "Siapa nama desainer fashion favorit Anda?"
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (formData.storeName.length < 3) {
      setError("Nama toko harus minimal 3 karakter");
      return false;
    }
    if (formData.ownerName.length < 3) {
      setError("Nama pemilik harus minimal 3 karakter");
      return false;
    }
    if (!formData.email.includes('@')) {
      setError("Format email tidak valid");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return false;
    }
    if (!formData.securityQuestion) {
      setError("Pilih pertanyaan keamanan");
      return false;
    }
    if (formData.securityAnswer.length < 2) {
      setError("Jawaban keamanan terlalu pendek");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('📝 Starting registration process...');
      
      // Save security Q&A to localStorage
      localStorage.setItem(`security_${formData.email}`, JSON.stringify({
        question: formData.securityQuestion,
        answer: formData.securityAnswer.toLowerCase().trim()
      }));

      console.log('📝 Calling signup function...');
      // Register user
      const success = await signup(
        formData.email,
        formData.password,
        formData.ownerName,
        formData.storeName
      );

      console.log('📝 Signup result:', success);

      if (success) {
        console.log('✅ Registration successful!');
        alert(`Selamat datang, ${formData.ownerName}! Akun ${formData.storeName} berhasil dibuat.`);
        navigate('/dashboard');
      } else {
        console.error('❌ Registration failed');
        setError("Registrasi gagal. Periksa console untuk detail error.");
      }
    } catch (err) {
      console.error('❌ Registration exception:', err);
      setError(`Terjadi kesalahan: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 animate-gradient-shift"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Ultra Premium Card */}
        <div className="relative backdrop-blur-2xl bg-white rounded-3xl shadow-[0_20px_60px_0_rgba(30,58,138,0.3)] border-2 border-blue-900/20 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 pointer-events-none"></div>
          
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white px-6 sm:px-8 py-8 sm:py-10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-400/20 rounded-full translate-y-20 -translate-x-20 blur-3xl"></div>
            {/* Logo Section Premium */}
            <div className="flex flex-col items-center justify-center relative z-10">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                  <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-2xl" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl tracking-tight" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                SKIRO
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full mb-3"></div>
              <p className="text-center text-purple-100 text-xs sm:text-sm font-medium leading-tight tracking-wide" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                
              </p>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-center mt-6 relative z-10" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
              Daftar Akun Baru
            </h2>
            <p className="text-center text-blue-200 text-xs mt-2 relative z-10" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
              Bergabung dengan 500+ UMKM Fashion Sukses
            </p>
          </div>

          {/* Form Section dengan glassmorphism */}
          <div className="relative p-6 sm:p-8 md:p-10">
            {error && (
              <Alert variant="destructive" className="mb-6 backdrop-blur-sm bg-red-50/90 border-red-200/50 animate-shake">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Store Name - Premium Design */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <Label htmlFor="storeName" className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                    <div className="p-1.5 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg shadow-lg">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    Nama Toko Fashion <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Contoh: Butik Elegan"
                    value={formData.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white backdrop-blur-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all duration-300 text-sm font-semibold placeholder:text-gray-400 hover:border-blue-900 shadow-sm"
                    style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    required
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="ownerName" className="text-gray-700 font-semibold text-sm sm:text-base flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                  Nama Pemilik <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={formData.ownerName}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all text-sm sm:text-base md:text-lg"
                  style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-sm sm:text-base flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all text-sm sm:text-base md:text-lg"
                  style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-semibold text-sm sm:text-base flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all text-sm sm:text-base md:text-lg"
                    style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold text-sm sm:text-base flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                  Konfirmasi Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all text-sm sm:text-base md:text-lg"
                    style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-900 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-950" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Keamanan Akun</h3>
                </div>
                
                {/* Security Question */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="securityQuestion" className="text-gray-700 font-semibold text-sm sm:text-base" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                    Pertanyaan Keamanan <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleChange('securityQuestion', value)} required>
                    <SelectTrigger className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl focus:border-blue-950 text-sm sm:text-base md:text-lg" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                      <SelectValue placeholder="Pilih pertanyaan" />
                    </SelectTrigger>
                    <SelectContent>
                      {securityQuestions.map((question, index) => (
                        <SelectItem key={index} value={question} className="text-sm sm:text-base">
                          {question}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Security Answer */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="securityAnswer" className="text-gray-700 font-semibold text-sm sm:text-base" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                    Jawaban <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="securityAnswer"
                    type="text"
                    placeholder="Jawaban untuk reset password"
                    value={formData.securityAnswer}
                    onChange={(e) => handleChange('securityAnswer', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all text-sm sm:text-base md:text-lg"
                    style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    required
                  />
                  <p className="text-xs sm:text-sm text-gray-600 italic">
                    Ingat jawaban ini untuk reset password jika lupa
                  </p>
                </div>
              </div>

              {/* Ultra Premium Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden rounded-xl py-4 text-base font-bold shadow-2xl transition-all duration-300 hover:shadow-blue-900/50 hover:-translate-y-1 mt-6"
                style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-950 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Daftar Sekarang
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </Button>
            </form>

            {/* Login Link dengan modern design */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-500 font-medium" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>atau</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                Sudah punya akun?{" "}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-900 hover:text-blue-950 font-bold hover:underline"
                >
                  Masuk
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterMobile;

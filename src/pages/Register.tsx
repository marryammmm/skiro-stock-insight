import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Store, Mail, Lock, User, TrendingUp, AlertCircle, Shield } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Email tidak valid");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password harus minimal 6 karakter");
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
      setError("Jawaban keamanan harus diisi");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store security question and answer (in real app, this would be securely stored in backend)
      localStorage.setItem(`security_${formData.email}`, JSON.stringify({
        question: formData.securityQuestion,
        answer: formData.securityAnswer.toLowerCase()
      }));

      // Register user
      const success = await signup(
        formData.email,
        formData.password,
        formData.ownerName,
        formData.storeName
      );
      
      if (success) {
        // Show success message
        alert(`Selamat datang, ${formData.ownerName}! Toko "${formData.storeName}" berhasil terdaftar.`);
        navigate('/dashboard');
      } else {
        setError('Email sudah terdaftar');
      }
    } catch (err) {
      setError("Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo & Back to Home */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 mb-6 hover:scale-105 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              SKIRO
            </span>
          </button>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Daftar Sekarang</h2>
            <p className="text-gray-600 text-base">Bergabung dengan ribuan UMKM fashion lainnya</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-800" />
                Nama Toko Fashion
              </Label>
              <Input
                id="storeName"
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="h-12 text-sm border-2 border-gray-200 focus:border-blue-800 rounded-xl transition-all"
                placeholder="Contoh: Butik Elegan"
                required
              />
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-800" />
                Nama Pemilik
              </Label>
              <Input
                id="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                className="h-12 text-sm border-2 border-gray-200 focus:border-blue-800 rounded-xl transition-all"
                placeholder="Nama lengkap Anda"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-800" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-12 text-sm border-2 border-gray-200 focus:border-blue-800 rounded-xl transition-all"
                placeholder="hanxie@gmail.com"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-800" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="h-12 text-sm border-2 border-gray-200 focus:border-blue-800 rounded-xl pr-10 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold text-sm">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="h-12 text-sm border-2 border-gray-200 focus:border-blue-800 rounded-xl pr-10 transition-all"
                    placeholder="Ulangi password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Question Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-800" />
                <h3 className="text-sm font-bold text-blue-900">Keamanan Akun</h3>
              </div>
              <p className="text-xs text-gray-700 mb-4">
                Pertanyaan keamanan akan digunakan untuk reset password jika Anda lupa
              </p>

              <div className="space-y-2">
                <Label htmlFor="securityQuestion" className="text-gray-700 font-semibold text-sm">
                  Pertanyaan Keamanan
                </Label>
                <Select value={formData.securityQuestion} onValueChange={(value) => handleChange('securityQuestion', value)}>
                  <SelectTrigger className="h-12 text-sm border-2 border-blue-200 rounded-xl">
                    <SelectValue placeholder="Pilih pertanyaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions.map((question, index) => (
                      <SelectItem key={index} value={question} className="text-sm py-3">
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityAnswer" className="text-gray-700 font-semibold text-sm">
                  Jawaban
                </Label>
                <Input
                  id="securityAnswer"
                  type="text"
                  value={formData.securityAnswer}
                  onChange={(e) => handleChange('securityAnswer', e.target.value)}
                  className="h-12 text-sm border-2 border-blue-200 focus:border-blue-800 rounded-xl"
                  placeholder="Jawaban untuk reset password"
                  required
                  disabled={!formData.securityQuestion}
                />
                <p className="text-xs text-gray-600 mt-1">
                  💡 Ingat jawaban ini untuk reset password jika lupa
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-semibold">{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 rounded-xl shadow-lg transform transition-all hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mendaftar...
                </div>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Sudah punya akun?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-800 hover:text-blue-900 font-bold hover:underline transition-all"
              >
                Masuk
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

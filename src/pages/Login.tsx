import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Lock, Mail, TrendingUp, AlertCircle, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'question' | 'reset'>('email');
  const [securityQuestion, setSecurityQuestion] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try to login
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError("Login gagal. Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (forgotStep === 'email') {
        // Simulate fetching security question
        setSecurityQuestion("Apa nama toko fashion pertama Anda?");
        setForgotStep('question');
      } else if (forgotStep === 'question') {
        // Validate security answer
        if (securityAnswer.trim().length < 2) {
          setError("Jawaban keamanan tidak valid");
          setLoading(false);
          return;
        }
        setForgotStep('reset');
      } else if (forgotStep === 'reset') {
        // Reset password
        setError("");
        alert("Password berhasil direset! Silakan cek email Anda untuk password baru.");
        setShowForgotPassword(false);
        setForgotStep('email');
        setSecurityAnswer("");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <button
            onClick={() => {
              setShowForgotPassword(false);
              setForgotStep('email');
              setError("");
            }}
            className="flex items-center gap-2 text-blue-800 hover:text-blue-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali ke Login</span>
          </button>

          {/* Forgot Password Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Lupa Password?</h2>
            <p className="text-gray-600 text-sm">
                {forgotStep === 'email' && "Masukkan email Anda untuk reset password"}
                {forgotStep === 'question' && "Jawab pertanyaan keamanan"}
                {forgotStep === 'reset' && "Password baru akan dikirim ke email Anda"}
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {forgotStep === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-gray-700 font-semibold text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-800 rounded-xl"
                      placeholder="Email Anda"
                      required
                    />
                  </div>
                </div>
              )}

              {forgotStep === 'question' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-2">Pertanyaan Keamanan:</p>
                    <p className="text-base font-bold text-blue-900">{securityQuestion}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="security-answer" className="text-gray-700 font-semibold text-sm">Jawaban Anda</Label>
                    <Input
                      id="security-answer"
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-800 rounded-xl"
                      placeholder="Masukkan jawaban"
                      required
                    />
                  </div>
                </div>
              )}

              {forgotStep === 'reset' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-base font-bold text-green-900 mb-2">Verifikasi Berhasil!</p>
                  <p className="text-gray-700 text-sm">Password baru akan segera dikirim ke email Anda.</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="border-2">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-semibold">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 rounded-xl shadow-lg transform transition-all hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  <>
                    {forgotStep === 'email' && "Lanjutkan"}
                    {forgotStep === 'question' && "Verifikasi"}
                    {forgotStep === 'reset' && "Kirim Password Baru"}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Masuk</h2>
            <p className="text-gray-600 text-base">Selamat datang kembali!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-800 rounded-xl transition-all"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base border-2 border-gray-200 focus:border-blue-800 rounded-xl transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-800 hover:text-blue-900 font-semibold text-sm hover:underline transition-all"
              >
                Lupa Password?
              </button>
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
                  Memproses...
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Belum punya akun?{" "}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-800 hover:text-blue-900 font-bold hover:underline transition-all"
              >
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

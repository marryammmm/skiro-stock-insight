import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Lock, Mail, TrendingUp, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

const LoginMobile = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
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

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setError("Masukkan email Anda");
      return;
    }

    const securityData = localStorage.getItem(`security_${forgotEmail}`);
    
    if (!securityData) {
      setError("Email tidak ditemukan. Silakan daftar terlebih dahulu.");
      return;
    }

    const { question } = JSON.parse(securityData);
    setSecurityQuestion(question);
    setForgotStep('question');
    setError("");
  };

  const handleVerifyAnswer = () => {
    const securityData = localStorage.getItem(`security_${forgotEmail}`);
    
    if (!securityData) {
      setError("Data keamanan tidak ditemukan");
      return;
    }

    const { answer } = JSON.parse(securityData);
    
    if (securityAnswer.toLowerCase().trim() === answer) {
      setForgotStep('reset');
      setError("");
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep('email');
        setEmail(forgotEmail);
        setPassword("");
      }, 3000);
    } else {
      setError("Jawaban salah. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 animate-gradient-shift"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Premium Glassmorphism Card */}
        <div className="relative backdrop-blur-2xl bg-white rounded-3xl shadow-[0_20px_60px_0_rgba(30,58,138,0.3)] border-2 border-blue-900/20 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>
          
          {/* Header dengan modern design */}
          <div className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white px-6 sm:px-8 py-8 sm:py-10">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full translate-y-20 -translate-x-20 blur-3xl"></div>
            {/* Logo dengan effect premium */}
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
              <p className="text-center text-blue-100 text-xs sm:text-sm font-medium leading-tight tracking-wide" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                
              </p>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-center mt-6 relative z-10">
              {!showForgotPassword ? 'Selamat Datang Kembali!' : 'Lupa Password?'}
            </h2>
          </div>

          {/* Form Section dengan glassmorphism */}
          <div className="relative p-6 sm:p-8 md:p-10">
            {error && (
              <Alert variant="destructive" className="mb-6 backdrop-blur-sm bg-red-50/90 border-red-200/50 animate-shake">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {!showForgotPassword ? (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Field dengan modern design */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <Label htmlFor="email" className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                        <div className="p-1.5 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg">
                          <Mail className="w-3.5 h-3.5 text-white" />
                        </div>
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white backdrop-blur-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all duration-300 text-sm placeholder:text-gray-400 hover:border-blue-900 shadow-sm"
                          style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Field dengan modern design */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <Label htmlFor="password" className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
                        <div className="p-1.5 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg">
                          <Lock className="w-3.5 h-3.5 text-white" />
                        </div>
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3.5 pr-12 bg-white backdrop-blur-sm border-2 border-blue-900/20 rounded-xl focus:border-blue-950 focus:ring-4 focus:ring-blue-900/20 transition-all duration-300 text-sm placeholder:text-gray-400 hover:border-blue-900 shadow-sm"
                          style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100/80 transition-colors"
                        >
                          {showPassword ? 
                            <EyeOff className="w-4 h-4 text-gray-600" /> : 
                            <Eye className="w-4 h-4 text-gray-600" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-900 hover:text-blue-950 font-medium text-xs sm:text-sm hover:underline"
                    >
                      Lupa Password?
                    </button>
                  </div>

                  {/* Premium Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group overflow-hidden rounded-xl py-4 text-base font-bold shadow-2xl transition-all duration-300 hover:shadow-blue-900/50 hover:-translate-y-1"
                    style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-950 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Memproses...
                        </>
                      ) : (
                        <>
                          Masuk
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </Button>
                </form>

                {/* Register Link dengan modern design */}
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
                    Belum punya akun?{" "}
                    <button
                      onClick={() => navigate('/register')}
                      className="text-blue-900 hover:text-blue-950 font-bold hover:underline"
                    >
                      Daftar Sekarang
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Forgot Password Flow */}
                {forgotStep === 'email' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="forgot-email" className="text-gray-700 font-semibold text-sm sm:text-base" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Masukkan email Anda"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg"
                        style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                        required
                      />
                    </div>
                    <Button
                      onClick={handleForgotPassword}
                      className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white text-base sm:text-lg font-bold px-8 sm:px-12 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:from-blue-900 hover:to-black transition-all"
                      style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    >
                      Lanjutkan
                    </Button>
                    <Button
                      onClick={() => setShowForgotPassword(false)}
                      variant="outline"
                      className="w-full border-2 border-blue-900 text-blue-950 text-base sm:text-lg font-semibold px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-blue-900 hover:text-white transition-all"
                      style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    >
                      Kembali
                    </Button>
                  </div>
                )}

                {forgotStep === 'question' && (
                  <div className="space-y-4 sm:space-y-6">
                    <Alert className="bg-blue-50 border-blue-200">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      <AlertDescription className="text-sm sm:text-base">
                        Jawab pertanyaan keamanan Anda
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-gray-700 font-semibold text-sm sm:text-base" style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>{securityQuestion}</Label>
                      <Input
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        placeholder="Jawaban Anda"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-blue-900/20 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg"
                        style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                      />
                    </div>
                    <Button
                      onClick={handleVerifyAnswer}
                      className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white text-base sm:text-lg font-bold px-8 sm:px-12 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:from-blue-900 hover:to-black transition-all"
                      style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    >
                      Verifikasi
                    </Button>
                    <Button
                      onClick={() => setForgotStep('email')}
                      variant="outline"
                      className="w-full border-2 border-blue-900 text-blue-950 text-base sm:text-lg font-semibold px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl hover:bg-blue-900 hover:text-white transition-all"
                      style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    >
                      Kembali
                    </Button>
                  </div>
                )}

                {forgotStep === 'reset' && (
                  <div className="space-y-4 sm:space-y-6">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <AlertDescription className="text-sm sm:text-base text-green-800">
                        Password Anda telah direset. Silakan login dengan password baru.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotStep('email');
                      }}
                      className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white text-base sm:text-lg font-bold px-8 sm:px-12 py-5 sm:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:from-blue-900 hover:to-black transition-all"
                      style={{fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}
                    >
                      Kembali ke Login
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default LoginMobile;

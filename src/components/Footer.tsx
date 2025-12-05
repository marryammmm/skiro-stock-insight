import { TrendingUp, Mail, Phone, MapPin, Shield, Zap, BarChart3, MessageSquare, Calculator, FileText } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100 border-t border-slate-200">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
      
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">SKIRO</span>
                <p className="text-xs text-slate-500 font-medium">Kami ada untuk UMKM anda</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Platform analisis stok berbasis AI yang membantu UMKM pakaian mengelola inventaris dengan lebih cerdas, 
              mengurangi deadstock, dan meningkatkan profitabilitas.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-slate-700">Trusted for UMKM Indonesia</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Produk & Fitur
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#analisis" className="group flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors text-sm">
                  <BarChart3 className="w-3.5 h-3.5 group-hover:text-blue-600" />
                  Analisis Data Penjualan
                </a>
              </li>
              <li>
                <a href="#konsultan" className="group flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors text-sm">
                  <MessageSquare className="w-3.5 h-3.5 group-hover:text-blue-600" />
                  AI Konsultan Bisnis
                </a>
              </li>
              <li>
                <a href="#kalkulator" className="group flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors text-sm">
                  <Calculator className="w-3.5 h-3.5 group-hover:text-blue-600" />
                  Kalkulator Harga
                </a>
              </li>
              <li>
                <a href="#laporan" className="group flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors text-sm">
                  <FileText className="w-3.5 h-3.5 group-hover:text-blue-600" />
                  Laporan Analisis
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4">Perusahaan</h3>
            <ul className="space-y-3">
              <li>
                <a href="#tentang" className="text-slate-600 hover:text-blue-700 transition-colors text-sm hover:translate-x-1 inline-block">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#fitur" className="text-slate-600 hover:text-blue-700 transition-colors text-sm hover:translate-x-1 inline-block">
                  Fitur & Layanan
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-600 hover:text-blue-700 transition-colors text-sm hover:translate-x-1 inline-block">
                  FAQ & Bantuan
                </a>
              </li>
              <li>
                <a href="#blog" className="text-slate-600 hover:text-blue-700 transition-colors text-sm hover:translate-x-1 inline-block">
                  Blog & Artikel
                </a>
              </li>
              <li>
                <a href="#karir" className="text-slate-600 hover:text-blue-700 transition-colors text-sm hover:translate-x-1 inline-block">
                  Karir
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-4">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Email</p>
                    <a href="mailto:support@skiro.id" className="text-sm text-slate-700 hover:text-blue-700 font-medium">
                      supportskiro.id
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Telepon</p>
                    <a href="tel:+6281234567890" className="text-sm text-slate-700 hover:text-blue-700 font-medium">
                      +62 877-1079-3375
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-whiteroup-hover:bg-purple-100 flex items-center justify-center flex-shrink-0 transition-colors">
                 
                  </div>
                  <div>
                  
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

       

        {/* Bottom Bar */}
        <div className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-600 text-sm font-medium">
                © {currentYear} <span className="font-bold text-slate-900">SKIRO</span>. All rights reserved.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#privacy" className="text-slate-600 hover:text-blue-700 transition-colors font-medium">
              
              </a>
              <a href="#terms" className="text-slate-600 hover:text-blue-700 transition-colors font-medium">
            
              </a>
              <a href="#cookies" className="text-slate-600 hover:text-blue-700 transition-colors font-medium">
                
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
    </footer>
  );
};

export default Footer;

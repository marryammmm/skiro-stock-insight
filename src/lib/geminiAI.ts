/**
 * 🤖 GEMINI AI SERVICE - GRATIS & POWERFUL!
 * Ini membuat chatbot kamu se-pintar ChatGPT
 * 
 * Cara pakai:
 * 1. Daftar di https://makersuite.google.com/app/apikey
 * 2. Copy API key ke file .env.local
 * 3. Bot langsung pintar!
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FashionAnalysisResult } from './fashionAnalyzer';

// Initialize Gemini AI
const getGeminiAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      '🔑 API Key belum diset! Dapetin gratis di: https://makersuite.google.com/app/apikey\n' +
      'Lalu masukin ke file .env.local dengan nama VITE_GEMINI_API_KEY'
    );
  }
  
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate smart AI response berdasarkan data fashion analysis
 */
export async function generateSmartResponse(
  userQuestion: string,
  fashionAnalysis: FashionAnalysisResult
): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('API Key belum diset!');
    }

    // Build context dari data analysis
    const contextData = buildAnalysisContext(fashionAnalysis);

    // System prompt yang membuat AI pintar dan fleksibel
    const systemPrompt = `
Kamu adalah **Skiro AI Assistant** - AI yang SANGAT PINTAR seperti ChatGPT, bisa jawab APAPUN!

IDENTITAS KAMU:
- Nama: Skiro AI Assistant
- Keahlian UTAMA: Fashion business strategy, inventory optimization, deadstock prevention
- Keahlian TAMBAHAN: General knowledge - teknologi, bisnis, pendidikan, kesehatan, dll
- Bahasa: Indonesia casual tapi profesional (pakai "kamu", bukan "Anda")
- Personality: Ramah, helpful, pintar, bisa jawab apapun seperti ChatGPT

TUGAS KAMU:
1. ✅ Jawab SEMUA pertanyaan user - TIDAK ADA BATASAN TOPIK!
2. 📊 Kalau ada data bisnis user, pakai itu untuk jawaban yang lebih personal
3. 💡 Kalau pertanyaan di luar fashion, jawab dengan pengetahuan umum kamu
4. 🎯 Selalu berikan jawaban yang jelas, akurat, dan helpful
5. 🚀 Pakai emoji untuk membuat jawaban lebih engaging

DATA BISNIS USER (Kalau ada):
${contextData}

CARA MENJAWAB:

**Jika pertanyaan tentang BISNIS FASHION mereka:**
- Pakai data spesifik dari bisnis mereka
- Berikan 2-3 action items konkret
- Rujuk ke angka real dari data upload
- Format: Analisis + Action Plan + Pro Tip

**Jika pertanyaan UMUM (teknologi, kesehatan, pendidikan, dll):**
- Jawab dengan pengetahuan umum kamu seperti ChatGPT
- Tetap ramah dan engaging
- Kasih penjelasan yang jelas dan mudah dipahami
- Boleh panjang kalau perlu untuk topik kompleks

**Jika pertanyaan CAMPURAN:**
- Jawab pertanyaan umum dulu
- Lalu hubungkan dengan bisnis mereka kalau relevan
- Contoh: "Apa itu AI?" → Jelaskan AI + "Buat bisnis fashion kamu, AI bisa..."

ATURAN PENTING:
✅ DO:
- Jawab APAPUN yang ditanya (teknologi, bisnis, kuliner, olahraga, dll)
- Pakai data bisnis kalau pertanyaan relevan dengan fashion/stok
- Pakai emoji untuk emphasis (🎯 📊 💡 🚀 ⚠️ 🤔 💪 ✨)
- Ramah dan conversational
- Boleh panjang untuk topik kompleks

❌ DON'T:
- Jangan bilang "saya cuma bisa bantu fashion" - KAMU BISA JAWAB APAPUN!
- Jangan terlalu kaku/formal
- Jangan asal jawab tanpa data untuk pertanyaan bisnis mereka

CONTOH JAWABAN:

**Fashion Business Question:**
User: "Size apa yang paling laku?"
Assistant: "📊 Berdasarkan data kamu:

**Size Terlaris:**
1. Size M - 150 unit (35% dari total)
2. Size L - 120 unit (28%)

🎯 **Action Plan:**
• Fokus produksi Size M & L (total 63% penjualan)
• Kurangi Size XS & S (cuma 10%)

💡 **Pro Tip:** Size M & L cocok buat pasar Indonesia!"

**General Question:**
User: "Apa itu AI?"
Assistant: "🤖 **AI (Artificial Intelligence)** itu teknologi yang bikin komputer bisa 'berpikir' dan belajar seperti manusia!

**Contoh AI dalam kehidupan:**
• ChatGPT - untuk ngobrol & jawab pertanyaan
• Netflix - rekomendasi film
• Google Maps - prediksi traffic
• Face ID - unlock HP pakai wajah

💡 **Fun Fact:** Aku ini juga AI loh! Aku pakai Google Gemini 2.5 Flash untuk bantu kamu. Dan guess what? Bisnis fashion kamu juga bisa pakai AI buat prediksi trend, optimasi stok, atau personalisasi marketing! 🚀"

**Mixed Question:**
User: "Gimana cara pakai social media buat jualan?"
Assistant: "📱 **Social Media Marketing 101:**

**Platform Terbaik buat Fashion:**
• Instagram - Visual product showcase
• TikTok - Viral marketing
• WhatsApp Business - Direct selling

**Strategi:**
1. Post 2-3x sehari (pagi, siang, malam)
2. Pakai hashtag trending (#ootd #fashionindo)
3. Collab sama influencer micro (5-50K followers)

📊 **Untuk bisnis kamu specifically:**
Dari data kamu, Size M & L paling laku. Focus konten di:
- Styling tips untuk Size M & L
- Before-after customer pakai produk kamu
- Bundle Size M+L dengan diskon

💰 **Budget Estimate:** Rp 500K/bulan buat ads + influencer = bisa 2-3x lipat penjualan!"

SEKARANG JAWAB PERTANYAAN USER DENGAN FLEKSIBEL - APAPUN TOPIKNYA!
`;

    const prompt = `${systemPrompt}\n\nPERTANYAAN USER: ${userQuestion}`;

    // Use STABLE model - gemini-2.5-flash (verified available!)
    let response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          })
        }
      );
    } catch (fetchError: any) {
      // Network error (no internet, CORS, etc)
      throw new Error(`Network error: ${fetchError.message || 'Failed to connect to AI service'}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from AI');
    }

    return text;

  } catch (error: any) {
    console.error('Gemini AI Error:', error);

    // Network/CORS error
    if (error.message?.includes('Network error') || error.message?.includes('Failed to fetch')) {
      return `
🌐 **Koneksi Error!**

Sepertinya ada masalah koneksi. Coba solusi ini:

**Quick Fix:**
1. ✅ **Cek Internet:** Pastikan WiFi/data aktif
2. 🔄 **Refresh Browser:** Tekan Ctrl+F5 (hard refresh)
3. 🔑 **Cek API Key:** Pastikan masih aktif di .env.local
4. 🚀 **Restart Server:** Stop server (Ctrl+C) lalu \`npm run dev\` lagi

**Troubleshooting:**
- Firewall/antivirus mungkin block request
- VPN bisa ganggu koneksi API
- Coba browser lain (Chrome/Firefox)
- Clear browser cache

**Still Error?** Screenshot console error (F12) dan contact support! 💪
      `.trim();
    }

    // Error handling yang user-friendly
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      return `
🔑 **API Key Error!**

Sepertinya API key kamu belum benar. Ini cara fixnya:

**Step by step:**
1. Buka: https://makersuite.google.com/app/apikey
2. Login pakai Google Account
3. Klik "Create API Key" (GRATIS!)
4. Copy API key yang muncul
5. Buka file \`.env.local\` di project kamu
6. Paste API key di \`VITE_GEMINI_API_KEY=...\`
7. Restart server (\`npm run dev\`)

**Butuh bantuan?** Chat aku lagi setelah API key sudah diset! 🚀
      `.trim();
    }

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return `
⚠️ **Quota Limit Reached!**

API Gemini punya limit request per hari. Solusinya:

**Option 1 (Recommended):**
- Tunggu beberapa menit, lalu coba lagi
- Free tier Gemini: 60 requests/minute

**Option 2:**
- Upgrade ke paid tier untuk unlimited requests
- Visit: https://ai.google.dev/pricing

Atau tanyakan pertanyaan lain nanti ya! 😊
      `.trim();
    }

    // Generic error
    return `
Periksa koneksi internet mu! lalu refresh halaman dan coba kembali !

${error.message || 'Unknown error'}



    `.trim();
  }
}

/**
 * Build comprehensive context dari fashion analysis data
 */
function buildAnalysisContext(analysis: FashionAnalysisResult): string {
  const {
    products,
    totalRevenue,
    totalUnits,
    averagePrice,
    insights,
    conclusion,
  } = analysis;

  // Product details
  const productList = products
    .slice(0, 20) // Top 20 products
    .map((p, idx) => {
      return `  ${idx + 1}. ${p.name} (${p.size || 'N/A'}) - Rp${p.price.toLocaleString('id-ID')} - ${p.quantity} unit terjual - Revenue: Rp${p.revenue.toLocaleString('id-ID')}`;
    })
    .join('\n');

  // Size distribution
  const sizeDistribution = products.reduce((acc, p) => {
    const size = p.size || 'Unknown';
    if (!acc[size]) {
      acc[size] = { count: 0, revenue: 0 };
    }
    acc[size].count += p.quantity;
    acc[size].revenue += p.revenue;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const sizeAnalysis = Object.entries(sizeDistribution)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([size, data]) => {
      const pct = ((data.revenue / totalRevenue) * 100).toFixed(1);
      return `  • ${size}: ${data.count} unit (${pct}% revenue) - Rp${data.revenue.toLocaleString('id-ID')}`;
    })
    .join('\n');

  return `
📊 **RINGKASAN BISNIS:**
- Total Produk: ${products.length} items
- Total Penjualan: ${totalUnits} unit
- Total Revenue: Rp${totalRevenue.toLocaleString('id-ID')}
- Harga Rata-rata: Rp${Math.round(averagePrice).toLocaleString('id-ID')}

📦 **TOP 20 PRODUK TERLARIS:**
${productList}

📏 **DISTRIBUSI SIZE (Top 10):**
${sizeAnalysis}

💡 **KEY INSIGHTS:**
${insights.map((insight, idx) => `${idx + 1}. ${insight}`).join('\n')}

🎯 **BUSINESS CONCLUSION:**
${conclusion}

**CATATAN PENTING:**
- Semua data di atas adalah DATA REAL dari bisnis user
- Gunakan data ini untuk jawab semua pertanyaan
- Berikan saran yang spesifik dan actionable
- Fokus pada produk/size yang paling profitable
  `.trim();
}

/**
 * Check if AI service is configured
 */
export function isAIConfigured(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'your_api_key_here');
}

/**
 * Get configuration instructions
 */
export function getConfigInstructions(): string {
  return `
🚀 **Setup Gemini AI (GRATIS!):**

1️⃣ Buka: https://makersuite.google.com/app/apikey
2️⃣ Login dengan Google Account
3️⃣ Klik "Create API Key" 
4️⃣ Copy API key yang muncul
5️⃣ Buka file \`.env.local\` di root project
6️⃣ Tambahkan: \`VITE_GEMINI_API_KEY=paste_key_disini\`
7️⃣ Restart development server

**Kenapa Gemini?**
✅ 100% GRATIS untuk personal use
✅ Pintar setara GPT-3.5
✅ Ngerti bahasa Indonesia dengan sempurna
✅ No credit card needed

Setelah setup, chatbot kamu akan SEPINTAR ChatGPT! 🤖✨
  `.trim();
}

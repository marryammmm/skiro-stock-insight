import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, MessageCircle, Send, AlertCircle, Sparkles } from 'lucide-react';
import type { FashionAnalysisResult } from '@/lib/fashionAnalyzer';
import { generateSmartResponse, isAIConfigured, getConfigInstructions } from '@/lib/geminiAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SmartChatConsultantProps {
  fashionAnalysis: FashionAnalysisResult;
}

const SmartChatConsultant: React.FC<SmartChatConsultantProps> = ({ 
  fashionAnalysis
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isAIConfigured()
        ? 'Halo! Saya adalah **Skiro AI Assistant** \n\n Silakan ketik pertanyaan mu atau pilih pertanyaan cepat yang telah saya sediakan !'
        : `⚠️ **AI Belum Aktif!**\n\n${getConfigInstructions()}\n\nSetelah setup, chatbot ini akan SEPINTAR ChatGPT dan bisa jawab semua pertanyaan bisnis fashion kamu! 🤖✨`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: '📏 Size mana yang paling laku?', question: 'Size apa yang paling banyak terjual di data saya?' },
    { label: '🏆 Produk terlaris?', question: 'Produk fashion apa yang paling laku?' },
    { label: '⚠️ Produk risiko deadstock?', question: 'Produk mana yang berisiko deadstock tinggi?' },
    { label: '📦 Rekomendasi stok?', question: 'Produk mana yang stoknya harus ditambah atau dikurangi?' },
    { label: '🎯 Cara kurangi deadstock?', question: 'Bagaimana strategi terbaik untuk mengurangi deadstock?' },
    { label: '💰 Cara tingkatkan revenue?', question: 'Bagaimana cara meningkatkan revenue bisnis fashion?' },
    { label: '📉 Produk harus didiskon?', question: 'Produk mana yang sebaiknya diberi diskon atau clearance sale?' },
    { label: '💡 Strategi size optimization?', question: 'Bagaimana strategi untuk optimasi size produk yang diproduksi?' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check if AI is configured
    if (!isAIConfigured()) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🔑 **Setup API Key dulu ya!**\n\n${getConfigInstructions()}\n\nSetelah setup, chat lagi dan aku akan jawab semua pertanyaan kamu! 🚀`,
        },
      ]);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call REAL AI service
      const aiResponse = await generateSmartResponse(inputValue, fashionAnalysis);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponse,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ **Error:** ${error.message}\n\nCoba lagi atau cek koneksi internet kamu! 🙏`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (question: string) => {
    if (!isAIConfigured()) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🔑 **Setup API Key dulu ya!**\n\n${getConfigInstructions()}`,
        },
      ]);
      return;
    }

    const userMessage: Message = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await generateSmartResponse(question, fashionAnalysis);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponse,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ **Error:** ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadChat = () => {
    const chatContent = messages.map((msg, idx) => {
      const role = msg.role === 'user' ? '👤 USER' : '🤖 AI FASHION CONSULTANT';
      return `${role}:\n${msg.content}\n\n${'='.repeat(60)}\n`;
    }).join('\n');

    const fullContent = `
╔════════════════════════════════════════════════════════════╗
║        SKIRO FASHION CONSULTANT - CHAT HISTORY           ║
║       Smart Fashion Business Consultation Report          ║
╚════════════════════════════════════════════════════════════╝

Date: ${new Date().toLocaleString('id-ID')}
Total Messages: ${messages.length}

${'='.repeat(60)}

${chatContent}

╔════════════════════════════════════════════════════════════╗
║           Generated by Skiro Deadstock Prevention         ║
║           Your Fashion Business Intelligence 🚀           ║
╚════════════════════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skiro-fashion-consultation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      {/* Blue Header seperti gambar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                Skiro AI Assistant 
                {isAIConfigured() && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAIConfigured() ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
                <span className="text-white/90 text-xs sm:text-sm">
                  {isAIConfigured() ? 'Online' : 'Setup Required'}
                </span>
              </div>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadChat}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* AI Status Alert */}
      {!isAIConfigured() && (
        <Alert className="m-3 sm:m-4 border-orange-300 bg-orange-50">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
          <AlertDescription className="text-orange-900 text-xs sm:text-sm">
            <strong>🔑 AI belum aktif!</strong> Setup API key untuk aktivasi chatbot pintar (gratis!).
            Lihat instruksi di chat.
          </AlertDescription>
        </Alert>
      )}

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Quick Action Buttons */}
        <div className="border-b bg-slate-50 px-3 sm:px-4 py-2.5 sm:py-3">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-700 mb-2">⚡ Pertanyaan Cepat:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {quickActions.slice(0, 4).map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                className="text-[11px] sm:text-xs px-2.5 py-1.5 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
                onClick={() => handleQuickAction(action.question)}
                disabled={isLoading}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages Area */}
        <ScrollArea ref={scrollRef} className="flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-white">
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-sm px-4 sm:px-5 py-3 sm:py-4">
                      <div className="text-xs sm:text-sm leading-relaxed text-slate-800 space-y-2">
                        {message.content.split('\n').map((line, i) => {
                          // Format bold text
                          const formattedLine = line
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-900 font-bold">$1</strong>')
                            .replace(/__(.*?)__/g, '<strong class="text-blue-900 font-bold">$1</strong>');
                          
                          return (
                            <React.Fragment key={i}>
                              {line.trim() ? (
                                <p dangerouslySetInnerHTML={{ __html: formattedLine }} />
                              ) : (
                                <br />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {message.role === 'user' && (
                  <div className="bg-blue-700 text-white rounded-2xl rounded-tr-sm px-4 sm:px-5 py-2.5 sm:py-3 max-w-[75%]">
                    <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-sm px-4 sm:px-5 py-2.5 sm:py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-white px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Tanyakan sesuatu..."
              disabled={isLoading}
              className="flex-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-700 hover:bg-blue-800 px-4 sm:px-6"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartChatConsultant;

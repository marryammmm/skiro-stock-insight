import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 1200);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      {/* Background */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #020617 0%, #0c1844 50%, #020617 100%)',
            }}
          >
            {/* Subtle animated gradient mesh */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(96, 165, 250, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 20%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)
                `,
                backgroundSize: '200% 200%',
              }}
            />

            {/* Minimal grid overlay */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(96, 165, 250, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(96, 165, 250, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />

            {/* Center glow effect */}
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                filter: 'blur(80px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKIRO Text - Iconic & Professional - RESPONSIVE */}
      <motion.h1
        className="fixed font-black z-[9999] select-none"
        initial={{ 
          top: '50%', 
          left: '50%', 
          x: '-50%', 
          y: '-50%',
          fontSize: 'clamp(40px, 12vw, 120px)', // Responsive font size - lebih kecil untuk mobile
          scale: 0.8,
          opacity: 0
        }}
        animate={isExiting ? {
          top: window.innerWidth < 768 ? '18px' : '22px', // Adjust for mobile
          left: window.innerWidth < 768 ? '16px' : '140px', // Adjust position for mobile
          x: '0%',
          y: '0%',
          fontSize: window.innerWidth < 768 ? '18px' : '24px', // Smaller on mobile
          scale: 1,
          opacity: 1
        } : {
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          fontSize: 'clamp(40px, 12vw, 120px)', // Responsive font size - lebih kecil untuk mobile
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: isExiting ? 1.2 : 1.5,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 900,
          letterSpacing: window.innerWidth < 768 ? '0.05em' : '0.08em', // Less spacing on mobile
          color: isExiting ? '#1e3a8a' : '#ffffff',
          textShadow: isExiting 
            ? 'none' 
            : '0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.5)',
          WebkitTextStroke: isExiting ? 'none' : '1px rgba(96, 165, 250, 0.3)',
        }}
      >
        {['S', 'K', 'I', 'R', 'O'].map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            transition={{
              duration: 1.2,
              delay: 0.3 + index * 0.15,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="inline-block"
            style={{
              transformOrigin: 'center',
            }}
          >
            <motion.span
              className="inline-block"
              animate={!isExiting ? {
                y: [0, -8, 0],
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            >
              {letter}
            </motion.span>
          </motion.span>
        ))}
      </motion.h1>

      {/* Loading indicator - Di bawah tulisan SKIRO */}
      {!isExiting && (
        <motion.div 
          className="fixed z-[9998] flex justify-center items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 1.2 }}
          style={{
            top: 'calc(50% + clamp(60px, 12vw, 100px))',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Tagline - Professional touch - RESPONSIVE */}
      {!isExiting && (
        <motion.div
          className="fixed z-[9998] text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 1.2 }}
          style={{
            top: 'calc(50% + clamp(90px, 15vw, 140px))', // Lebih bawah dari loading
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '600px'
          }}
        >
          <motion.p 
            className="text-blue-300/80 text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.4em] uppercase font-light"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
          
          </motion.p>
        </motion.div>
      )}
    </>
  );
};

export default SplashScreen;
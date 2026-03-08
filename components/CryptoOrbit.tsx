'use client';
import { motion } from 'framer-motion';
import React from 'react';

const CryptoOrbit = () => {
  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Outer orbit circles */}
      <div className="absolute w-full h-full rounded-full border-2 border-yellow-600/40" />
      <div className="absolute inset-8 rounded-full border border-yellow-500/20" />
      <div className="absolute inset-16 rounded-full border border-yellow-400/10" />

      {/* XRP token at top */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 z-20"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/50 border-2 border-orange-400 text-xs font-bold text-white">
          XRP
        </div>
      </motion.div>

      {/* Rotating orbit container with scattered particles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute w-full h-full"
      >
        {/* Scattered yellow particles around orbit */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 360;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * 160;
          const y = Math.sin(radian) * 160;
          const size = Math.random() * 3 + 2;

          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-yellow-400/60"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(250, 204, 21, 0.6)',
              }}
            />
          );
        })}
      </motion.div>

      {/* Central Bitcoin circle - Large */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          boxShadow: [
            '0 0 30px rgba(250, 204, 21, 0.4), 0 0 60px rgba(250, 204, 21, 0.2)',
            '0 0 50px rgba(250, 204, 21, 0.6), 0 0 100px rgba(250, 204, 21, 0.3)',
            '0 0 30px rgba(250, 204, 21, 0.4), 0 0 60px rgba(250, 204, 21, 0.2)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-56 h-56 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-400 flex items-center justify-center border-4 border-yellow-400/90"
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500/30 to-yellow-200/20" />
        
        {/* Glow rings inside */}
        <div className="absolute inset-4 rounded-full border-2 border-yellow-200/60" />
        <div className="absolute inset-8 rounded-full border border-yellow-100/40" />
        
        {/* Bitcoin symbol */}
        <div className="relative z-10 text-center">
          <span className="text-8xl font-bold text-black drop-shadow-md">₿</span>
        </div>
      </motion.div>

      {/* Blue geometric shape (bottom right accent) */}
      <motion.div
        animate={{
          x: [0, 8, 0],
          y: [0, 8, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 right-8"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/50 to-blue-500/50 rounded-lg transform -rotate-45 shadow-lg shadow-cyan-400/30 backdrop-blur-sm" />
      </motion.div>

      {/* Floating info indicator (bottom left) */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-16 left-8"
      >
        <div className="w-10 h-10 rounded-full border-2 border-blue-400/40 bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-semibold">
          i
        </div>
      </motion.div>
    </div>
  );
};

export default CryptoOrbit;

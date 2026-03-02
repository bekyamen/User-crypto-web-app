'use client'

import { useState, useEffect, useMemo } from 'react';

interface OrbitDot {
  id: number;
  angle: number;
  speed: number;
  radius: number;
  size: number;
}

export function BitcoinOrbit() {
  const dots = useMemo<OrbitDot[]>(() =>
    [...Array(12)].map((_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      speed: 8 + Math.random() * 6,
      radius: 6 + Math.random() * 2,
      size: 0.5 + Math.random() * 0.4,
    })), []
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">

      {/* Multi-layer Glow Background */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 80%)"
        }}
      />
      <div className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(255,140,0,0.2) 0%, transparent 70%)"
        }}
      />

      {/* Gradient Rings */}
      <div className="absolute inset-4 md:inset-6 rounded-full animate-spin-slow"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #facc15 15%, transparent 35%, #fb923c 55%, transparent 75%)",
          mask: "radial-gradient(circle, transparent 60%, black 62%)",
          WebkitMask: "radial-gradient(circle, transparent 60%, black 62%)",
        }}
      />
      <div className="absolute inset-6 md:inset-10 rounded-full animate-spin-slower"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #f59e0b 15%, transparent 35%, #fbbf24 55%, transparent 75%)",
          mask: "radial-gradient(circle, transparent 50%, black 52%)",
          WebkitMask: "radial-gradient(circle, transparent 50%, black 52%)",
        }}
      />

      {/* Orbit Dots with Neon Glow */}
      {mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          {dots.map((dot) => (
            <div
              key={dot.id}
              className="absolute"
              style={{
                animation: `orbit${dot.id} ${dot.speed}s linear infinite`,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: `${dot.size}rem`,
                  height: `${dot.size}rem`,
                  background: "radial-gradient(135deg,#facc15,#fb923c)",
                  boxShadow: "0 0 12px #facc15, 0 0 25px #fb923c, 0 0 35px rgba(250,204,21,0.5)",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Center Bitcoin Coin with Pulse and Shine */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center relative animate-pulse-slow"
          style={{
            background: "radial-gradient(circle at 30% 30%, #facc15, #b45309)",
            boxShadow:
              "0 0 80px rgba(250,204,21,0.5), inset 0 -10px 20px rgba(180,83,9,0.6)",
          }}
        >
          <span
            className="text-6xl md:text-7xl font-extrabold select-none animate-pulse-text"
            style={{ color: "#3b2f0f" }}
          >
            ₿
          </span>
        </div>
      </div>

      {/* XRP Badge Orbiting with Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute animate-xrp-orbit">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-md animate-glow"
            style={{
              background: "linear-gradient(135deg, rgba(0,240,255,0.9), rgba(0,140,255,0.9))",
              color: "white",
              boxShadow: "0 0 20px rgba(0,200,255,0.9), 0 0 30px rgba(0,240,255,0.6)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            XRP
          </div>
        </div>
      </div>

      {/* Dynamic Keyframes & Animations */}
      <style>{`
        ${dots.map(dot => `
        @keyframes orbit${dot.id} {
          0% { transform: rotate(${dot.angle}deg) translate(${dot.radius}rem) rotate(-${dot.angle}deg); }
          100% { transform: rotate(${dot.angle + 360}deg) translate(${dot.radius}rem) rotate(-${dot.angle + 360}deg); }
        }`).join("\n")}

        @keyframes xrpOrbit {
          0% { transform: rotate(0deg) translate(9rem) rotate(0deg); }
          100% { transform: rotate(360deg) translate(9rem) rotate(-360deg); }
        }

        .animate-xrp-orbit {
          animation: xrpOrbit 18s linear infinite;
        }

        .animate-spin-slow {
          animation: spin 35s linear infinite;
        }

        .animate-spin-slower {
          animation: spin 60s linear reverse infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-pulse-slow {
          animation: pulse 3.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .animate-pulse-text {
          animation: pulseText 2s ease-in-out infinite;
        }

        @keyframes pulseText {
          0%,100% { text-shadow: 0 0 5px #facc15, 0 0 15px #fb923c; }
          50% { text-shadow: 0 0 20px #facc15, 0 0 35px #fb923c; }
        }

        .animate-glow {
          animation: glowPulse 2.5s ease-in-out infinite alternate;
        }

        @keyframes glowPulse {
          0% { box-shadow: 0 0 15px rgba(0,200,255,0.6), 0 0 25px rgba(0,240,255,0.4); }
          50% { box-shadow: 0 0 25px rgba(0,240,255,0.9), 0 0 35px rgba(0,200,255,0.6); }
          100% { box-shadow: 0 0 15px rgba(0,200,255,0.6), 0 0 25px rgba(0,240,255,0.4); }
        }
      `}</style>
    </div>
  );
}
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
    [...Array(8)].map((_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      speed: 10 + Math.random() * 6,
      radius: 7 + Math.random() * 1.5,
      size: 0.6 + Math.random() * 0.3,
    })), []
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">

      {/* Background Glow */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(255,185,0,0.35) 0%, transparent 70%)"
        }}
      />

      {/* Animated Gradient Ring */}
      <div className="absolute inset-4 md:inset-6 rounded-full animate-spin-slow"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #facc15 20%, transparent 40%, #fb923c 60%, transparent 80%)",
          mask: "radial-gradient(circle, transparent 62%, black 63%)",
          WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
        }}
      />

      {/* Orbit Dots */}
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
                  background: "linear-gradient(135deg,#facc15,#fb923c)",
                  boxShadow: "0 0 12px rgba(250,204,21,0.8)",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Center Bitcoin Coin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center relative"
          style={{
            background: "linear-gradient(145deg,#facc15,#f59e0b,#b45309)",
            boxShadow:
              "0 0 60px rgba(250,204,21,0.4), inset 0 -8px 18px rgba(120,53,15,0.6)",
          }}
        >
          <span
            className="text-5xl md:text-6xl font-bold select-none"
            style={{ color: "#3b2f0f" }}
          >
            ₿
          </span>
        </div>
      </div>

      {/* Movable XRP Badge (Orbiting) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="absolute animate-xrp-orbit"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-md"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,240,255,0.9), rgba(0,140,255,0.9))",
              color: "white",
              boxShadow: "0 0 18px rgba(0,200,255,0.8)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            XRP
          </div>
        </div>
      </div>

      {/* Dynamic Keyframes */}
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
          animation: spin 30s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
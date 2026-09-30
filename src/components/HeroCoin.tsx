"use client";

import { useState } from "react";
import { Coins } from "lucide-react";

export default function HeroCoin() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-radial from-krypton-gold/25 via-krypton-accent/30 to-transparent blur-3xl animate-pulse" />

      {/* 3D Coin Body */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-krypton-gold/80 bg-gradient-to-tr from-krypton-brown via-krypton-surface to-krypton-gold/40 shadow-2xl flex items-center justify-center p-4">
        {/* Inner Coin Rim */}
        <div className="w-full h-full rounded-full border-2 border-dashed border-krypton-gold/60 flex flex-col items-center justify-center bg-krypton-bg/80 backdrop-blur-md">
          <Coins className="w-20 h-20 text-krypton-gold animate-bounce mb-2" />
          <span className="font-black text-2xl tracking-widest text-krypton-gold">KRYPTON</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 mt-1">Virtual Mint</span>
        </div>
      </div>
    </div>
  );
}
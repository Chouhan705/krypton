"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, LineChart, Wallet, Bot, Calculator } from "lucide-react";

const navItems = [
  { name: "Live Prices", href: "/prices", icon: LineChart },
  { name: "Virtual Wallet", href: "/wallet", icon: Wallet },
  { name: "Crypto Bot", href: "/assistant", icon: Bot },
  { name: "Converter", href: "/calculator", icon: Calculator },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-krypton-bg/85 border-b border-krypton-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-wider text-krypton-gold">
          <Coins className="w-6 h-6 text-krypton-gold animate-pulse" />
          <span>KRYPTON</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-krypton-surface text-krypton-gold"
                    : "text-zinc-300 hover:text-krypton-gold hover:bg-krypton-surface/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/wallet"
          className="bg-krypton-gold hover:bg-krypton-gold-muted text-krypton-bg font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          Launch Wallet
        </Link>
      </div>
    </header>
  );
}
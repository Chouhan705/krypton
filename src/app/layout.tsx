import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Krypton | Virtual Crypto Trading & Intelligence",
  description: "Virtual wallet paper trading, live crypto rates, and AI-powered market insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-krypton-bg text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-krypton-gold selection:text-krypton-bg">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
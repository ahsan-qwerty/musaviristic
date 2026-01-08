import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata will be provided from the content layer in a later phase.
export const metadata = {};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background to-background/80">
          <Header />
          <div className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

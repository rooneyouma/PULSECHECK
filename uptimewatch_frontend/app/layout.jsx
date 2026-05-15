import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider"; // <--- Double check this import path!
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "UptimeWatch",
  description: "Real-time service monitoring infrastructure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Make absolutely sure this wraps {children} */}
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
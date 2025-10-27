// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Đảm bảo bạn đã import file CSS global

// Import Sidebar và Header
import Sidebar from "@/components/home/Sidebar";
import Header from "@/components/home/Header";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "A modern and intuitive dashboard for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-slate-100 text-gray-800 font-sans">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <Header />
            {children} {/* Đây là nơi nội dung của page.tsx sẽ được hiển thị */}
          </main>
        </div>
      </body>
    </html>
  );
}
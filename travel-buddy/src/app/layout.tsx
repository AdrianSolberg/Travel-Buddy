
import Header from "../components/Header";
import HomePage from "@/pages/HomePage";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Buddy",
  description: "Generated by create next app",
};


 export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="content">{children}</div>
        </body>
    </html>
  );
  }




import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Empowering the Next Generation with AI-Ready Skills",
  description: "Our mission is to equip children with the knowledge and skills necessary to thrive in an AI-driven world. Through personalized learning experiences, we foster creativity, critical thinking, and a deep understanding of artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Lexend%3Awght%40400%3B500%3B700%3B900&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900"
        />
      </head>
      <body className={`${lexend.variable} antialiased`}>
        {/* Removed header navigation */}
        {children}
      </body>
    </html>
  );
}

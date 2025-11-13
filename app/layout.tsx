import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RegulaGuard - Проверка соответствия 152-ФЗ | Аудит персональных данных",
  description: "Профессиональный аудит сайтов на соответствие требованиям 152-ФЗ. Защитите свой бизнес от штрафов до 15 млн руб. Бесплатная проверка за 2 минуты.",
  keywords: "152-ФЗ, проверка сайта, аудит персональных данных, Роскомнадзор, штрафы, защита данных",
  openGraph: {
    title: "RegulaGuard - Проверка соответствия 152-ФЗ",
    description: "Профессиональный аудит сайтов на соответствие требованиям 152-ФЗ. Защитите свой бизнес от штрафов до 15 млн руб.",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "RegulaGuard - Проверка соответствия 152-ФЗ",
    description: "Профессиональный аудит сайтов на соответствие требованиям 152-ФЗ. Защитите свой бизнес от штрафов до 15 млн руб.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
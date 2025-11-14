import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/Header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://regulaguard.ru";
const yandexId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  title:
    "RegulaGuard - Проверка соответствия 152-ФЗ | Аудит персональных данных",
  description:
    "Профессиональный аудит сайтов на соответствие требованиям 152-ФЗ. Защитите свой бизнес от штрафов до 15 млн руб. Бесплатная проверка за 2 минуты.",
  keywords:
    "152-ФЗ, проверка сайта, аудит персональных данных, Роскомнадзор, штрафы, защита данных",
  openGraph: {
    title: "RegulaGuard - Проверка соответствия 152-ФЗ",
    description:
      "Профессиональный аудит сайтов на соответствие требованиям 152-ФЗ. Защитите свой бизнес от штрафов до 15 млн руб.",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/vercel.svg",
        alt: "Проверка сайта на соответствие 152‑ФЗ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RegulaGuard - Проверка соответствия 152-ФЗ",
    description:
      "Профессиональный аудит сайтов на соответствие требованиям 152-ФЗ. Защитите свой бизнес от штрафов до 15 млн руб.",
    images: ["/vercel.svg"],
  },
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
        {yandexId ? (
          <>
            <Script
              src="https://mc.yandex.ru/metrika/tag.js"
              strategy="lazyOnload"
            />
            <Script id="yandex-metrika" strategy="lazyOnload">
              {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
              ym(${yandexId}, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
            `}
            </Script>
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${yandexId}`}
                  style={{ position: "absolute", left: "-9999px" }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        ) : null}
        <Header />
        {children}
      </body>
    </html>
  );
}

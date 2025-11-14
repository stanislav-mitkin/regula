"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white/80 backdrop-blur"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Shield
              className={`h-8 w-8 mr-2 transition-colors text-blue-600`}
            />
            <span
              className={`text-xl font-bold transition-colors text-gray-900`}
            >
              RegulaGuard
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="#audit-form"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Проверить сайт
            </Link>
          </div>

          <div
            className={`md:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100`}
          >
            <Link
              href="#audit-form"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Проверить сайт
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#how-it-works', label: 'Как это работает' },
    { href: '#pricing', label: 'Тарифы' },
    { href: '#cases', label: 'Кейсы' },
    { href: '#team', label: 'Эксперты' },
    { href: '#contact', label: 'Контакты' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/80 backdrop-blur'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Shield className={`h-8 w-8 mr-2 transition-colors text-blue-600`} />
            <span className={`text-xl font-bold transition-colors text-gray-900`}>
              RegulaGuard
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-blue-600 text-gray-700`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="tel:+74951234567"
              className={`transition-colors hover:text-blue-600 text-gray-700`}
            >
              +7 (495) 123-45-67
            </Link>
            <Link
              href="#audit-form"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Проверить сайт
            </Link>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="tel:+74951234567"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  +7 (495) 123-45-67
                </Link>
                <Link
                  href="#audit-form"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Проверить сайт
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

import React from 'react';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold">RegulaGuard</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Профессиональные услуги по обеспечению соответствия требованиям 
              152-ФЗ и защите персональных данных. Работаем с 2014 года.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-400 mr-3" />
                <span className="text-gray-300">info@regulaguard.ru</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-400 mr-3" />
                <span className="text-gray-300">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-400 mr-3" />
                <span className="text-gray-300">Москва, ул. Тверская, д. 1</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Технический аудит
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Юридическое сопровождение
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Разработка документов
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Обучение персонала
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Постоянный мониторинг
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Эксперты
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ООО «РегулаГард». Все права защищены.
            </div>
            <div className="text-gray-400 text-sm">
              <Link href="/privacy-policy" className="hover:text-white transition-colors mr-4">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-gray-500 text-xs text-center">
            Использование сайта означает согласие с{' '}
            <Link href="/privacy-policy" className="underline hover:text-gray-400">
              политикой конфиденциальности
            </Link>{' '}
            и{' '}
            <Link href="/terms" className="underline hover:text-gray-400">
              пользовательским соглашением
            </Link>
            . Вся информация защищена в соответствии с требованиями 152-ФЗ.
          </div>
        </div>
      </div>
    </footer>
  );
};
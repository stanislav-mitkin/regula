import React from 'react';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-2xl font-bold">RegulaGuard</span>
            </div>
            <p className="text-slate-600 mb-6 max-w-md">
              Профессиональные услуги по обеспечению соответствия требованиям 
              152-ФЗ и защите персональных данных. Работаем с 2014 года.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-slate-600">info@regulaguard.ru</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-slate-600">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-slate-600">Москва, ул. Тверская, д. 1</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Технический аудит
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Юридическое сопровождение
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Разработка документов
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Обучение персонала
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Постоянный мониторинг
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Эксперты
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-gray-900 transition-colors">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-sm mb-4 md:mb-0">
              © {currentYear} ООО «РегулаГард». Все права защищены.
            </div>
            <div className="text-slate-500 text-sm">
              <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors mr-4">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-slate-500 text-xs text-center">
            Использование сайта означает согласие с{' '}
            <Link href="/privacy-policy" className="underline hover:text-gray-900">
              политикой конфиденциальности
            </Link>{' '}
            и{' '}
            <Link href="/terms" className="underline hover:text-gray-900">
              пользовательским соглашением
            </Link>
            . Вся информация защищена в соответствии с требованиями 152-ФЗ.
          </div>
        </div>
      </div>
    </footer>
  );
};

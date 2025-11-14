import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Спасибо за заявку - RegulaGuard',
  description: 'Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
  alternates: { canonical: 'https://regulaguard.ru/thank-you' },
};

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Спасибо за заявку!
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в течение 
          1 рабочего дня для уточнения деталей и предоставления дополнительной информации.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Что дальше?</h2>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• Мы проанализируем ваш запрос</li>
            <li>• Подготовим персональное предложение</li>
            <li>• Свяжемся для консультации</li>
            <li>• Предоставим доступ к материалам</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Вернуться на главную
          </Link>
          
          <Link
            href="tel:+74951234567"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Позвонить нам: +7 (495) 123-45-67
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Если у вас есть срочные вопросы, пожалуйста, не стесняйтесь позвонить нам.
          Мы всегда рады помочь!
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadForm } from '../forms/LeadForm';
import { SubmitLeadRequest } from '@/types/lead';
import { FileText, Download } from 'lucide-react';

export const SecondaryCTA: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const handleLeadSubmit = async (data: SubmitLeadRequest) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(result.error || 'Произошла ошибка при отправке');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">
              Получите чек-лист по 152-ФЗ
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Бесплатный PDF-чек-лист с 25 пунктами для самостоятельной проверки 
              вашего сайта на соответствие требованиям закона о персональных данных.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">25 критических пунктов проверки</span>
              </div>
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">Мгновенное скачивание после заполнения формы</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">Обновляется при изменении законодательства</span>
              </div>
            </div>
            
            <div className="bg-blue-900 bg-opacity-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">
                Или закажите консультацию
              </h3>
              <p className="text-blue-200">
                Получите персональные рекомендации от экспертов с 10-летним опытом 
                работы в сфере защиты персональных данных.
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {!success ? (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Получить чек-лист
                  </h3>
                  <p className="text-gray-600">
                    Заполните форму и получите материалы на email
                  </p>
                </div>
                
                <LeadForm 
                  onSubmit={handleLeadSubmit} 
                  loading={loading}
                  service="consultation"
                />
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Спасибо за заявку!
                </h3>
                <p className="text-gray-600 mb-4">
                  Чек-лист и инструкции были отправлены на ваш email.
                </p>
                <p className="text-sm text-gray-500">
                  Наш менеджер свяжется с вами в течение 1 рабочего дня для консультации.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
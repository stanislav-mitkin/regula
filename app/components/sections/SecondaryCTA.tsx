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
    <section id="paid-report" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="text-gray-900">
            <h2 className="text-4xl font-bold mb-6">Закажите PDF-отчет</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Расширенная автоматическая проверка и подробный отчет по вашему сайту. Стоимость услуги: 1990 ₽.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-600">Политика конфиденциальности: ясность, актуальность, корректные реквизиты</span>
              </div>
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-600">HTTPS: срок действия SSL-сертификата</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-600">Cookie-файлы: корректная работа механизма согласия</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-600">Базовая безопасность: контакты для обращений, настройки robots.txt</span>
              </div>
            </div>
            
            <div className="text-sm text-slate-500">Только информационный сервис. Юридическая проверка и консультации не предоставляются.</div>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Заказать PDF-отчет</h3>
                  <p className="text-gray-600">Заполните форму и получите отчет на email</p>
                </div>
                
                <LeadForm 
                  onSubmit={handleLeadSubmit} 
                  loading={loading}
                  service="paid_report"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Спасибо за заказ!</h3>
                <p className="text-gray-600 mb-4">PDF-отчет будет отправлен на ваш email.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, FileCheck, Shield } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Ввод URL сайта",
    description:
      "Укажите адрес вашего сайта для проверки. Поддерживаются все типы доменов, включая кириллические.",
    icon: <Search className="h-8 w-8" />,
  },
  {
    number: 2,
    title: "Автоматическое сканирование",
    description:
      "Система анализирует POST-запросы, cookies, формы и другие элементы, связанные с обработкой персональных данных.",
    icon: <FileCheck className="h-8 w-8" />,
  },
  {
    number: 3,
    title: "Генерация отчета",
    description:
      "Получите детальный отчет с перечнем нарушений, рекомендациями по устранению и уровнем риска.",
    icon: <Shield className="h-8 w-8" />,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Как это работает
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Простой трехшаговый процесс позволяет быстро выявить потенциальные
            нарушения и получить рекомендации по их устранению
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <div className="h-0.5 bg-blue-200 mx-8"></div>
                  <div className="absolute right-8 top-0 w-0 h-0 border-l-4 border-l-blue-200 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">
              Особенность нашего подхода
            </h4>
            <p className="text-blue-800 leading-relaxed">
              Мы анализируем не только внешние признаки, но и технические
              аспекты: передачу данных через POST-запросы, использование
              cookies, работу форм обратной связи, интеграцию с внешними
              сервисами и многое другое.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

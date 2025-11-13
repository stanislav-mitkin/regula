"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Check, Star } from "lucide-react";
import { Button } from "../ui/Button";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  ctaText: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Standard Report",
    price: "29 900 ₽",
    description: "Технический аудит соответствия 152-ФЗ",
    features: [
      "Полный технический аудит сайта",
      "Анализ POST-запросов и cookies",
      "Проверка форм и интеграций",
      "Отчет с перечнем нарушений",
      "Рекомендации по устранению",
      "Приоритетная поддержка",
    ],
    ctaText: "Заказать аудит",
  },
  {
    name: "Audit Pro",
    price: "59 900 ₽",
    description: "Комплексный аудит + юридические шаблоны",
    features: [
      "Все функции Standard Report",
      "Юридический анализ документов",
      "Шаблоны политики конфиденциальности",
      "Соглашение на обработку ПДн",
      "Персональные рекомендации",
      "Консультация юриста 1 час",
      "Гарантия соответствия",
    ],
    recommended: true,
    ctaText: "Выбрать Pro",
  },
  {
    name: "Monitoring",
    price: "199 900 ₽/год",
    description: "Ежемесячный контроль соответствия",
    features: [
      "Все функции Audit Pro",
      "Ежемесячные проверки сайта",
      "Отслеживание изменений законодательства",
      "Автоматические уведомления о рисках",
      "Квартальные отчеты для руководства",
      "24/7 техническая поддержка",
      "Экстренное реагирование на утечки",
    ],
    ctaText: "Начать мониторинг",
  },
];

export const PricingCards: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Тарифные пакеты
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите подходящий пакет услуг для обеспечения соответствия вашего
            бизнеса требованиям 152-ФЗ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                variant={plan.recommended ? "highlighted" : "default"}
                className="h-full flex flex-col"
              >
                {plan.recommended && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Рекомендуем
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.recommended ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {plan.ctaText}
                </Button>
              </Card>
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
              Нужна индивидуальная консультация?
            </h4>
            <p className="text-blue-800 mb-6">
              Мы предлагаем индивидуальные решения для крупных компаний и
              специфических отраслей с повышенными требованиями к защите данных.
            </p>
            <Button variant="outline" size="lg">
              Обсудить индивидуальные условия
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

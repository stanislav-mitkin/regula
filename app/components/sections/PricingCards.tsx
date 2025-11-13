"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Check } from "lucide-react";
import { Button } from "../ui/Button";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  onClick?: () => void;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Бесплатная проверка",
    price: "Бесплатно",
    description: "Автоматическая проверка базовых параметров в реальном времени",
    features: [
      "Политика конфиденциальности: наличие документа в открытом доступе",
      "Согласие на обработку ПДн: явные чекбоксы во всех формах, без предустановленных галочек",
      "Защита данных при передаче: использование HTTPS при отправке данных из форм",
      "Cookie-файлы: наличие баннера/плашки об использовании cookies",
    ],
    ctaText: "Проверить сайт",
    onClick: () => {
      const el = document.getElementById("audit-form");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
  {
    name: "PDF-отчет",
    price: "1990 ₽",
    description: "Расширенная автоматическая проверка с подробным отчетом в PDF",
    features: [
      "Политика конфиденциальности: ясность текста, актуальные сроки хранения и цели обработки, корректные реквизиты оператора",
      "Согласие на обработку ПДн: корректные формулировки целей, доступность полной Политики рядом с формой",
      "HTTPS: проверка срока действия SSL-сертификата",
      "Cookie-файлы: возможность согласия/отказа, корректная работа механизма",
      "Базовая безопасность: контакты для обращений по ПДн, корректные настройки robots.txt для личных кабинетов",
      "PDF-отчет на email",
    ],
    ctaText: "Заказать PDF-отчет",
    onClick: () => {
      const el = document.getElementById("paid-report");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  },
];

export const PricingCards: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Услуги</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Только автоматическая проверка и информационный сервис. Выберите формат: мгновенная базовая проверка или подробный отчет в PDF.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                variant="default"
                className="h-full flex flex-col"
              >
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
                  variant={index === 1 ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={plan.onClick}
                >
                  {plan.ctaText}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

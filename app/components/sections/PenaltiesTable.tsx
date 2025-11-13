"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Shield, FileText, Users } from "lucide-react";

interface Penalty {
  violation: string;
  description: string;
  fine: string;
  severity: "low" | "medium" | "high" | "critical";
  icon: React.ReactNode;
}

const penalties: Penalty[] = [
  {
    violation: "Отсутствие согласия на обработку ПДн",
    description:
      "Не получено явное согласие пользователя на обработку персональных данных",
    fine: "До 1.5 млн руб.",
    severity: "high",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    violation: "Нарушение локализации данных",
    description:
      "Хранение персональных данных российских граждан за пределами РФ",
    fine: "До 15 млн руб.",
    severity: "critical",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    violation: "Отсутствие политики конфиденциальности",
    description: "Отсутствует документ с информацией о порядке обработки ПДн",
    fine: "До 300 тыс. руб.",
    severity: "medium",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    violation: "Необоснованная передача третьим лицам",
    description: "Передача персональных данных без согласия субъекта",
    fine: "До 1 млн руб.",
    severity: "high",
    icon: <Users className="h-5 w-5" />,
  },
  {
    violation: "Нарушение сроков уведомления о утечке",
    description:
      "Неуведомление Роскомнадзора о факте утечки ПДн в установленный срок",
    fine: "До 1 млн руб.",
    severity: "high",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    violation: "Отсутствие защитных мер",
    description: "Не приняты необходимые меры для защиты персональных данных",
    fine: "До 500 тыс. руб.",
    severity: "medium",
    icon: <Shield className="h-5 w-5" />,
  },
];

const severityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

export const PenaltiesTable: React.FC = () => {
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
            Штрафы по 152-ФЗ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Нарушение требований закона о персональных данных может привести к
            серьезным финансовым последствиям для вашего бизнеса
          </p>
        </motion.div>

        <div className="grid gap-6">
          {penalties.map((penalty, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        severityColors[penalty.severity]
                      }`}
                    >
                      {penalty.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      {penalty.violation}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{penalty.description}</p>
                </div>
                <div className="ml-6 text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      severityColors[penalty.severity]
                    }`}
                  >
                    {penalty.fine}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-red-50 rounded-lg border border-red-200"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-red-900 mb-1">
                Уголовная ответственность
              </h4>
              <p className="text-red-700">
                В ряде случаев нарушение может повлечь уголовную ответственность
                до 4 лет лишения свободы (ст. 137 УК РФ)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuditForm } from "../forms/AuditForm";
import { StartAuditRequest, StartAuditResponse } from "@/types/audit";
import { AlertTriangle } from "lucide-react";

export const HeroSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StartAuditResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [risk, setRisk] = useState<string>("");
  const [violationsCount, setViolationsCount] = useState<number>(0);

  const handleAuditSubmit = async (data: StartAuditRequest) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/start-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setResult(result);
        setStatus(result.status);
      } else {
        setError(result.error || "Произошла ошибка при проверке");
      }
    } catch (err) {
      setError("Не удалось подключиться к серверу проверки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const poll = async () => {
      if (!result?.auditId) return;
      try {
        const res = await fetch(`/api/get-report-status?id=${result.auditId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus(data.status);
          if (data.status !== "pending") {
            setSummary(data.summary || "");
            setRisk(data.riskLevel || "unknown");
            setViolationsCount(
              Array.isArray(data.violations) ? data.violations.length : 0
            );
            if (interval) clearInterval(interval);
          }
        }
      } catch (e) {}
    };
    if (result?.auditId) {
      interval = setInterval(poll, 2000);
      poll();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [result?.auditId]);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-900"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 leading-tight">
              Штрафы до <span className="text-red-400">15 млн руб.</span>
              <br />
              за нарушение 152-ФЗ
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Автоматизированная проверка вашего сайта на соответствие
              требованиям закона о персональных данных. Защитите свой бизнес от
              крупных штрафов и уголовной ответственности.
            </p>

            <div className="flex items-center mb-8 text-slate-500">
              <AlertTriangle className="h-5 w-5 mr-2 text-slate-500" />
              <span className="font-medium">
                Каждый третий сайт в России имеет критические нарушения
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">15 млн</div>
                <div className="text-sm text-slate-600">Максимальный штраф</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">1.5 млн</div>
                <div className="text-sm text-slate-600">За отсутствие согласия</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">4 года</div>
                <div className="text-sm text-slate-600">Уголовная ответственность</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Бесплатная проверка сайта
              </h2>
              <p className="text-gray-600">
                Получите предварительный отчет о нарушениях за 2 минуты
              </p>
            </div>

            <AuditForm onSubmit={handleAuditSubmit} loading={loading} />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">
                  Проверка запущена! ID: {result.auditId}
                </p>
                <p className="text-green-500 text-sm mt-1">
                  Статус: {status || result.status}
                </p>
                {status === "completed" && (
                  <div className="mt-2 text-sm text-green-700">
                    <p>Итог: {summary}</p>
                    <p className="mt-1">Уровень риска: {risk}</p>
                    <p className="mt-1">Нарушений: {violationsCount}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { z } from 'zod';
import { SubmitLeadRequest } from '@/types/lead';

const leadFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(255, 'Имя слишком длинное'),
  email: z.string().email('Введите корректный email').max(255, 'Email слишком длинный'),
  phone: z.string().max(50, 'Телефон слишком длинный').optional().or(z.literal('')),
  company: z.string().max(255, 'Название компании слишком длинное').optional().or(z.literal('')),
  service: z.string().min(1, 'Выберите услугу').max(100, 'Название услуги слишком длинное')
});

type FormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  onSubmit: (data: SubmitLeadRequest) => Promise<void>;
  loading?: boolean;
  service?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, loading = false, service = '' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: service
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      leadFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="text"
        label="Имя контактного лица"
        placeholder="Иван Иванов"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        error={errors.name}
        required
        disabled={loading}
      />
      
      <Input
        type="email"
        label="Email"
        placeholder="client@company.ru"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        required
        disabled={loading}
      />
      
      <Input
        type="tel"
        label="Телефон (опционально)"
        placeholder="+7 (999) 123-45-67"
        value={formData.phone}
        onChange={(e) => handleInputChange('phone', e.target.value)}
        error={errors.phone}
        disabled={loading}
      />
      
      <Input
        type="text"
        label="Компания (опционально)"
        placeholder="ООО Ромашка"
        value={formData.company}
        onChange={(e) => handleInputChange('company', e.target.value)}
        error={errors.company}
        disabled={loading}
      />
      
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Услуга <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.service}
          onChange={(e) => handleInputChange('service', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.service ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
          required
          disabled={loading}
        >
          <option value="">Выберите услугу</option>
          <option value="paid_report">PDF-отчет (1990 ₽)</option>
        </select>
        {errors.service && (
          <p className="mt-2 text-sm text-red-600">{errors.service}</p>
        )}
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Оставить заявку
      </Button>
    </form>
  );
};

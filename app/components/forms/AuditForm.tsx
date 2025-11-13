'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { z } from 'zod';
import { StartAuditRequest } from '@/types/audit';

const auditFormSchema = z.object({
  url: z.string().url('Введите корректный URL').min(1, 'URL обязателен'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Необходимо согласие на обработку персональных данных'
  }),
  email: z.string().email('Введите корректный email').optional().or(z.literal(''))
});

type FormData = z.infer<typeof auditFormSchema>;

interface AuditFormProps {
  onSubmit: (data: StartAuditRequest) => Promise<void>;
  loading?: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    url: '',
    consent: false,
    email: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      auditFormSchema.parse(formData);
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
        type="url"
        label="URL сайта для проверки"
        placeholder="https://example.com"
        value={formData.url}
        onChange={(e) => handleInputChange('url', e.target.value)}
        error={errors.url}
        required
        disabled={loading}
      />
      
      <Input
        type="email"
        label="Email для отправки отчета (опционально)"
        placeholder="client@company.ru"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        disabled={loading}
      />
      
      <Checkbox
        label="Я даю согласие на обработку моих персональных данных в соответствии с требованиями 152-ФЗ"
        checked={formData.consent}
        onChange={(e) => handleInputChange('consent', e.target.checked)}
        error={errors.consent}
        required
        disabled={loading}
      />
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Бесплатная проверка
      </Button>
    </form>
  );
};
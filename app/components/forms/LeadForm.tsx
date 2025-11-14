'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { z } from 'zod';
import { SubmitLeadRequest } from '@/types/lead';
import { Captcha } from '../common/Captcha/Captcha';

const leadFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(255, 'Имя слишком длинное'),
  email: z.string().email('Введите корректный email').max(255, 'Email слишком длинный'),
});

type FormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  onSubmit: (data: SubmitLeadRequest) => Promise<void>;
  loading?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    
  });
  const [captchaToken, setCaptchaToken] = useState<string>('');
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
    if (validateForm() && captchaToken) {
      await onSubmit({ ...formData, captchaToken });
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
      
      
      
      <Captcha onSuccess={setCaptchaToken} />
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
        disabled={!captchaToken || loading}
      >
        Оставить заявку
      </Button>
    </form>
  );
};

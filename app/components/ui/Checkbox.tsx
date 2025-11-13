import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      <div className="flex items-start">
        <input
          id={checkboxId}
          type="checkbox"
          className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        <label htmlFor={checkboxId} className="ml-3 text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlighted';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-lg',
    highlighted: 'bg-white border-2 border-green-500 shadow-xl'
  };
  
  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};
import React from 'react';
import { motion } from 'motion/react';

interface AnimatedButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  onClick, 
  children, 
  className = '', 
  variant = 'primary',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-green-600 text-white shadow-lg shadow-green-200',
    secondary: 'bg-blue-600 text-white shadow-lg shadow-blue-200',
    outline: 'border-2 border-green-600 text-green-600 bg-transparent',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

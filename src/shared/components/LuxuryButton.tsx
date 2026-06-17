import React from 'react';
import { motion } from 'framer-motion';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold';
  isClay?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'primary',
  isClay = true,
  className = '',
  ...props
}) => {
  const baseClass = isClay ? 'clay-button' : 'btn';
  const variantClass = variant === 'gold' ? 'clay-button-gold' : variant === 'primary' ? 'btn-primary' : 'btn-outline-dark';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClass} ${variantClass} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
import React from 'react';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label sub-heading mb-2" style={{ fontSize: '0.8rem' }}>{label}</label>}
      <input className={`clay-input w-100 ${className}`} {...props} />
    </div>
  );
};
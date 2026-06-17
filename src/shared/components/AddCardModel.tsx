import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuxuryButton } from './LuxuryButton';
import { PremiumInput } from './PremiumInput';
import api from '../services/api';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdded }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    cardType: 'Credit',
    cardNumber: '',
    nameOnCard: '',
    cvv: '',
    expiryDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Client-side validation
    if (formData.cardNumber.length !== 16) {
      showToast('Card number must be 16 digits.', 'error');
      return;
    }
    if (formData.cvv.length !== 3) {
      showToast('CVV must be 3 digits.', 'error');
      return;
    }
    if (new Date(formData.expiryDate) < new Date()) {
      showToast('Card has expired.', 'error');
      return;
    }

    try {
      await api.post(`/payment-api/customer/${user.emailId}/cards`, {
        ...formData,
        customerEmailId: user.emailId
      });
      showToast('Card added successfully', 'success');
      onAdded();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.errorMessage || 'Failed to add card', 'error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-index-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            className="glass-panel p-4 border-0 soft-shadow"
            style={{ width: '400px', backgroundColor: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-4">Add Secured Card</h4>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <select name="cardType" className="form-select" onChange={handleChange} value={formData.cardType}>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
              <PremiumInput name="cardNumber" label="Card Number (16 digits)" placeholder="1234..." onChange={handleChange} />
              <PremiumInput name="nameOnCard" label="Name on Card" placeholder="John Doe" onChange={handleChange} />
              <PremiumInput name="cvv" label="CVV (3 digits)" placeholder="123" onChange={handleChange} />
              <PremiumInput name="expiryDate" label="Expiry Date" type="date" onChange={handleChange} />
              
              <div className="d-flex gap-2 mt-3">
                <LuxuryButton type="button" variant="secondary" onClick={onClose}>Cancel</LuxuryButton>
                <LuxuryButton type="submit" variant="gold">Add Card</LuxuryButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
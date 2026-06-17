import React, { useState, useEffect } from 'react';
import { Layout } from '../shared/components/Layout';
import { GlassCard } from '../shared/components/GlassCard';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { PremiumInput } from '../shared/components/PremiumInput';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from '../providers/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Trash2, Plus, ShieldCheck, X } from 'lucide-react';
import api from '../shared/services/api';

const PaymentManagement: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cards, setCards] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardType: 'Credit',
    cardNumber: '',
    nameOnCard: '',
    cvv: '',
    expiryDate: ''
  });

  const fetchCards = async () => {
    if (!user) return;
    try {
      const credit = await api.get(`/payment-api/customer/${user.emailId}/card-type/Credit`).catch(() => ({ data: [] }));
      const debit = await api.get(`/payment-api/customer/${user.emailId}/card-type/Debit`).catch(() => ({ data: [] }));
      
      // ✅ Normalize cardID → cardId if backend returns cardID
      const normalize = (list: any[]) => list.map(card => ({
        ...card,
        cardId: card.cardId ?? card.cardID  // handle both cases
      }));

      setCards([...normalize(credit.data), ...normalize(debit.data)]);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    }
  };

  useEffect(() => { fetchCards(); }, [user]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Backend returns plain String not JSON
      const response = await api.post(
        `/payment-api/customer/${user?.emailId}/cards`,
        {
          ...formData,
          customerEmailId: user?.emailId
        }
      );
      console.log('Card added response:', response.data); // e.g. "NEW_CARD_ADDED_SUCCESS 1"
      showToast('Secured card added to your portfolio.', 'success');
      setIsAdding(false);
      // ✅ Reset form
      setFormData({ cardType: 'Credit', cardNumber: '', nameOnCard: '', cvv: '', expiryDate: '' });
      fetchCards();
    } catch (err: any) {
      console.error('Add card error:', err.response?.data);
      showToast(err.response?.data?.errorMessage || err.response?.data || 'Failed to add card.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId: number) => {
    try {
      await api.delete(`/payment-api/customer/${user?.emailId}/card/${cardId}/delete`);
      showToast('Card removed from secured storage.', 'success');
      fetchCards();
    } catch (err: any) {
      console.error('Delete card error:', err.response?.data);
      showToast(err.response?.data?.errorMessage || 'Failed to remove card.', 'error');
    }
  };

  const allowOnlyDigits = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">Secured Payments</h4>
        <LuxuryButton variant="gold" className="btn-sm" onClick={() => setIsAdding(true)}>
          <Plus size={16} className="me-2" /> Add Secured Card
        </LuxuryButton>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-5">
            <GlassCard className="border-gold" style={{ border: '1px solid var(--color-gold)' }}>
              <div className="d-flex justify-content-between mb-4">
                <span className="sub-heading">New Acquisition Tool</span>
                <X className="cursor-pointer" onClick={() => setIsAdding(false)} />
              </div>
              <form onSubmit={handleAddCard}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label sub-heading small">Card Type</label>
                      <select
                        className="clay-input w-100"
                        value={formData.cardType}
                        onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                      >
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <PremiumInput
                      label="Name on Card"
                      placeholder="Alexander Vanguard"
                      value={formData.nameOnCard}
                      onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <PremiumInput
                      label="Card Number"
                      placeholder="1234567812345678"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 16); 
                        setFormData({ ...formData, cardNumber: digits });
                      }}
                      onKeyDown={allowOnlyDigits}
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <PremiumInput
                      label="Expiry Date (MM/YYYY)"
                      type="month"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <PremiumInput
                        label="CVV"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 3); // strip non-digits, cap at 3
                          setFormData({ ...formData, cvv: digits });
                        }}
                        onKeyDown={allowOnlyDigits}
                        maxLength={3}
                        required
                      />
                  </div>
                </div>
                {/* ✅ Show loading state on button */}
                <LuxuryButton variant="gold" className="w-100 py-3 mt-3" type="submit" disabled={loading}>
                  {loading ? 'Securing...' : 'Authorize & Secure'}
                </LuxuryButton>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="row g-4">
        {cards.map((card) => (
          <div key={card.cardId} className="col-md-6">
            <motion.div whileHover={{ scale: 1.02 }} className="glass-panel p-4 border-0 soft-shadow position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 p-4 opacity-10">
                <CreditCard size={100} />
              </div>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="badge bg-gold bg-opacity-10 text-gold border-0 px-3 py-2">{card.cardType}</div>
                <Trash2
                  size={18}
                  className="text-danger cursor-pointer opacity-50 hover-opacity-100"
                  onClick={() => handleDelete(card.cardId)}
                />
              </div>
              <div className="h5 mb-1 text-gold" style={{ letterSpacing: '4px' }}>
                **** **** **** {card.cardNumber?.slice(-4)}
              </div>
              <div className="d-flex justify-content-between align-items-end mt-4">
                <div>
                  <div className="sub-heading" style={{ fontSize: '0.6rem' }}>Card Holder</div>
                  <div className="fw-bold small">{card.nameOnCard}</div>
                </div>
                <div className="text-end">
                  <div className="sub-heading" style={{ fontSize: '0.6rem' }}>Expires</div>
                  <div className="fw-bold small">{card.expiryDate}</div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
        {cards.length === 0 && !isAdding && (
          <div className="text-center py-5 opacity-50">
            <ShieldCheck size={48} className="mb-3" />
            <p className="sub-heading">No secured acquisition tools found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
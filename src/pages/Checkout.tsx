import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../shared/components/Layout';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { GlassCard } from '../shared/components/GlassCard';
import { PremiumInput } from '../shared/components/PremiumInput';
import { AddCardModal } from '../shared/components/AddCardModel';
import { useCart } from '../providers/CartProvider';
import { useToast } from '../providers/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, ArrowRight, Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../shared/services/api';
import { useAuth } from '../providers/AuthProvider';

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // ✅ Shipping fields
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');


  const [cvv, setCvv] = useState<string>('');

  const fetchCards = useCallback(async () => {
    if (!user) return;
    try {
      const credit = await api.get(`/payment-api/customer/${user.emailId}/card-type/Credit`).catch(() => ({ data: [] }));
      const debit = await api.get(`/payment-api/customer/${user.emailId}/card-type/Debit`).catch(() => ({ data: [] }));
      const normalize = (list: any[]) => list.map(card => ({
        ...card,
        cardId: card.cardId ?? card.cardID
      }));
      setCards([...normalize(credit.data), ...normalize(debit.data)]);
    } catch (err) { console.error(err); }
  }, [user]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const selected = cards.find(c => c.cardId === selectedCardId);
  const discountRate = selected?.cardType === 'Credit' ? 0.10 : selected?.cardType === 'Debit' ? 0.05 : 0;
  const discountAmount = total * discountRate;
  const finalTotal = total - discountAmount;

  const handleNext = () => {
    // ✅ Validate shipping address before moving to step 2
    if (step === 1 && !shippingAddress.trim()) {
      showToast('Please enter your delivery address.', 'error');
      return;
    }
    // ✅ Validate card and CVV before moving to step 3
    if (step === 2) {
      if (!selectedCardId) {
        showToast('Please select or add a secured card.', 'error');
        return;
      }
      if (!cvv || cvv.length !== 3) {
        showToast('Please enter a valid 3-digit CVV.', 'error');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedCardId) return;
    setIsProcessing(true);
    try {
      // ✅ Single API call — OrderMS handles payment internally
      const orderResp = await api.post('/order-api/place-order', {
        customerEmailId: user.emailId,
        cardId: selectedCardId,                          // ✅ send cardId
        cvv: cvv,                                        // ✅ send cvv
        paymentThrough: selected?.cardType || 'Credit',  // ✅ Credit or Debit
        deliveryAddress: `${shippingAddress}, ${city}, ${country}` // ✅ real address
      });

      console.log('Order response:', orderResp.data);
      // Response: "Order Placed successfully with Id: 1"

      setIsSuccess(true);
      clearCart();
      showToast('Your order has been secured.', 'success');
    } catch (err: any) {
      console.error('Order error:', err.response?.data);
      showToast(err.response?.data?.errorMessage || err.response?.data || 'Transaction failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-5 mx-auto"
            style={{ maxWidth: '600px' }}
          >
            <div className="bg-gold rounded-circle d-inline-flex p-4 mb-4" style={{ backgroundColor: 'var(--color-gold)' }}>
              <ShieldCheck size={60} color="white" />
            </div>
            <h1 className="luxury-heading mb-3">Order Secured</h1>
            <p className="lead text-secondary mb-5">Your masterpiece is being prepared for boutique delivery.</p>
            <LuxuryButton variant="gold" onClick={() => navigate('/collections')}>Return to Collections</LuxuryButton>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between mb-5">
              {[1, 2, 3].map(s => (
                <div key={s} className="d-flex align-items-center gap-2">
                  <div className={`rounded-circle d-flex align-items-center justify-content-center ${step >= s ? 'bg-dark text-white' : 'bg-light text-secondary'}`} style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                    {s}
                  </div>
                  <span className={`sub-heading ${step === s ? 'text-dark fw-bold' : 'text-secondary'}`} style={{ fontSize: '0.6rem' }}>
                    {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ✅ STEP 1 - Shipping */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h2 className="mb-4">Shipping Sanctuary</h2>
                  <GlassCard className="border-0 soft-shadow mb-4">
                    <div className="row">
                      <div className="col-md-6">
                        <PremiumInput label="First Name" placeholder="Alexander" defaultValue={user?.firstName} />
                      </div>
                      <div className="col-md-6">
                        <PremiumInput label="Last Name" placeholder="Vanguard" defaultValue={user?.lastName} />
                      </div>
                      <div className="col-12">
                        {/* ✅ Capture real address */}
                        <PremiumInput
                          label="Street Address"
                          placeholder="123 Luxury Avenue"
                          value={shippingAddress}
                          onChange={(e: any) => setShippingAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <PremiumInput
                          label="City"
                          placeholder="Paris"
                          value={city}
                          onChange={(e: any) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <PremiumInput
                          label="Country"
                          placeholder="France"
                          value={country}
                          onChange={(e: any) => setCountry(e.target.value)}
                        />
                      </div>
                    </div>
                  </GlassCard>
                  <LuxuryButton variant="gold" onClick={handleNext}>
                    Continue to Payment <ArrowRight size={18} className="ms-2" />
                  </LuxuryButton>
                </motion.div>
              )}

              {/* ✅ STEP 2 - Payment */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Secure Liquidity</h2>
                    <LuxuryButton variant="gold" className="btn-sm" onClick={() => setIsAddCardModalOpen(true)}>
                      <Plus size={16} className="me-2" /> Add New Card
                    </LuxuryButton>
                  </div>
                  <div className="row g-4 mb-4">
                    {cards.length > 0 ? (
                      cards.map((card: any) => (
                        <div key={card.cardId} className="col-md-6">
                          <div
                            className={`glass-panel p-3 cursor-pointer transition-smooth ${selectedCardId === card.cardId ? 'border-gold bg-gold-light shadow-sm' : 'border-luxury'}`}
                            style={{ border: selectedCardId === card.cardId ? '2px solid var(--color-gold)' : '1px solid var(--border-luxury)' }}
                            onClick={() => setSelectedCardId(card.cardId)}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <CreditCard size={24} className={selectedCardId === card.cardId ? 'text-gold' : 'text-secondary'} />
                              <div>
                                <div className="fw-bold small">{card.cardType} Secured</div>
                                <div className="small text-secondary">**** {card.cardNumber?.slice(-4)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-4 glass-panel border-luxury bg-light">
                        <p className="small text-secondary mb-3">No secured cards found in your portfolio.</p>
                      </div>
                    )}
                  </div>

                  {/* ✅ CVV input — shown after card is selected */}
                  {selectedCardId && (
                    <div className="mb-4" style={{ maxWidth: '200px' }}>
                      <PremiumInput
                        label="Enter CVV"
                        placeholder="123"
                        value={cvv}
                        onChange={(e: any) => setCvv(e.target.value)}
                        maxLength={3}
                        required
                      />
                    </div>
                  )}

                  <div className="d-flex gap-3">
                    <LuxuryButton variant="secondary" onClick={() => setStep(1)}>Back</LuxuryButton>
                    <LuxuryButton variant="gold" onClick={handleNext}>Review Masterpieces</LuxuryButton>
                  </div>
                  <AddCardModal
                    isOpen={isAddCardModalOpen}
                    onClose={() => setIsAddCardModalOpen(false)}
                    onAdded={fetchCards}
                  />
                </motion.div>
              )}

              {/* ✅ STEP 3 - Review & Place Order */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h2 className="mb-4">Final Affirmation</h2>
                  <GlassCard className="border-0 soft-shadow mb-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-light">
                        <div className="d-flex align-items-center gap-3">
                          <img src={item.image} className="rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} alt={item.productName} />
                          <div>
                            <div className="fw-bold">{item.productName}</div>
                            <div className="small text-secondary">{item.colorName} / {item.size}</div>
                          </div>
                        </div>
                        <div className="fw-bold">${item.price.toLocaleString()}</div>
                      </div>
                    ))}
                    {/* ✅ Show order summary */}
                    <div className="mt-3 p-3 bg-light rounded small text-secondary">
                      <div><strong>Delivery to:</strong> {shippingAddress}, {city}, {country}</div>
                      <div><strong>Payment:</strong> {selected?.cardType} **** {selected?.cardNumber?.slice(-4)}</div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <span className="sub-heading">Total Acquisition</span>
                      <h3 className="text-gold">${finalTotal.toLocaleString()}</h3>
                    </div>
                  </GlassCard>

                  {isProcessing ? (
                    <div className="text-center py-4">
                      <Loader2 size={40} className="animate-spin mb-3 text-gold" />
                      <p className="sub-heading" style={{ fontSize: '0.7rem' }}>Performing Secure Liquidity Check...</p>
                    </div>
                  ) : (
                    <div className="d-flex gap-3">
                      <LuxuryButton variant="secondary" onClick={() => setStep(2)}>Back</LuxuryButton>
                      <LuxuryButton variant="gold" className="px-5" onClick={handlePlaceOrder}>
                        Finalize Order
                      </LuxuryButton>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <GlassCard className="border-0 soft-shadow bg-light">
              <h4 className="mb-4">Purchase Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">{selected?.cardType} Discount</span>
                  <span className="text-danger">-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Boutique Shipping</span>
                <span className="text-success">Complimentary</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold text-gold h4">${finalTotal.toLocaleString()}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-secondary small">
                <ShieldCheck size={14} /> Encrypted Secure Checkout
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
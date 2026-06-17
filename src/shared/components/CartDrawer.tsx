import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { useToast } from '../../providers/ToastProvider';
import { LuxuryButton } from './LuxuryButton';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleUpdateQuantity = async (productId: string, delta: number) => {
    const item = items.find(i => i.productId === productId);
    if (!item) return;

    try {
      await updateQuantity(productId, delta, item.availableQuantity);
    } catch (err: any) {
      if (err.message === 'LIMIT_REACHED') {
        showToast('Limit reached for this product.', 'warning');
      }
    }
  };

  const handleDeleteClick = (productId: string) => {
    setDeleteTargetId(productId);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      removeItem(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTargetId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed-top w-100 h-100 bg-black bg-opacity-25"
            style={{ zIndex: 1050, backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed-top ms-auto h-100 bg-white shadow-lg glass-panel"
            style={{ width: '400px', zIndex: 1060, borderRadius: '24px 0 0 24px' }}
          >
            <div className="p-4 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Your Collection</h3>
                <X className="cursor-pointer" onClick={onClose} />
              </div>

              <div className="flex-grow-1 overflow-auto pe-2">
                {items.length === 0 ? (
                  <div className="text-center py-5">
                    <ShoppingBag size={48} className="text-light mb-3" />
                    <p className="sub-heading">Your collection is empty</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="glass-panel p-3 mb-3 border-0 soft-shadow d-flex gap-3">
                      <img src={item.image} className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{item.productName}</div>
                        <div className="text-secondary" style={{ fontSize: '0.7rem' }}>{item.colorName} / {item.size}</div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-sm p-0" onClick={() => handleUpdateQuantity(item.productId, -1)}><Minus size={14} /></button>
                            <span className="small">{item.quantity}</span>
                            <button className="btn btn-sm p-0" onClick={() => handleUpdateQuantity(item.productId, 1)}><Plus size={14} /></button>
                          </div>
                          <div className="fw-bold text-gold">${(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      </div>
                      <Trash2
                        size={16}
                        className="text-danger cursor-pointer opacity-50 hover-opacity-100"
                        onClick={() => handleDeleteClick(item.productId)}
                      />
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="mt-4 pt-4 border-top">
                  <div className="d-flex justify-content-between mb-4">
                    <span className="sub-heading">Subtotal</span>
                    <span className="fw-bold h4 text-gold">${subtotal.toLocaleString()}</span>
                  </div>
                  <LuxuryButton
                    variant="gold"
                    className="w-100 py-3"
                    onClick={() => { onClose(); navigate('/checkout'); }}
                  >
                    Proceed to Checkout
                  </LuxuryButton>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delete Confirmation Popup */}
          <AnimatePresence>
            {deleteTargetId && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50"
                  style={{ zIndex: 1070 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 p-4 shadow-lg"
                  style={{ zIndex: 1080, width: '320px' }}
                >
                  <div className="text-center">
                    <div className="mb-3">
                      <Trash2 size={32} className="text-danger" />
                    </div>
                    <h5 className="fw-bold mb-2">Remove Item?</h5>
                    <p className="text-secondary small mb-4">
                      Are you sure you want to remove this product from your collection?
                    </p>
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-outline-secondary flex-fill py-2 rounded-3"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-danger flex-fill py-2 rounded-3"
                        onClick={handleConfirmDelete}
                      >
                        Yes, Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
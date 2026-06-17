import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, CheckCircle2, Truck, Clock } from 'lucide-react';
import type { OrderResponse } from '../shared/types';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { Link } from 'react-router-dom';
import api from '../shared/services/api';
import { Layout } from '../shared/components/Layout';
import { GlassCard } from '../shared/components/GlassCard';
import { useAuth } from '../providers/AuthProvider';

const OrderSkeleton = () => (
  <div className="glass-panel h-100 p-0 overflow-hidden border-0 soft-shadow skeleton-pulse mb-4" style={{ height: '200px' }}>
    <div className="bg-light w-100 h-100 opacity-20"></div>
  </div>
);

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/order-api/customer/${user.emailId}/orders`);
        // Map backend response to frontend expected structure if they differ
        const mappedOrders = response.data.map((order: any) => ({
          id: order.orderId || order.id,
          createdAt: order.dateOfOrder || order.createdAt,
          total: order.totalPrice || order.total || 0,
          status: order.orderStatus || order.status || 'PENDING',
          items: (order.orderedProducts || order.items || []).map((item: any) => ({
            productId: item.productId,
            productName: item.productName || `Product #${item.productId}`,
            image: item.image || 'https://via.placeholder.com/150',
            price: item.price || 0,
            quantity: item.quantity || 0,
            colorName: item.colorName && item.colorName !== 'N/A' ? item.colorName : '',
            size: item.size && item.size !== 'N/A' ? item.size : ''
          }))
        }));
        setOrders(mappedOrders);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h2 className="mb-4">Access Restricted</h2>
          <p className="text-secondary mb-4">Please enter the sanctuary to view your acquisitions.</p>
          <Link to="/login" className="clay-button-gold text-decoration-none d-inline-block px-5">Login to View</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="mb-5">
          <span className="sub-heading">Acquisition History</span>
          <h1 className="luxury-heading h2">Your Orders</h1>
          <p className="text-secondary">Track the journey of your confirmed masterpieces.</p>
        </div>

        <div className="row g-4">
          <div className="col-12">
            <AnimatePresence mode="wait">
              {loading ? (
                [1, 2, 3].map(i => <OrderSkeleton key={i} />)
              ) : orders.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5 glass-panel border-0 soft-shadow">
                  <Package size={48} className="text-light mb-3" />
                  <p className="sub-heading">No orders found in your collection.</p>
                  <Link to="/collections" className="text-gold fw-bold text-decoration-none small">Discover Masterpieces</Link>
                </motion.div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel p-0 overflow-hidden border-0 soft-shadow"
                    >
                      <div className="p-4 bg-light bg-opacity-50 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 border-bottom border-luxury">
                        <div className="d-flex flex-wrap gap-4 gap-lg-5">
                          <div>
                            <div className="sub-heading" style={{ fontSize: '0.6rem' }}>Acquisition ID</div>
                            <div className="fw-bold small">{order.id}</div>
                          </div>
                          <div>
                            <div className="sub-heading" style={{ fontSize: '0.6rem' }}>Date Secured</div>
                            <div className="fw-bold small">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div>
                            <div className="sub-heading" style={{ fontSize: '0.6rem' }}>Total Investment</div>
                            <div className="fw-bold small text-gold">${order.total.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {order.status === 'DELIVERED' ? (
                            <span className="badge bg-success bg-opacity-10 text-success border-0 px-3 py-2 d-flex align-items-center gap-2">
                              <CheckCircle2 size={14} /> Delivered
                            </span>
                          ) : (
                            <span className="badge bg-gold bg-opacity-10 text-gold border-0 px-3 py-2 d-flex align-items-center gap-2">
                              <Truck size={14} /> {order.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-4">
                              <div className="glass-panel p-1 rounded-3" style={{ width: '80px', height: '80px' }}>
                                <img src={item.image} className="w-100 h-100 object-fit-cover rounded-2" />
                              </div>
                              <div>
                                <h6 className="mb-1">{item.productName}</h6>
                                <p className="text-secondary small mb-0">
                                  {item.colorName ? `${item.colorName} • ` : ''}
                                  {item.size ? `${item.size} • ` : ''}
                                  Qty: {item.quantity}
                                </p>
                                <div className="d-flex align-items-center gap-2 x-small text-secondary mt-1" style={{ fontSize: '0.7rem' }}>
                                  <Clock size={12} /> Verification Node: Secured
                                </div>
                              </div>
                            </div>
                            <div className="text-end d-none d-md-block">
                              <LuxuryButton variant="secondary" className="btn-sm px-4">Trace Journey</LuxuryButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
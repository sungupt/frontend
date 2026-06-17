import React, { useState, useEffect } from 'react';
import { Layout } from '../shared/components/Layout';
import { GlassCard } from '../shared/components/GlassCard';
import { useAuth } from '../providers/AuthProvider';
import { motion } from 'framer-motion';
import { Package, MapPin, User, Settings, LogOut, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentManagement from './PaymentManagement';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import api from '../shared/services/api';
import type { OrderResponse } from '../shared/types';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'orders' | 'payments' | 'addresses'>('orders');
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/order-api/customer/${user.emailId}/orders`);
        // Map backend response
        const mappedOrders = response.data.map((order: any) => ({
          id: order.orderId || order.id,
          date: order.dateOfOrder || order.createdAt,
          total: order.totalPrice || order.total || 0,
          status: order.orderStatus || order.status || 'PENDING',
          item: order.orderedProducts?.[0]?.productName || `Order #${order.orderId}`
        }));
        setOrders(mappedOrders);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div className="container py-5">Redirecting...</div>;

  const today = new Date();
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(today.getDate() - 5);

  const recentOrders = orders.filter(order => new Date(order.createdAt) >= fiveDaysAgo);

  return (
    <Layout>
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3">
            <GlassCard className="p-4 border-0 soft-shadow">
              <div className="text-center mb-5">
                <div className="rounded-circle bg-gold-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', color: 'var(--color-gold)' }}>
                  <User size={40} />
                </div>
                <h5 className="mb-1">{user.firstName} {user.lastName}</h5>
                <p className="text-secondary small">{user.emailId}</p>
              </div>

              <div className="d-flex flex-column gap-2">
                <div 
                  className={`glass-panel p-3 cursor-pointer d-flex align-items-center gap-3 transition-smooth border-0 ${activeSection === 'orders' ? 'border-gold bg-gold-light' : 'text-secondary hover-text-dark'}`}
                  style={activeSection === 'orders' ? { border: '2px solid var(--color-gold)' } : {}}
                  onClick={() => setActiveSection('orders')}
                >
                  <Package size={18} className={activeSection === 'orders' ? 'text-gold' : ''} />
                  <span className={`small ${activeSection === 'orders' ? 'fw-bold' : ''}`}>Order History</span>
                </div>
                
                <div 
                  className={`glass-panel p-3 cursor-pointer d-flex align-items-center gap-3 transition-smooth border-0 ${activeSection === 'payments' ? 'border-gold bg-gold-light' : 'text-secondary hover-text-dark'}`}
                  style={activeSection === 'payments' ? { border: '2px solid var(--color-gold)' } : {}}
                  onClick={() => setActiveSection('payments')}
                >
                  <CreditCard size={18} className={activeSection === 'payments' ? 'text-gold' : ''} />
                  <span className={`small ${activeSection === 'payments' ? 'fw-bold' : ''}`}>Secured Payments</span>
                </div>

                <div 
                  className={`glass-panel p-3 cursor-pointer d-flex align-items-center gap-3 transition-smooth border-0 ${activeSection === 'addresses' ? 'border-gold bg-gold-light' : 'text-secondary hover-text-dark'}`}
                  style={activeSection === 'addresses' ? { border: '2px solid var(--color-gold)' } : {}}
                  onClick={() => setActiveSection('addresses')}
                >
                  <MapPin size={18} className={activeSection === 'addresses' ? 'text-gold' : ''} />
                  <span className={`small ${activeSection === 'addresses' ? 'fw-bold' : ''}`}>Addresses</span>
                </div>
                
                <hr className="border-luxury" />
                <div className="glass-panel p-3 cursor-pointer text-danger hover-bg-danger-subtle d-flex align-items-center gap-3 transition-smooth border-0" onClick={logout}>
                  <LogOut size={18} />
                  <span className="small">Logout</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="col-lg-9">
            <div className="mb-5">
              <span className="sub-heading">Welcome Back</span>
              <h2 className="luxury-heading h3">
                {activeSection === 'orders' ? 'Account Overview' : activeSection === 'payments' ? 'Financial Portfolio' : 'Sanctuary Addresses'}
              </h2>
            </div>

            {activeSection === 'orders' && (
              <>
                <div className="row g-4 mb-5">
                  <div className="col-md-4"><GlassCard className="p-4 border-0 soft-shadow text-center"><h3 className="text-gold mb-1">02</h3><p className="text-secondary small mb-0">Active Orders</p></GlassCard></div>
                  <div className="col-md-4"><GlassCard className="p-4 border-0 soft-shadow text-center"><h3 className="text-gold mb-1">12</h3><p className="text-secondary small mb-0">Saved Items</p></GlassCard></div>
                  <div className="col-md-4"><GlassCard className="p-4 border-0 soft-shadow text-center"><h3 className="text-gold mb-1">$3,650</h3><p className="text-secondary small mb-0">Total Acquisitions</p></GlassCard></div>
                </div>

                <h4 className="mb-4">Recent Logistics</h4>
                <div className="d-flex flex-column gap-3">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                    <motion.div key={order.id} whileHover={{ x: 10 }} className="glass-panel p-4 border-0 soft-shadow d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 cursor-pointer" onClick={() => navigate('/orders')}>
                      <div className="d-flex align-items-center gap-4">
                        <div className="bg-light p-3 rounded"><Package size={24} className="text-gold" /></div>
                        <div>
                        <div className="fw-bold">{order.items?.[0]?.productName ?? 'Order'}</div>
                        <div className="text-secondary small">{order.id} • {order.createdAt}</div>
                      </div>
                      </div>
                      <div className="d-flex align-items-center gap-5">
                        <div className="text-end"><div className="fw-bold">${order.total.toLocaleString()}</div><span className={`badge rounded-pill ${order.status === 'SHIPPED' ? 'bg-info' : 'bg-success'} bg-opacity-10 text-dark border-0 small`}>{order.status}</span></div>
                        <ChevronRight size={20} className="text-secondary" />
                      </div>
                    </motion.div>
                  ))
                  ) : (
                    <p className="text-secondary">No logistics recorded in the past 5 days.</p>
                  )}
                </div>
              </>
            )}

            {activeSection === 'payments' && <PaymentManagement />}

            {activeSection === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="border-0 soft-shadow p-5">
                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div className="bg-gold bg-opacity-10 p-3 rounded-circle text-gold">
                      <MapPin size={32} />
                    </div>
                    <div>
                      <h4 className="mb-1">Primary Sanctuary</h4>
                      <p className="text-secondary small mb-0">Verified destination for boutique deliveries.</p>
                    </div>
                  </div>
                  <div className="glass-panel p-4 bg-light bg-opacity-30 border-luxury">
                    <div className="fw-bold mb-2">{user.firstName} {user.lastName}</div>
                    <div className="text-secondary" id="user-address">{(user as any).address || '123 Luxury Avenue, Paris, France'}</div>
                    <div className="text-secondary mt-1">{(user as any).phoneNumber}</div>
                  </div>
                  <LuxuryButton 
                    variant="secondary" 
                    className="mt-4 btn-sm"
                    onClick={async () => {
                      const newAddress = prompt('Enter new address:', (user as any).address);
                      if (newAddress) {
                        try {
                          await api.put(`/customer-api/${user.emailId}/address`, { address: newAddress });
                          // Update UI by triggering a reload or updating state if possible, 
                          // but since AuthProvider manages user, simplest is to alert or refresh
                          alert('Address updated successfully! Please login again to see changes.');
                        } catch (err) {
                          alert('Failed to update address');
                        }
                      }
                    }}
                  >
                    Update Sanctuary Address
                  </LuxuryButton>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
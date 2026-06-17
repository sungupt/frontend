import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { useAuth } from '../../providers/AuthProvider';
import { CartDrawer } from './CartDrawer';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
export const Navbar: React.FC = () => {
  const { items } = useCart();
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
// ...
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [user, isCartOpen]);

  const handleCartOpen = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCartOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="glass-nav py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Menu className="d-lg-none me-3 cursor-pointer" />
            <Link to="/" className="text-decoration-none text-dark">
              <h2 className="m-0" style={{ fontFamily: 'var(--font-luxury)', letterSpacing: '2px' }}>
                EKART <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem', verticalAlign: 'middle' }}>LUXURY</span>
              </h2>
            </Link>
          </div>

          <div className="d-none d-lg-flex gap-4 sub-heading" style={{ fontSize: '0.9rem' }}>
            <Link to="/collections" className="text-decoration-none text-dark hover-text-gold transition-smooth">Collections</Link>
            <Link to="/orders" className="text-decoration-none text-dark hover-text-gold transition-smooth">View Orders</Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <form onSubmit={handleSearch} className="d-none d-md-flex glass-panel px-3 py-1 align-items-center gap-2 border-0 soft-shadow">
              <Search size={16} className="text-secondary" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="border-0 bg-transparent outline-none small" 
                style={{ width: '120px', fontSize: '0.8rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="position-relative cursor-pointer hover-text-gold transition-smooth" onClick={handleCartOpen}>
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" 
                  style={{ fontSize: '0.6rem' }}
                >
                  {items.length}
                </motion.span>
              )}
            </div>
            <User 
              className="cursor-pointer hover-text-gold transition-smooth" 
              size={20} 
              onClick={() => navigate(user ? '/dashboard' : '/login')}
            />
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Layout } from '../shared/components/Layout';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { GlassCard } from '../shared/components/GlassCard';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="sub-heading">Exquisite Craftsmanship</span>
                <h1 className="luxury-heading mb-4 mt-2">
                  Elevate Your <br />
                  Digital Lifestyle
                </h1>
                <p className="lead mb-5 text-secondary" style={{ maxWidth: '500px' }}>
                  Discover the intersection of timeless elegance and modern technology. 
                  Curated luxury for the discerning individual.
                </p>
                <div className="d-flex gap-3">
                  <LuxuryButton variant="gold" style={{ padding: '1rem 2.5rem' }} onClick={() => navigate('/collections')}>
                    Shop Collection
                  </LuxuryButton>
                  <LuxuryButton variant="secondary" style={{ padding: '1rem 2.5rem' }} onClick={() => navigate('/orders')}>
                    View Orders
                  </LuxuryButton>
                </div>
              </motion.div>
            </div>
            
            <div className="col-lg-6 mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="position-relative"
              >
                <div className="glass-panel p-5 overflow-hidden" style={{ borderRadius: '100px 20px 100px 20px', height: '500px' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Luxury Watch"
                    className="w-100 h-100 object-fit-cover rounded"
                    style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
                  />
                </div>
                <GlassCard className="position-absolute bottom-0 start-0 m-4 p-3 d-flex align-items-center gap-3" style={{ minWidth: '200px' }}>
                  <div className="rounded-circle bg-gold p-2" style={{ backgroundColor: 'var(--color-gold)' }}></div>
                  <div>
                    <div className="fw-bold">Limited Edition</div>
                    <div className="sub-heading" style={{ fontSize: '0.6rem' }}>Now Available</div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-8">
              <div className="glass-panel p-0 overflow-hidden position-relative" style={{ height: '400px' }}>
                <img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=1000&q=80" className="w-100 h-100 object-fit-cover" alt="Electronics" />
                <div className="position-absolute bottom-0 start-0 p-5 text-white bg-gradient-to-t from-black-50">
                  <span className="sub-heading text-white opacity-75">Future Living</span>
                  <h2 className="text-white">Elite Electronics</h2>
                  <LuxuryButton variant="gold" className="mt-3" onClick={() => navigate('/collections')}>Explore</LuxuryButton>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-panel p-0 overflow-hidden position-relative" style={{ height: '400px' }}>
                <img src="https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&w=600&q=80" className="w-100 h-100 object-fit-cover" alt="Home Decor" />
                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                  <h3 className="text-white">Artisan Home</h3>
                  <Link to="/collections" className="text-white text-decoration-none small sub-heading opacity-75">View All <ChevronRight size={14} /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-heritage py-5 bg-white">
        <div className="container text-center mb-5">
          <span className="sub-heading">The Global Shopping Brand</span>
          <h2 className="mt-2">Why Choose EKart Luxury</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            EKart is the world's premier digital destination for curated luxury. 
            We bridge the gap between elite global boutiques and the modern digital shopper.
          </p>
        </div>
        
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-6">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }} 
                initial={{ opacity: 0, x: -30 }} 
                viewport={{ once: true }}
                className="pe-lg-5"
              >
                <h3 className="mb-4">The Global Digital Boutique</h3>
                <p className="text-secondary mb-4">
                  We have redefined the luxury shopping experience for the digital age. 
                  EKart provides unparalleled access to the world's most exclusive masterpieces, 
                  all within a single, secure digital sanctuary.
                </p>
                <p className="text-secondary">
                  Our platform is engineered for the discerning individual who values time and 
                  authenticity. Every transaction is a protected journey, ensuring that your 
                  acquisition of high-end electronics, timepieces, and home decor is seamless and secure.
                </p>
              </motion.div>
            </div>
            <div className="col-md-6">
              <GlassCard className="p-0 overflow-hidden border-0 soft-shadow" style={{ height: '400px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                  className="w-100 h-100 object-fit-cover" 
                  alt="Elite Shopping Experience" 
                />
              </GlassCard>
            </div>

            <div className="col-md-6 order-md-2">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }} 
                initial={{ opacity: 0, x: 30 }} 
                viewport={{ once: true }}
                className="ps-lg-5"
              >
                <h3 className="mb-4">Masterpieces Delivered</h3>
                <p className="text-secondary mb-4">
                  Our commitment to excellence extends beyond the digital interface. 
                  We have established an elite logistics network designed specifically 
                  for high-value acquisitions.
                </p>
                <p className="text-secondary">
                  From our temperature-controlled shipping nodes to our white-glove 
                  boutique delivery service, EKart ensures that your masterpiece arrives 
                  in pristine condition, fully verified and ready to elevate your lifestyle.
                </p>
              </motion.div>
            </div>
            <div className="col-md-6 order-md-1">
              <GlassCard className="p-0 overflow-hidden border-0 soft-shadow" style={{ height: '400px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&w=800&q=80" 
                  className="w-100 h-100 object-fit-cover" 
                  alt="Luxury Logistics" 
                />
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
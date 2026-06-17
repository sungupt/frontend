import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../shared/components/Layout';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { useCart } from '../providers/CartProvider';
import { useToast } from '../providers/ToastProvider';
import type { ProductDTO } from '../shared/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../shared/services/api';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('Standard');
  const [selectedSize, setSelectedSize] = useState<string>('Default');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product-api/products/${id}`);
        const p = response.data;
        setProduct({
          id: p.productId.toString(),
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          images: [`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80`],
          colors: ['Standard'],
          sizes: ['Default'],
          stock: p.availableQuantity
        });
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Layout><div className="container py-5 text-center">Loading masterpiece...</div></Layout>;

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addItem({
          productId: product.id,
          productName: product.name,
          colorName: selectedColor,
          size: selectedSize,
          quantity: 1,
          price: product.price,
          image: product.images[0],
          availableQuantity: product.stock
        }, product.stock);
        showToast(`${product.name} added to collection.`, 'success');
      } catch (err: any) {
        if (err.message === 'ALREADY_IN_CART') {
            showToast(`${product.name} is already available in the cart.`, 'warning');
        } else {
            showToast('Failed to add to collection.', 'error');
        }
      }
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <nav className="mb-5 sub-heading d-flex align-items-center gap-2" style={{ fontSize: '0.7rem' }}>
          <Link to="/" className="text-decoration-none text-secondary hover-text-dark">Sanctuary</Link>
          <ChevronRight size={10} />
          <Link to="/collections" className="text-decoration-none text-secondary hover-text-dark">Collection</Link>
          <ChevronRight size={10} />
          <span className="text-dark fw-bold">{product.name}</span>
        </nav>

        <div className="row g-5">
          <div className="col-lg-7">
            <div className="row g-3">
              <div className="col-2 d-flex flex-column gap-3">
                {product.images.map((img, idx) => (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    key={idx}
                    className={`glass-panel p-1 cursor-pointer overflow-hidden transition-smooth ${activeImage === idx ? 'border-gold shadow-sm' : 'opacity-50'}`}
                    style={{ height: '80px', border: activeImage === idx ? '2px solid var(--color-gold)' : '1px solid var(--border-luxury)' }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} className="w-100 h-100 object-fit-cover rounded" />
                  </motion.div>
                ))}
              </div>
              <div className="col-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel overflow-hidden border-0 soft-shadow"
                    style={{ height: '600px' }}
                  >
                    <img src={product.images[activeImage]} className="w-100 h-100 object-fit-cover" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ps-lg-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="sub-heading text-gold d-block">Elite Catalog / {product.category}</span>
                {product.stock > 0 ? (
                  <span className="badge bg-success bg-opacity-10 text-success border-0 px-3 py-2 small">In Stock ({product.stock})</span>
                ) : (
                  <span className="badge bg-danger bg-opacity-10 text-danger border-0 px-3 py-2 small">Out of Portfolio</span>
                )}
              </div>
              <h1 className="mb-3 luxury-heading h2">{product.name}</h1>
              
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="d-flex text-warning">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= 4 ? "currentColor" : "none"} />)}
                </div>
                <span className="small text-secondary">(Authenticated Review)</span>
              </div>

              <h2 className="display-6 mb-4 text-gold" style={{ fontFamily: 'var(--font-main)', fontWeight: 300 }}>
                ${product.price.toLocaleString()}
              </h2>

              <p className="text-secondary mb-5 leading-relaxed" style={{ fontSize: '1.1rem' }}>{product.description}</p>

              <div className="glass-panel p-4 border-0 soft-shadow mb-5 bg-light bg-opacity-30">
                <div className="mb-4">
                  <span className="sub-heading d-block mb-3" style={{ fontSize: '0.7rem' }}>Select Finish</span>
                  <div className="d-flex gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`clay-button btn-sm px-4 ${selectedColor === color ? 'clay-button-gold' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="sub-heading d-block mb-3" style={{ fontSize: '0.7rem' }}>Select Dimension</span>
                  <div className="d-flex gap-3">
                    {product.sizes.map(size => (
                      <div
                        key={size}
                        className={`glass-panel p-2 px-4 cursor-pointer text-center transition-smooth ${selectedSize === size ? 'border-gold bg-gold-light' : ''}`}
                        style={{ 
                          border: selectedSize === size ? '2px solid var(--color-gold)' : '1px solid var(--border-luxury)',
                          backgroundColor: selectedSize === size ? 'rgba(212, 175, 55, 0.05)' : 'transparent'
                        }}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <LuxuryButton 
                variant="gold" 
                className={`w-100 py-3 mb-4 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Acquire Now' : 'Currently Unavailable'}
              </LuxuryButton>

              <div className="glass-panel p-3 text-center border-0 soft-shadow">
                <p className="small mb-0 text-secondary d-flex align-items-center justify-content-center gap-2">
                  <Check size={14} className="text-success" /> 
                  Complimentary secure transit & white-glove delivery
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
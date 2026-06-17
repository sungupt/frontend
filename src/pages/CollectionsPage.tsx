import React, { useState, useEffect } from 'react';
import { Layout } from '../shared/components/Layout';
import { GlassCard } from '../shared/components/GlassCard';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import type { ProductDTO } from '../shared/types';
import { Search, SlidersHorizontal, PackageX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../shared/services/api';

const ProductSkeleton = () => (
  <div className="col-md-6 col-xl-4">
    <div className="glass-panel h-100 p-0 overflow-hidden border-0 soft-shadow skeleton-pulse" style={{ height: '450px' }}>
      <div className="bg-light w-100 h-100 opacity-20"></div>
    </div>
  </div>
);

const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchByQuery] = useState('');

  const fetchProducts = async (keyword?: string) => {
    setLoading(true);
    try {
      const url = keyword ? `/product-api/products/find/${keyword}` : '/product-api/products';
      const response = await api.get(url, { params: { pageSize: 50 } });
      const mappedProducts = response.data.map((p: any) => ({
        id: p.productId.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: [`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80`],
        colors: ['Standard'],
        sizes: ['Default'],
        stock: p.availableQuantity
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      if (err.response?.status === 400) setProducts([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchByQuery(q);
      fetchProducts(q);
    } else {
      fetchProducts();
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  const [sortOption, setSortOption] = useState('Featured');

  const handleSort = (productsToSort: ProductDTO[]) => {
    let sorted = [...productsToSort];
    switch (sortOption) {
      case 'PriceLowToHigh':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'PriceHighToLow':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'NameAToZ':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NameZToA':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return sorted;
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const sortedAndFilteredProducts = handleSort(products.filter(p => filterCategory === 'All' || p.category === filterCategory));

  return (
    <Layout>
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="sub-heading">Exclusive Catalog</span>
            <h1 className="luxury-heading h2 mb-0">The Collection</h1>
          </motion.div>
          
          <div className="d-flex gap-3">
            <form onSubmit={handleSearch} className="glass-panel px-3 py-2 d-flex align-items-center gap-2">
              <Search size={18} className="text-secondary" />
              <input 
                type="text" 
                placeholder="Search masterpieces..." 
                className="border-0 bg-transparent outline-none small" 
                style={{ width: '180px' }}
                value={searchQuery}
                onChange={(e) => setSearchByQuery(e.target.value)}
              />
            </form>
            <select 
              className="glass-panel px-3 py-2 border-0 small fw-bold cursor-pointer hover-bg-light transition-smooth"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
                <option value="Featured">Sort By</option>
                <option value="PriceLowToHigh">Price: Low to High</option>
                <option value="PriceHighToLow">Price: High to Low</option>
                <option value="NameAToZ">Name: A to Z</option>
                <option value="NameZToA">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3 d-none d-lg-block">
            <GlassCard className="border-0 soft-shadow sticky-top" style={{ top: '120px' }}>
              <h5 className="mb-4 sub-heading" style={{ fontSize: '0.8rem' }}>By Category</h5>
              <div className="d-flex flex-column gap-3">
                {categories.map(cat => (
                  <div 
                    key={cat} 
                    className={`cursor-pointer transition-smooth d-flex justify-content-between align-items-center ${filterCategory === cat ? 'text-gold fw-bold' : 'text-secondary hover-text-dark'}`}
                    onClick={() => setFilterCategory(cat)}
                  >
                    <span>{cat}</span>
                    {filterCategory === cat && <motion.div layoutId="activeCat" className="bg-gold rounded-circle" style={{ width: '6px', height: '6px' }} />}
                  </div>
                ))}
              </div>
              <hr className="my-4 border-luxury" />
              <div className="glass-panel p-3 border-0 bg-gold-light bg-opacity-10 rounded-4">
                <p className="small text-secondary mb-0">Discover artisanal masterpieces verified by EKart Sanctuary.</p>
              </div>
            </GlassCard>
          </div>

          <div className="col-lg-9">
            <div className="row g-4">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)
                ) : sortedAndFilteredProducts.length > 0 ? (
                  sortedAndFilteredProducts.map((product) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={product.id} 
                      className="col-md-6 col-xl-4"
                    >
                      <div
                        className="glass-panel h-100 p-0 overflow-hidden cursor-pointer border-0 soft-shadow group"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div className="position-relative overflow-hidden" style={{ height: '320px' }}>
                          <motion.img 
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={product.images[0]} 
                            className="w-100 h-100 object-fit-cover"
                            alt={product.name}
                          />
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge glass-panel text-gold px-3 py-2 border-0" style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                              {product.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="mb-1 text-truncate">{product.name}</h5>
                          <p className="text-secondary small mb-3 text-truncate-2" style={{ height: '40px' }}>{product.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="sub-heading text-gold mb-0" style={{ fontSize: '0.6rem' }}>Acquisition</div>
                              <span className="fw-bold h5 mb-0">${product.price.toLocaleString()}</span>
                            </div>
                            <LuxuryButton variant="gold" className="btn-sm px-3 rounded-pill">Explore</LuxuryButton>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-12 text-center py-5">
                    <PackageX size={64} className="text-light mb-4" />
                    <h3 className="mb-2">The Vault is Quiet</h3>
                    <p className="text-secondary">No masterpieces match your current search or filter.</p>
                    <LuxuryButton variant="secondary" className="mt-3" onClick={() => { setSearchByQuery(''); fetchProducts(); }}>View All Masterpieces</LuxuryButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionsPage;
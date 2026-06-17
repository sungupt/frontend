import React, { useState } from 'react';
import { Layout } from '../shared/components/Layout';
import { GlassCard } from '../shared/components/GlassCard';
import { PremiumInput } from '../shared/components/PremiumInput';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from '../providers/ToastProvider';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ emailId: email, password });
      showToast('Welcome back to the sanctuary.', 'success');
      navigate('/collections');
    } catch (err: any) {
      showToast(err.response?.data?.errorMessage || 'Authentication failed.', 'error');
    }
  };

  return (
    <Layout>
      <div className="container py-5 d-flex justify-content-center align-items-center min-vh-75">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-100"
          style={{ maxWidth: '450px' }}
        >
          <GlassCard className="p-5 border-0 soft-shadow text-center">
            <span className="sub-heading mb-3 d-block">Elite Access</span>
            <h2 className="mb-5">Enter the Sanctuary</h2>
            
            <form onSubmit={handleSubmit}>
              <PremiumInput 
                label="Email Address" 
                type="email" 
                placeholder="alexander@vanguard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PremiumInput 
                label="Passphrase" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <div className="text-end mb-4">
                <a href="#" className="small text-secondary text-decoration-none hover-text-dark transition-smooth">Forgotten passphrase?</a>
              </div>

              <LuxuryButton variant="gold" className="w-100 py-3 mb-4" type="submit">
                Access Account
              </LuxuryButton>
            </form>

            <p className="text-secondary small">
              New to the collection? <Link to="/register" className="text-gold fw-bold text-decoration-none">Apply for Access</Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
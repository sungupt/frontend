import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-vh-100">
      <div className="ambient-glow" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="ambient-glow" style={{ bottom: '-10%', right: '-10%', animationDelay: '-5s' }}></div>
      
      <Navbar />
      
      <main style={{ paddingTop: '100px' }}>
        {children}
      </main>
      
      <footer className="py-5 mt-5 border-top border-luxury">
        <div className="container text-center">
          <p className="sub-heading mb-0" style={{ fontSize: '0.7rem' }}>
            © 2026 EKart Luxury Enterprise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
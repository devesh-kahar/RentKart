import React from 'react';
import { Repeat, ShieldCheck, Lock, Award, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper">
                <Repeat size={20} strokeWidth={2.6} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Rent<span style={{ color: 'var(--primary)' }}>Loop</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '340px', color: 'var(--slate-600)' }}>
              The modern peer-to-peer marketplace that goes beyond OLX: <strong>Buy, Sell, and Rent</strong> virtually anything within your university community with verified escrow deposits and automated demand matching.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.78rem', color: 'var(--emerald-hover)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={16} /> 100% Secure Deposit Protection
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock size={16} /> 100% Deposit Protection
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Marketplace</h4>
            <ul className="footer-links-list">
              <li><a href="#browse">Browse Rental Gear</a></li>
              <li><a href="#buy">Buy & Sell Listings</a></li>
              <li><a href="#reverse">Wanted to Rent Board</a></li>
              <li><a href="#categories">Explore Categories</a></li>
              <li><a href="#deals">Campus Hot Deals</a></li>
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="footer-col-title">How Renting Works</h4>
            <ul className="footer-links-list">
              <li><a href="#deposit">Security Deposit Escrow</a></li>
              <li><a href="#handover">Campus Handover Protocol</a></li>
              <li><a href="#matching">Intelligent Matching Engine</a></li>
              <li><a href="#reviews">Verified Student Reviews</a></li>
              <li><a href="#chat">Secure In-App Chat</a></li>
            </ul>
          </div>

          {/* Tech Stack & Academic */}
          <div>
            <h4 className="footer-col-title">Architecture</h4>
            <ul className="footer-links-list">
              <li><span>Backend: Spring Boot 4.1.1 (Java 17)</span></li>
              <li><span>Frontend: React 19 + Vite 8</span></li>
              <li><span>Security: Stateless JWT + BCrypt</span></li>
              <li><span>Database: MySQL 8.4 + JPA/Hibernate</span></li>
              <li><span>Realtime: WebSocket + STOMP</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div style={{ color: 'var(--slate-500)' }}>
            © {new Date().getFullYear()} RentLoop Platform • Academic & Peer-to-Peer Project.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-500)' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for student collaboration and sustainable gear reuse.
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Repeat, PlusCircle, Sparkles, ShieldCheck, Zap, ArrowRight, Tag } from 'lucide-react';

export const HeroBanner = ({ onExplore, onPostItem, onPostRequest }) => {
  return (
    <section className="hero-wrapper">
      <div className="hero-inner">
        {/* Top Feature Pill */}
        <div className="hero-pill-badge">
          <Sparkles size={15} color="var(--primary)" />
          <span>The Next Evolution of OLX • Buy, Sell & <strong>Rent</strong></span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline">
          Don't Just Buy or Sell.<br />
          <span className="gradient-text">Rent Anything In Your Community.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subhead">
          Traditional classifieds like OLX only give you two choices: buy it forever or sell it away.
          With <strong>RentLoop</strong>, university students and peers can rent pro cameras, laptops, musical instruments, and gaming rigs for a weekend — with verified escrow deposits and automated demand matching.
        </p>

        {/* Call to Actions */}
        <div className="hero-actions-row">
          <button 
            id="hero-btn-explore"
            className="hero-btn-primary"
            onClick={onExplore}
          >
            <Repeat size={18} />
            <span>Browse Rentals & Sales</span>
            <ArrowRight size={18} />
          </button>

          <button 
            id="hero-btn-post"
            className="hero-btn-secondary"
            onClick={onPostItem}
          >
            <PlusCircle size={18} color="var(--primary)" />
            <span>List an Item to Rent / Sell</span>
          </button>

          <button 
            id="hero-btn-request"
            className="hero-btn-secondary"
            onClick={onPostRequest}
            style={{ background: 'var(--secondary-light)', borderColor: '#c7d2fe', color: 'var(--secondary)' }}
          >
            <Zap size={18} color="var(--secondary)" />
            <span>Post "Wanted to Rent" Request</span>
          </button>
        </div>

        {/* Key Stats Bar */}
        <div className="hero-stats-banner">
          <div className="stat-item">
            <span className="stat-number gradient-text">1,480+</span>
            <span className="stat-label">Campus Items Circulated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: 'var(--secondary)' }}>$38,500+</span>
            <span className="stat-label">Student Rental Savings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: '#059669' }}>100%</span>
            <span className="stat-label">Escrow Deposit Protection</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: 'var(--accent-amber)' }}>&lt; 0.4 mi</span>
            <span className="stat-label">Average Campus Handover</span>
          </div>
        </div>
      </div>
    </section>
  );
};

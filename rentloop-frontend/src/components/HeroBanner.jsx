import React, { useState, useEffect, useRef } from 'react';
import { 
  Repeat, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Laptop, 
  Camera, 
  Music, 
  Star,
  CheckCircle2
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    categoryTag: 'Tech & Laptops',
    categoryIcon: Laptop,
    badgeColor: '#6366f1',
    title: 'Rent M3 Max MacBooks & Hackathon Rigs',
    subtitle: 'Power through machine learning models, finals week, and 48-hour hackathons without dropping $3,000+ upfront.',
    trustTag: '100% Secure Deposit Protection',
    perks: [
      '⚡ Apple M3 Max & 36GB RAM',
      '🔌 140W Fast Charger Included',
      '📍 Library Plaza • 0.2 mi'
    ],
    priceText: '$28',
    priceSub: 'per day • 100% deposit protected',
    primaryActionText: 'Rent Tech Rig',
    use3D: false,
    specs: ['36GB Unified RAM', 'Liquid Retina XDR', 'M3 Max 14-Core CPU'],
    gearImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    categoryTag: 'Cameras & Creator Gear',
    categoryIcon: Camera,
    badgeColor: '#06b6d4',
    title: 'Pro Cinema Cameras, Drones & Prime Lenses',
    subtitle: 'Capture student films, commencement ceremonies, and campus concerts with 4K Sony A7 IV bodies, G-Master glass & DJI gimbals.',
    trustTag: '100% Secure Deposit Protection',
    perks: [
      '🎥 4K 60p 10-Bit 4:2:2 Video',
      '🔍 Sony 24-70mm f/2.8 GM Glass',
      '🔋 3 Batteries & Dual Charger'
    ],
    priceText: '$35',
    priceSub: 'per day • 100% deposit protected',
    primaryActionText: 'Rent Camera Gear',
    use3D: false,
    fallbackImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    categoryTag: 'Musical Instruments & Gaming',
    categoryIcon: Music,
    badgeColor: '#ec4899',
    title: 'Guitars, DJ Controllers & PS5 Dorm Bundles',
    subtitle: 'Host acoustic jam sessions, prep for orchestra auditions, or battle dorm mates on EA Sports FC 25 & Super Smash Bros.',
    trustTag: '100% Secure Deposit Protection',
    perks: [
      '🎸 Yamaha & Fender Guitars',
      '🎮 2 DualSense Wireless Controllers',
      '✨ Sanitized & Ready to Play'
    ],
    priceText: '$14',
    priceSub: 'per day • 100% deposit protected',
    primaryActionText: 'Rent Music & Gaming',
    use3D: false,
    fallbackImage: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=900&q=80'
  }
];

export const HeroBanner = ({ onExplore, onPostItem, onPostRequest }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef(null);

  // Auto-slide every 4 seconds as requested
  useEffect(() => {
    if (isPaused) {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
      return;
    }

    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, [isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-wrapper">
      <div className="hero-inner">
        {/* Clean, Bright White Card Container */}
        <div 
          id="hero-promotional-carousel"
          className="hero-carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {SLIDES.map((slide, index) => {
            const Icon = slide.categoryIcon;
            const isActive = index === currentSlide;

            return (
              <div 
                key={slide.id} 
                className={`carousel-slide ${isActive ? 'active' : ''}`}
                aria-hidden={!isActive}
              >
                {/* Left Side: Clean Light Content */}
                <div className="carousel-slide-left">
                  {/* Category Pill Tag */}
                  <div className="carousel-category-tag">
                    <Icon size={14} color="var(--primary)" />
                    <span>{slide.categoryTag}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="carousel-headline">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="carousel-subhead">
                    {slide.subtitle}
                  </p>

                  {/* Specs & Trust Highlights */}
                  <div className="carousel-perks-row">
                    <div className="carousel-perk-pill trust">
                      <ShieldCheck size={14} color="var(--emerald)" />
                      <span>{slide.trustTag}</span>
                    </div>

                    {slide.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="carousel-perk-pill">
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons & Pricing Row */}
                  <div className="carousel-actions-row">
                    <button 
                      id={`hero-btn-rent-${slide.id}`}
                      className="carousel-btn-primary"
                      onClick={onExplore}
                    >
                      <Repeat size={17} />
                      <span>{slide.primaryActionText}</span>
                      <ArrowRight size={16} />
                    </button>

                    <button 
                      id="hero-btn-list-gear"
                      className="carousel-btn-secondary"
                      onClick={onPostItem}
                    >
                      <PlusCircle size={17} color="var(--primary)" />
                      <span>List Gear & Earn</span>
                    </button>

                    <button 
                      id="hero-btn-request-gear"
                      className="carousel-btn-secondary"
                      onClick={onPostRequest}
                      style={{ background: 'var(--primary-light)', borderColor: 'var(--primary-border)', color: 'var(--primary)' }}
                    >
                      <Zap size={17} color="var(--primary)" />
                      <span>Wanted Request</span>
                    </button>

                    <div className="carousel-price-tag">
                      <div className="carousel-price-val">
                        From {slide.priceText}
                      </div>
                      <div className="carousel-price-sub">
                        {slide.priceSub}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Clean Light-Themed 3D Asset or Feature Product Showcase */}
                <div className="carousel-slide-right">
                  {/* Floating Badges */}
                  <div className="carousel-floating-badge badge-top">
                    <div className="brand-icon-wrapper" style={{ width: '30px', height: '30px', borderRadius: '8px' }}>
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--slate-900)' }}>Deposit Protection</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--emerald-hover)', fontWeight: 700 }}>100% Escrow Guarded</div>
                    </div>
                  </div>

                  <div className="carousel-floating-badge badge-bottom">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
                      <Star size={16} fill="#f59e0b" />
                      <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)' }}>4.9/5.0</strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                      from 1,480+ student rentals
                    </div>
                  </div>

                    <div className="carousel-right-showcase">
                      <div className="carousel-showcase-card">
                        <img 
                          src={slide.gearImage || slide.fallbackImage} 
                          alt={slide.title} 
                          className="carousel-right-img" 
                          loading="eager"
                        />
                        {/* Live Hardware Highlight Bar */}
                        <div className="carousel-item-chip">
                          <span className="live-pulse-dot" />
                          <span>Campus Verified • Available for Instant Pickup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Previous / Next Manual Navigation Arrows */}
          <button 
            type="button"
            id="carousel-btn-prev"
            className="carousel-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous promotional slide"
          >
            <ChevronLeft size={22} />
          </button>

          <button 
            type="button"
            id="carousel-btn-next"
            className="carousel-nav-btn next"
            onClick={handleNext}
            aria-label="Next promotional slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Bottom Bar: Indicators & Counter */}
          <div className="carousel-bottom-bar">
            <div className="carousel-dots">
              {SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  id={`carousel-dot-${dotIdx}`}
                  className={`carousel-dot ${dotIdx === currentSlide ? 'active' : ''}`}
                  onClick={() => handleDotClick(dotIdx)}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <div className="carousel-counter">
              <span>0{currentSlide + 1}</span>
              <span style={{ opacity: 0.5, margin: '0 0.2rem' }}>/</span>
              <span>0{SLIDES.length}</span>
            </div>
          </div>
        </div>

        {/* Key Campus Stats Bar (Strict Light Mode) */}
        <div className="hero-stats-banner">
          <div className="stat-item">
            <span className="stat-number gradient-text">1,480+</span>
            <span className="stat-label">Items Circulated on Campus</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: 'var(--primary)' }}>$38,500+</span>
            <span className="stat-label">Student Rental Savings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number gradient-emerald-text">100%</span>
            <span className="stat-label">Secure Deposit Protection</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" style={{ color: 'var(--accent-amber)' }}>&lt; 0.4 mi</span>
            <span className="stat-label">Average Campus Handover Distance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Search, 
  X,
  Repeat,
  ArrowRight,
  Clock,
  Filter,
  Flame,
  AlertCircle,
  Tag,
  Laptop,
  Camera,
  Music,
  Gamepad2,
  Bike,
  BookOpen,
  Shirt,
  Wrench,
  CheckCircle2,
  Send
} from 'lucide-react';
import { rentalRequestsApi, categoriesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ListingCard } from '../components/ListingCard';

const getCategoryIcon = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('laptop') || name.includes('tech')) return Laptop;
  if (name.includes('camera') || name.includes('optic')) return Camera;
  if (name.includes('music') || name.includes('instrument')) return Music;
  if (name.includes('game') || name.includes('console')) return Gamepad2;
  if (name.includes('bike') || name.includes('mobility')) return Bike;
  if (name.includes('book') || name.includes('academic')) return BookOpen;
  if (name.includes('fashion') || name.includes('wear')) return Shirt;
  if (name.includes('tool') || name.includes('diy')) return Wrench;
  return Tag;
};

export const RentalRequestsPage = ({ onOpenCreateRequest, onSelectListing }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMatches, setActiveMatches] = useState(null); // { request, matches: [] }
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [urgencyFilter, setUrgencyFilter] = useState('ALL'); // 'ALL' | 'URGENT' | 'HIGH' | 'NORMAL'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allRequests, allCats] = await Promise.all([
        rentalRequestsApi.getAll(),
        categoriesApi.getAll()
      ]);
      setRequests(allRequests);
      setCategories(allCats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindMatches = async (req) => {
    setLoadingMatches(true);
    try {
      const matches = await rentalRequestsApi.findMatches(req.id);
      setActiveMatches({ request: req, matches });
    } catch (e) {
      showToast('Error searching for matches', 'error');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleFulfillRequest = (req) => {
    showToast(`Notification sent to ${req.requesterName}! They will receive your offer to supply this gear.`, 'success');
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (selectedCategory && Number(req.categoryId) !== Number(selectedCategory)) return false;
    if (urgencyFilter !== 'ALL' && req.urgency !== urgencyFilter) return false;
    if (searchFilter.trim() !== '') {
      const q = searchFilter.toLowerCase();
      const matchTitle = (req.title || '').toLowerCase().includes(q);
      const matchDesc = (req.description || '').toLowerCase().includes(q);
      const matchCat = (req.categoryName || '').toLowerCase().includes(q);
      const matchReq = (req.requesterName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat && !matchReq) return false;
    }
    return true;
  });

  return (
    <div className="main-content-layout">
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #eff6ff 100%)',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Decorative Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            background: 'var(--primary-light)', 
            border: '1px solid var(--primary-border)',
            padding: '0.3rem 0.75rem', 
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary)', 
            fontSize: '0.76rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '0.85rem' 
          }}>
            <Sparkles size={14} />
            <span>Reverse Demand Marketplace</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.3rem)', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.6rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Wanted to Rent: <span className="gradient-text">Campus Request Board</span>
          </h1>

          <p style={{ color: 'var(--slate-600)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Can't find the exact gear in the marketplace? Post your specific requirements and budget. Peer owners with matching equipment get alerted instantly, or run our <strong>Intelligent Match Engine</strong> to find active compatible listings!
          </p>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--emerald)" />
              <span><strong>{requests.length}</strong> Active Student Requests</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={16} color="#f59e0b" />
              <span>Avg Match Time: <strong>&lt; 2.4 Hours</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span>100% Escrow Protection</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <button
            id="btn-open-create-request-page"
            className="carousel-btn-primary"
            style={{ padding: '0.85rem 1.6rem', fontSize: '0.94rem' }}
            onClick={onOpenCreateRequest}
          >
            <Plus size={18} />
            <span>Post a Wanted Request</span>
          </button>
        </div>
      </div>

      {/* Search, Category & Urgency Filter Strip */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Top Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
              placeholder="Filter requests by title, gear, or requester name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          {/* Urgency Pill Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--slate-100)', padding: '0.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--slate-200)' }}>
            <button
              className={`filter-tab-btn ${urgencyFilter === 'ALL' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
              onClick={() => setUrgencyFilter('ALL')}
            >
              All Urgency
            </button>
            <button
              className={`filter-tab-btn ${urgencyFilter === 'URGENT' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', color: urgencyFilter === 'URGENT' ? '#e11d48' : undefined }}
              onClick={() => setUrgencyFilter('URGENT')}
            >
              🔥 Urgent (Hackathon/Finals)
            </button>
            <button
              className={`filter-tab-btn ${urgencyFilter === 'HIGH' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', color: urgencyFilter === 'HIGH' ? '#ea580c' : undefined }}
              onClick={() => setUrgencyFilter('HIGH')}
            >
              ⚡ High Priority
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
          <button
            className={`cat-pill ${selectedCategory === null ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            onClick={() => setSelectedCategory(null)}
          >
            <span>All Categories ({requests.length})</span>
          </button>
          {categories.map(c => {
            const Icon = getCategoryIcon(c.name);
            const count = requests.filter(r => Number(r.categoryId) === Number(c.id)).length;
            return (
              <button
                key={c.id}
                className={`cat-pill ${selectedCategory === c.id ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
              >
                <Icon size={14} />
                <span>{c.name} {count > 0 && `(${count})`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--slate-500)' }}>
          <Repeat size={32} className="spin-animation" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <div>Loading student rental requests...</div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'white', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px dashed var(--slate-300)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
            No requests found matching your filter
          </h3>
          <p style={{ color: 'var(--slate-500)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.88rem' }}>
            Try resetting your filters or post the first request for this category!
          </p>
          <button 
            className="hero-btn-secondary" 
            onClick={() => { setSelectedCategory(null); setSearchFilter(''); setUrgencyFilter('ALL'); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredRequests.map(req => {
            const isMine = req.requesterEmail === currentUser?.email;
            const CategoryIcon = getCategoryIcon(req.categoryName);
            const isUrgent = req.urgency === 'URGENT' || req.urgency === 'HIGH';

            return (
              <div 
                key={req.id}
                id={`request-card-${req.id}`}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: isUrgent ? '1px solid #fecdd3' : '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header: Category Tag & Status / Urgency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--primary-light)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 700 }}>
                    <CategoryIcon size={13} />
                    <span>{req.categoryName}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {req.urgency === 'URGENT' && (
                      <span style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Flame size={12} /> URGENT
                      </span>
                    )}
                    {req.urgency === 'HIGH' && (
                      <span style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#ea580c', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                        HIGH PRIORITY
                      </span>
                    )}
                    <span className="live-status-pill live" style={{ fontSize: '0.7rem' }}>
                      <span className="status-dot green" />
                      <span>OPEN</span>
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.35, marginBottom: '0.35rem' }}>
                    {req.title || req.description}
                  </h3>
                  {req.title && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                      {req.description}
                    </p>
                  )}
                </div>

                {/* Budget & Date Window Box */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'var(--slate-50)', 
                  border: '1px solid var(--slate-200)',
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-md)' 
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>Daily Budget</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-hover)' }}>
                      ${req.budgetPerDay} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)' }}>/ day</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>Needed Window</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} color="var(--primary)" />
                      <span>{req.startDate} → {req.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Requester Identity */}
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Requested by: <strong style={{ color: 'var(--slate-800)' }}>{req.requesterName}</strong> {isMine && <span style={{ color: 'var(--primary)', fontWeight: 700 }}>(You)</span>}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>Verified Student</span>
                </div>

                {/* Actions: Run Match Engine & Fulfill */}
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    id={`btn-match-request-${req.id}`}
                    className="hero-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.86rem', padding: '0.65rem' }}
                    onClick={() => handleFindMatches(req)}
                  >
                    <Sparkles size={16} />
                    <span>Run Intelligent Match Engine</span>
                  </button>

                  {!isMine && (
                    <button
                      id={`btn-fulfill-request-${req.id}`}
                      className="hero-btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem', padding: '0.55rem' }}
                      onClick={() => handleFulfillRequest(req)}
                    >
                      <Send size={15} color="var(--primary)" />
                      <span>I Have This Gear (Offer to Rent)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matches Modal Drawer */}
      {activeMatches && (
        <div className="modal-backdrop" onClick={() => setActiveMatches(null)}>
          <div 
            id="request-matches-modal"
            className="modal-container large" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Intelligent Matching Engine
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Matching Listings Found ({activeMatches.matches.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                  For request: "{activeMatches.request.title || activeMatches.request.description}" (Budget: ${activeMatches.request.budgetPerDay}/day)
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveMatches(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {activeMatches.matches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--slate-500)' }}>
                  <AlertCircle size={36} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-800)', marginBottom: '0.35rem' }}>
                    No Current Listings Match This Budget
                  </h4>
                  <p style={{ fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                    There are no listings in <strong>{activeMatches.request.categoryName}</strong> priced at or below ${activeMatches.request.budgetPerDay}/day right now. Owners will be notified automatically when they list!
                  </p>
                  <button 
                    className="hero-btn-primary" 
                    onClick={() => setActiveMatches(null)}
                  >
                    Got It
                  </button>
                </div>
              ) : (
                <div className="listings-grid">
                  {activeMatches.matches.map(l => (
                    <ListingCard
                      key={l.id}
                      listing={l}
                      onSelectListing={(item) => {
                        setActiveMatches(null);
                        onSelectListing(item);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

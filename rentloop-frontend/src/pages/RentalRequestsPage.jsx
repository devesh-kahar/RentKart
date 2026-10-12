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
  ArrowRight
} from 'lucide-react';
import { rentalRequestsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ListingCard } from '../components/ListingCard';

export const RentalRequestsPage = ({ onOpenCreateRequest, onSelectListing }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [activeMatches, setActiveMatches] = useState(null); // { request, matches: [] }
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const all = await rentalRequestsApi.getAll();
      setRequests(all);
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

  return (
    <div className="main-content-layout">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdfa 100%)',
        border: '1px solid #c7d2fe',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Sparkles size={16} />
            <span>Reverse Demand Marketplace</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            Wanted to Rent: Campus Request Board
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            In traditional sites like OLX, if nobody is selling what you want, you are stuck. On <strong>RentLoop</strong>, students post their demand requests, and our matching engine notifies gear owners automatically!
          </p>
        </div>

        <button
          id="btn-open-create-request-page"
          className="hero-btn-primary"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)' }}
          onClick={onOpenCreateRequest}
        >
          <Plus size={18} />
          <span>Post a Rental Request</span>
        </button>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
          Loading student rental requests...
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
          No open requests right now. Be the first to post one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {requests.map(req => {
            const isMine = req.requesterEmail === currentUser?.email;
            return (
              <div 
                key={req.id}
                id={`request-card-${req.id}`}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--secondary)' }}>
                      {req.categoryName}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                      {req.description}
                    </h3>
                  </div>
                  <span className={`status-badge ${req.status}`}>{req.status}</span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 600 }}>Daily Budget</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
                      ${req.budgetPerDay}/day
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 600 }}>Needed Window</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} />
                      {req.startDate} → {req.endDate}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Requested by: <strong>{req.requesterName}</strong></span>
                  {isMine && <span style={{ color: 'var(--primary)', fontWeight: 700 }}>(You)</span>}
                </div>

                {/* Action CTA */}
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    id={`btn-match-request-${req.id}`}
                    className="hero-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.55rem' }}
                    onClick={() => handleFindMatches(req)}
                  >
                    <Sparkles size={16} />
                    <span>Run Intelligent Match Engine</span>
                  </button>
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
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                  Intelligent Matching Engine
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  Matching Listings Found ({activeMatches.matches.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                  For request: "{activeMatches.request.description}" (Budget: ${activeMatches.request.budgetPerDay}/day)
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveMatches(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {activeMatches.matches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
                  No active listings match this specific category and budget right now.
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

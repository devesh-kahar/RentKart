import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle,
  Eye,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { listingsApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const OwnerDashboard = ({ onOpenCreateListing, onSelectListing, onOpenChat }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [myListings, setMyListings] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOwnerData();
  }, [currentUser]);

  const loadOwnerData = async () => {
    if (!currentUser?.email) return;
    setIsLoading(true);
    try {
      const listings = await listingsApi.getMyListings(currentUser.email);
      const bookings = await bookingsApi.getBookingsOnMyItems(currentUser.email);
      setMyListings(listings);
      setIncomingBookings(bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      await listingsApi.delete(id);
      showToast("Listing removed successfully", "success");
      loadOwnerData();
    }
  };

  const handleUpdateBooking = async (id, status) => {
    await bookingsApi.updateStatus(id, status);
    showToast(`Booking transitioned to ${status}!`, 'success');
    loadOwnerData();
  };

  // Calculations
  const pendingRequests = incomingBookings.filter(b => b.status === 'REQUESTED');
  const activeRentals = incomingBookings.filter(b => b.status === 'ACTIVE');
  const totalEarnings = incomingBookings
    .filter(b => b.status === 'RETURNED' || b.status === 'ACTIVE')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const escrowDeposits = activeRentals.reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  return (
    <div className="main-content-layout">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Owner & Seller Command Center
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Manage your campus gear listings, approve incoming rental requests, and oversee student handovers.
          </p>
        </div>

        <button 
          id="btn-owner-add-item"
          className="hero-btn-primary" 
          onClick={onOpenCreateListing}
        >
          <Plus size={18} />
          <span>+ List Another Item</span>
        </button>
      </div>

      {/* Modern Bento Grid Metrics */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--slate-500)' }}>
          Loading owner command center...
        </div>
      ) : (
        <>
          <div className="bento-grid">
        {/* Bento 1: Active Listings */}
        <div className="bento-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="bento-stat-label">Active Listings</span>
            <div className="brand-icon-wrapper" style={{ width: '34px', height: '34px', borderRadius: '10px' }}>
              <Package size={18} />
            </div>
          </div>
          <div className="bento-stat-val">{myListings.length}</div>
          <div className="bento-stat-sub">Circulating gear on campus</div>
        </div>

        {/* Bento 2: Cumulative Rental Earnings */}
        <div className="bento-card highlight-emerald">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="bento-stat-label">Rental Earnings</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--emerald-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color="var(--emerald-hover)" />
            </div>
          </div>
          <div className="bento-stat-val" style={{ color: '#047857' }}>
            ${totalEarnings.toFixed(2)}
          </div>
          <div className="bento-stat-sub">Earned from rentals & buyouts</div>
        </div>

        {/* Bento 3: Escrow Security Deposits */}
        <div className="bento-card highlight-indigo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="bento-stat-label">Escrow Protected</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="var(--primary)" />
            </div>
          </div>
          <div className="bento-stat-val" style={{ color: 'var(--primary)' }}>
            ${escrowDeposits.toFixed(2)}
          </div>
          <div className="bento-stat-sub">Held in lock for active rentals</div>
        </div>

        {/* Bento 4: Action Required */}
        <div className="bento-card highlight-amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="bento-stat-label">Action Required</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#b45309" />
            </div>
          </div>
          <div className="bento-stat-val" style={{ color: '#b45309' }}>
            {pendingRequests.length}
          </div>
          <div className="bento-stat-sub">
            {pendingRequests.length === 1 ? '1 request needs review' : `${pendingRequests.length} requests pending`}
          </div>
        </div>
      </div>

      {/* Pending Approval Section */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Action Required: Pending Rental Requests ({pendingRequests.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map(b => (
              <div 
                key={b.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="status-badge REQUESTED">Awaiting Approval</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Booking #{b.id}</span>
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--slate-900)' }}>{b.listingTitle}</h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                    Requested by <strong>{b.renterName}</strong> for dates <strong>{b.startDate} → {b.endDate}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                    Total: <strong>${b.totalAmount}</strong> • Escrow Deposit: <strong>${b.depositAmount}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    className="hero-btn-secondary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.86rem', color: '#be123c', borderColor: '#fecdd3' }}
                    onClick={() => handleUpdateBooking(b.id, 'CANCELLED')}
                  >
                    Decline
                  </button>
                  <button
                    className="hero-btn-primary"
                    style={{ padding: '0.55rem 1.3rem', fontSize: '0.86rem' }}
                    onClick={() => handleUpdateBooking(b.id, 'CONFIRMED')}
                  >
                    Approve Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listed Gear Catalog */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            My Listed Gear ({myListings.length})
          </h2>
        </div>

        {myListings.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'white', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px dashed var(--slate-300)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Package size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.7 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
              You haven't listed any items under this account yet
            </h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Publish your camera, laptop, or bike to start receiving rental requests from verified students.
            </p>
            <button 
              className="hero-btn-primary" 
              onClick={onOpenCreateListing}
              style={{ margin: '0 auto' }}
            >
              <Plus size={18} />
              <span>+ List Your First Item</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {myListings.map(listing => (
              <div 
                key={listing.id}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--slate-200)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16 / 10', background: 'var(--slate-100)', overflow: 'hidden' }}>
                  <img 
                    src={listing.imageUrls?.[0] || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80"} 
                    alt={listing.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="condition-pill">{listing.item?.condition || 'GOOD'}</span>
                </div>

                <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {listing.item?.categoryName}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.25rem 0 0.6rem', color: 'var(--slate-900)' }}>
                    {listing.title}
                  </h4>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {listing.allowRent && (
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                          ${listing.pricePerDay}<span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)' }}>/day</span>
                        </div>
                      )}
                      {listing.allowBuy && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                          Buyout: ${listing.buyPrice}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      <button
                        className="modal-close-btn"
                        title="View details"
                        onClick={() => onSelectListing(listing)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="modal-close-btn"
                        title="Delete listing"
                        style={{ color: '#be123c' }}
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
};

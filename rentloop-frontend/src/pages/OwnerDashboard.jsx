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
  MessageSquare
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
    showToast(`Booking updated to ${status}!`, 'success');
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Owner & Seller Command Center</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Manage your items for rent & sale, track incoming booking requests, and oversee student handovers.
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

      {/* KPI Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Active Listings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)' }}>{myListings.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Available to peers</div>
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Cumulative Rental Earnings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>${totalEarnings.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Earned from rentals & sales</div>
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Escrow Security Deposits</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>${escrowDeposits.toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Locked for active rentals</div>
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Action Required</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309' }}>{pendingRequests.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Pending approval</div>
        </div>
      </div>

      {/* Pending Approval Section */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#b45309' }}>
            ⚡ Needs Your Approval ({pendingRequests.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {pendingRequests.map(b => (
              <div 
                key={b.id}
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{b.listingTitle}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                    Requested by <strong>{b.renterName}</strong> for dates {b.startDate} to {b.endDate}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Total: ${b.totalAmount} • Escrow Deposit: ${b.depositAmount}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="hero-btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', color: '#be123c' }}
                    onClick={() => handleUpdateBooking(b.id, 'CANCELLED')}
                  >
                    Decline
                  </button>
                  <button
                    className="hero-btn-primary"
                    style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
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

      {/* My Items Table / Grid */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
          My Listed Gear ({myListings.length})
        </h2>

        {myListings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
            You haven't listed any items under this account yet. Click "+ List Another Item" above!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {myListings.map(listing => (
              <div 
                key={listing.id}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'var(--slate-100)' }}>
                  <img 
                    src={listing.imageUrls?.[0] || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80"} 
                    alt={listing.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span className="condition-pill">{listing.item?.condition || 'GOOD'}</span>
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                    {listing.item?.categoryName}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.2rem 0 0.5rem' }}>
                    {listing.title}
                  </h4>

                  <div style={{ marginTop: 'auto', paddingTop: '0.6rem', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {listing.allowRent && (
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                          ${listing.pricePerDay}<span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-400)' }}>/day</span>
                        </div>
                      )}
                      {listing.allowBuy && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700 }}>
                          Buyout: ${listing.buyPrice}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
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
    </div>
  );
};

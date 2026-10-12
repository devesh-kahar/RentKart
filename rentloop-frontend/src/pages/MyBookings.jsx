import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Repeat, 
  ShieldCheck, 
  MessageSquare, 
  Star, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const MyBookings = ({ onOpenChat, onOpenReviewModal }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [activeSubTab, setActiveSubTab] = useState('RENTER'); // 'RENTER' | 'OWNER'
  const [renterBookings, setRenterBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [currentUser]);

  const loadBookings = async () => {
    if (!currentUser?.email) return;
    setIsLoading(true);
    try {
      const myRentals = await bookingsApi.getMyRentals(currentUser.email);
      const myItems = await bookingsApi.getBookingsOnMyItems(currentUser.email);
      setRenterBookings(myRentals);
      setOwnerBookings(myItems);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingsApi.updateStatus(bookingId, newStatus);
      showToast(`Booking state transitioned to ${newStatus}!`, 'success');
      loadBookings();
    } catch (err) {
      showToast('Failed to update booking status', 'error');
    }
  };

  const currentList = activeSubTab === 'RENTER' ? renterBookings : ownerBookings;

  const renderStatusStepper = (status) => {
    const steps = ['REQUESTED', 'CONFIRMED', 'ACTIVE', 'RETURNED'];
    const currentIdx = steps.indexOf(status);

    return (
      <div className="booking-stepper">
        {steps.map((st, i) => {
          const isDone = currentIdx >= i && status !== 'CANCELLED';
          const isActive = currentIdx === i && status !== 'CANCELLED';
          return (
            <div key={st} className="step-node">
              <div className={`step-circle ${isActive ? 'active' : isDone ? 'completed' : ''}`}>
                {isDone ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className="step-text">{st}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="main-content-layout">
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          My Bookings & Rentals Hub
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Manage the full peer-to-peer rental lifecycle: requests, campus handovers, security deposit escrow, and returns.
        </p>
      </div>

      {/* Sub Tabs: Renter vs Owner Perspective */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        borderBottom: '1px solid var(--border)', 
        marginBottom: '1.75rem' 
      }}>
        <button
          id="subtab-my-rentals"
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            borderBottom: activeSubTab === 'RENTER' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeSubTab === 'RENTER' ? 'var(--primary)' : 'var(--slate-500)',
            cursor: 'pointer'
          }}
          onClick={() => setActiveSubTab('RENTER')}
        >
          Rentals I Requested ({renterBookings.length})
        </button>

        <button
          id="subtab-my-items"
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            borderBottom: activeSubTab === 'OWNER' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeSubTab === 'OWNER' ? 'var(--primary)' : 'var(--slate-500)',
            cursor: 'pointer'
          }}
          onClick={() => setActiveSubTab('OWNER')}
        >
          Bookings on My Items ({ownerBookings.length})
        </button>
      </div>

      {/* Booking List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)' }}>
          Loading bookings...
        </div>
      ) : currentList.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'white', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px dashed var(--slate-300)' 
        }}>
          <FileText size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {activeSubTab === 'RENTER' ? 'No active rental requests yet' : 'No one has booked your items yet'}
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>
            {activeSubTab === 'RENTER' 
              ? 'Explore the marketplace and request your first camera, laptop, or bike!' 
              : 'Post more listings to start earning passive income on campus.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentList.map(booking => {
            const isOwner = activeSubTab === 'OWNER';
            return (
              <div 
                key={booking.id}
                id={`booking-card-${booking.id}`}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                        Booking #{booking.id} • {booking.transactionType === 'BUY' ? 'Purchase Offer' : 'Rental'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      {booking.listingTitle}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                      {isOwner 
                        ? <span>Renter: <strong>{booking.renterName}</strong> ({booking.renterEmail})</span>
                        : <span>Owner: <strong>{booking.ownerName}</strong> ({booking.ownerEmail})</span>
                      }
                    </div>
                  </div>

                  {/* Pricing and Dates block */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      ${booking.totalAmount?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      ${booking.depositAmount || 0} deposit held in escrow
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--slate-600)', marginTop: '0.3rem' }}>
                      <Calendar size={13} />
                      <span>{booking.startDate} → {booking.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* State Machine Stepper */}
                {booking.status !== 'CANCELLED' ? (
                  renderStatusStepper(booking.status)
                ) : (
                  <div style={{ 
                    padding: '0.6rem 0.9rem', 
                    background: '#ffe4e6', 
                    color: '#be123c', 
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <XCircle size={16} />
                    <span>This booking was cancelled. Any held deposit has been fully refunded.</span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '0.75rem', 
                  borderTop: '1px solid var(--slate-100)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {/* Chat CTA */}
                  <button
                    id={`btn-chat-booking-${booking.id}`}
                    className="hero-btn-secondary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                    onClick={() => onOpenChat(booking)}
                  >
                    <MessageSquare size={15} color="var(--primary)" />
                    <span>Open Handover Chat</span>
                  </button>

                  {/* Lifecycle Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* OWNER ACTIONS */}
                    {isOwner && booking.status === 'REQUESTED' && (
                      <>
                        <button
                          id={`btn-cancel-booking-${booking.id}`}
                          className="hero-btn-secondary"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', color: '#be123c' }}
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                        >
                          Decline
                        </button>
                        <button
                          id={`btn-approve-booking-${booking.id}`}
                          className="hero-btn-primary"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                          onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                        >
                          Approve Rental
                        </button>
                      </>
                    )}

                    {isOwner && booking.status === 'CONFIRMED' && (
                      <button
                        id={`btn-start-booking-${booking.id}`}
                        className="hero-btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: '#059669' }}
                        onClick={() => handleUpdateStatus(booking.id, 'ACTIVE')}
                      >
                        Start Rental (Item Handed Over)
                      </button>
                    )}

                    {isOwner && booking.status === 'ACTIVE' && (
                      <button
                        id={`btn-return-booking-${booking.id}`}
                        className="hero-btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: '#0d9488' }}
                        onClick={() => handleUpdateStatus(booking.id, 'RETURNED')}
                      >
                        Confirm Return & Release Escrow
                      </button>
                    )}

                    {/* RENTER ACTIONS */}
                    {!isOwner && booking.status === 'REQUESTED' && (
                      <button
                        id={`btn-renter-cancel-${booking.id}`}
                        className="hero-btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', color: '#be123c' }}
                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                      >
                        Cancel Request
                      </button>
                    )}

                    {booking.status === 'RETURNED' && (
                      <button
                        id={`btn-review-booking-${booking.id}`}
                        className="hero-btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: 'var(--accent-amber)' }}
                        onClick={() => onOpenReviewModal(booking)}
                      >
                        <Star size={14} fill="white" />
                        <span>Leave Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

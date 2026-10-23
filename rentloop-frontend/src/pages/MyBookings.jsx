import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Star, 
  XCircle,
  AlertTriangle,
  Check
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
  const [reviewedBookingIds, setReviewedBookingIds] = useState(new Set());
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

  const handleReportIssue = (booking) => {
    showToast(`Support Ticket #INC-${booking.id} created. A campus escrow mediator has been notified.`, 'info');
  };

  const handleReviewTrigger = (booking) => {
    onOpenReviewModal(booking);
    setReviewedBookingIds(prev => new Set([...prev, booking.id]));
  };

  const currentList = activeSubTab === 'RENTER' ? renterBookings : ownerBookings;

  const renderStatusStepper = (status) => {
    const steps = [
      { id: 'REQUESTED', label: '1. Requested' },
      { id: 'CONFIRMED', label: '2. Confirmed' },
      { id: 'ACTIVE', label: '3. Handed Over' },
      { id: 'RETURNED', label: '4. Returned' }
    ];
    const currentIdx = steps.findIndex(s => s.id === status);

    return (
      <div className="booking-stepper">
        {steps.map((st, i) => {
          const isDone = currentIdx > i && status !== 'CANCELLED';
          const isActive = currentIdx === i && status !== 'CANCELLED';
          return (
            <div key={st.id} className="step-node">
              <div className={`step-circle ${isActive ? 'active' : isDone ? 'completed' : ''}`}>
                {isDone ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span className="step-text" style={{ color: isActive ? 'var(--primary)' : isDone ? 'var(--emerald)' : 'var(--slate-500)' }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="main-content-layout">
      {/* Title Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--slate-900)' }}>
          My Bookings & Rentals Hub
        </h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem' }}>
          Track the full peer-to-peer rental lifecycle: requests, campus handover coordination, escrow protection, and gear returns.
        </p>
      </div>

      {/* Sub Tabs: Renter vs Owner Perspective */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        borderBottom: '1px solid var(--border)', 
        marginBottom: '2rem' 
      }}>
        <button
          id="subtab-my-rentals"
          style={{
            padding: '0.75rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.92rem',
            borderBottom: activeSubTab === 'RENTER' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeSubTab === 'RENTER' ? 'var(--primary)' : 'var(--slate-500)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSubTab('RENTER')}
        >
          Rentals I Requested ({renterBookings.length})
        </button>

        <button
          id="subtab-my-items"
          style={{
            padding: '0.75rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.92rem',
            borderBottom: activeSubTab === 'OWNER' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeSubTab === 'OWNER' ? 'var(--primary)' : 'var(--slate-500)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onClick={() => setActiveSubTab('OWNER')}
        >
          Bookings on My Items ({ownerBookings.length})
        </button>
      </div>

      {/* Booking List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--slate-500)' }}>
          Loading your active campus bookings...
        </div>
      ) : currentList.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'white', 
          borderRadius: 'var(--radius-xl)', 
          border: '1px dashed var(--slate-300)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <FileText size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--slate-900)' }}>
            {activeSubTab === 'RENTER' ? 'No active rental requests yet' : 'No incoming booking requests yet'}
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            {activeSubTab === 'RENTER' 
              ? 'Explore the verified marketplace and request your first camera, laptop, or bike for the weekend!' 
              : 'Post more listings to start earning passive income right here on campus.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {currentList.map(booking => {
            const isOwner = activeSubTab === 'OWNER';
            const hasReviewed = reviewedBookingIds.has(booking.id);

            return (
              <div 
                key={booking.id}
                id={`booking-card-${booking.id}`}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--slate-200)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                        Booking #{booking.id} • {booking.transactionType === 'BUY' ? 'Purchase Buyout' : 'Peer Rental'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      {booking.listingTitle}
                    </h3>
                    <div style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                      {isOwner 
                        ? <span>Renter: <strong style={{ color: 'var(--slate-900)' }}>{booking.renterName}</strong> ({booking.renterEmail})</span>
                        : <span>Owner: <strong style={{ color: 'var(--slate-900)' }}>{booking.ownerName}</strong> ({booking.ownerEmail})</span>
                      }
                    </div>
                  </div>

                  {/* Pricing and Dates */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      ${booking.totalAmount?.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--emerald-hover)', fontWeight: 700 }}>
                      ${booking.depositAmount || 0} refundable deposit in escrow
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '0.35rem', justifyContent: 'flex-end' }}>
                      <Calendar size={14} color="var(--primary)" />
                      <span>{booking.startDate} → {booking.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Progress Stepper */}
                {booking.status !== 'CANCELLED' ? (
                  renderStatusStepper(booking.status)
                ) : (
                  <div style={{ 
                    padding: '0.75rem 1rem', 
                    background: '#fff1f2', 
                    color: '#e11d48', 
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fecdd3',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    <XCircle size={18} />
                    <span>This booking was cancelled. Any held deposit has been fully refunded to your student balance.</span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid var(--slate-100)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {/* Chat & Incident Actions */}
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      id={`btn-chat-booking-${booking.id}`}
                      className="hero-btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}
                      onClick={() => onOpenChat(booking)}
                    >
                      <MessageSquare size={15} color="var(--primary)" />
                      <span>Handover Chat</span>
                    </button>

                    {(booking.status === 'ACTIVE' || booking.status === 'CONFIRMED') && (
                      <button
                        id={`btn-report-issue-${booking.id}`}
                        className="hero-btn-secondary"
                        style={{ padding: '0.5rem 0.95rem', fontSize: '0.82rem', color: '#e11d48', borderColor: '#fecdd3' }}
                        onClick={() => handleReportIssue(booking)}
                        title="Report damage, missing parts, or handover delay"
                      >
                        <AlertTriangle size={15} />
                        <span>Report Issue / Damage</span>
                      </button>
                    )}
                  </div>

                  {/* Lifecycle Transitions */}
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {/* OWNER ACTIONS */}
                    {isOwner && booking.status === 'REQUESTED' && (
                      <>
                        <button
                          id={`btn-cancel-booking-${booking.id}`}
                          className="hero-btn-secondary"
                          style={{ padding: '0.5rem 0.95rem', fontSize: '0.84rem', color: '#be123c' }}
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                        >
                          Decline
                        </button>
                        <button
                          id={`btn-approve-booking-${booking.id}`}
                          className="hero-btn-primary"
                          style={{ padding: '0.5rem 1.15rem', fontSize: '0.84rem' }}
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
                        style={{ padding: '0.5rem 1.15rem', fontSize: '0.84rem', background: 'var(--emerald)' }}
                        onClick={() => handleUpdateStatus(booking.id, 'ACTIVE')}
                      >
                        Start Rental (Gear Handed Over)
                      </button>
                    )}

                    {isOwner && booking.status === 'ACTIVE' && (
                      <button
                        id={`btn-return-booking-${booking.id}`}
                        className="hero-btn-primary"
                        style={{ padding: '0.5rem 1.15rem', fontSize: '0.84rem', background: '#059669' }}
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
                        style={{ padding: '0.5rem 0.95rem', fontSize: '0.84rem', color: '#be123c' }}
                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                      >
                        Cancel Request
                      </button>
                    )}

                    {/* REVIEW ACTION */}
                    {booking.status === 'RETURNED' && (
                      hasReviewed ? (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          padding: '0.5rem 1rem', 
                          background: 'var(--emerald-light)', 
                          color: '#065f46', 
                          border: '1px solid var(--emerald-border)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 700 
                        }}>
                          <Check size={14} /> Review Posted
                        </span>
                      ) : (
                        <button
                          id={`btn-review-booking-${booking.id}`}
                          className="hero-btn-primary"
                          style={{ padding: '0.5rem 1.15rem', fontSize: '0.84rem', background: 'var(--accent-amber)' }}
                          onClick={() => handleReviewTrigger(booking)}
                        >
                          <Star size={14} fill="white" />
                          <span>Leave Review</span>
                        </button>
                      )
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

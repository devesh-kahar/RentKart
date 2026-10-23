import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  Star, 
  MessageSquare, 
  Repeat, 
  ShoppingBag, 
  Clock,
  Sparkles
} from 'lucide-react';
import { bookingsApi, reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const ListingDetailModal = ({ listing, onClose, onOpenChat, onBookingSuccess }) => {
  const { currentUser, openLogin } = useAuth();
  const { showToast } = useNotifications();

  // Default dates: tomorrow until 3 days later
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 4);
  const defaultEnd = threeDaysLater.toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState(listing.allowRent !== false ? 'RENT' : 'BUY');
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [offerPrice, setOfferPrice] = useState(listing.buyPrice || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (listing?.id) {
      loadReviews();
    }
  }, [listing]);

  const loadReviews = async () => {
    const data = await reviewsApi.getForListing(listing.id);
    setReviews(data);
  };

  if (!listing) return null;

  // Calculate rental duration and pricing
  const calculateRental = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const rentalFee = Number((diffTime * listing.pricePerDay).toFixed(2));
    const deposit = Number(listing.depositAmount || 0);
    const total = Number((rentalFee + deposit).toFixed(2));
    return { days: diffTime, rentalFee, deposit, total };
  };

  const { days, rentalFee, deposit, total } = calculateRental();

  const handleBooking = async () => {
    if (!currentUser) {
      openLogin();
      return;
    }

    if (currentUser.email === listing.ownerEmail) {
      showToast("You cannot rent or buy your own listing!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'RENT') {
        const result = await bookingsApi.create({
          listingId: listing.id,
          startDate,
          endDate,
          transactionType: 'RENT'
        }, currentUser);

        showToast(`Rental request submitted for ${days} days! Total: $${total.toFixed(2)}`, 'success');
        if (onBookingSuccess) onBookingSuccess(result);
        onClose();
      } else {
        const result = await bookingsApi.create({
          listingId: listing.id,
          startDate: defaultStart,
          endDate: defaultEnd,
          transactionType: 'BUY',
          offerAmount: Number(offerPrice)
        }, currentUser);

        showToast(`Purchase offer of $${offerPrice} sent to ${listing.ownerName}!`, 'success');
        if (onBookingSuccess) onBookingSuccess(result);
        onClose();
      }
    } catch (err) {
      showToast(err.message || "Failed to submit request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = listing.imageUrls?.length > 0 ? listing.imageUrls : [
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=80"
  ];

  const getOwnerAvatar = (email) => {
    if (email?.includes('sarah')) return "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80";
    if (email?.includes('marcus')) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80";
    if (email?.includes('alex')) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        id="listing-detail-modal"
        className="modal-container large" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {listing.item?.categoryName || "Verified Listing"}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.1rem' }}>
              {listing.title}
            </h2>
          </div>
          <button 
            id="btn-close-listing-modal"
            className="modal-close-btn" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem' }}>
          
          {/* Left Column: Media & Specifications */}
          <div>
            {/* Featured Photo */}
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              aspectRatio: '16 / 10', 
              background: 'var(--slate-100)',
              border: '1px solid var(--slate-200)',
              marginBottom: '0.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img 
                src={images[activeImageIdx]} 
                alt={listing.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    style={{
                      width: '64px',
                      height: '46px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImageIdx === i ? '2px solid var(--primary)' : '1px solid var(--slate-200)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Item Condition & Location */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
              <span className="condition-pill" style={{ position: 'static' }}>
                Condition: {listing.item?.condition || 'GOOD'}
              </span>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                fontSize: '0.82rem', 
                color: 'var(--slate-600)',
                background: 'var(--slate-100)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 600
              }}>
                <MapPin size={14} color="var(--primary)" />
                {listing.locationName || "Campus Quad • 0.2 miles"}
              </span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--slate-900)' }}>
                Description & Inclusions
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                {listing.item?.description || "High quality item maintained in excellent working condition. Suitable for immediate campus use."}
              </p>
            </div>

            {/* Technical Specifications */}
            {listing.item?.attributes && listing.item.attributes.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
                  Technical Attributes
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '0.55rem',
                  background: 'var(--slate-50)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-200)'
                }}>
                  {listing.item.attributes.map((a, idx) => (
                    <div key={idx} style={{ fontSize: '0.83rem' }}>
                      <span style={{ color: 'var(--slate-500)', fontWeight: 600 }}>{a.keyName}: </span>
                      <strong style={{ color: 'var(--slate-900)' }}>{a.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Profile Banner */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem', 
              background: 'white', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={getOwnerAvatar(listing.ownerEmail)}
                  alt={listing.ownerName} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid white', boxShadow: 'var(--shadow-xs)' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--slate-900)' }}>{listing.ownerName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '0.1rem' }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <strong>{listing.ownerRating || 5.0}</strong>
                    <span>({listing.ownerReviewsCount || 1} verified student reviews)</span>
                  </div>
                </div>
              </div>

              <button 
                id="btn-chat-owner"
                className="hero-btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                onClick={() => {
                  onClose();
                  onOpenChat({
                    bookingId: 201,
                    id: listing.id,
                    ownerEmail: listing.ownerEmail,
                    ownerName: listing.ownerName,
                    listingTitle: listing.title
                  });
                }}
              >
                <MessageSquare size={15} color="var(--primary)" />
                <span>Message</span>
              </button>
            </div>

            {/* Verified Reviews Section */}
            {reviews.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
                  Student Reviews ({reviews.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ 
                      padding: '0.65rem 0.85rem', 
                      background: 'var(--slate-50)', 
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-200)',
                      fontSize: '0.82rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <strong style={{ color: 'var(--slate-900)' }}>{r.reviewerName || r.reviewerEmail?.split('@')[0]}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          <span>{r.rating}/5</span>
                        </div>
                      </div>
                      <div style={{ color: 'var(--slate-600)' }}>{r.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Transaction Options & Pricing Engine */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Mode Switch: Rent vs Buy */}
            <div style={{ 
              display: 'flex', 
              background: 'var(--slate-100)', 
              borderRadius: 'var(--radius-full)', 
              padding: '0.25rem',
              marginBottom: '1.25rem',
              border: '1px solid var(--slate-200)'
            }}>
              {listing.allowRent !== false && (
                <button
                  id="tab-select-rent"
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: activeTab === 'RENT' ? 'white' : 'transparent',
                    color: activeTab === 'RENT' ? 'var(--primary)' : 'var(--slate-600)',
                    boxShadow: activeTab === 'RENT' ? 'var(--shadow-sm)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setActiveTab('RENT')}
                >
                  <Repeat size={16} /> Rent Gear
                </button>
              )}

              {listing.allowBuy && (
                <button
                  id="tab-select-buy"
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: activeTab === 'BUY' ? 'white' : 'transparent',
                    color: activeTab === 'BUY' ? 'var(--primary)' : 'var(--slate-600)',
                    boxShadow: activeTab === 'BUY' ? 'var(--shadow-sm)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setActiveTab('BUY')}
                >
                  <ShoppingBag size={16} /> Buyout
                </button>
              )}
            </div>

            {/* TAB CONTENT: RENT */}
            {activeTab === 'RENT' ? (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Daily Rental Rate</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      ${listing.pricePerDay}
                    </span>
                    <span style={{ color: 'var(--slate-500)', fontWeight: 600 }}>/ 24-hr day</span>
                  </div>
                </div>

                {/* Rental Date Pickers */}
                <div className="form-row" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Pickup Date
                    </label>
                    <input
                      id="input-rental-start-date"
                      type="date"
                      className="form-input"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      Return Date
                    </label>
                    <input
                      id="input-rental-end-date"
                      type="date"
                      className="form-input"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Cost Breakdown Calculation */}
                <div className="rental-calc-card">
                  <div className="calc-row">
                    <span>${listing.pricePerDay} × {days} day{days > 1 ? 's' : ''} rental</span>
                    <strong>${rentalFee.toFixed(2)}</strong>
                  </div>
                  <div className="calc-row">
                    <span>Refundable Escrow Security Deposit</span>
                    <strong>${deposit.toFixed(2)}</strong>
                  </div>
                  <div className="calc-row total">
                    <span>Total Authorization</span>
                    <span className="gradient-text">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Emerald Escrow Trust Box */}
                <div className="escrow-trust-box">
                  <ShieldCheck size={22} style={{ flexShrink: 0, color: 'var(--emerald)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.86rem', color: '#065f46' }}>
                      🛡️ 100% Secure Deposit Protection
                    </strong>
                    <div style={{ marginTop: '0.2rem', lineHeight: 1.5 }}>
                      Your security deposit (${deposit}) is securely protected in escrow and automatically returned to your balance immediately after the owner confirms the gear return handover.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB CONTENT: BUY */
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>Outright Asking Price</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${listing.buyPrice}
                    </span>
                    <span style={{ color: 'var(--slate-500)', fontWeight: 600 }}>one-time ownership buyout</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Offer Amount ($ USD)</label>
                  <input
                    id="input-buy-offer-amount"
                    type="number"
                    className="form-input"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Enter offer price"
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.35rem', display: 'block' }}>
                    You can offer the asking price (${listing.buyPrice}) or propose a negotiated counter-offer.
                  </span>
                </div>

                <div className="escrow-trust-box" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary-border)', color: '#3730a3' }}>
                  <Sparkles size={20} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.86rem' }}>
                      🤝 Campus Handover & Inspection
                    </strong>
                    <div style={{ marginTop: '0.2rem', lineHeight: 1.5 }}>
                      Funds are held securely. Meet in person on campus to inspect the device before concluding the buyout.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Sticky Modal Footer */}
        <div className="modal-footer">
          <div style={{ marginRight: 'auto' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block', fontWeight: 600 }}>
              {activeTab === 'RENT' ? 'Total Required Auth' : 'Proposed Buyout'}
            </span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
              {activeTab === 'RENT' ? `$${total.toFixed(2)}` : `$${offerPrice || listing.buyPrice}`}
            </strong>
          </div>

          <button
            type="button"
            className="hero-btn-secondary"
            onClick={onClose}
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
          >
            Cancel
          </button>

          <button
            id="btn-confirm-transaction"
            className="hero-btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
            disabled={isSubmitting}
            onClick={handleBooking}
          >
            {isSubmitting ? (
              <span>Authorizing...</span>
            ) : activeTab === 'RENT' ? (
              <>
                <Repeat size={16} />
                <span>Request to Rent (${total.toFixed(2)})</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Send Buyout Offer (${offerPrice})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

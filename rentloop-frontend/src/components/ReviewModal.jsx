import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const targetEmail = currentUser.email === booking.renterEmail 
    ? booking.ownerEmail 
    : booking.renterEmail;

  const targetName = currentUser.email === booking.renterEmail 
    ? booking.ownerName 
    : booking.renterName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide a short feedback comment', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await reviewsApi.submit(
        booking.id,
        targetEmail,
        booking.listingId,
        rating,
        comment,
        currentUser
      );
      showToast(`Thank you! Your ${rating}-star review for ${targetName} was posted.`, 'success');
      if (onReviewSubmitted) onReviewSubmitted(created);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        id="review-modal"
        className="modal-container" 
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Leave a Review & Trust Score</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Rate your rental experience with {targetName} for "{booking.listingTitle}"
            </p>
          </div>
          <button id="btn-close-review" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body">
          {/* Star selector */}
          <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--slate-700)' }}>
              Select Rating:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', padding: '0.2rem' }}
                >
                  <Star 
                    size={32} 
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'} 
                    color={(hoverRating || rating) >= star ? '#f59e0b' : 'var(--slate-300)'} 
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.4rem' }}>
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5/5)' :
               rating === 4 ? '⭐⭐⭐⭐ Great (4/5)' :
               rating === 3 ? '⭐⭐⭐ Average (3/5)' :
               rating === 2 ? '⭐⭐ Poor (2/5)' : '⭐ Terrible (1/5)'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Feedback & Experience</label>
            <textarea
              id="textarea-review-comment"
              className="form-textarea"
              rows={4}
              placeholder="Was the item in the described condition? Was pickup and return timely and smooth?..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={onClose}
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-review"
              className="hero-btn-primary"
              disabled={isSubmitting}
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
            >
              {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

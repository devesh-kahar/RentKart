import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Package, 
  FileText, 
  Star, 
  Trash2, 
  Sparkles,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { adminApi } from '../services/api';
import { useNotifications } from '../context/NotificationContext';

export const AdminDashboard = () => {
  const { showToast } = useNotifications();
  const [activeAdminTab, setActiveAdminTab] = useState('listings'); // 'users' | 'listings' | 'bookings' | 'reviews'
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [u, l, b, r] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllListings(),
        adminApi.getAllBookings(),
        adminApi.getAllReviews()
      ]);
      setUsers(u);
      setListings(l);
      setBookings(b);
      setReviews(r);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDeleteListing = async (id) => {
    if (window.confirm("Admin Moderation: Force-remove this listing?")) {
      await adminApi.removeListing(id);
      showToast("Listing moderated & removed by Admin", "success");
      loadAdminData();
    }
  };

  const handleAdminDeleteReview = async (id) => {
    if (window.confirm("Admin Moderation: Delete this review?")) {
      await adminApi.removeReview(id);
      showToast("Review removed by Admin", "success");
      loadAdminData();
    }
  };

  return (
    <div className="main-content-layout">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="brand-icon-wrapper" style={{ background: '#be123c' }}>
          <ShieldAlert size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Oversight Console</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>
            Full platform administration: monitor active listings, moderate reviews, view campus users, and maintain community trust.
          </p>
        </div>
      </div>

      {/* Bento Overview Cards */}
      <div className="bento-grid">
        <div className="bento-card">
          <span className="bento-stat-label">Registered Users</span>
          <div className="bento-stat-val">{users.length}</div>
          <div className="bento-stat-sub">Verified campus community</div>
        </div>
        <div className="bento-card highlight-indigo">
          <span className="bento-stat-label">Marketplace Listings</span>
          <div className="bento-stat-val" style={{ color: 'var(--primary)' }}>{listings.length}</div>
          <div className="bento-stat-sub">Active circulating items</div>
        </div>
        <div className="bento-card highlight-emerald">
          <span className="bento-stat-label">Platform Bookings</span>
          <div className="bento-stat-val" style={{ color: 'var(--emerald-hover)' }}>{bookings.length}</div>
          <div className="bento-stat-sub">Completed & active rentals</div>
        </div>
        <div className="bento-card highlight-amber">
          <span className="bento-stat-label">Student Reviews</span>
          <div className="bento-stat-val" style={{ color: '#b45309' }}>{reviews.length}</div>
          <div className="bento-stat-sub">Community trust feedback</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <button
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderBottom: activeAdminTab === 'listings' ? '3px solid #be123c' : '3px solid transparent',
            color: activeAdminTab === 'listings' ? '#be123c' : 'var(--slate-600)'
          }}
          onClick={() => setActiveAdminTab('listings')}
        >
          Listings Moderation ({listings.length})
        </button>
        <button
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderBottom: activeAdminTab === 'users' ? '3px solid #be123c' : '3px solid transparent',
            color: activeAdminTab === 'users' ? '#be123c' : 'var(--slate-600)'
          }}
          onClick={() => setActiveAdminTab('users')}
        >
          Registered Users ({users.length})
        </button>
        <button
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderBottom: activeAdminTab === 'bookings' ? '3px solid #be123c' : '3px solid transparent',
            color: activeAdminTab === 'bookings' ? '#be123c' : 'var(--slate-600)'
          }}
          onClick={() => setActiveAdminTab('bookings')}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderBottom: activeAdminTab === 'reviews' ? '3px solid #be123c' : '3px solid transparent',
            color: activeAdminTab === 'reviews' ? '#be123c' : 'var(--slate-600)'
          }}
          onClick={() => setActiveAdminTab('reviews')}
        >
          Reviews Moderation ({reviews.length})
        </button>
      </div>

      {/* TAB: LISTINGS */}
      {activeAdminTab === 'listings' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Rent / Buy</th>
                <th style={{ padding: '0.75rem 1rem' }}>Owner</th>
                <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-400)' }}>#{l.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{l.title}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{l.item?.categoryName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {l.allowRent && `$${l.pricePerDay}/day `}
                    {l.allowBuy && `(Buy: $${l.buyPrice})`}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{l.ownerEmail}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      className="hero-btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', color: '#be123c', fontSize: '0.78rem' }}
                      onClick={() => handleAdminDeleteListing(l.id)}
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: USERS */}
      {activeAdminTab === 'users' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>User</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Campus</th>
                <th style={{ padding: '0.75rem 1rem' }}>Trust Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={u.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    <strong>{u.name}</strong>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="condition-pill" style={{ position: 'static' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{u.campus}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>⭐ {u.rating} ({u.reviewsCount} reviews)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: BOOKINGS */}
      {activeAdminTab === 'bookings' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>Booking #</th>
                <th style={{ padding: '0.75rem 1rem' }}>Item</th>
                <th style={{ padding: '0.75rem 1rem' }}>Renter</th>
                <th style={{ padding: '0.75rem 1rem' }}>Owner</th>
                <th style={{ padding: '0.75rem 1rem' }}>Window</th>
                <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-400)' }}>#{b.id}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{b.listingTitle}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{b.renterName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{b.ownerName}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{b.startDate} to {b.endDate}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>${b.totalAmount}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`status-badge ${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: REVIEWS */}
      {activeAdminTab === 'reviews' && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>Reviewer</th>
                <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                <th style={{ padding: '0.75rem 1rem' }}>Target</th>
                <th style={{ padding: '0.75rem 1rem' }}>Feedback Comment</th>
                <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{r.reviewerEmail}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>⭐ {r.rating}/5</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{r.targetEmail}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)' }}>"{r.comment}"</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      className="hero-btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', color: '#be123c', fontSize: '0.78rem' }}
                      onClick={() => handleAdminDeleteReview(r.id)}
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

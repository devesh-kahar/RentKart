import React, { useState, useEffect, useRef } from 'react';
import { 
  Repeat, 
  Search, 
  PlusCircle, 
  Bell, 
  User, 
  Shield, 
  ShieldAlert,
  MessageSquare, 
  Package, 
  FileText, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenCreateListing, 
  onOpenRentalRequest,
  searchQuery,
  setSearchQuery
}) => {
  const { 
    currentUser, 
    switchPersona, 
    isBackendLive, 
    checkHealth,
    openLogin,
    openRegister,
    logout 
  } = useAuth();
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Click-outside listener to dismiss open dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotificationsDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-header">
      <div className="nav-container">
        {/* Brand Logo & Health Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <a 
            href="#home" 
            className="brand-logo"
            onClick={(e) => { e.preventDefault(); setCurrentTab('marketplace'); }}
          >
            <div className="brand-icon-wrapper">
              <Repeat size={22} strokeWidth={2.6} />
            </div>
            <span>Rent<span style={{ color: 'var(--primary)' }}>Loop</span></span>
            <span className="brand-tag">Buy • Sell • Rent</span>
          </a>

          {/* Live Pulsing Emerald Status Pill */}
          <div 
            className={`live-status-pill ${isBackendLive ? 'live' : 'demo'}`}
            title={isBackendLive ? "Connected to Spring Boot API on :8080" : "Demo Evaluation Mode: Local storage & mock simulation active"}
            onClick={checkHealth}
            style={{ cursor: 'pointer' }}
          >
            <span className={`status-dot ${isBackendLive ? 'green' : 'green'}`} />
            <span>{isBackendLive ? 'API LIVE' : 'DEMO ACTIVE'}</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="nav-search-bar">
          <Search size={18} className="nav-search-icon" />
          <input
            id="nav-search-input"
            type="text"
            className="nav-search-input"
            placeholder="Search laptops, Sony cameras, bikes, guitars..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'marketplace') setCurrentTab('marketplace');
            }}
          />
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="nav-nav-links">
          <button 
            id="nav-tab-marketplace"
            className={`nav-link-btn ${currentTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setCurrentTab('marketplace')}
          >
            <Package size={16} />
            <span>Marketplace</span>
          </button>

          <button 
            id="nav-tab-requests"
            className={`nav-link-btn ${currentTab === 'requests' ? 'active' : ''}`}
            onClick={() => setCurrentTab('requests')}
          >
            <Sparkles size={16} />
            <span>Wanted to Rent</span>
          </button>

          <button 
            id="nav-tab-bookings"
            className={`nav-link-btn ${currentTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setCurrentTab('bookings')}
          >
            <FileText size={16} />
            <span>My Bookings</span>
          </button>

          <button 
            id="nav-tab-owner"
            className={`nav-link-btn ${currentTab === 'owner' ? 'active' : ''}`}
            onClick={() => setCurrentTab('owner')}
          >
            <Shield size={16} />
            <span>Owner Hub</span>
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button 
              id="nav-tab-admin"
              className={`nav-link-btn admin-link ${currentTab === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin')}
              title="Platform Administration Console"
            >
              <ShieldAlert size={16} />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Right Action Zone: Post Item, Persona Switcher, Notifications, and Login / User Profile */}
        <div className="nav-right-actions">
          {/* Quick Post Item CTA */}
          <button 
            id="btn-nav-post-listing"
            className="btn-post-item"
            onClick={onOpenCreateListing}
            title="List equipment or tech for rent/sale"
          >
            <PlusCircle size={16} />
            <span>Post Item</span>
          </button>

          {/* Persona Switcher for Evaluation */}
          <div className="persona-selector" title="Switch between demo personas">
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 700 }}>Demo:</span>
            <select
              id="persona-switch-select"
              className="persona-select"
              value={currentUser?.email || ''}
              onChange={(e) => switchPersona(e.target.value)}
            >
              <option value="alex.renter@university.edu">Alex (Renter)</option>
              <option value="sarah.owner@university.edu">Sarah (Owner)</option>
              <option value="marcus.creator@university.edu">Marcus (Creator)</option>
              <option value="admin@rentloop.edu">Admin (Platform)</option>
            </select>
          </div>

          {/* Notifications Bell with Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              id="btn-nav-notifications"
              className="nav-badge-icon"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
            </button>

            {showNotificationsDropdown && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '125%',
                  width: '320px',
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border)',
                  zIndex: 60,
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                    Notifications ({notifications.length})
                  </strong>
                  {unreadCount > 0 && (
                    <button 
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.75rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--slate-100)',
                          background: n.isRead ? 'white' : 'var(--primary-light)',
                          cursor: 'pointer'
                        }}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
                          {n.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar or Login / Sign Up Button */}
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={userRef}>
              <button 
                id="btn-nav-user-profile"
                className="nav-user-profile-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="Account Menu"
              >
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={currentUser?.name}
                  className="nav-user-avatar"
                />
                <span className="nav-user-name">{currentUser?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showUserDropdown && (
                <div 
                  className="nav-user-dropdown"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '125%',
                    width: '260px',
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border)',
                    zIndex: 60,
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--slate-100)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--slate-900)' }}>{currentUser?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{currentUser?.email}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>
                      {currentUser?.role === 'ADMIN' ? '🛡️ Platform Administrator' : '🎓 Verified Campus Member'}
                    </div>
                  </div>

                  <button 
                    className="nav-link-btn"
                    onClick={() => { setCurrentTab('bookings'); setShowUserDropdown(false); }}
                  >
                    <FileText size={16} /> My Rentals & Orders
                  </button>
                  <button 
                    className="nav-link-btn"
                    onClick={() => { setCurrentTab('owner'); setShowUserDropdown(false); }}
                  >
                    <Package size={16} /> My Active Listings
                  </button>
                  <button 
                    className="nav-link-btn"
                    onClick={() => { onOpenRentalRequest(); setShowUserDropdown(false); }}
                  >
                    <Sparkles size={16} /> Post a Rental Request
                  </button>

                  <div style={{ borderTop: '1px solid var(--slate-100)', marginTop: '0.2rem', paddingTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button 
                      className="nav-link-btn"
                      style={{ color: 'var(--primary)', width: '100%' }}
                      onClick={() => { openLogin(); setShowUserDropdown(false); }}
                    >
                      <User size={16} /> Switch / Login Account
                    </button>
                    <button 
                      className="nav-link-btn"
                      style={{ color: '#e11d48', width: '100%' }}
                      onClick={() => { logout(); setShowUserDropdown(false); }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <button 
                id="btn-nav-login"
                className="btn-nav-login"
                onClick={openLogin}
              >
                Log In
              </button>
              <button 
                id="btn-nav-signup"
                className="btn-nav-signup"
                onClick={openRegister}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

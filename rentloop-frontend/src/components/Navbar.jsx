import React, { useState } from 'react';
import { 
  Repeat, 
  Search, 
  PlusCircle, 
  Bell, 
  User, 
  Shield, 
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
import { DEMO_USERS } from '../data/mockData';

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

  return (
    <header className="navbar-header">
      <div className="nav-container">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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

          {/* Backend Connection Pill */}
          <div 
            className={`live-status-pill ${isBackendLive ? 'live' : 'demo'}`}
            title={isBackendLive ? "Connected to Spring Boot API on :8080" : "Running on Interactive Demo Mode with local fallback"}
            onClick={checkHealth}
            style={{ cursor: 'pointer' }}
          >
            <span className={`status-dot ${isBackendLive ? 'green' : 'blue'}`} />
            {isBackendLive ? 'API LIVE' : 'DEMO MODE'}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="nav-search-bar">
          <Search size={18} className="nav-search-icon" />
          <input
            id="nav-search-input"
            type="text"
            className="nav-search-input"
            placeholder="Search laptops, cameras, guitars, bikes, PS5..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'marketplace') setCurrentTab('marketplace');
            }}
          />
        </div>

        {/* Nav Links */}
        <nav className="nav-nav-links">
          <button 
            id="nav-tab-marketplace"
            className={`nav-link-btn ${currentTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setCurrentTab('marketplace')}
          >
            <Package size={17} />
            <span>Marketplace</span>
          </button>

          <button 
            id="nav-tab-requests"
            className={`nav-link-btn ${currentTab === 'requests' ? 'active' : ''}`}
            onClick={() => setCurrentTab('requests')}
          >
            <Sparkles size={17} />
            <span>Wanted to Rent</span>
          </button>

          <button 
            id="nav-tab-bookings"
            className={`nav-link-btn ${currentTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setCurrentTab('bookings')}
          >
            <FileText size={17} />
            <span>My Bookings</span>
          </button>

          <button 
            id="nav-tab-owner"
            className={`nav-link-btn ${currentTab === 'owner' ? 'active' : ''}`}
            onClick={() => setCurrentTab('owner')}
          >
            <Shield size={17} />
            <span>Owner Hub</span>
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button 
              id="nav-tab-admin"
              className={`nav-link-btn ${currentTab === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin')}
              style={{ color: '#be123c', fontWeight: 700 }}
            >
              <Shield size={17} />
              <span>Admin</span>
            </button>
          )}

          {/* Quick Post CTA */}
          <button 
            id="btn-nav-post-listing"
            className="btn-post-item"
            onClick={onOpenCreateListing}
          >
            <PlusCircle size={18} />
            <span>Post Item</span>
          </button>

          {/* Persona Switcher for Evaluation */}
          <div className="persona-selector" title="Switch between demo user roles">
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Persona:</span>
            <select
              id="persona-switch-select"
              className="persona-select"
              value={currentUser?.email || ''}
              onChange={(e) => switchPersona(e.target.value)}
            >
              <option value="alex.renter@university.edu">Alex (Renter)</option>
              <option value="sarah.owner@university.edu">Sarah (Owner)</option>
              <option value="marcus.creator@university.edu">Marcus (Seller)</option>
              <option value="admin@rentloop.edu">Admin Officer</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              id="btn-nav-notifications"
              className="nav-badge-icon"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
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
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong style={{ fontSize: '0.88rem' }}>Notifications ({notifications.length})</strong>
                  {unreadCount > 0 && (
                    <button 
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
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
                        <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                          {n.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div style={{ position: 'relative' }}>
            <button 
              id="btn-nav-user-profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem',
                borderRadius: 'var(--radius-full)'
              }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser?.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
              />
            </button>

            {showUserDropdown && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '230px',
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border)',
                  zIndex: 60,
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--slate-100)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{currentUser?.email}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                    {currentUser?.role === 'ADMIN' ? 'Platform Administrator' : 'Verified Campus Member'}
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

                <div style={{ borderTop: '1px solid var(--slate-100)', marginTop: '0.2rem', paddingTop: '0.4rem' }}>
                  <button 
                    className="nav-link-btn"
                    style={{ color: '#be123c', width: '100%' }}
                    onClick={() => { openLogin(); setShowUserDropdown(false); }}
                  >
                    <User size={16} /> Switch / Login Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

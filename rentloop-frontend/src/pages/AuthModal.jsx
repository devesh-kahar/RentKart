import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { DEMO_USERS } from '../data/mockData';

export const AuthModal = () => {
  const { 
    authModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    closeAuthModal, 
    login, 
    register, 
    switchPersona 
  } = useAuth();
  
  const { showToast } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (authModalTab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          showToast(`Welcome back!`, 'success');
          closeAuthModal();
        } else {
          showToast('Login failed. Please check credentials.', 'error');
        }
      } else {
        const res = await register(name, email, password, phone);
        if (res.success) {
          showToast(`Account registered successfully! Welcome to RentLoop.`, 'success');
          closeAuthModal();
        } else {
          showToast('Registration failed.', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (userEmail) => {
    switchPersona(userEmail);
    showToast(`Logged in as demo persona: ${userEmail}`, 'success');
    closeAuthModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div 
        id="auth-modal-dialog"
        className="modal-container" 
        style={{ maxWidth: '440px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {authModalTab === 'login' ? 'Sign In to RentLoop' : 'Create an Account'}
            </h2>
          </div>
          <button id="btn-close-auth" className="modal-close-btn" onClick={closeAuthModal}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--slate-100)', 
            padding: '0.25rem', 
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem' 
          }}>
            <button
              id="tab-auth-login"
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: authModalTab === 'login' ? 'white' : 'transparent',
                color: authModalTab === 'login' ? 'var(--primary)' : 'var(--slate-600)',
                boxShadow: authModalTab === 'login' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => setAuthModalTab('login')}
            >
              Sign In
            </button>
            <button
              id="tab-auth-register"
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: authModalTab === 'register' ? 'white' : 'transparent',
                color: authModalTab === 'register' ? 'var(--primary)' : 'var(--slate-600)',
                boxShadow: authModalTab === 'register' ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => setAuthModalTab('register')}
            >
              Register
            </button>
          </div>

          {/* Quick Demo Login Preset Bar */}
          <div style={{ 
            background: 'var(--primary-light)', 
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-hover)', marginBottom: '0.4rem' }}>
              ⚡ 1-Click Demo Evaluation Profiles:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                id="btn-quick-login-alex"
                style={{
                  fontSize: '0.73rem',
                  padding: '0.25rem 0.55rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary-hover)',
                  fontWeight: 600
                }}
                onClick={() => handleQuickDemoLogin('alex.renter@university.edu')}
              >
                Alex (Renter)
              </button>
              <button
                type="button"
                id="btn-quick-login-sarah"
                style={{
                  fontSize: '0.73rem',
                  padding: '0.25rem 0.55rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary-hover)',
                  fontWeight: 600
                }}
                onClick={() => handleQuickDemoLogin('sarah.owner@university.edu')}
              >
                Sarah (Owner)
              </button>
              <button
                type="button"
                id="btn-quick-login-admin"
                style={{
                  fontSize: '0.73rem',
                  padding: '0.25rem 0.55rem',
                  background: '#fef2f2',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontWeight: 600
                }}
                onClick={() => handleQuickDemoLogin('admin@rentloop.edu')}
              >
                Admin Officer
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit}>
            {authModalTab === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    id="input-reg-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Jordan Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    id="input-reg-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 555-0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">University / Email Address</label>
              <input
                id="input-auth-email"
                type="email"
                className="form-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="input-auth-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              id="btn-submit-auth"
              className="hero-btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            >
              {isSubmitting ? 'Authenticating...' : authModalTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

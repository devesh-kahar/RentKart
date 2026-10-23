import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Star,
  Users
} from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
          showToast('Welcome back to RentLoop!', 'success');
          closeAuthModal();
        } else {
          showToast('Login failed. Please check your credentials.', 'error');
        }
      } else {
        const res = await register(name, email, password, phone);
        if (res.success) {
          showToast('Account registered successfully! Welcome to RentLoop.', 'success');
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

  const handleGoogleSignIn = () => {
    switchPersona('alex.renter@university.edu');
    showToast('Signed in successfully via Google Campus SSO (Alex Rivera)', 'success');
    closeAuthModal();
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
        className="auth-split-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Brand & Value Proposition (Bright Light Gradient Theme) */}
        <div className="auth-split-left">
          <div className="auth-split-left-overlay" />
          
          <div className="auth-split-left-content">
            {/* Top Brand Bar */}
            <div className="auth-brand-badge">
              <div className="brand-icon-wrapper" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <span className="auth-split-brand-title">RentLoop</span>
              </div>
              <span className="auth-brand-tag">Campus Network</span>
            </div>

            {/* Middle Value Proposition */}
            <div style={{ margin: '1.75rem 0' }}>
              <h2 className="auth-split-tagline">
                Campus Gear Rental, <br />
                <span className="gradient-text">
                  Reimagined.
                </span>
              </h2>

              <p className="auth-split-sub">
                Access pro equipment right on campus. Rent high-end cameras, laptops, and gear directly from verified student peers with complete peace of mind.
              </p>

              <div className="auth-vprop-list">
                <div className="auth-vprop-item">
                  <div className="auth-vprop-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div className="auth-vprop-title">100% Secure Deposit Protection</div>
                    <div className="auth-vprop-sub">Security deposits held safely in escrow until verified safe item return.</div>
                  </div>
                </div>

                <div className="auth-vprop-item">
                  <div className="auth-vprop-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div className="auth-vprop-title">Verified Campus Peers</div>
                    <div className="auth-vprop-sub">Exclusive to authenticated university students and faculty.</div>
                  </div>
                </div>

                <div className="auth-vprop-item">
                  <div className="auth-vprop-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div className="auth-vprop-title">Instant In-Person Handover</div>
                    <div className="auth-vprop-sub">Meet at library plaza, student union, or dorms in under 15 mins.</div>
                  </div>
                </div>

                <div className="auth-vprop-item">
                  <div className="auth-vprop-icon">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div className="auth-vprop-title">Zero Hassle Escrow</div>
                    <div className="auth-vprop-sub">Automatic check-in inspection, condition logs & dispute defense.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Social Proof Rating Box */}
            <div className="auth-split-social-proof">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', marginBottom: '0.2rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" />
                  ))}
                  <strong style={{ color: 'var(--slate-900)', fontSize: '0.82rem', marginLeft: '0.35rem' }}>4.9/5.0</strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  Trusted by 1,480+ campus students
                </div>
              </div>

              {/* Student Avatars Stack */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={DEMO_USERS[0].avatar} 
                  alt="Student" 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #ffffff', objectFit: 'cover' }} 
                />
                <img 
                  src={DEMO_USERS[1].avatar} 
                  alt="Student" 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #ffffff', marginLeft: '-8px', objectFit: 'cover' }} 
                />
                <img 
                  src={DEMO_USERS[2].avatar} 
                  alt="Student" 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #ffffff', marginLeft: '-8px', objectFit: 'cover' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Pristine Pure White Card Surface */}
        <div className="auth-split-right">
          <button 
            id="btn-close-auth" 
            className="auth-modal-close" 
            onClick={closeAuthModal}
            aria-label="Close authentication modal"
          >
            <X size={18} />
          </button>

          {/* Form Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              {authModalTab === 'login' ? 'Welcome Back' : 'Create Free Account'}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
              {authModalTab === 'login' 
                ? 'Sign in to access your rentals, listings, and messages.' 
                : 'Join your campus gear community with university verification.'}
            </p>
          </div>

          {/* Segmented Sign In / Register Switch */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--slate-100)', 
            padding: '0.3rem', 
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--slate-200)',
            marginBottom: '1.25rem' 
          }}>
            <button
              id="tab-auth-login"
              type="button"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.86rem',
                background: authModalTab === 'login' ? '#ffffff' : 'transparent',
                color: authModalTab === 'login' ? 'var(--primary)' : 'var(--slate-600)',
                boxShadow: authModalTab === 'login' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setAuthModalTab('login')}
            >
              Sign In
            </button>
            <button
              id="tab-auth-register"
              type="button"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.86rem',
                background: authModalTab === 'register' ? '#ffffff' : 'transparent',
                color: authModalTab === 'register' ? 'var(--primary)' : 'var(--slate-600)',
                boxShadow: authModalTab === 'register' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setAuthModalTab('register')}
            >
              Register
            </button>
          </div>

          {/* "Continue with Google" Button */}
          <button 
            type="button"
            id="btn-google-auth"
            className="google-btn"
            onClick={handleGoogleSignIn}
          >
            {/* Official Google 4-Color SVG Icon */}
            <svg width="19" height="19" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
            <span className="google-sso-badge">Campus SSO</span>
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <span>or with university email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {authModalTab === 'register' && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon-prefix" />
                    <input
                      id="input-reg-name"
                      type="text"
                      className="form-input input-has-prefix"
                      placeholder="e.g. Jordan Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon-prefix" />
                    <input
                      id="input-reg-phone"
                      type="tel"
                      className="form-input input-has-prefix"
                      placeholder="+1 555-0123"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">University / Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon-prefix" />
                <input
                  id="input-auth-email"
                  type="email"
                  className="form-input input-has-prefix"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {authModalTab === 'login' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
                    Forgot?
                  </span>
                )}
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon-prefix" />
                <input
                  id="input-auth-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input input-has-prefix input-has-suffix"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-auth"
              className="carousel-btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem 1.25rem' }}
            >
              {isSubmitting ? (
                'Authenticating...'
              ) : authModalTab === 'login' ? (
                <>
                  <span>Sign In to RentLoop</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Evaluation Profiles Bar */}
          <div style={{ 
            background: 'var(--primary-light)', 
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 0.85rem',
            marginTop: '1.25rem'
          }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, color: 'var(--primary-hover)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>⚡ 1-Click Evaluation Profiles:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
              <button
                type="button"
                id="btn-quick-login-alex"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.5rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary-hover)',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => handleQuickDemoLogin('alex.renter@university.edu')}
              >
                <span>👤</span>
                <span>Alex (Renter)</span>
              </button>
              <button
                type="button"
                id="btn-quick-login-sarah"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.5rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary-hover)',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => handleQuickDemoLogin('sarah.owner@university.edu')}
              >
                <span>⭐</span>
                <span>Sarah (Owner)</span>
              </button>
              <button
                type="button"
                id="btn-quick-login-marcus"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.5rem',
                  background: 'white',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary-hover)',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => handleQuickDemoLogin('marcus.creator@university.edu')}
              >
                <span>🎬</span>
                <span>Marcus (Creator)</span>
              </button>
              <button
                type="button"
                id="btn-quick-login-admin"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.5rem',
                  background: '#fff1f2',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  fontWeight: 600,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => handleQuickDemoLogin('admin@rentloop.edu')}
              >
                <span>🛡️</span>
                <span>Admin Officer</span>
              </button>
            </div>
          </div>

          {/* Safety Guarantee Notice */}
          <div style={{ 
            marginTop: '1rem', 
            textAlign: 'center', 
            fontSize: '0.71rem', 
            color: 'var(--slate-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}>
            <ShieldCheck size={13} color="var(--emerald)" />
            <span>Protected by RentLoop 100% Secure Deposit Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

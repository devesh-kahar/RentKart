import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, DollarSign, MapPin } from 'lucide-react';
import { categoriesApi, rentalRequestsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const CreateRentalRequestModal = ({ onClose, onRequestCreated }) => {
  const { currentUser, openLogin } = useAuth();
  const { showToast } = useNotifications();

  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('1');
  const [description, setDescription] = useState('');
  const [budgetPerDay, setBudgetPerDay] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const weekendEnd = new Date();
  weekendEnd.setDate(weekendEnd.getDate() + 3);
  const defaultEnd = weekendEnd.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await categoriesApi.getAll();
    setCategories(cats);
    if (cats.length > 0) setCategoryId(String(cats[0].id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      openLogin();
      return;
    }

    if (!title.trim()) {
      showToast('Please give your request a short title', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please describe what item you are looking for', 'error');
      return;
    }

    if (!budgetPerDay || Number(budgetPerDay) <= 0) {
      showToast('Please specify a positive daily budget', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        categoryId: Number(categoryId),
        description,
        budgetPerDay: Number(budgetPerDay),
        startDate,
        endDate,
        urgency,
        latitude: 40.7128,
        longitude: -74.0060
      };

      const created = await rentalRequestsApi.create(payload, currentUser);
      showToast('Wanted to Rent request posted! The matching engine is searching for items.', 'success');
      if (onRequestCreated) onRequestCreated(created);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        id="create-rental-request-modal"
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Post a "Wanted to Rent" Request</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Can't find what you need? State your budget and let campus owners match with you!
              </p>
            </div>
          </div>
          <button id="btn-close-rental-request" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="form-group">
              <label className="form-label">Request Title / Headline</label>
              <input
                id="input-request-title"
                type="text"
                className="form-input"
                placeholder="e.g. Need DJI Ronin gimbal or Sony 50mm Lens for graduation shoot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category Needed</label>
                <select
                  id="select-request-category"
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select
                  id="select-request-urgency"
                  className="form-select"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="Normal">🟢 Normal (Flexible timeline)</option>
                  <option value="High Priority">⚡ High Priority (This weekend / project)</option>
                  <option value="Urgent">🔥 Urgent (Needed within 24-48 hours)</option>
                </select>
              </div>
            </div>

          <div className="form-group">
            <label className="form-label">What item do you need?</label>
            <textarea
              id="textarea-request-desc"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Need a Sony A7 or Canon R6 with 50mm lens for shooting a graduation portfolio this Friday to Sunday..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Target Daily Budget ($ USD / day)</label>
            <input
              id="input-request-budget"
              type="number"
              step="1"
              className="form-input"
              placeholder="e.g. 30"
              value={budgetPerDay}
              onChange={(e) => setBudgetPerDay(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Needed From</label>
              <input
                id="input-request-start"
                type="date"
                className="form-input"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Needed Until</label>
              <input
                id="input-request-end"
                type="date"
                className="form-input"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          </div>

          {/* Pinned Sticky Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={onClose}
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-rental-request"
              className="hero-btn-primary"
              disabled={isSubmitting}
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
            >
              {isSubmitting ? 'Posting...' : 'Post Request & Find Matches'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

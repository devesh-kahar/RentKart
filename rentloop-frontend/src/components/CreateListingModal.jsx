import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Repeat, 
  ShoppingBag, 
  Sparkles,
  Check,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { categoriesApi, listingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const CreateListingModal = ({ onClose, onListingCreated }) => {
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();

  const [categories, setCategories] = useState([]);
  const [listingMode, setListingMode] = useState('BOTH'); // 'RENT' | 'BUY' | 'BOTH'
  const [categoryId, setCategoryId] = useState('1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('LIKE_NEW');
  const [pricePerDay, setPricePerDay] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [locationName, setLocationName] = useState('Student Union Plaza • 0.2 mi');
  const [imageUrl, setImageUrl] = useState('');
  const [attributes, setAttributes] = useState([
    { keyName: 'Brand', value: '' },
    { keyName: 'Model', value: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await categoriesApi.getAll();
    setCategories(cats);
    if (cats.length > 0) setCategoryId(String(cats[0].id));
  };

  const addAttributeRow = () => {
    setAttributes([...attributes, { keyName: '', value: '' }]);
  };

  const removeAttributeRow = (idx) => {
    setAttributes(attributes.filter((_, i) => i !== idx));
  };

  const updateAttribute = (idx, field, val) => {
    const updated = [...attributes];
    updated[idx][field] = val;
    setAttributes(updated);
  };

  // Image Presets for rapid testing
  const presets = [
    { name: '💻 Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80' },
    { name: '📷 Camera', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80' },
    { name: '🎸 Guitar', url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80' },
    { name: '🎮 Console', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80' },
    { name: '🚲 Bike', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an item title', 'error');
      return;
    }

    const allowRent = listingMode === 'RENT' || listingMode === 'BOTH';
    const allowBuy = listingMode === 'BUY' || listingMode === 'BOTH';

    if (allowRent && (!pricePerDay || Number(pricePerDay) <= 0)) {
      showToast('Please provide a valid rental price per day', 'error');
      return;
    }

    if (allowBuy && (!buyPrice || Number(buyPrice) <= 0)) {
      showToast('Please provide a valid purchase price', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const filteredAttributes = attributes.filter(a => a.keyName.trim() && a.value.trim());

      const payload = {
        categoryId: Number(categoryId),
        title,
        name: title,
        description,
        condition,
        allowRent,
        allowBuy,
        pricePerDay: allowRent ? Number(pricePerDay) : 0,
        depositAmount: allowRent ? Number(depositAmount || 0) : 0,
        buyPrice: allowBuy ? Number(buyPrice) : null,
        locationName,
        latitude: 40.7128,
        longitude: -74.0060,
        imageUrls: imageUrl.trim() ? [imageUrl.trim()] : [presets[0].url],
        attributes: filteredAttributes
      };

      const created = await listingsApi.create(payload, currentUser);
      showToast(`Listing "${title}" published successfully!`, 'success');
      if (onListingCreated) onListingCreated(created);
      onClose();
    } catch (err) {
      showToast(err.message || 'Error creating listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        id="create-listing-modal"
        className="modal-container large" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
              <Plus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>List an Item on RentLoop</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Rent it out for passive income, sell it outright, or offer both!
              </p>
            </div>
          </div>
          <button id="btn-close-create-listing" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
            {/* Mode Selector */}
          <div className="form-group">
            <label className="form-label">How do you want to list this item?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <button
                type="button"
                id="btn-mode-both"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: listingMode === 'BOTH' ? '2px solid var(--primary)' : '1px solid var(--slate-200)',
                  background: listingMode === 'BOTH' ? 'var(--primary-light)' : 'white',
                  color: listingMode === 'BOTH' ? 'var(--primary)' : 'var(--slate-700)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => setListingMode('BOTH')}
              >
                <Sparkles size={18} />
                <span>Rent & Sell (Both)</span>
              </button>

              <button
                type="button"
                id="btn-mode-rent"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: listingMode === 'RENT' ? '2px solid var(--primary)' : '1px solid var(--slate-200)',
                  background: listingMode === 'RENT' ? 'var(--primary-light)' : 'white',
                  color: listingMode === 'RENT' ? 'var(--primary)' : 'var(--slate-700)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => setListingMode('RENT')}
              >
                <Repeat size={18} />
                <span>For Rent Only</span>
              </button>

              <button
                type="button"
                id="btn-mode-buy"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: listingMode === 'BUY' ? '2px solid var(--secondary)' : '1px solid var(--slate-200)',
                  background: listingMode === 'BUY' ? 'var(--secondary-light)' : 'white',
                  color: listingMode === 'BUY' ? 'var(--secondary)' : 'var(--slate-700)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onClick={() => setListingMode('BUY')}
              >
                <ShoppingBag size={18} />
                <span>For Sale Only</span>
              </button>
            </div>
          </div>

          {/* Category & Title */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                id="select-listing-category"
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
              <label className="form-label">Item Condition</label>
              <select
                id="select-listing-condition"
                className="form-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="BRAND_NEW">Brand New (Unopened / Mint)</option>
                <option value="LIKE_NEW">Like New (Flawless condition)</option>
                <option value="GOOD">Good (Light cosmetic signs)</option>
                <option value="FAIR">Fair (Fully functional)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Listing Title</label>
            <input
              id="input-listing-title"
              type="text"
              className="form-input"
              placeholder="e.g. Sony FX3 Cinema Line Camera + 24-70mm GM Lens"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Inclusions</label>
            <textarea
              id="textarea-listing-desc"
              className="form-textarea"
              rows={3}
              placeholder="Describe condition, accessories included (chargers, cases, cables), and handover preferences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Pricing Controls */}
          <div className="form-row">
            {(listingMode === 'RENT' || listingMode === 'BOTH') && (
              <>
                <div className="form-group">
                  <label className="form-label">Daily Rental Price ($ USD / day)</label>
                  <input
                    id="input-listing-rent-price"
                    type="number"
                    step="0.5"
                    className="form-input"
                    placeholder="e.g. 25"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    required={listingMode !== 'BUY'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Refundable Security Deposit ($ USD)</label>
                  <input
                    id="input-listing-deposit"
                    type="number"
                    step="5"
                    className="form-input"
                    placeholder="e.g. 100"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </>
            )}

            {(listingMode === 'BUY' || listingMode === 'BOTH') && (
              <div className="form-group">
                <label className="form-label">Outright Purchase Price ($ USD)</label>
                <input
                  id="input-listing-buy-price"
                  type="number"
                  step="5"
                  className="form-input"
                  placeholder="e.g. 750"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required={listingMode !== 'RENT'}
                />
              </div>
            )}
          </div>

          {/* Campus Location */}
          <div className="form-group">
            <label className="form-label">Campus Handover Location</label>
            <input
              id="input-listing-location"
              type="text"
              className="form-input"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Science Library Quad, Student Union"
            />
          </div>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">Image URL or Pick Preset</label>
            <input
              id="input-listing-image-url"
              type="url"
              className="form-input"
              placeholder="Paste high-res image URL (Cloudinary, Unsplash...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', alignSelf: 'center' }}>
                Quick Presets:
              </span>
              {presets.map((p, i) => (
                <button
                  type="button"
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    background: 'var(--slate-100)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--slate-700)'
                  }}
                  onClick={() => setImageUrl(p.url)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Specs / Attributes */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Category Specifications</label>
              <button
                type="button"
                style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                onClick={addAttributeRow}
              >
                <Plus size={14} /> Add Spec
              </button>
            </div>

            {attributes.map((attr, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Attribute (e.g. RAM)"
                  className="form-input"
                  style={{ flex: 1 }}
                  value={attr.keyName}
                  onChange={(e) => updateAttribute(idx, 'keyName', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 32GB)"
                  className="form-input"
                  style={{ flex: 1.5 }}
                  value={attr.value}
                  onChange={(e) => updateAttribute(idx, 'value', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAttributeRow(idx)}
                  style={{ color: '#be123c', padding: '0 0.4rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
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
              id="btn-submit-listing"
              className="hero-btn-primary"
              disabled={isSubmitting}
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

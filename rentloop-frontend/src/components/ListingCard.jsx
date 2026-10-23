import React from 'react';
import { Star, Repeat, ShoppingCart } from 'lucide-react';

export const ListingCard = ({ listing, onSelectListing }) => {
  const isRent = listing.allowRent !== false;
  const isBuy = Boolean(listing.allowBuy && listing.buyPrice);

  const getTagBadge = () => {
    if (isRent && isBuy) {
      return <span className="tag-badge both">🔄 Rent & 🏷️ Buy</span>;
    }
    if (isRent) {
      return <span className="tag-badge rent">🔄 For Rent</span>;
    }
    return <span className="tag-badge buy">🏷️ For Sale</span>;
  };

  const formatCondition = (cond) => {
    switch (cond) {
      case 'BRAND_NEW': return '✨ Brand New';
      case 'LIKE_NEW': return '💎 Like New';
      case 'GOOD': return '👍 Good';
      case 'FAIR': return '👌 Fair';
      default: return cond || 'Good';
    }
  };

  const imageSrc = listing.imageUrls?.[0] || 
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=80";

  const getOwnerAvatar = (email) => {
    if (email?.includes('sarah')) return "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80";
    if (email?.includes('marcus')) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80";
    if (email?.includes('alex')) return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";
  };

  return (
    <div 
      id={`listing-card-${listing.id}`}
      className="listing-card"
      onClick={() => onSelectListing(listing)}
    >
      {/* Top Media */}
      <div className="listing-card-img-container">
        <img 
          src={imageSrc} 
          alt={listing.title} 
          className="listing-card-img"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="badge-overlay-top">
          {getTagBadge()}
        </div>

        {/* Condition Badge */}
        <span className="condition-pill">
          {formatCondition(listing.item?.condition)}
        </span>
      </div>

      {/* Body Content */}
      <div className="listing-card-body">
        <div className="listing-category-text">
          {listing.item?.categoryName || "Marketplace"}
        </div>

        <h3 className="listing-title" title={listing.title}>
          {listing.title}
        </h3>

        {/* Attributes Preview */}
        {listing.item?.attributes && listing.item.attributes.length > 0 && (
          <div className="listing-attributes-preview">
            {listing.item.attributes.slice(0, 3).map((attr, idx) => (
              <span key={idx} className="attr-tag">
                {attr.keyName}: {attr.value}
              </span>
            ))}
          </div>
        )}

        {/* Pricing Row */}
        <div className="listing-price-row">
          {isRent ? (
            <div className="price-rent-block">
              <div>
                <span className="price-rent-val">${listing.pricePerDay}</span>
                <span className="price-rent-unit"> / day</span>
              </div>
              <span className="deposit-subtext">
                ${listing.depositAmount || 0} deposit protected
              </span>
            </div>
          ) : (
            <div className="price-rent-block">
              <span className="price-rent-val">${listing.buyPrice}</span>
              <span className="deposit-subtext">Outright Purchase</span>
            </div>
          )}

          {isBuy && isRent && (
            <div className="buy-price-badge">
              <div className="buy-price-val">${listing.buyPrice}</div>
              <div className="buy-price-label">or Buyout</div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="listing-card-footer">
        <div className="owner-chip">
          <img 
            src={getOwnerAvatar(listing.ownerEmail)}
            alt={listing.ownerName} 
            className="owner-mini-avatar" 
          />
          <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
            {listing.ownerName || "Campus Peer"}
          </span>
        </div>

        <div className="rating-star-chip">
          <Star size={13} className="star-icon" fill="#f59e0b" />
          <span>{listing.ownerRating || 5.0}</span>
          <span style={{ color: 'var(--slate-500)', fontWeight: 500 }}>
            ({listing.ownerReviewsCount || 1})
          </span>
        </div>
      </div>
    </div>
  );
};

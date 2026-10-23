import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Repeat, 
  ShoppingBag, 
  Sparkles,
  ArrowUpDown,
  Tag,
  Laptop,
  Camera,
  Music,
  Gamepad2,
  Bike,
  BookOpen,
  Shirt,
  Wrench
} from 'lucide-react';
import { categoriesApi, listingsApi } from '../services/api';
import { ListingCard } from '../components/ListingCard';

const getCategoryIcon = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('laptop') || name.includes('tech')) return Laptop;
  if (name.includes('camera') || name.includes('optic')) return Camera;
  if (name.includes('music') || name.includes('instrument')) return Music;
  if (name.includes('game') || name.includes('console')) return Gamepad2;
  if (name.includes('bike') || name.includes('mobility')) return Bike;
  if (name.includes('book') || name.includes('academic') || name.includes('textbook')) return BookOpen;
  if (name.includes('fashion') || name.includes('wear')) return Shirt;
  if (name.includes('tool') || name.includes('diy')) return Wrench;
  return Tag;
};

export const Marketplace = ({ 
  onSelectListing, 
  searchQuery, 
  setSearchQuery,
  onOpenCreateListing,
  onOpenRentalRequest
}) => {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'RENT_ONLY' | 'BUY_ONLY'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_low' | 'price_high'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, typeFilter, searchQuery, sortBy]);

  const loadCategories = async () => {
    const cats = await categoriesApi.getAll();
    setCategories(cats);
  };

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const results = await listingsApi.search({
        categoryId: selectedCategory,
        search: searchQuery,
        typeFilter
      });

      // Sort results
      let sorted = [...results];
      if (sortBy === 'price_low') {
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      } else if (sortBy === 'price_high') {
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      } else {
        sorted.sort((a, b) => b.id - a.id);
      }

      setListings(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Category Horizontal Pill Strip (Airbnb Inspired with Edge Fade) */}
      <section className="category-strip-wrapper">
        <div className="category-strip">
          <button
            id="cat-pill-all"
            className={`cat-pill ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <Sparkles size={16} />
            <span>All Categories</span>
          </button>

          {categories.map(c => {
            const Icon = getCategoryIcon(c.name);
            const isSelected = selectedCategory === c.id;

            return (
              <button
                key={c.id}
                id={`cat-pill-${c.id}`}
                className={`cat-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedCategory(isSelected ? null : c.id)}
              >
                <Icon size={16} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Layout with 1280px Container */}
      <main className="main-content-layout">
        {/* Marketplace Controls Bar */}
        <div className="marketplace-controls-bar">
          {/* Mode Filter Tabs: All, Rent Only, Buy Only */}
          <div className="filter-tabs-group">
            <button
              id="filter-tab-all"
              className={`filter-tab-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setTypeFilter('ALL')}
            >
              All Listings
            </button>
            <button
              id="filter-tab-rent"
              className={`filter-tab-btn ${typeFilter === 'RENT_ONLY' ? 'active' : ''}`}
              onClick={() => setTypeFilter('RENT_ONLY')}
            >
              🔄 For Rent
            </button>
            <button
              id="filter-tab-buy"
              className={`filter-tab-btn ${typeFilter === 'BUY_ONLY' ? 'active' : ''}`}
              onClick={() => setTypeFilter('BUY_ONLY')}
            >
              🏷️ For Sale
            </button>
          </div>

          {/* Sort Selector & Count */}
          <div className="sort-and-count">
            <span>
              Showing <strong>{listings.length}</strong> items
              {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </span>

            <select
              id="select-sort-listings"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Listings Grid (Responsive 4-Column Layout) */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--slate-500)' }}>
            <Repeat size={32} className="spin-animation" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
            <div>Loading verified campus listings...</div>
          </div>
        ) : listings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--slate-300)'
          }}>
            <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
              No items found matching your filters
            </h3>
            <p style={{ color: 'var(--slate-500)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.88rem' }}>
              Can't find the gear you need? Post a "Wanted to Rent" request and let campus peers reach out to you!
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button 
                id="btn-empty-clear-filters"
                className="hero-btn-secondary" 
                onClick={() => { setSelectedCategory(null); setTypeFilter('ALL'); setSearchQuery(''); }}
              >
                Clear Filters
              </button>
              <button 
                id="btn-empty-post-request"
                className="hero-btn-primary" 
                onClick={onOpenRentalRequest}
              >
                Post "Wanted to Rent" Request
              </button>
            </div>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map(item => (
              <ListingCard 
                key={item.id} 
                listing={item} 
                onSelectListing={onSelectListing} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

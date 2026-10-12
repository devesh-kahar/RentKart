import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Repeat, 
  ShoppingBag, 
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { categoriesApi, listingsApi } from '../services/api';
import { ListingCard } from '../components/ListingCard';

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
      {/* Category Horizontal Pill Strip */}
      <section className="category-strip-wrapper">
        <div className="category-strip">
          <button
            id="cat-pill-all"
            className={`cat-pill ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span>✨ All Categories</span>
          </button>

          {categories.map(c => (
            <button
              key={c.id}
              id={`cat-pill-${c.id}`}
              className={`cat-pill ${selectedCategory === c.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
            >
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Layout */}
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

        {/* Listings Grid */}
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              No items found matching your filters
            </h3>
            <p style={{ color: 'var(--slate-500)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.88rem' }}>
              Can't find the gear you need? Post a "Wanted to Rent" request and let owners reach out to you!
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

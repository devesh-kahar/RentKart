import {
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_BOOKINGS,
  INITIAL_RENTAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_CHAT_MESSAGES,
  DEMO_USERS
} from '../data/mockData';

// Local storage key constants for persistence during interactive demo
const STORAGE_KEYS = {
  LISTINGS: 'rentloop_listings_v2',
  BOOKINGS: 'rentloop_bookings_v2',
  REQUESTS: 'rentloop_requests_v2',
  NOTIFICATIONS: 'rentloop_notifications_v2',
  REVIEWS: 'rentloop_reviews_v2',
  CHATS: 'rentloop_chats_v2',
  CATEGORIES: 'rentloop_categories_v2',
  TOKEN: 'rentloop_jwt_token',
  CURRENT_USER: 'rentloop_current_user',
  USE_LIVE_API: 'rentloop_use_live_api'
};

// Seed local storage if empty
const loadOrSeed = (key, defaultData) => {
  try {
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(existing);
  } catch (e) {
    return defaultData;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Initialize in-memory / localStorage storage
let localCategories = loadOrSeed(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
let localListings = loadOrSeed(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
let localBookings = loadOrSeed(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
let localRequests = loadOrSeed(STORAGE_KEYS.REQUESTS, INITIAL_RENTAL_REQUESTS);
let localNotifications = loadOrSeed(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
let localReviews = loadOrSeed(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
let localChats = loadOrSeed(STORAGE_KEYS.CHATS, INITIAL_CHAT_MESSAGES);

export const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
export const setStoredToken = (token) => {
  if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  else localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : DEMO_USERS[0]; // Default to Alex Rivera
  } catch (e) {
    return DEMO_USERS[0];
  }
};

export const setStoredUser = (user) => {
  if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Check if live API is available
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('/api/categories', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    return false;
  }
};

const authHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// ─── AUTHENTICATION API ──────────────────────────────────────────────────
export const authApi = {
  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setStoredToken(data.token);
        return { success: true, token: data.token };
      }
    } catch (e) {
      // Fallback to demo mode
    }

    // Demo Mode fallback
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    const user = matched || {
      id: Date.now(),
      name: email.split('@')[0],
      email,
      phone: "+1 555-0100",
      role: email.includes('admin') ? "ADMIN" : "USER",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      rating: 5.0,
      reviewsCount: 1,
      campus: "University Main Campus",
      verifiedStudent: true
    };
    const mockToken = "mock_jwt_token_" + Date.now();
    setStoredToken(mockToken);
    setStoredUser(user);
    return { success: true, token: mockToken, user };
  },

  register: async (name, email, password, phone) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      if (res.ok) {
        const data = await res.json();
        setStoredToken(data.token);
        return { success: true, token: data.token };
      }
    } catch (e) {
      // Fallback
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone: phone || "+1 555-0111",
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      reviewsCount: 0,
      campus: "Central Campus",
      verifiedStudent: true
    };
    const mockToken = "mock_jwt_token_" + Date.now();
    setStoredToken(mockToken);
    setStoredUser(newUser);
    return { success: true, token: mockToken, user: newUser };
  },

  getCurrentUser: () => getStoredUser(),

  switchPersona: (personaEmail) => {
    const user = DEMO_USERS.find(u => u.email === personaEmail) || DEMO_USERS[0];
    setStoredUser(user);
    setStoredToken("token_" + user.role.toLowerCase() + "_" + user.id);
    return user;
  }
};

// ─── CATEGORIES API ──────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}
    return localCategories;
  }
};

// ─── LISTINGS API ────────────────────────────────────────────────────────
export const listingsApi = {
  search: async ({ categoryId, minPrice, maxPrice, search, typeFilter }) => {
    try {
      let queryParams = new URLSearchParams();
      if (categoryId) queryParams.append('categoryId', categoryId);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);

      const res = await fetch(`/api/listings/search?${queryParams.toString()}`);
      if (res.ok) {
        const pageData = await res.json();
        if (pageData && pageData.content) {
          return pageData.content;
        }
      }
    } catch (e) {}

    // Fallback search over local storage
    return localListings.filter(listing => {
      if (listing.status !== 'ACTIVE') return false;
      if (categoryId && Number(listing.item?.categoryId) !== Number(categoryId)) return false;
      if (minPrice && listing.pricePerDay < Number(minPrice)) return false;
      if (maxPrice && listing.pricePerDay > Number(maxPrice)) return false;
      if (typeFilter === 'RENT_ONLY' && !listing.allowRent) return false;
      if (typeFilter === 'BUY_ONLY' && !listing.allowBuy) return false;

      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        const matchesTitle = listing.title.toLowerCase().includes(q);
        const matchesDesc = listing.item?.description?.toLowerCase().includes(q);
        const matchesCat = listing.item?.categoryName?.toLowerCase().includes(q);
        const matchesAttrs = listing.item?.attributes?.some(a => 
          a.keyName.toLowerCase().includes(q) || a.value.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesAttrs) return false;
      }
      return true;
    });
  },

  getMyListings: async (userEmail) => {
    try {
      const res = await fetch('/api/listings/my-listings', {
        headers: authHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    return localListings.filter(l => l.ownerEmail === userEmail);
  },

  create: async (newListingData, currentUser) => {
    // Attempt backend creation
    try {
      // 1. Create item first if calling real backend
      const itemPayload = {
        categoryId: newListingData.categoryId,
        name: newListingData.name,
        description: newListingData.description,
        condition: newListingData.condition || "GOOD",
        attributes: newListingData.attributes || []
      };
      const itemRes = await fetch('/api/items', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(itemPayload)
      });

      if (itemRes.ok) {
        const createdItem = await itemRes.json();
        const listingPayload = {
          itemId: createdItem.id,
          title: newListingData.title,
          pricePerDay: newListingData.pricePerDay,
          depositAmount: newListingData.depositAmount,
          latitude: newListingData.latitude || 40.7128,
          longitude: newListingData.longitude || -74.0060,
          imageUrls: newListingData.imageUrls
        };
        const listingRes = await fetch('/api/listings', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(listingPayload)
        });
        if (listingRes.ok) {
          const createdListing = await listingRes.json();
          return createdListing;
        }
      }
    } catch (e) {}

    // Fallback creation in local store
    const cat = localCategories.find(c => c.id === Number(newListingData.categoryId)) || localCategories[0];
    const created = {
      id: Date.now(),
      title: newListingData.title,
      pricePerDay: Number(newListingData.pricePerDay),
      depositAmount: Number(newListingData.depositAmount || 0),
      buyPrice: newListingData.buyPrice ? Number(newListingData.buyPrice) : null,
      allowBuy: Boolean(newListingData.allowBuy),
      allowRent: newListingData.allowRent !== false,
      latitude: newListingData.latitude || 40.7128,
      longitude: newListingData.longitude || -74.0060,
      locationName: newListingData.locationName || "Campus Quad",
      status: "ACTIVE",
      ownerEmail: currentUser.email,
      ownerName: currentUser.name,
      ownerRating: currentUser.rating || 5.0,
      ownerReviewsCount: currentUser.reviewsCount || 1,
      imageUrls: newListingData.imageUrls?.length > 0 ? newListingData.imageUrls : [
        "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=80"
      ],
      item: {
        id: Date.now() + 1,
        categoryId: cat.id,
        categoryName: cat.name,
        name: newListingData.name || newListingData.title,
        description: newListingData.description,
        condition: newListingData.condition || "GOOD",
        attributes: newListingData.attributes || []
      }
    };

    localListings = [created, ...localListings];
    saveToStorage(STORAGE_KEYS.LISTINGS, localListings);
    return created;
  },

  delete: async (id) => {
    try {
      await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
    } catch (e) {}

    localListings = localListings.filter(l => l.id !== id);
    saveToStorage(STORAGE_KEYS.LISTINGS, localListings);
    return true;
  }
};

// ─── BOOKINGS & ORDERS API ───────────────────────────────────────────────
export const bookingsApi = {
  create: async ({ listingId, startDate, endDate, transactionType, offerAmount }, currentUser) => {
    const listing = localListings.find(l => l.id === listingId);
    if (!listing) throw new Error("Listing not found");

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ listingId, startDate, endDate })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Duration calculation in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalAmount = transactionType === 'BUY' 
      ? (offerAmount || listing.buyPrice || 100)
      : (diffTime * listing.pricePerDay);

    const newBooking = {
      id: Date.now(),
      listingId: listing.id,
      listingTitle: listing.title,
      renterEmail: currentUser.email,
      renterName: currentUser.name,
      ownerEmail: listing.ownerEmail,
      ownerName: listing.ownerName,
      startDate,
      endDate,
      totalAmount,
      depositAmount: transactionType === 'BUY' ? 0 : listing.depositAmount,
      status: "REQUESTED",
      transactionType: transactionType || 'RENT',
      createdAt: new Date().toISOString()
    };

    localBookings = [newBooking, ...localBookings];
    saveToStorage(STORAGE_KEYS.BOOKINGS, localBookings);

    // Notify owner
    const newNotif = {
      id: Date.now(),
      userEmail: listing.ownerEmail,
      title: transactionType === 'BUY' ? "New Purchase Offer!" : "New Booking Request",
      message: `${currentUser.name} requested to ${transactionType === 'BUY' ? 'buy' : 'rent'} "${listing.title}".`,
      type: "BOOKING_REQUESTED",
      isRead: false,
      createdAt: new Date().toISOString()
    };
    localNotifications = [newNotif, ...localNotifications];
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, localNotifications);

    return newBooking;
  },

  getMyRentals: async (userEmail) => {
    try {
      const res = await fetch('/api/bookings/my-rentals', { headers: authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    return localBookings.filter(b => b.renterEmail === userEmail);
  },

  getBookingsOnMyItems: async (userEmail) => {
    try {
      const res = await fetch('/api/bookings/my-items', { headers: authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    return localBookings.filter(b => b.ownerEmail === userEmail);
  },

  updateStatus: async (bookingId, newStatus) => {
    try {
      const actionEndpoint = newStatus === 'CONFIRMED' ? 'approve'
        : newStatus === 'ACTIVE' ? 'start'
        : newStatus === 'RETURNED' ? 'return'
        : 'cancel';
      await fetch(`/api/bookings/${bookingId}/${actionEndpoint}`, {
        method: 'PATCH',
        headers: authHeaders()
      });
    } catch (e) {}

    localBookings = localBookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    saveToStorage(STORAGE_KEYS.BOOKINGS, localBookings);
    return true;
  }
};

// ─── RENTAL REQUESTS (REVERSE DEMAND) API ────────────────────────────────
export const rentalRequestsApi = {
  create: async (requestData, currentUser) => {
    try {
      const res = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(requestData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const cat = localCategories.find(c => c.id === Number(requestData.categoryId)) || localCategories[0];
    const created = {
      id: Date.now(),
      categoryId: cat.id,
      categoryName: cat.name,
      requesterEmail: currentUser.email,
      requesterName: currentUser.name,
      description: requestData.description,
      budgetPerDay: Number(requestData.budgetPerDay),
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      latitude: requestData.latitude || 40.7128,
      longitude: requestData.longitude || -74.0060,
      status: "OPEN",
      createdAt: new Date().toISOString()
    };

    localRequests = [created, ...localRequests];
    saveToStorage(STORAGE_KEYS.REQUESTS, localRequests);
    return created;
  },

  getAll: async () => {
    return localRequests;
  },

  getMyRequests: async (userEmail) => {
    try {
      const res = await fetch('/api/rental-requests/my-requests', { headers: authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    return localRequests.filter(r => r.requesterEmail === userEmail);
  },

  findMatches: async (requestId) => {
    try {
      const res = await fetch(`/api/rental-requests/${requestId}/matches`, { headers: authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    const req = localRequests.find(r => r.id === requestId);
    if (!req) return [];

    // Intelligent match engine: items in same category within budget + 20%
    return localListings.filter(l => {
      if (l.status !== 'ACTIVE') return false;
      const sameCat = Number(l.item?.categoryId) === Number(req.categoryId);
      const budgetFit = l.pricePerDay <= (req.budgetPerDay * 1.25);
      return sameCat && budgetFit;
    });
  },

  cancel: async (requestId) => {
    try {
      await fetch(`/api/rental-requests/${requestId}/cancel`, {
        method: 'PATCH',
        headers: authHeaders()
      });
    } catch (e) {}

    localRequests = localRequests.map(r => r.id === requestId ? { ...r, status: 'CANCELLED' } : r);
    saveToStorage(STORAGE_KEYS.REQUESTS, localRequests);
    return true;
  }
};

// ─── CHAT API ────────────────────────────────────────────────────────────
export const chatApi = {
  getHistory: async (bookingId) => {
    try {
      const res = await fetch(`/api/chat/${bookingId}`, { headers: authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    return localChats.filter(c => c.bookingId === bookingId);
  },

  sendMessage: async (bookingId, senderEmail, senderName, receiverEmail, content) => {
    const newMsg = {
      id: Date.now(),
      bookingId,
      senderEmail,
      senderName,
      receiverEmail,
      content,
      timestamp: new Date().toISOString()
    };
    localChats = [...localChats, newMsg];
    saveToStorage(STORAGE_KEYS.CHATS, localChats);
    return newMsg;
  }
};

// ─── REVIEWS API ─────────────────────────────────────────────────────────
export const reviewsApi = {
  submit: async (bookingId, targetEmail, listingId, rating, comment, currentUser) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ bookingId, targetEmail, listingId, rating, comment })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newRev = {
      id: Date.now(),
      bookingId,
      reviewerEmail: currentUser.email,
      reviewerName: currentUser.name,
      targetEmail,
      listingId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };
    localReviews = [newRev, ...localReviews];
    saveToStorage(STORAGE_KEYS.REVIEWS, localReviews);
    return newRev;
  },

  getForListing: async (listingId) => {
    try {
      const res = await fetch(`/api/reviews/listing/${listingId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return localReviews.filter(r => r.listingId === listingId);
  },

  getForUser: async (email) => {
    try {
      const res = await fetch(`/api/reviews/user/${email}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return localReviews.filter(r => r.targetEmail === email);
  }
};

// ─── NOTIFICATIONS API ───────────────────────────────────────────────────
export const notificationsApi = {
  getMy: async (userEmail) => {
    try {
      const res = await fetch('/api/notifications', { headers: authHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    return localNotifications.filter(n => n.userEmail === userEmail);
  },

  markAsRead: async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: authHeaders()
      });
    } catch (e) {}

    localNotifications = localNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, localNotifications);
    return true;
  },

  markAllAsRead: async (userEmail) => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: authHeaders()
      });
    } catch (e) {}

    localNotifications = localNotifications.map(n => n.userEmail === userEmail ? { ...n, isRead: true } : n);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, localNotifications);
    return true;
  }
};

// ─── ADMIN API ───────────────────────────────────────────────────────────
export const adminApi = {
  getAllUsers: async () => DEMO_USERS,
  getAllListings: async () => localListings,
  getAllBookings: async () => localBookings,
  getAllRequests: async () => localRequests,
  getAllReviews: async () => localReviews,
  removeListing: async (id) => {
    localListings = localListings.filter(l => l.id !== id);
    saveToStorage(STORAGE_KEYS.LISTINGS, localListings);
    return true;
  },
  removeReview: async (id) => {
    localReviews = localReviews.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.REVIEWS, localReviews);
    return true;
  }
};

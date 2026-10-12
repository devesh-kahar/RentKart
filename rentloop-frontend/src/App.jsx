import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { Marketplace } from './pages/Marketplace';
import { MyBookings } from './pages/MyBookings';
import { RentalRequestsPage } from './pages/RentalRequestsPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './pages/AuthModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { CreateRentalRequestModal } from './components/CreateRentalRequestModal';
import { ChatDrawer } from './components/ChatDrawer';
import { ReviewModal } from './components/ReviewModal';

const AppContent = () => {
  const { currentUser } = useAuth();

  const [currentTab, setCurrentTab] = useState('marketplace'); // 'marketplace' | 'requests' | 'bookings' | 'owner' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedListing, setSelectedListing] = useState(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
        onOpenRentalRequest={() => setIsCreateRequestOpen(true)}
      />

      {/* Main Page Content */}
      <div style={{ flex: 1 }}>
        {currentTab === 'marketplace' && (
          <>
            {/* Show hero banner if search query is empty */}
            {!searchQuery && (
              <HeroBanner
                onExplore={() => {
                  const el = document.getElementById('cat-pill-all');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onPostItem={() => setIsCreateListingOpen(true)}
                onPostRequest={() => setIsCreateRequestOpen(true)}
              />
            )}

            <Marketplace
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectListing={(listing) => setSelectedListing(listing)}
              onOpenCreateListing={() => setIsCreateListingOpen(true)}
              onOpenRentalRequest={() => setIsCreateRequestOpen(true)}
            />
          </>
        )}

        {currentTab === 'requests' && (
          <RentalRequestsPage
            onOpenCreateRequest={() => setIsCreateRequestOpen(true)}
            onSelectListing={(listing) => setSelectedListing(listing)}
          />
        )}

        {currentTab === 'bookings' && (
          <MyBookings
            onOpenChat={(booking) => setChatContext(booking)}
            onOpenReviewModal={(booking) => setReviewBooking(booking)}
          />
        )}

        {currentTab === 'owner' && (
          <OwnerDashboard
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onOpenChat={(booking) => setChatContext(booking)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal />

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onOpenChat={(ctx) => setChatContext(ctx)}
          onBookingSuccess={() => setCurrentTab('bookings')}
        />
      )}

      {isCreateListingOpen && (
        <CreateListingModal
          onClose={() => setIsCreateListingOpen(false)}
          onListingCreated={() => {
            setCurrentTab('marketplace');
          }}
        />
      )}

      {isCreateRequestOpen && (
        <CreateRentalRequestModal
          onClose={() => setIsCreateRequestOpen(false)}
          onRequestCreated={() => {
            setCurrentTab('requests');
          }}
        />
      )}

      {chatContext && (
        <ChatDrawer
          context={chatContext}
          onClose={() => setChatContext(null)}
        />
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onReviewSubmitted={() => {}}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

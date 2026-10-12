import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationsApi } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (currentUser?.email) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser?.email) return;
    const notifs = await notificationsApi.getMy(currentUser.email);
    setNotifications(notifs);
  };

  const markAsRead = async (id) => {
    await notificationsApi.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    if (!currentUser?.email) return;
    await notificationsApi.markAllAsRead(currentUser.email);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      showToast,
      toastMessage
    }}>
      {children}
      {toastMessage && (
        <div className={`toast-notification toast-${toastMessage.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toastMessage.type === 'success' ? '✅' : toastMessage.type === 'error' ? '⚠️' : '🔔'}
            </span>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

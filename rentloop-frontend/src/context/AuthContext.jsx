import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getStoredToken, getStoredUser, checkBackendHealth, setStoredToken, setStoredUser } from '../services/api';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser() || DEMO_USERS[0]);
  const [token, setToken] = useState(() => getStoredToken() || 'demo_token_alex');
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    const live = await checkBackendHealth();
    setIsBackendLive(live);
  };

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success) {
      setCurrentUser(res.user);
      setToken(res.token);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = async (name, email, password, phone) => {
    const res = await authApi.register(name, email, password, phone);
    if (res.success) {
      setCurrentUser(res.user);
      setToken(res.token);
      return { success: true };
    }
    return { success: false, message: 'Registration failed' };
  };

  const logout = () => {
    setStoredToken(null);
    setStoredUser(null);
    setCurrentUser(null);
    setToken(null);
  };

  const switchPersona = (personaEmail) => {
    const user = authApi.switchPersona(personaEmail);
    setCurrentUser(user);
    setToken("token_" + user.id);
  };

  const openLogin = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      isBackendLive,
      checkHealth,
      login,
      register,
      logout,
      switchPersona,
      authModalOpen,
      authModalTab,
      setAuthModalTab,
      openLogin,
      openRegister,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

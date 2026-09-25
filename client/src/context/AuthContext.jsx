import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('uiu_auth_token');
        const storedUser = localStorage.getItem('uiu_mock_user');
        
        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Verify with backend
          try {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.user) {
                setUser(data.user);
                localStorage.setItem('uiu_mock_user', JSON.stringify(data.user));
              }
            } else if (res.status === 401 || res.status === 403) {
              // Expired or invalid token
              localStorage.removeItem('uiu_auth_token');
              localStorage.removeItem('uiu_mock_user');
              setToken(null);
              setUser(null);
            }
          } catch (netErr) {
            console.warn('Backend offline, using cached credentials:', netErr.message);
          }
        }
      } catch (e) {
        console.error('Failed to load user session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginApi = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.removeItem('uiu_order_chats_v1');
      localStorage.removeItem('uiu_active_delivery');
      localStorage.setItem('uiu_auth_token', data.token);
      localStorage.setItem('uiu_mock_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      console.warn('API login error, using local fallback:', err.message);
      return { success: false, error: err.message };
    }
  };

  const registerApi = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.removeItem('uiu_order_chats_v1');
      localStorage.removeItem('uiu_active_delivery');
      localStorage.setItem('uiu_auth_token', data.token);
      localStorage.setItem('uiu_mock_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const login = (userData) => {
    localStorage.removeItem('uiu_order_chats_v1');
    localStorage.removeItem('uiu_active_delivery');
    localStorage.setItem('uiu_mock_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API notification error:', e);
    }
    localStorage.removeItem('uiu_mock_user');
    localStorage.removeItem('uiu_auth_token');
    localStorage.removeItem('uiu_order_chats_v1');
    localStorage.removeItem('uiu_active_delivery');
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const storedToken = token || localStorage.getItem('uiu_auth_token');
      if (!storedToken) return null;
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('uiu_mock_user', JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn('Failed to refresh user:', e);
    }
    return null;
  };

  const updateUserWallet = (newBalance) => {
    if (!user) return;
    const updated = { ...user, walletBalance: newBalance };
    if (user.role === 'runner' && user.runnerDetails) {
      updated.runnerDetails = { ...user.runnerDetails, walletBalance: newBalance };
    }
    setUser(updated);
    localStorage.setItem('uiu_mock_user', JSON.stringify(updated));
  };

  const updateUserData = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('uiu_mock_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginApi, registerApi, logout, refreshUser, updateUserWallet, updateUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// localStorage key for the cached user profile (no longer "mock" — it mirrors the backend session)
const USER_CACHE_KEY = 'uiu_user_cache';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('uiu_auth_token');
        // Support both the old key (migration) and the new key
        const storedUser =
          localStorage.getItem(USER_CACHE_KEY) ||
          localStorage.getItem('uiu_mock_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (_) {}
          }
          // Verify with backend — always prefer live data
          try {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.user) {
                setUser(data.user);
                localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
                // Remove legacy key if present
                localStorage.removeItem('uiu_mock_user');
              }
            } else if (res.status === 401 || res.status === 403) {
              // Expired or invalid token — clear everything
              localStorage.removeItem('uiu_auth_token');
              localStorage.removeItem(USER_CACHE_KEY);
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

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.status >= 500
            ? 'Backend server is offline or unreachable on port 5001. Please check that the backend is running.'
            : 'Invalid response from server'
        );
      }

      if (!res.ok) {
        if (data?.isPendingApproval) {
          return {
            success: false,
            isPendingApproval: true,
            message: data.message || 'Account is pending admin approval',
            role: data.role || data.accountRole,
            name: data.name,
            email: data.email || email
          };
        }
        throw new Error(data?.message || 'Login failed');
      }

      localStorage.removeItem('uiu_order_chats_v1');
      localStorage.removeItem('uiu_active_delivery');
      localStorage.removeItem('uiu_mock_user'); // remove legacy key on fresh login
      localStorage.setItem('uiu_auth_token', data.token);
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      console.warn('API login error:', err.message);
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

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.status >= 500
            ? 'Backend server is offline or unreachable on port 5001. Please check that the backend is running.'
            : 'Invalid response from server'
        );
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      // If registration requires admin approval (Shop Owner or Delivery Runner)
      if (data?.isPendingApproval || data?.requiresApproval || !data?.token) {
        return {
          success: true,
          isPendingApproval: true,
          message: data?.message || 'Account registered and pending admin approval',
          user: data?.user,
          role: data?.user?.role || userData.role,
          email: data?.user?.email || userData.email,
          name: data?.user?.name || userData.name
        };
      }

      // If immediately active (e.g. Student)
      localStorage.removeItem('uiu_order_chats_v1');
      localStorage.removeItem('uiu_active_delivery');
      localStorage.removeItem('uiu_mock_user');
      localStorage.setItem('uiu_auth_token', data.token);
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API notification error:', e);
    }
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem('uiu_mock_user'); // clean up legacy key
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
          localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
          localStorage.removeItem('uiu_mock_user');
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
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(updated));
  };

  const updateUserData = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loginApi, registerApi, logout, refreshUser, updateUserWallet, updateUserData, isLoading }}>
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

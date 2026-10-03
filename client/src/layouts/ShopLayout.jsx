import React, { useState, useEffect } from 'react';
import SharedLayout from '../components/SharedLayout';
import { shopNavigation } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import OrderChatDrawer from '../components/chat/OrderChatDrawer';

export default function ShopLayout() {
  const { user, token } = useAuth();
  const [shopProfile, setShopProfile] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const authToken = token || localStorage.getItem('uiu_auth_token');
        if (!authToken) return;
        const res = await fetch('/api/shops/my-shop', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.shop) setShopProfile(data.shop);
        }
      } catch (_) {
        // Silently fall back to user-level data
      }
    };
    fetchShop();
  }, [token]);

  const currentUser = {
    // Show shop name (from live shop record → shopDetails → owner name fallback)
    name: shopProfile?.name || user?.shopDetails?.shopName || user?.name || 'UIU Shop',
    // Show shop profile image (from live shop record → owner avatar fallback)
    avatar:
      shopProfile?.image ||
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&h=150&fit=crop'
  };

  return (
    <>
      <SharedLayout navigation={shopNavigation} user={currentUser} isShopRole />
      <OrderChatDrawer />
    </>
  );
}

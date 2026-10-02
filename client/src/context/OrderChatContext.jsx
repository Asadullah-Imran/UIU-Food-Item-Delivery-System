import React, { createContext, useContext, useState, useEffect } from 'react';
import initialOrderChats from '../data/orderChatsData.json';
import { useAuth } from './AuthContext';

const OrderChatContext = createContext();

const STORAGE_KEY = 'uiu_order_chats_v1';

const normalizeOrderNumber = (orderId) => {
  if (!orderId) return '';
  const value = String(orderId).trim();
  return value.startsWith('#') ? value : `#${value}`;
};

const normalizeApiChat = (chatData, fallbackOrderId = null) => {
  if (!chatData || !chatData.messages) return [];

  return chatData.messages.map((message, index) => ({
    id: message._id || `msg_${index}`,
    senderRole: message.senderRole || 'student',
    senderName: message.senderName || 'User',
    avatar: message.avatar || 'https://i.pravatar.cc/150?u=chat',
    target: message.target || 'all',
    text: message.text || '',
    time: message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
    status: message.status || 'read'
  }));
};

const getNormalizedId = (value) => String(value ?? '').trim();

const isCurrentUserMatchedToOrder = (order, user) => {
  if (!order || !user) return true;
  const currentUserId = getNormalizedId(user._id || user.id);
  const currentUserName = String(user.name || '').trim().toLowerCase();

  const studentId = getNormalizedId(order?.student?.id || order?.student?._id || order?.student);
  const runnerId = getNormalizedId(order?.runner?.id || order?.runner?._id || order?.runner);
  const shopId = getNormalizedId(order?.shop?.id || order?.shop?._id || order?.shop);

  if (user.role === 'student') {
    return !currentUserId || studentId === currentUserId || String(order?.student?.name || '').trim().toLowerCase() === currentUserName;
  }

  if (user.role === 'runner') {
    if (!order?.runner) return false;
    const isAcceptedByRunner = ['READY_FOR_PICKUP', 'HANDED_OVER', 'ON_THE_WAY', 'DELIVERED'].includes(order?.status);
    if (!isAcceptedByRunner) return false;
    if (currentUserId) return runnerId === currentUserId;
    return String(order?.runner?.name || '').trim().toLowerCase() === currentUserName;
  }

  if (user.role === 'shop') {
    return true;
  }

  return true;
};

const mapOrderToChat = (order, currentUser) => {
  if (!order) return null;

  const shopId = order.shop?._id || order.shop || '';
  const studentId = order.student?._id || order.student || '';
  const runnerId = order.runner?._id || order.runner || '';

  return {
    orderId: order.orderNumber || order._id || '#unknown',
    shop: {
      id: shopId,
      name: order.shop?.name || 'Shop',
      avatar: order.shop?.image || 'https://i.pravatar.cc/150?u=shop',
      phone: order.shop?.phone || '',
      location: order.shop?.location || ''
    },
    student: {
      id: studentId,
      name: order.student?.name || currentUser?.name || 'Student',
      avatar: order.student?.avatar || 'https://i.pravatar.cc/150?u=student',
      phone: order.student?.phone || '',
      room: order.deliveryAddress?.room || ''
    },
    runner: {
      id: runnerId,
      name: order.runner?.name || 'Unassigned Runner',
      avatar: order.runner?.avatar || 'https://i.pravatar.cc/150?u=runner',
      phone: order.runner?.phone || '',
      vehicle: order.runner?.runnerDetails?.vehicle || ''
    },
    status: order.status || 'PREPARING',
    statusLabel: order.statusLabel || order.status || 'Preparing',
    eta: order.eta || 'Live',
    totalPrice: order.billing?.grandTotal || order.totalPrice || 0,
    items: Array.isArray(order.items) ? order.items.map(item => ({
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || item.amount || 0,
      note: item.note || ''
    })) : [],
    messages: Array.isArray(order.messages) ? order.messages.map((message, index) => ({
      id: message._id || `msg_${index}`,
      senderRole: message.senderRole || 'student',
      senderName: message.senderName || 'User',
      avatar: message.avatar || 'https://i.pravatar.cc/150?u=chat',
      target: message.target || 'all',
      text: message.text || '',
      time: message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
      status: message.status || 'read'
    })) : [],
    autoReplies: { student: [], shop: [], runner: [] }
  };
};

export function OrderChatProvider({ children }) {
  const { user, token } = useAuth();
  const [orderChats, setOrderChats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load order chats from localStorage:', e);
    }
    return initialOrderChats;
  });

  const [activeOrderId, setActiveOrderId] = useState('#UIU-2026-1030');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState('shop');
  const [typingParticipants, setTypingParticipants] = useState({});

  useEffect(() => {
    if (!user || !token) return;

    const loadCurrentUserOrders = async () => {
      try {
        let orders = [];

        if (user.role === 'student') {
          const res = await fetch('/api/student/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch student orders');
          const data = await res.json();
          orders = data.orders || [];
        } else if (user.role === 'runner') {
          const activeRes = await fetch('/api/runner/orders/active', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const historyRes = await fetch('/api/runner/history', {
            headers: { Authorization: `Bearer ${token}` }
          });

          let activeOrders = [];
          if (activeRes.ok) {
            const activeData = await activeRes.json();
            if (activeData?.order) activeOrders = [activeData.order];
          }

          let historyOrders = [];
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            historyOrders = historyData?.history || [];
          }

          orders = [...activeOrders, ...historyOrders];
        } else if (user.role === 'shop') {
          const res = await fetch('/api/shop/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Failed to fetch shop orders');
          const data = await res.json();
          orders = data.orders || [];
        }

        const mappedOrders = orders
          .map(order => mapOrderToChat(order, user))
          .filter(order => isCurrentUserMatchedToOrder(order, user));

        if (mappedOrders.length > 0) {
          setOrderChats(mappedOrders);
          setActiveOrderId(mappedOrders[0].orderId);
        } else {
          setOrderChats([]);
          setActiveOrderId(null);
        }
      } catch (error) {
        console.warn('Could not fetch current user orders for chat list:', error.message);
      }
    };

    loadCurrentUserOrders();
  }, [user?._id, user?.id, user?.name, user?.role, token]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderChats));
    } catch (e) {
      console.error('Failed to save order chats to localStorage:', e);
    }
  }, [orderChats]);

  const loadOrderChat = async (orderId) => {
    const normalizedOrderId = normalizeOrderNumber(orderId);
    if (!normalizedOrderId || !user || !token) {
      return;
    }

    let endpoint = null;
    if (user.role === 'student') {
      endpoint = `/api/student/chat/${encodeURIComponent(normalizedOrderId)}`;
    } else if (user.role === 'runner') {
      endpoint = `/api/runner/chat/${encodeURIComponent(normalizedOrderId)}`;
    } else if (user.role === 'shop') {
      endpoint = `/api/shop/chat/${encodeURIComponent(normalizedOrderId)}`;
    }

    if (!endpoint) return;

    try {
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Unable to load order chat');
      }

      const data = await res.json();
      const chatMessages = normalizeApiChat(data.chat || { messages: [] }, normalizedOrderId);

      setOrderChats(prev => {
        const currentOrder = prev.find(item => normalizeOrderNumber(item.orderId) === normalizedOrderId);
        if (!currentOrder) {
          return [
            {
              orderId: normalizedOrderId,
              shop: { name: 'Shop', avatar: 'https://i.pravatar.cc/150?u=shop' },
              student: { name: user.name || 'Student', avatar: user.avatar || 'https://i.pravatar.cc/150?u=student' },
              runner: { name: 'Runner', avatar: 'https://i.pravatar.cc/150?u=runner' },
              status: 'PREPARING',
              statusLabel: 'Order Chat',
              eta: 'Live',
              totalPrice: 0,
              items: [],
              messages: chatMessages,
              autoReplies: { student: [], shop: [], runner: [] }
            },
            ...prev
          ];
        }

        return prev.map(order =>
          normalizeOrderNumber(order.orderId) === normalizedOrderId
            ? { ...order, messages: chatMessages }
            : order
        );
      });
    } catch (error) {
      console.warn('Failed to fetch live chat messages:', error.message);
    }
  };

  const openOrderChat = async (orderId, targetTab = 'shop') => {
    const normalizedOrderId = normalizeOrderNumber(orderId);
    let matched = orderChats.find(o => normalizeOrderNumber(o.orderId) === normalizedOrderId);
    if (!matched && orderChats.length) matched = orderChats[0];
    if (matched) setActiveOrderId(normalizedOrderId || matched.orderId);
    setActiveTabFilter(targetTab === 'all' ? 'shop' : targetTab);
    setIsDrawerOpen(true);

    if (normalizedOrderId) {
      await loadOrderChat(normalizedOrderId);
    }
  };

  const closeOrderChat = () => {
    setIsDrawerOpen(false);
  };

  const getOrderById = (orderId) => {
    if (!orderId) return orderChats[0];
    return orderChats.find(o => normalizeOrderNumber(o.orderId) === normalizeOrderNumber(orderId)) || orderChats[0];
  };

  const sendMessage = async (orderId, text, senderRole = 'student', senderName = 'Rafiqul Haque', avatar = 'https://i.pravatar.cc/150?u=student') => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const normalizedOrderId = normalizeOrderNumber(orderId);
    const chatTarget = senderRole === 'student'
      ? (activeTabFilter === 'runner' ? 'runner' : 'shop')
      : senderRole === 'runner'
        ? 'student'
        : 'student';

    const endpoint = user?.role === 'student'
      ? `/api/student/chat/${encodeURIComponent(normalizedOrderId)}`
      : user?.role === 'runner'
        ? `/api/runner/chat/${encodeURIComponent(normalizedOrderId)}`
        : user?.role === 'shop'
          ? `/api/shop/chat/${encodeURIComponent(normalizedOrderId)}`
          : null;

    const localMessage = {
      id: `msg_${Date.now()}`,
      senderRole,
      senderName,
      avatar,
      target: chatTarget,
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setOrderChats(prev => prev.map(order =>
      normalizeOrderNumber(order.orderId) === normalizedOrderId
        ? { ...order, messages: [...(order.messages || []), localMessage] }
        : order
    ));

    if (endpoint && token) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ text: cleanText, target: chatTarget })
        });

        if (!res.ok) {
          throw new Error('Failed to send message');
        }

        const data = await res.json();
        const serverMessage = data.chatMessage || data.newMessage;
        if (!serverMessage) return;

        setOrderChats(prev => prev.map(order => {
          if (normalizeOrderNumber(order.orderId) !== normalizedOrderId) return order;
          const nextMessages = [...(order.messages || [])];
          const existingIndex = nextMessages.findIndex(msg => msg.id === localMessage.id);
          if (existingIndex >= 0) {
            nextMessages[existingIndex] = {
              id: serverMessage._id || serverMessage.id || localMessage.id,
              senderRole: serverMessage.senderRole || senderRole,
              senderName: serverMessage.senderName || senderName,
              avatar: serverMessage.avatar || avatar,
              target: serverMessage.target || chatTarget,
              text: serverMessage.text || cleanText,
              time: serverMessage.createdAt ? new Date(serverMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : localMessage.time,
              status: serverMessage.status || 'sent'
            };
            return { ...order, messages: nextMessages };
          }
          return { ...order, messages: [...nextMessages, {
            id: serverMessage._id || serverMessage.id || `msg_${Date.now()}`,
            senderRole: serverMessage.senderRole || senderRole,
            senderName: serverMessage.senderName || senderName,
            avatar: serverMessage.avatar || avatar,
            target: serverMessage.target || chatTarget,
            text: serverMessage.text || cleanText,
            time: serverMessage.createdAt ? new Date(serverMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : localMessage.time,
            status: serverMessage.status || 'sent'
          }] };
        }));
      } catch (error) {
        console.warn('Live API send failed, kept local message only:', error.message);
      }
    }
  };

  return (
    <OrderChatContext.Provider
      value={{
        orderChats,
        activeOrderId,
        setActiveOrderId,
        isDrawerOpen,
        setIsDrawerOpen,
        activeTabFilter,
        setActiveTabFilter,
        loadOrderChat,
        openOrderChat,
        closeOrderChat,
        getOrderById,
        sendMessage,
        typingParticipants
      }}
    >
      {children}
    </OrderChatContext.Provider>
  );
}

export function useOrderChat() {
  const context = useContext(OrderChatContext);
  if (!context) {
    throw new Error('useOrderChat must be used within an OrderChatProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import initialOrderChats from '../data/orderChatsData.json';

const OrderChatContext = createContext();

const STORAGE_KEY = 'uiu_order_chats_v1';

export function OrderChatProvider({ children }) {
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
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'shop' | 'runner' | 'student'
  const [typingParticipants, setTypingParticipants] = useState({}); // { [orderId]: { role, name, avatar } }

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderChats));
    } catch (e) {
      console.error('Failed to save order chats to localStorage:', e);
    }
  }, [orderChats]);

  const openOrderChat = (orderId, targetTab = 'all') => {
    // Normalize orderId (handle missing '#' or matching string)
    let matched = orderChats.find(o => o.orderId === orderId || o.orderId.replace('#', '') === String(orderId).replace('#', ''));
    if (!matched) {
      // If not found, use first order or default
      matched = orderChats[0];
    }
    if (matched) {
      setActiveOrderId(matched.orderId);
    }
    setActiveTabFilter(targetTab);
    setIsDrawerOpen(true);
  };

  const closeOrderChat = () => {
    setIsDrawerOpen(false);
  };

  const getOrderById = (orderId) => {
    if (!orderId) return orderChats[0];
    return orderChats.find(o => o.orderId === orderId || o.orderId.replace('#', '') === String(orderId).replace('#', '')) || orderChats[0];
  };

  const sendMessage = (orderId, text, senderRole = 'student', senderName = 'Rafiqul Haque', avatar = 'https://i.pravatar.cc/150?u=student') => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderRole,
      senderName,
      avatar,
      target: activeTabFilter,
      text: cleanText,
      time,
      status: 'sent'
    };

    setOrderChats(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          messages: [...order.messages, newMsg]
        };
      }
      return order;
    }));

    // Trigger realistic simulated multi-role reply based on who sent it
    const currentOrder = getOrderById(orderId);
    if (!currentOrder) return;

    let responderRole = 'shop';
    let responderName = currentOrder.shop.name;
    let responderAvatar = currentOrder.shop.avatar;
    let repliesList = currentOrder.autoReplies?.shop || ['Received! Thank you.'];

    if (senderRole === 'shop') {
      responderRole = 'runner';
      responderName = currentOrder.runner.name;
      responderAvatar = currentOrder.runner.avatar;
      repliesList = currentOrder.autoReplies?.runner || ['Understood, heading over now!'];
    } else if (senderRole === 'runner') {
      responderRole = 'student';
      responderName = currentOrder.student.name;
      responderAvatar = currentOrder.student.avatar;
      repliesList = currentOrder.autoReplies?.student || ['Thanks for letting me know!'];
    } else {
      // If student sent, reply based on activeTabFilter or order status
      if (activeTabFilter === 'runner' || currentOrder.status === 'ON THE WAY') {
        responderRole = 'runner';
        responderName = currentOrder.runner.name;
        responderAvatar = currentOrder.runner.avatar;
        repliesList = currentOrder.autoReplies?.runner || ['On my way!'];
      }
    }

    // Set typing indicator
    setTypingParticipants(prev => ({
      ...prev,
      [orderId]: { role: responderRole, name: responderName, avatar: responderAvatar }
    }));

    setTimeout(() => {
      setTypingParticipants(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });

      const replyText = repliesList[Math.floor(Math.random() * repliesList.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const autoReply = {
        id: `reply_${Date.now()}`,
        senderRole: responderRole,
        senderName: responderName,
        avatar: responderAvatar,
        target: 'all',
        text: replyText,
        time: replyTime,
        status: 'read'
      };

      setOrderChats(prev => prev.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            messages: [...order.messages, autoReply]
          };
        }
        return order;
      }));
    }, 1300);
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

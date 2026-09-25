import React, { useState, useRef, useEffect } from 'react';
import { 
  Package, Clock, Store, Bike, User, Send, 
  Smile, Paperclip, Phone, PhoneCall, ChevronRight, 
  CheckCheck, AlertCircle, ShoppingBag, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderChat } from '../../context/OrderChatContext';
import { useAuth } from '../../context/AuthContext';

const normalizeOrderNumber = (orderId) => {
  if (!orderId) return '';
  const value = String(orderId).trim();
  return value.startsWith('#') ? value : `#${value}`;
};

export default function OrderChatHub() {
  const { 
    orderChats, 
    activeOrderId, 
    setActiveOrderId, 
    getOrderById, 
    sendMessage, 
    typingParticipants,
    activeTabFilter,
    setActiveTabFilter,
    loadOrderChat
  } = useOrderChat();

  const { user } = useAuth();
  const currentRole = user?.role || 'student'; // 'student' | 'runner' | 'shop'

  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callModal, setCallModal] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeOrder = getOrderById(activeOrderId) || orderChats[0];
  const typingInfo = typingParticipants[activeOrder?.orderId];

  const currentUserName = user?.name || (currentRole === 'runner' ? 'Tanvir Ahmed' : currentRole === 'shop' ? "Chef's Table" : 'Rafiqul Haque');
  const currentUserAvatar = user?.avatar || (currentRole === 'runner' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' : currentRole === 'shop' ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80" : 'https://i.pravatar.cc/150?u=student');

  const orderMatchesCurrentUser = (order) => {
    if (!user) return true;
    const currentUserId = String(user._id || user.id || '').trim();
    const studentId = String(order?.student?.id || order?.student?._id || order?.student || '').trim();
    const runnerId = String(order?.runner?.id || order?.runner?._id || order?.runner || '').trim();
    const shopId = String(order?.shop?.id || order?.shop?._id || order?.shop || '').trim();

    if (user.role === 'student') {
      return !currentUserId || studentId === currentUserId || order?.student?.name === user.name;
    }

    if (user.role === 'runner') {
      if (!order?.runner) return false;
      const isAcceptedByRunner = ['READY_FOR_PICKUP', 'HANDED_OVER', 'ON_THE_WAY', 'DELIVERED'].includes(order?.status);
      if (!isAcceptedByRunner) return false;
      if (currentUserId) return runnerId === currentUserId;
      return order?.runner?.name === user.name;
    }

    if (user.role === 'shop') {
      return true;
    }
    return true;
  };

  const filteredOrders = orderChats.filter(order => {
    if (!orderMatchesCurrentUser(order)) return false;
    if (orderFilter === 'active') return order.status !== 'DELIVERED';
    if (orderFilter === 'completed') return order.status === 'DELIVERED';
    return true;
  });

  const hasAssignedRunner = Boolean(activeOrder?.runner && activeOrder.runner.name && activeOrder.runner.name !== 'Not Assigned' && activeOrder.runner.name !== 'N/A');

  useEffect(() => {
    if (currentRole === 'student' && !hasAssignedRunner && activeTabFilter === 'runner') {
      setActiveTabFilter('shop');
    }
  }, [currentRole, hasAssignedRunner, activeTabFilter, setActiveTabFilter]);

  const activeViewRole = currentRole === 'runner' && activeTabFilter === 'runner' ? 'student' : activeTabFilter;
  const displayedMessages = (activeOrder?.messages || []).filter(msg => {
    const sender = msg.senderRole;
    const target = msg.target || 'all';

    if (currentRole === 'shop') {
      const isShopMessage = sender === 'shop' && (target === 'student' || target === 'all');
      const isStudentMessage = sender === 'student' && (target === 'shop' || target === 'all');
      return isShopMessage || isStudentMessage;
    }

    if (currentRole === 'runner') {
      const isRunnerMessage = sender === 'runner' && (target === 'student' || target === 'all');
      const isStudentMessage = sender === 'student' && (target === 'runner' || target === 'all');
      return isRunnerMessage || isStudentMessage;
    }

    if (activeViewRole === 'shop') {
      const isShopMessage = sender === 'shop' && (target === 'student' || target === 'all');
      const isStudentMessage = sender === 'student' && (target === 'shop' || target === 'all');
      return isShopMessage || isStudentMessage;
    }

    if (activeViewRole === 'runner') {
      const isRunnerMessage = sender === 'runner' && (target === 'student' || target === 'all');
      const isStudentMessage = sender === 'student' && (target === 'runner' || target === 'all');
      return isRunnerMessage || isStudentMessage;
    }

    return true;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages.length, typingInfo]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeOrder) return;
    sendMessage(activeOrder.orderId, text, currentRole, currentUserName, currentUserAvatar);
    setInputMessage('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getQuickReplies = () => {
    if (currentRole === 'runner') {
      return [
        "I've arrived at the shop",
        "Picked up & on the way!",
        "I'm at the building entrance",
        "Please meet me at the lobby"
      ];
    }
    if (currentRole === 'shop') {
      return [
        "Order is cooking fresh!",
        "Ready for pickup at counter",
        "Extra napkins & sauce included",
        "Packing the order now"
      ];
    }
    return [
      "Where is my order right now?",
      "Please make it less spicy",
      "I'm coming down to the lobby",
      "Please leave it at Room 412"
    ];
  };

  const commonEmojis = ["🍔", "🛵", "👍", "🙏", "🔥", "⏰", "❤️", "🥤"];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'shop':
        return <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">Shop</span>;
      case 'runner':
        return <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">Runner</span>;
      case 'student':
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">Customer</span>;
      default:
        return <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">Support</span>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50">
      
      {/* Left Pane - Orders List */}
      <div className="w-84 border-r border-slate-200 bg-white flex flex-col flex-shrink-0 z-10">
        
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Order Messages</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live communication per order</p>
          </div>
          <span className="w-8 h-8 rounded-full bg-orange-50 text-[#9B5110] flex items-center justify-center font-bold text-xs">
            {orderChats.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Orders' },
            { id: 'completed', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOrderFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                orderFilter === tab.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredOrders.map(order => {
            const isSelected = order.orderId === activeOrder?.orderId;
            const lastMsg = order.messages[order.messages.length - 1];

            return (
              <div
                key={order.orderId}
                onClick={async () => {
                  const nextOrderId = normalizeOrderNumber(order.orderId);
                  setActiveOrderId(nextOrderId);

                  if (user?.role === 'student') {
                    setActiveTabFilter(order.runner?.name && order.runner.name !== 'Unassigned Runner' ? 'runner' : 'shop');
                  } else if (user?.role === 'runner') {
                    setActiveTabFilter('student');
                  } else {
                    setActiveTabFilter('student');
                  }

                  if (nextOrderId) {
                    await loadOrderChat(nextOrderId);
                  }

                  inputRef.current?.focus();
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#FEF8F3] border-[#9B5110]/40 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-800">{order.orderId}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'ON THE WAY'
                          ? 'bg-orange-100 text-orange-700 font-black animate-pulse'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{lastMsg?.time || 'Today'}</span>
                </div>

                <p className="text-xs font-semibold text-slate-600 truncate mb-1">
                  {order.shop.name} • {order.items.map(i => i.name).join(', ')}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                  <p className="text-slate-500 text-[11px] truncate flex-1 pr-2">
                    <strong className="text-slate-700">{lastMsg?.senderName?.split(' ')[0]}:</strong> {lastMsg?.text || 'No messages yet'}
                  </p>
                  <span className="text-xs font-bold text-[#9B5110] flex-shrink-0">৳{order.totalPrice}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Pane - Active Order Chat */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0 border-r border-slate-200">
        
        {/* Chat Header with Order Info */}
        <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-xs z-10">
          <div className="flex items-center min-w-0 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#9B5110] flex items-center justify-center font-bold flex-shrink-0 border border-orange-100 shadow-xs">
              <Package className="w-6 h-6" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-base leading-tight">
                  Order {activeOrder?.orderId}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activeOrder?.status === 'DELIVERED'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {activeOrder?.statusLabel || activeOrder?.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {activeOrder?.shop.name} • ETA: <strong className="text-[#9B5110]">{activeOrder?.eta}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {currentRole !== 'student' || hasAssignedRunner ? (
              <button
                onClick={() => setCallModal(activeOrder?.runner)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Runner</span>
              </button>
            ) : null}
            <button
              onClick={() => setCallModal(activeOrder?.shop)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 text-[#9B5110] hover:bg-orange-100 font-bold text-xs transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Call Shop</span>
            </button>
          </div>
        </div>

        {/* Stakeholder Channel Filter Tabs */}
        <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {currentRole === 'student' ? (
            <>
              <button
                onClick={() => setActiveTabFilter('shop')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTabFilter === 'shop'
                    ? 'bg-[#9B5110] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-orange-500" />
                {activeOrder?.shop.name}
              </button>

              {hasAssignedRunner && (
                <button
                  onClick={() => setActiveTabFilter('runner')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTabFilter === 'runner'
                      ? 'bg-[#9B5110] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5 text-green-600" />
                  Runner: {activeOrder?.runner.name}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => setActiveTabFilter('student')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTabFilter === 'student'
                  ? 'bg-[#9B5110] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              Ordering Student: {activeOrder?.student.name}
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="flex justify-center my-1">
            <span className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Order {activeOrder?.orderId} Timeline
            </span>
          </div>

          {displayedMessages.map(msg => {
            const isMe = msg.senderRole === currentRole || (currentRole === 'student' && msg.senderRole === 'student');
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}>
                {!isMe && (
                  <img
                    src={msg.avatar || 'https://i.pravatar.cc/150?u=avatar'}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover mr-3 mt-auto border border-slate-200 shadow-xs flex-shrink-0"
                  />
                )}

                <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-xs font-bold text-slate-700">{msg.senderName}</span>
                    {getRoleBadge(msg.senderRole)}
                  </div>

                  <div className={`p-3.5 px-4 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-[#9B5110] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs shadow-xs border border-slate-200/90'
                  }`}>
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium px-1">
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-400 ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Live Typing Indicator */}
          {typingInfo && (
            <div className="flex items-center gap-2 text-slate-400 py-1 animate-in fade-in">
              <img
                src={typingInfo.avatar}
                alt={typingInfo.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-xs font-bold text-slate-600 ml-1.5">{typingInfo.name} ({typingInfo.role}) is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Chips */}
        <div className="bg-white p-4 border-t border-slate-200 relative">
          
          {/* Quick Reply Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {getQuickReplies().map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(reply)}
                className="px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50/60 text-xs font-bold text-[#9B5110] hover:bg-[#9B5110] hover:text-white transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Common Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 bg-white border border-slate-200 shadow-xl rounded-2xl p-3 flex gap-2 z-30 animate-in fade-in duration-150">
              {commonEmojis.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                    inputRef.current?.focus();
                  }}
                  className="text-xl hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[#F9FAFB] border border-slate-200 rounded-2xl p-2 px-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-[#9B5110] transition-all">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 rounded-lg transition-colors ${showEmojiPicker ? 'text-[#9B5110] bg-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => alert("Attachment feature ready for order receipts & photos.")}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors mr-1"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message about Order ${activeOrder?.orderId}...`}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 py-1.5 placeholder-slate-400 font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs flex-shrink-0 ${
                inputMessage.trim()
                  ? 'bg-[#9B5110] hover:bg-[#80420c] text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>

      </div>

      {/* Right Pane - Order Summary & Stakeholders */}
      <div className="w-80 border-l border-slate-200 bg-[#F9FAFB] flex flex-col flex-shrink-0 z-10 overflow-y-auto hidden xl:block p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Order Breakdown</h2>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-5">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl text-[#9B5110] flex items-center justify-center mr-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base leading-tight">{activeOrder?.orderId}</h3>
              <p className="text-xs text-slate-500">{activeOrder?.shop.name}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="bg-orange-100 text-orange-700 font-extrabold px-2 py-0.5 rounded uppercase">
                {activeOrder?.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">ETA</span>
              <span className="font-bold text-[#9B5110]">{activeOrder?.eta}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Total Bill</span>
              <span className="font-extrabold text-slate-800 text-sm">৳{activeOrder?.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Stakeholders Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-5 space-y-3">
          <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Stakeholders</h4>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-bold text-slate-800">{activeOrder?.student.name}</p>
                <p className="text-[10px] text-slate-400">{activeOrder?.student.room}</p>
              </div>
            </div>
            <button
              onClick={() => setCallModal(activeOrder?.student)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-green-600" />
              <div>
                <p className="font-bold text-slate-800">{activeOrder?.runner.name}</p>
                <p className="text-[10px] text-slate-400">{activeOrder?.runner.vehicle}</p>
              </div>
            </div>
            <button
              onClick={() => setCallModal(activeOrder?.runner)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-orange-500" />
              <div>
                <p className="font-bold text-slate-800">{activeOrder?.shop.name}</p>
                <p className="text-[10px] text-slate-400">{activeOrder?.shop.location}</p>
              </div>
            </div>
            <button
              onClick={() => setCallModal(activeOrder?.shop)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2.5">
            Items ({activeOrder?.items.length})
          </h4>
          <div className="space-y-2">
            {activeOrder?.items.map((it, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800">{it.quantity}x {it.name}</span>
                  {it.note && <p className="text-[10px] text-orange-600">{it.note}</p>}
                </div>
                <span className="font-extrabold text-slate-700">৳{it.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Call Simulator Modal */}
      {callModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <img 
              src={callModal.avatar} 
              alt={callModal.name} 
              className="w-20 h-20 mx-auto rounded-full object-cover mb-4 border-4 border-orange-100 shadow-md"
            />
            <h3 className="font-extrabold text-slate-800 text-lg">{callModal.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{callModal.phone || '+880 1700-000000'}</p>
            <div className="my-5 py-2 px-4 bg-green-50 text-green-700 rounded-full inline-flex items-center text-xs font-bold gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Order #{activeOrder?.orderId} Calling Connected
            </div>
            <button
              onClick={() => setCallModal(null)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-colors shadow-xs cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

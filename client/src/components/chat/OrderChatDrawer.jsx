import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Phone, PhoneCall, Smile, Paperclip, 
  Store, Bike, User, ChevronDown, ChevronUp, 
  Package, Clock, CheckCheck, Sparkles, AlertCircle
} from 'lucide-react';
import { useOrderChat } from '../../context/OrderChatContext';
import { useAuth } from '../../context/AuthContext';

export default function OrderChatDrawer() {
  const { 
    isDrawerOpen, 
    closeOrderChat, 
    activeOrderId, 
    orderChats,
    getOrderById, 
    sendMessage,
    typingParticipants,
    activeTabFilter,
    setActiveTabFilter
  } = useOrderChat();

  const { user } = useAuth();
  const currentRole = user?.role || 'student'; // 'student' | 'runner' | 'shop' | 'admin'

  const [inputMessage, setInputMessage] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callModal, setCallModal] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const visibleOrder = orderChats.find(order => orderMatchesCurrentUser(order)) || orderChats[0];
  const activeOrder = getOrderById(activeOrderId) || visibleOrder;
  const typingInfo = typingParticipants[activeOrder?.orderId];
  const hasAssignedRunner = Boolean(activeOrder?.runner && activeOrder.runner.name && activeOrder.runner.name !== 'Not Assigned' && activeOrder.runner.name !== 'N/A');

  useEffect(() => {
    if (currentRole === 'student' && !hasAssignedRunner && activeTabFilter === 'runner') {
      setActiveTabFilter('shop');
    }
  }, [currentRole, hasAssignedRunner, activeTabFilter, setActiveTabFilter]);

  // Role details mapping
  const currentUserName = user?.name || (currentRole === 'runner' ? 'Tanvir Ahmed' : currentRole === 'shop' ? "Chef's Table" : 'Rafiqul Haque');
  const currentUserAvatar = user?.avatar || (currentRole === 'runner' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' : currentRole === 'shop' ? "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80" : 'https://i.pravatar.cc/150?u=student');

  // Filter messages if specific tab chosen
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

  // Dynamic quick replies based on viewer role
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
    // Student
    return [
      "Where is my order right now?",
      "Please make it less spicy",
      "I'm coming down to the lobby",
      "Please leave it at Room 412"
    ];
  };

  const commonEmojis = ["🍔", "🛵", "👍", "🙏", "🔥", "⏰", "❤️", "🥤"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isDrawerOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isDrawerOpen, displayedMessages.length, typingInfo]);

  if (!isDrawerOpen || !activeOrder) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;
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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeOrderChat}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-250 border-l border-slate-200">
        
        {/* Header with Order Status */}
        <div className="bg-[#1E293B] text-white p-4 px-5 flex flex-col gap-2 flex-shrink-0 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white tracking-wide">
                    Order {activeOrder.orderId}
                  </h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    activeOrder.status === 'DELIVERED' 
                      ? 'bg-green-500 text-white' 
                      : activeOrder.status === 'ON THE WAY'
                        ? 'bg-[#F37623] text-white animate-pulse'
                        : 'bg-amber-500 text-white'
                  }`}>
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                  <span>{activeOrder.shop.name}</span>
                  <span>•</span>
                  <span className="text-orange-300 font-semibold">{activeOrder.eta}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCallModal(activeOrder.runner)}
                title="Call Delivery Runner"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-orange-500 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <Bike className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCallModal(activeOrder.shop)}
                title="Call Shop"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-orange-500 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <Store className="w-4 h-4" />
              </button>
              <button 
                onClick={closeOrderChat}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Collapsible Order Summary Bar */}
          <div className="pt-2 border-t border-slate-700/60">
            <button 
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-orange-400" />
                {activeOrder.items.length} items (৳{activeOrder.totalPrice})
              </span>
              <span className="flex items-center gap-1 text-[11px] text-orange-300">
                {showOrderSummary ? 'Hide Details' : 'View Order Items'}
                {showOrderSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showOrderSummary && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-800/90 text-xs space-y-2 animate-in fade-in">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-200">
                    <span className="font-semibold">{it.quantity}x {it.name}</span>
                    <span className="text-orange-400 font-bold">৳{it.price}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-700 flex justify-between text-slate-300 text-[11px]">
                  <span>Customer: <strong className="text-white">{activeOrder.student.name}</strong> ({activeOrder.student.room})</span>
                  <span>Runner: <strong className="text-white">{activeOrder.runner.name}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stakeholder Channel Filter Tabs */}
        <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
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
                {activeOrder.shop.name}
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
                  Runner: {activeOrder.runner.name}
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
              Ordering Student: {activeOrder.student.name}
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
          
          {/* Order Notice Banner */}
          <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-start gap-2.5 text-xs text-[#9B5110]">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-600" />
            <div>
              <p className="font-bold">Direct Order Chat</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                You are chatting directly with {currentRole === 'student' ? (activeViewRole === 'shop' ? activeOrder.shop.name : activeOrder.runner.name) : activeOrder.student.name} for Order <strong>{activeOrder.orderId}</strong>.
              </p>
            </div>
          </div>

          {displayedMessages.map(msg => {
            const isMe = msg.senderRole === currentRole || (currentRole === 'student' && msg.senderRole === 'student');
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}>
                {!isMe && (
                  <img 
                    src={msg.avatar || 'https://i.pravatar.cc/150?u=avatar'} 
                    alt={msg.senderName} 
                    className="w-8 h-8 rounded-full object-cover mr-2.5 mt-auto border border-slate-200 shadow-xs flex-shrink-0"
                  />
                )}

                <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-xs font-bold text-slate-700">{msg.senderName}</span>
                    {getRoleBadge(msg.senderRole)}
                  </div>

                  <div className={`p-3.5 px-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    isMe 
                      ? 'bg-[#9B5110] text-white rounded-tr-xs' 
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90'
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

          {/* Typing Indicator */}
          {typingInfo && (
            <div className="flex items-center gap-2.5 text-slate-400 py-1 animate-in fade-in">
              <img 
                src={typingInfo.avatar} 
                alt={typingInfo.name} 
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-xs font-bold text-slate-600 ml-1">{typingInfo.name} ({typingInfo.role}) is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input & Quick Action Bar */}
        <div className="bg-white border-t border-slate-200 p-3.5 flex flex-col gap-2 relative">
          
          {/* Quick Reply Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {getQuickReplies().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50/60 text-[#9B5110] text-xs font-bold hover:bg-[#9B5110] hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Common Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-4 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2.5 flex gap-2 z-30 animate-in fade-in duration-150">
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

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-100 rounded-2xl px-3 py-1.5 border border-slate-200 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-[#9B5110] transition-all">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 rounded-lg transition-colors ${showEmojiPicker ? 'text-[#9B5110]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Smile className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={() => alert("Photo / receipt attachment ready.")}
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
                placeholder={`Message about ${activeOrder.orderId}...`}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 py-1.5 placeholder-slate-400 font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className={`p-3 rounded-2xl font-bold transition-all shadow-xs flex items-center justify-center flex-shrink-0 ${
                inputMessage.trim()
                  ? 'bg-[#9B5110] hover:bg-[#80420c] text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Direct Calling Simulator Modal */}
      {callModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <img 
              src={callModal.avatar} 
              alt={callModal.name} 
              className="w-20 h-20 mx-auto rounded-full object-cover mb-4 border-4 border-orange-100 shadow-md"
            />
            <h3 className="font-extrabold text-slate-800 text-lg">{callModal.name}</h3>
            <p className="text-xs text-slate-500 font-semibold">{callModal.phone || '+880 1700-000000'}</p>
            <div className="my-5 py-2 px-4 bg-green-50 text-green-700 rounded-full inline-flex items-center text-xs font-bold gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Order #{activeOrder.orderId} Direct Call Connected
            </div>
            <button
              onClick={() => setCallModal(null)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-colors shadow-sm cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

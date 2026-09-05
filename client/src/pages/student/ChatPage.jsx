import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit3, MoreVertical, Phone, Paperclip, Smile, 
  FileText, PhoneCall, Store, ChevronRight, Send, Check, CheckCheck, X
} from 'lucide-react';
import StudentSidebarFix from './StudentSidebarFix';

const initialConversations = [
  {
    id: "c2",
    name: "Tanvir Ahmed",
    role: "Runner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    phone: "+880 1712-345678",
    subtitle: "Order #UIU-9821 • Delivery Runner",
    lastMessage: "I'm arriving in 3 minutes.",
    time: "Just now",
    unread: 1,
    online: true,
    orderDetails: {
      orderId: "#UIU-9821",
      shopName: "Chef's Table",
      runner: "Tanvir Ahmed",
      status: "ON THE WAY",
      eta: "3 mins",
      items: [
        { quantity: 1, name: "Chicken Curry Bowl" },
        { quantity: 2, name: "Fresh Lime Soda" }
      ]
    },
    autoReplies: [
      "Got it! I'm near the front lobby entrance.",
      "No problem! I have your order warm and secure.",
      "I'm at the stairs now, see you in a minute!",
      "Thanks! Enjoy your meal!"
    ]
  },
  {
    id: "c1",
    name: "Chef's Table",
    role: "Shop",
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
    phone: "+880 1819-876543",
    subtitle: "Order #UIU-9821 • Food Shop",
    lastMessage: "Sure! We've noted your request for less spice.",
    time: "10:41 AM",
    unread: 0,
    online: true,
    orderDetails: {
      orderId: "#UIU-9821",
      shopName: "Chef's Table",
      runner: "Tanvir Ahmed",
      status: "PREPARING",
      eta: "10 mins",
      items: [
        { quantity: 1, name: "Chicken Curry Bowl" },
        { quantity: 2, name: "Fresh Lime Soda" }
      ]
    },
    autoReplies: [
      "We've noted your message, the kitchen is preparing your order fresh!",
      "Thank you for ordering with Chef's Table! It will be handed over to runner soon.",
      "Your extra sauce request has been added to the package."
    ]
  },
  {
    id: "c3",
    name: "UIU Support Desk",
    role: "Support",
    avatar: "default",
    phone: "+880 1900-UIUHELP",
    subtitle: "Campus Helpdesk & Delivery Support",
    lastMessage: "Hello! How can we assist you today?",
    time: "Yesterday",
    unread: 0,
    online: true,
    orderDetails: {
      orderId: "#SUPPORT-104",
      shopName: "Campus Support Services",
      runner: "Support Staff",
      status: "ACTIVE TICKET",
      eta: "Immediate",
      items: [
        { quantity: 1, name: "Student Delivery Support Inquiry" }
      ]
    },
    autoReplies: [
      "Thank you for reaching out to UIU Delivery Support. An agent is reviewing your query.",
      "We have recorded your ticket. Please let us know if there's anything urgent.",
      "Support resolved previous inquiries. Let us know if you need further help!"
    ]
  }
];

const initialMessages = {
  c2: [
    {
      id: "m1",
      sender: "me",
      text: "Could you make it less spicy?",
      time: "10:40 AM",
      status: "Read"
    },
    {
      id: "m2",
      sender: "runner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      text: "Sure! I checked with the shop and they adjusted the spice level for you.",
      time: "10:42 AM"
    },
    {
      id: "m3",
      sender: "runner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      text: "I'm outside the Academic Building. Ready to hand over your order!",
      time: "10:55 AM"
    },
    {
      id: "m4",
      sender: "me",
      text: "I'll be there in one minute. Just coming down from the 4th floor.",
      time: "10:56 AM"
    },
    {
      id: "m5",
      sender: "runner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      text: "I'm arriving in 3 minutes.",
      time: "Just now"
    }
  ],
  c1: [
    {
      id: "c1_1",
      sender: "me",
      text: "Hi! Is the Chicken Curry Bowl available fresh?",
      time: "10:35 AM",
      status: "Read"
    },
    {
      id: "c1_2",
      sender: "shop",
      avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
      text: "Yes, it is freshly made and hot!",
      time: "10:38 AM"
    },
    {
      id: "c1_3",
      sender: "me",
      text: "Could you make it less spicy?",
      time: "10:40 AM",
      status: "Read"
    },
    {
      id: "c1_4",
      sender: "shop",
      avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
      text: "Sure! We've noted your request for less spice.",
      time: "10:41 AM"
    }
  ],
  c3: [
    {
      id: "c3_1",
      sender: "admin",
      avatar: "default",
      text: "Hello! Welcome to UIU Food Delivery support. How can we assist you today?",
      time: "Yesterday"
    }
  ]
};

export default function ChatPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState("c2");
  const [messagesMap, setMessagesMap] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [callModal, setCallModal] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeChatId) || conversations[0];
  const activeMessages = messagesMap[activeChatId] || [];

  const quickReplies = [
    "Thank you!", 
    "Where are you?", 
    "I'm on my way down!", 
    "Please call me when you arrive"
  ];

  const commonEmojis = ["👍", "👋", "😊", "❤️", "🍔", "🥤", "🔥", "🙏", "⏳", "🎉"];

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  // Handle switching conversation
  const handleSelectConversation = (convId) => {
    setActiveChatId(convId);
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, unread: 0 } : c
    ));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle sending a message
  const handleSendMessage = (textToSend) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: "me",
      text: messageText,
      time: currentTime,
      status: "Sent"
    };

    // Append to messages
    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    // Update conversation last message in left pane
    setConversations(prev => prev.map(c => 
      c.id === activeChatId 
        ? { ...c, lastMessage: messageText, time: "Just now", unread: 0 } 
        : c
    ));

    setInputMessage("");
    setShowEmojiPicker(false);

    // Simulate realistic auto-reply from contact
    const currentConv = activeConv;
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const replies = currentConv.autoReplies || ["Received! Thanks for updating."];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const autoReplyMessage = {
        id: `reply_${Date.now()}`,
        sender: currentConv.role.toLowerCase(),
        avatar: currentConv.avatar,
        text: randomReply,
        time: replyTime
      };

      setMessagesMap(prev => ({
        ...prev,
        [currentConv.id]: [...(prev[currentConv.id] || []), autoReplyMessage]
      }));

      setConversations(prev => prev.map(c => 
        c.id === currentConv.id 
          ? { ...c, lastMessage: randomReply, time: replyTime } 
          : c
      ));
    }, 1400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <StudentSidebarFix />
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50">
        
        {/* Left Pane - Conversations List */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col flex-shrink-0 z-10">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Messages</h2>
              <p className="text-xs text-slate-400 mt-0.5">Connect with Runner & Shops</p>
            </div>
            <button 
              title="New message"
              onClick={() => handleSelectConversation('c2')}
              className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="px-5 py-2.5 border-b border-slate-100 text-xs font-medium text-slate-400 flex items-center">
            <Link to="/dashboard/student" className="hover:text-orange-500">Dashboard</Link>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-orange-500 font-semibold">Live Chat</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.map(conv => {
              const isCurrent = conv.id === activeChatId;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3 rounded-2xl flex items-center cursor-pointer transition-all ${
                    isCurrent 
                      ? 'bg-[#F2ECE6] border-2 border-[#9B5110]/30 shadow-sm' 
                      : 'hover:bg-slate-50 border-2 border-transparent'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {conv.avatar === 'default' ? (
                      <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        UIU
                      </div>
                    ) : (
                      <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                    )}
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-800 truncate text-sm">{conv.name}</h4>
                      <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#9B5110]' : 'text-slate-400'}`}>
                        {conv.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-xs truncate ${conv.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="ml-2 bg-orange-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full animate-pulse">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Pane - Active Chat */}
        <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0 border-r border-slate-200">
          
          {/* Chat Header */}
          <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
            <div className="flex items-center min-w-0">
              <div className="relative flex-shrink-0">
                {activeConv.avatar === 'default' ? (
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-slate-200">
                    UIU
                  </div>
                ) : (
                  <img src={activeConv.avatar} alt={activeConv.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm" />
                )}
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="ml-3 truncate">
                <div className="flex items-center">
                  <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{activeConv.name}</h3>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">
                    {activeConv.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{activeConv.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button 
                onClick={() => setCallModal(activeConv)}
                title="Call Contact"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 text-[#9B5110] hover:bg-orange-100 font-bold text-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
              <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-center my-2">
              <span className="bg-slate-200/70 backdrop-blur-sm text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Today
              </span>
            </div>

            {activeMessages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                  {!isMe && (
                    <div className="mr-3 flex-shrink-0 mt-auto">
                      {msg.avatar === 'default' ? (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          UIU
                        </div>
                      ) : (
                        <img 
                          src={msg.avatar || activeConv.avatar} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200" 
                        />
                      )}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div className={`p-3.5 px-4 rounded-2xl text-sm leading-relaxed ${
                      isMe 
                        ? 'bg-[#9B5110] text-white rounded-tr-xs shadow-md' 
                        : 'bg-white text-slate-800 rounded-tl-xs shadow-sm border border-slate-200/80'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.time}</span>
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-400 ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 py-1 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  {activeConv.avatar === 'default' ? (
                    <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      UIU
                    </div>
                  ) : (
                    <img src={activeConv.avatar} alt="Typing" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-xs font-semibold text-slate-500 ml-1.5">{activeConv.name} is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer */}
          <div className="bg-white p-4 border-t border-slate-200 relative">
            
            {/* Quick Reply Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(reply)}
                  className="px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50/50 text-xs font-bold text-slate-700 hover:bg-[#9B5110] hover:text-white hover:border-[#9B5110] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4 bg-white border border-slate-200 shadow-xl rounded-2xl p-3 flex gap-2 z-30 animate-in fade-in duration-150">
                {commonEmojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="text-xl hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            {/* Input Bar with Send Button */}
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
                  onClick={() => alert("Attachment feature is active for images & receipts.")}
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
                  placeholder={`Message ${activeConv.name}...`}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 py-1.5 placeholder-slate-400 font-medium"
                />
              </div>

              {/* Explicit Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm flex-shrink-0 ${
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

        {/* Right Pane - Order Context */}
        <div className="w-80 border-l border-slate-200 bg-[#F9FAFB] flex flex-col flex-shrink-0 z-10 overflow-y-auto hidden xl:block">
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Order Details</h2>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-xl text-orange-500 flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{activeConv.orderDetails.orderId}</h3>
                  <p className="text-xs text-slate-500">{activeConv.orderDetails.shopName}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Contact Role</span>
                  <span className="font-bold text-slate-800">{activeConv.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {activeConv.orderDetails.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">ETA</span>
                  <span className="font-bold text-[#9B5110]">{activeConv.orderDetails.eta}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button 
                onClick={() => setCallModal(conversations.find(c => c.id === 'c2'))}
                className="w-full flex items-center justify-center py-3 border-2 border-[#9B5110] text-[#9B5110] font-bold rounded-xl hover:bg-[#9B5110]/5 transition-colors"
              >
                <PhoneCall className="w-4 h-4 mr-2" /> Call Runner
              </button>
              <button 
                onClick={() => setCallModal(conversations.find(c => c.id === 'c1'))}
                className="w-full flex items-center justify-center py-3 border border-slate-200 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Store className="w-4 h-4 mr-2" /> Call Shop
              </button>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4 text-sm">
                Items ({activeConv.orderDetails.items.length})
              </h3>
              <div className="space-y-3">
                {activeConv.orderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <span className="bg-white border border-slate-200 text-slate-600 font-bold text-[10px] px-2 py-1 rounded-lg mr-3 shadow-sm">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* Call Simulator Modal */}
      {callModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 border-4 border-orange-100 shadow-md">
              {callModal.avatar === 'default' ? (
                <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                  UIU
                </div>
              ) : (
                <img src={callModal.avatar} alt={callModal.name} className="w-full h-full object-cover" />
              )}
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{callModal.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{callModal.phone}</p>
            <div className="my-6 py-2 px-4 bg-green-50 text-green-700 rounded-full inline-flex items-center text-xs font-bold gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Calling Connected (Mock Simulation)
            </div>
            <button
              onClick={() => setCallModal(null)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition-colors shadow-sm"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </>
  );
}


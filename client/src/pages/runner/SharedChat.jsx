import React, { useState, useRef, useEffect } from 'react';
import RunnerSidebarFix from './RunnerSidebarFix';
import { 
  Phone, Video, MoreVertical, Plus, Smile, Send, CheckCheck, X
} from 'lucide-react';

const initialRunnerConversations = [
  {
    id: "1",
    name: "Tonmoy",
    role: "Student",
    type: "student",
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=tonmoy",
    phone: "+880 1711-223344",
    location: "Near UIU Library Stairs, 3rd Floor",
    lastMessage: "Wait, did you get the extra sauce?",
    time: "12:42 PM",
    unreadCount: 2,
    autoReplies: [
      "Awesome! I'm waiting near the library stairs.",
      "Thank you so much! I have the cash ready.",
      "Got it, see you at the front gate!",
      "Thanks for checking!"
    ]
  },
  {
    id: "2",
    name: "Chillox",
    role: "Food Shop",
    type: "shop",
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=chillox",
    phone: "+880 1812-998877",
    location: "Campus Food Court Counter #3",
    lastMessage: "Order #3392 is ready for pickup.",
    time: "11:15 AM",
    unreadCount: 0,
    autoReplies: [
      "Order is freshly packed in bag #4!",
      "Counter #3 is open for runner collection.",
      "Thanks runner, have a safe trip!"
    ]
  },
  {
    id: "3",
    name: "Book Shop",
    role: "Stationery",
    type: "shop",
    isOnline: false,
    avatar: "https://i.pravatar.cc/150?u=bookshop",
    phone: "+880 1611-334455",
    location: "Academic Building Ground Floor",
    lastMessage: "We have the calculators in stock now.",
    time: "Yesterday",
    unreadCount: 0,
    autoReplies: [
      "Items are placed near counter A.",
      "Pickup code is #5519."
    ]
  },
  {
    id: "4",
    name: "UIU Support",
    role: "Runner Dispatch",
    type: "support",
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=admin",
    phone: "+880 1900-DISPATCH",
    location: "Admin Building Room 102",
    lastMessage: "Your payout has been processed.",
    time: "Tuesday",
    unreadCount: 0,
    autoReplies: [
      "Dispatch confirmed. Next payout will process tonight.",
      "Let us know if there is any traffic or access delay on campus."
    ]
  }
];

const initialRunnerMessages = {
  "1": [
    {
      id: "m1",
      sender: "Tonmoy",
      isMe: false,
      text: "Hi! Just making sure you found the North Gate entrance? I'm waiting near the library stairs.",
      time: "12:35 PM"
    },
    {
      id: "m2",
      sender: "Me",
      isMe: true,
      text: "Yes, I just passed the main gate. I'll be at the library in about 5 minutes.",
      time: "12:38 PM",
      status: "read"
    },
    {
      id: "m3",
      sender: "Tonmoy",
      isMe: false,
      text: "Great! Wait, did you get the extra sauce? I mentioned it in the order note but forgot to double check with the shop.",
      time: "12:42 PM"
    }
  ],
  "2": [
    {
      id: "c2_1",
      sender: "Chillox",
      isMe: false,
      text: "Hello Runner! Order #3392 for Tonmoy is being prepared now.",
      time: "11:05 AM"
    },
    {
      id: "c2_2",
      sender: "Me",
      isMe: true,
      text: "Got it, I will be at Counter #3 in 4 minutes.",
      time: "11:10 AM",
      status: "read"
    },
    {
      id: "c2_3",
      sender: "Chillox",
      isMe: false,
      text: "Order #3392 is ready for pickup.",
      time: "11:15 AM"
    }
  ],
  "3": [
    {
      id: "c3_1",
      sender: "Book Shop",
      isMe: false,
      text: "We have the scientific calculators and notebooks in stock now.",
      time: "Yesterday"
    }
  ],
  "4": [
    {
      id: "c4_1",
      sender: "Support",
      isMe: false,
      text: "Your payout of ৳ 2,450 for yesterday's deliveries has been processed.",
      time: "Tuesday"
    }
  ]
};

export default function SharedChat() {
  const [activeTab, setActiveTab] = useState('All');
  const [conversations, setConversations] = useState(initialRunnerConversations);
  const [activeChatId, setActiveChatId] = useState("1");
  const [messagesMap, setMessagesMap] = useState(initialRunnerMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [callModal, setCallModal] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const tabs = ['All', 'Students', 'Shops', 'Support'];

  // Filter conversations
  const filteredConversations = conversations.filter(chat => {
    if (activeTab === 'Students') return chat.type === 'student';
    if (activeTab === 'Shops') return chat.type === 'shop';
    if (activeTab === 'Support') return chat.type === 'support';
    return true;
  });

  const activeConv = conversations.find(c => c.id === activeChatId) || conversations[0];
  const activeMessages = messagesMap[activeChatId] || [];

  const quickReplies = [
    "I'm on my way", 
    "I've arrived", 
    "I'm at the gate", 
    "Almost there!"
  ];

  const commonEmojis = ["🛵", "👍", "👋", "🍔", "📦", "⏰", "🔥", "🙏"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setConversations(prev => prev.map(c => 
      c.id === chatId ? { ...c, unreadCount: 0 } : c
    ));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = (textToSend) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: `runner_msg_${Date.now()}`,
      sender: "Me",
      isMe: true,
      text: messageText,
      time: currentTime,
      status: "read"
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeChatId 
        ? { ...c, lastMessage: messageText, time: "Just now", unreadCount: 0 } 
        : c
    ));

    setInputMessage("");
    setShowEmojiPicker(false);

    // Realistic auto-reply
    const currentConv = activeConv;
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const replies = currentConv.autoReplies || ["Received! Thanks."];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const autoReplyMessage = {
        id: `reply_${Date.now()}`,
        sender: currentConv.name,
        isMe: false,
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
    }, 1300);
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
      <RunnerSidebarFix />
      <div className="h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-slate-200 flex overflow-hidden">
        
        {/* Left Pane: Inbox List */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-5 pb-3">
            <h2 className="text-xl font-extrabold text-[#9B5110]">Messages</h2>
            <p className="text-xs text-slate-400 mt-0.5">Students, Shops & Support</p>
          </div>
          
          {/* Filters */}
          <div className="px-5 pb-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-100">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#F37623] text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(chat => {
              const isSelected = chat.id === activeChatId;
              return (
                <div 
                  key={chat.id} 
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex gap-3 p-4 cursor-pointer border-l-4 transition-colors ${
                    isSelected 
                      ? 'border-[#9B5110] bg-[#FEF8F3]' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-extrabold text-slate-800 text-sm truncate">{chat.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-slate-800' : 'font-medium text-slate-500'}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#9B5110] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 animate-pulse">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className="flex-1 flex flex-col bg-[#FDFDFD] relative">
          
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeConv.avatar} alt={activeConv.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                {activeConv.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">{activeConv.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#9B5110] font-bold">
                    {activeConv.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[11px] font-bold ${activeConv.isOnline ? 'text-green-600' : 'text-slate-400'}`}>
                    {activeConv.isOnline ? 'Online' : 'Offline'}
                  </span>
                  {activeConv.location && (
                    <span className="text-[11px] text-slate-400">• {activeConv.location}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <button 
                onClick={() => setCallModal({ ...activeConv, type: 'Audio' })}
                className="p-2 rounded-xl hover:bg-orange-50 hover:text-[#9B5110] transition-colors"
                title="Call"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCallModal({ ...activeConv, type: 'Video' })}
                className="p-2 rounded-xl hover:bg-orange-50 hover:text-[#9B5110] transition-colors"
                title="Video Call"
              >
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            <div className="flex justify-center my-2">
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                Today
              </span>
            </div>

            {activeMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}>
                
                {!msg.isMe && (
                  <img src={activeConv.avatar} alt={msg.sender} className="w-8 h-8 rounded-full mr-3 mt-auto object-cover bg-slate-200" />
                )}

                <div className={`max-w-[70%] ${msg.isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                  <div className={`p-4 shadow-sm inline-block ${
                    msg.isMe 
                      ? 'bg-[#F37623] text-white rounded-2xl rounded-tr-xs' 
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                    {msg.isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                </div>

              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center gap-3 animate-in fade-in">
                <img src={activeConv.avatar} alt={activeConv.name} className="w-8 h-8 rounded-full object-cover bg-slate-200" />
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="flex gap-1 bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-xs shadow-xs">
                    <span className="w-1.5 h-1.5 bg-[#F37623] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#F37623] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#F37623] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 italic ml-1">{activeConv.name} is typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <div className="bg-white border-t border-slate-200 flex flex-col relative">
            
            {/* Quick Replies */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-100">
              {quickReplies.map((reply, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(reply)}
                  className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50/50 text-[#9B5110] text-xs font-bold hover:bg-[#9B5110] hover:text-white hover:border-[#9B5110] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-6 bg-white border border-slate-200 shadow-xl rounded-2xl p-3 flex gap-2 z-30 animate-in fade-in duration-150">
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

            {/* Input Row */}
            <div className="px-6 py-3 flex items-center gap-3">
              <button 
                type="button"
                onClick={() => alert("Quick attachment ready for location & proof of delivery.")}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-[#F37623] bg-slate-100 hover:bg-orange-50 rounded-full transition-colors flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${showEmojiPicker ? 'bg-orange-100 text-[#F37623]' : 'text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200'}`}
              >
                <Smile className="w-5 h-5" />
              </button>
              
              <input 
                ref={inputRef}
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Write a message to ${activeConv.name}...`}
                className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F37623]/30"
              />
              
              <button 
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-sm flex-shrink-0 ${
                  inputMessage.trim() 
                    ? 'bg-[#F37623] hover:bg-[#d9671b] text-white cursor-pointer active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Call Simulator Modal */}
      {callModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-4 border-4 border-orange-100 shadow-md">
              <img src={callModal.avatar} alt={callModal.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{callModal.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{callModal.phone}</p>
            <div className="my-6 py-2 px-4 bg-green-50 text-green-700 rounded-full inline-flex items-center text-xs font-bold gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              {callModal.type || 'Voice'} Call Connected (Simulation)
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


import React, { useState } from 'react';
import chatData from '../data/chatData.json';
import { 
  Phone, Video, MoreVertical, Plus, Smile, Send, CheckCheck
} from 'lucide-react';

export default function SharedChat() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Students', 'Shops', 'Support'];

  return (
    <>
      <div className="h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-slate-200 flex overflow-hidden">
        
        {/* Left Pane: Inbox List */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-5 pb-3">
            <h2 className="text-xl font-extrabold text-[#9B5110]">Messages</h2>
          </div>
          
          {/* Filters */}
          <div className="px-5 pb-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-100">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#F37623] text-white' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chatData.conversations.map(chat => (
              <div 
                key={chat.id} 
                className={`flex gap-3 p-4 cursor-pointer border-l-4 transition-colors ${
                  chat.isActive 
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
                    <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-slate-700' : 'font-medium text-slate-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#9B5110] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className="flex-1 flex flex-col bg-[#FDFDFD] relative">
          
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src={chatData.activeChat.avatar} alt={chatData.activeChat.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">{chatData.activeChat.name}</h3>
                {chatData.activeChat.isOnline && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-[11px] font-bold text-green-600">Online</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <button className="hover:text-slate-700 transition-colors"><Phone className="w-5 h-5" /></button>
              <button className="hover:text-slate-700 transition-colors"><Video className="w-5 h-5" /></button>
              <button className="hover:text-slate-700 transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="flex justify-center">
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                Today
              </span>
            </div>

            {chatData.activeChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                
                {!msg.isMe && (
                  <img src={chatData.activeChat.avatar} alt={msg.sender} className="w-8 h-8 rounded-full mr-3 mt-auto object-cover bg-slate-200" />
                )}

                <div className={`max-w-[70%] ${msg.isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                  <div className={`p-4 shadow-sm inline-block ${
                    msg.isMe 
                      ? 'bg-[#F37623] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                    {msg.isMe && msg.status === 'read' && (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                </div>

              </div>
            ))}

            {chatData.activeChat.isTyping && (
              <div className="flex justify-start items-center gap-3">
                <img src={chatData.activeChat.avatar} alt={chatData.activeChat.name} className="w-8 h-8 rounded-full object-cover bg-slate-200" />
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="flex gap-1 bg-slate-100 px-3 py-2 rounded-2xl rounded-tl-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-[10px] font-bold italic ml-1">{chatData.activeChat.name} is typing...</span>
                </div>
              </div>
            )}
            
            {/* Dummy div to scroll to bottom if needed */}
            <div className="h-2"></div>
          </div>

          {/* Bottom Input Area */}
          <div className="bg-white border-t border-slate-200 flex flex-col">
            
            {/* Quick Replies */}
            <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar">
              {["I'm on my way", "I've arrived", "I'm at the gate", "Almost there!"].map((reply, idx) => (
                <button 
                  key={idx}
                  className="whitespace-nowrap px-4 py-2 rounded-full border border-[#9B5110] text-[#9B5110] text-sm font-bold hover:bg-[#9B5110] hover:text-white transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="px-6 pb-6 pt-2 flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0">
                <Plus className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              
              <input 
                type="text" 
                placeholder="Write a message..."
                className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F37623]/20"
              />
              
              <button className="w-12 h-12 flex items-center justify-center bg-[#F37623] hover:bg-[#d9671b] text-white rounded-full transition-colors shadow-sm flex-shrink-0">
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

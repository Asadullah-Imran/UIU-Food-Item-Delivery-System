import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit3, MoreVertical, Phone, Paperclip, Smile, 
  FileText, PhoneCall, Store, ChevronRight
} from 'lucide-react';
import chatData from '../../data/chat.json';

export default function ChatPage() {
  const { conversations, activeChat, orderDetails } = chatData;

  return (
    <>
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
        
        {/* Left Pane - Conversations List */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col flex-shrink-0 z-10">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Messages</h2>
            <button className="text-slate-500 hover:text-orange-500 transition-colors">
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 flex items-center">
            <Link to="/dashboard/student" className="hover:text-orange-500">Dashboard</Link>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-orange-500">Chat</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`p-3 rounded-2xl flex items-center cursor-pointer transition-colors ${conv.active ? 'bg-[#F2ECE6]' : 'hover:bg-slate-50'}`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {conv.avatar === 'default' ? (
                    <FileText className="w-5 h-5 text-slate-400" />
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
                    <span className={`text-[10px] font-bold ${conv.active ? 'text-[#9B5110]' : 'text-slate-400'}`}>
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${conv.unread > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Pane - Active Chat */}
        <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
          
          {/* Chat Header */}
          <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
            <div className="flex items-center">
              <img src={activeChat.contactAvatar} alt="Contact" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{activeChat.contactName}</h3>
                  <span className="w-2 h-2 rounded-full bg-green-500 ml-2"></span>
                  <span className="text-xs text-green-500 font-medium ml-1">{activeChat.status}</span>
                </div>
                <p className="text-xs text-slate-500">{activeChat.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-[#9B5110] hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center">
              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full">Today</span>
            </div>

            {activeChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender !== 'me' && (
                  <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-3 mt-1 object-cover shadow-sm border border-slate-100" />
                )}
                
                <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'me' 
                      ? 'bg-[#9B5110] text-white rounded-tr-sm shadow-md' 
                      : 'bg-white text-slate-700 rounded-tl-sm shadow-sm border border-slate-100'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  
                  <div className="flex items-center mt-1 text-[10px] text-slate-400 font-medium">
                    {msg.time}
                    {msg.status && <span className="ml-1">- {msg.status}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Footer */}
          <div className="bg-white p-4 border-t border-slate-200">
            <div className="flex space-x-2 mb-3">
              <button className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Thank you!</button>
              <button className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Where are you?</button>
            </div>
            
            <div className="flex items-center bg-[#F9FAFB] border border-slate-200 rounded-2xl p-2 px-4 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <Smile className="w-5 h-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 p-1 mr-2">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 py-2 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Right Pane - Order Context */}
        <div className="w-80 border-l border-slate-200 bg-[#F9FAFB] flex flex-col flex-shrink-0 z-10 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Order Details</h2>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-xl text-orange-500 flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{orderDetails.orderId}</h3>
                  <p className="text-xs text-slate-500">{orderDetails.shopName}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Runner</span>
                  <span className="font-bold text-slate-800">{orderDetails.runner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{orderDetails.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">ETA</span>
                  <span className="font-bold text-[#9B5110]">{orderDetails.eta}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <button className="w-full flex items-center justify-center py-3 border-2 border-[#9B5110] text-[#9B5110] font-bold rounded-xl hover:bg-[#9B5110]/5 transition-colors">
                <PhoneCall className="w-4 h-4 mr-2" /> Call Runner
              </button>
              <button className="w-full flex items-center justify-center py-3 border border-slate-200 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                <Store className="w-4 h-4 mr-2" /> Call Shop
              </button>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4 text-sm">Items ({orderDetails.items.length})</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <span className="bg-white border border-slate-200 text-slate-600 font-bold text-[10px] px-2 py-1 rounded-lg mr-3 shadow-sm">{item.quantity}x</span>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </>
  );
}

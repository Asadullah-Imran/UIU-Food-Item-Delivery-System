import React from 'react';
import { Store, User, Bike, Package } from 'lucide-react';

export default function DeliveryAnimation() {
  
  // Sequence Keyframes for 20s loop
  const customStyles = `
    /* Rider 1 Movement (Shop 1 -> Student 1) */
    @keyframes r1-move {
      0%, 19% { transform: translate(0, 0) scaleX(1); opacity: 0; }
      20% { transform: translate(0, 0) scaleX(1); opacity: 1; }
      40% { transform: translate(210px, -20px) scaleX(1); opacity: 1; }
      41%, 49% { transform: translate(210px, -20px) scaleX(-1); opacity: 1; }
      50% { transform: translate(210px, -20px) scaleX(-1); opacity: 1; }
      70% { transform: translate(0, 0) scaleX(-1); opacity: 1; }
      71%, 100% { transform: translate(0, 0) scaleX(-1); opacity: 0; }
    }
    
    /* Rider 2 Movement (Shop 2 -> Student 2) */
    @keyframes r2-move {
      0%, 19% { transform: translate(0, 0) scaleX(1); opacity: 0; }
      20% { transform: translate(0, 0) scaleX(1); opacity: 1; }
      40% { transform: translate(210px, -80px) scaleX(1); opacity: 1; }
      41%, 49% { transform: translate(210px, -80px) scaleX(-1); opacity: 1; }
      50% { transform: translate(210px, -80px) scaleX(-1); opacity: 1; }
      70% { transform: translate(0, 0) scaleX(-1); opacity: 1; }
      71%, 100% { transform: translate(0, 0) scaleX(-1); opacity: 0; }
    }
    
    /* Package Visibility */
    @keyframes r-pkg {
      0%, 19% { opacity: 0; transform: scale(0.5); }
      20%, 40% { opacity: 1; transform: scale(1); }
      41%, 100% { opacity: 0; transform: scale(0.5); }
    }
    
    /* Story Popups */
    @keyframes popup-req {
      0% { opacity: 0; transform: translateY(5px) scale(0.9); }
      2%, 8% { opacity: 1; transform: translateY(0) scale(1); }
      10%, 100% { opacity: 0; transform: translateY(-5px) scale(0.9); }
    }
    @keyframes popup-prep {
      0%, 10% { opacity: 0; transform: translateY(5px) scale(0.9); }
      12%, 18% { opacity: 1; transform: translateY(0) scale(1); }
      20%, 100% { opacity: 0; transform: translateY(-5px) scale(0.9); }
    }
    @keyframes popup-del {
      0%, 40% { opacity: 0; transform: translateY(5px) scale(0.9); }
      42%, 48% { opacity: 1; transform: translateY(0) scale(1); }
      50%, 100% { opacity: 0; transform: translateY(-5px) scale(0.9); }
    }
    
    @keyframes pulse-node {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
    }
  `;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/20 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden max-w-sm w-full mx-auto">
      <style>{customStyles}</style>

      <h3 className="text-white font-bold text-xl mb-4 tracking-wide text-center">
        Live Campus Map
      </h3>

      <div className="relative w-[300px] h-[340px] bg-slate-800/40 rounded-2xl border border-white/5 overflow-hidden shadow-inner">
        
        {/* SVG Background Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path d="M 46 68 L 254 48" stroke="white" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <path d="M 46 248 L 254 148" stroke="white" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        </svg>

        {/* --- GROUP 1 (0s Delay Sequence) --- */}
        {/* Shop 1 */}
        <div className="absolute left-6 top-[40px] z-10 flex flex-col items-center">
          <div className="absolute -top-7 whitespace-nowrap bg-white text-slate-800 text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0" style={{ animation: 'popup-prep 20s ease-in-out infinite 0s' }}>
            Preparing... 👨‍🍳
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
          </div>
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-[pulse-node_3s_ease-in-out_infinite]">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9px] font-bold text-white/80 mt-1 uppercase tracking-wider">Chef's Table</span>
        </div>

        {/* Student 1 (Top Right) */}
        <div className="absolute left-[234px] top-[20px] z-10 flex flex-col items-center">
          {/* Popups moved to the left to prevent clipping at the top */}
          <div className="absolute right-[50px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0" style={{ animation: 'popup-req 20s ease-in-out infinite 0s' }}>
            Hungry! 🍔
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-blue-500"></div>
          </div>
          <div className="absolute right-[50px] top-1/2 -translate-y-1/2 whitespace-nowrap bg-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0" style={{ animation: 'popup-del 20s ease-in-out infinite 0s' }}>
            Delivered! 🎉
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-green-500"></div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9px] font-bold text-white/80 mt-1 uppercase tracking-wider">Library</span>
        </div>

        {/* Rider 1 */}
        <div className="absolute left-[24px] top-[40px] z-20 opacity-0" style={{ animation: 'r1-move 20s ease-in-out infinite 0s' }}>
          <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100 relative">
            <Bike className="w-5 h-5 text-[#9B5110]" />
            <div className="absolute -top-2 -right-2 bg-orange-500 p-0.5 rounded-md shadow-sm opacity-0" style={{ animation: 'r-pkg 20s ease-in-out infinite 0s' }}>
              <Package className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* --- GROUP 2 (10s Delay Sequence) --- */}
        {/* Shop 2 */}
        <div className="absolute left-6 top-[220px] z-10 flex flex-col items-center">
           <div className="absolute -top-7 whitespace-nowrap bg-white text-slate-800 text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0" style={{ animation: 'popup-prep 20s ease-in-out infinite 10s' }}>
            Preparing... 👨‍🍳
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
          </div>
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-[pulse-node_4.5s_ease-in-out_infinite]">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9px] font-bold text-white/80 mt-1 uppercase tracking-wider">Chillox</span>
        </div>

        {/* Student 2 */}
        <div className="absolute left-[234px] top-[120px] z-10 flex flex-col items-center">
           <div className="absolute -top-7 whitespace-nowrap bg-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0" style={{ animation: 'popup-req 20s ease-in-out infinite 10s' }}>
            Ordering... 🍩
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-blue-500"></div>
          </div>
          <div className="absolute -top-7 whitespace-nowrap bg-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0" style={{ animation: 'popup-del 20s ease-in-out infinite 10s' }}>
            Delivered! 🎉
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-green-500"></div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9px] font-bold text-white/80 mt-1 uppercase tracking-wider">Academic</span>
        </div>

        {/* Student 3 (Idle extra node) */}
        <div className="absolute left-[234px] top-[240px] z-10 flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-[9px] font-bold text-white/80 mt-1 uppercase tracking-wider">Hostel</span>
        </div>

        {/* Rider 2 */}
        <div className="absolute left-[24px] top-[220px] z-20 opacity-0" style={{ animation: 'r2-move 20s ease-in-out infinite 10s' }}>
          <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100 relative">
            <Bike className="w-5 h-5 text-[#9B5110]" />
            <div className="absolute -top-2 -right-2 bg-orange-500 p-0.5 rounded-md shadow-sm opacity-0" style={{ animation: 'r-pkg 20s ease-in-out infinite 10s' }}>
              <Package className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

      </div>

      <div className="mt-4 flex justify-center space-x-6 w-full text-[10px] text-white/60 font-semibold uppercase tracking-widest px-2">
        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span> 2 Shops</span>
        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-[#9B5110] rounded-full mr-1.5"></span> 2 Runners</span>
        <span className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span> 3 Zones</span>
      </div>

    </div>
  );
}

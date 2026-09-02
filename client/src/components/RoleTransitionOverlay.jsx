import React, { useEffect, useState } from 'react';
import { User, Truck, ArrowLeftRight } from 'lucide-react';

export default function RoleTransitionOverlay({ isVisible, toRole }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setStage(1); // Show overlay
      
      const timer1 = setTimeout(() => {
        setStage(2); // Swap icons
      }, 500);
      
      const timer2 = setTimeout(() => {
        setStage(3); // Fade out
      }, 1200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setStage(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ${stage === 3 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center bg-white px-12 py-10 rounded-[2.5rem] shadow-2xl">
        
        {/* Animated Container */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          
          {/* Ring */}
          <div className="absolute inset-0 border-4 border-orange-100 rounded-full animate-[spin_3s_linear_infinite]">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
          </div>
          
          <div className="absolute inset-2 border-4 border-dashed border-orange-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>

          {/* Icons container with flip effect */}
          <div className={`transition-all duration-500 ease-in-out transform flex items-center justify-center w-full h-full ${stage >= 2 ? 'rotate-[360deg] scale-110' : 'scale-100'}`}>
            
            {/* Conditional Icon Rendering based on stage and role */}
            {stage < 2 ? (
              // Initial State (From)
              toRole === 'runner' ? (
                <User className="w-10 h-10 text-slate-400" />
              ) : (
                <Truck className="w-10 h-10 text-slate-400" />
              )
            ) : (
              // Final State (To)
              toRole === 'runner' ? (
                <Truck className="w-10 h-10 text-orange-500" />
              ) : (
                <User className="w-10 h-10 text-orange-500" />
              )
            )}
            
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 tracking-wide text-center">
          Switching to <span className="text-orange-500">{toRole === 'runner' ? 'Runner' : 'Student'}</span>
        </h2>
        <p className="text-sm text-slate-400 mt-2 font-medium">Please wait a moment...</p>
        
      </div>
    </div>
  );
}

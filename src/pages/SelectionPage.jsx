import React from 'react';
import { ShieldCheck, Store, Bike, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeliveryAnimation from '../components/DeliveryAnimation';

export default function SelectionPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      title: 'University Admin',
      description: 'Manage shops, runners, and platform operations.',
      icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
    },
    {
      id: 'shop',
      title: 'Shop Owner',
      description: 'Manage your menu, incoming orders, and sales analytics.',
      icon: <Store className="w-6 h-6 text-orange-500" />,
    },
    {
      id: 'runner',
      title: 'Student Runner',
      description: 'Accept delivery requests and earn while you study.',
      icon: <Bike className="w-6 h-6 text-orange-500" />,
    },
    {
      id: 'student',
      title: 'Ordering Student',
      description: 'Browse campus shops and order food or stationery.',
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-800">
      {/* Left Panel - Image Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <img
          src="/bg.jpg"
          alt="UIU Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* The Animated Story */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 lg:p-20 h-full text-white">
          <DeliveryAnimation />
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight text-center">
            Empowering Campus <br /> Logistics
          </h1>
          <p className="text-base lg:text-lg text-slate-200 max-w-md leading-relaxed text-center">
            Providing a seamless connection between campus shops, student runners, and the university community.
          </p>
        </div>
      </div>

      {/* Right Panel - Selection Menu */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16 relative">
        <div className="w-full max-w-md xl:max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              <span className="text-orange-500">UIU</span> Food and Items Delivery
            </h2>
            <p className="text-slate-500 text-sm">Select your role to continue to the portal</p>
          </div>

          {/* Role Selection Cards */}
          <div className="flex flex-col gap-4 mb-10">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => navigate('/login')}
                className="group flex items-center p-5 bg-[#F8F7F5] border border-transparent rounded-2xl transition-all duration-300 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 text-left w-full"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100/70 group-hover:bg-orange-100 transition-colors mr-5">
                  {role.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-[17px] group-hover:text-orange-600 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mt-0.5">
                    {role.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Area */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-8">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-orange-500 font-semibold hover:text-orange-600 hover:underline transition-all">
                Create Account
              </button>
            </p>
            <p className="text-xs text-slate-400">
              © 2026 University Institutional Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

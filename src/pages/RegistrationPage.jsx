import React from 'react';
import { Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F1] flex flex-col items-center justify-center p-4 lg:p-8 font-sans">
      
      {/* Main Card */}
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row overflow-hidden border border-slate-100">
        
        {/* Left Side - Information */}
        <div className="lg:w-[45%] bg-[#F0EBE1] p-8 lg:p-12 flex flex-col relative">
          <div>
            <span className="inline-block px-4 py-1.5 bg-orange-200/50 text-orange-700 text-sm font-medium rounded-full mb-8">
              Official Campus Service
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-orange-400 leading-tight mb-4 tracking-tight">
              Join the UIU Food & Items Delivery Portal
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-md">
              Create your account to order food, campus essentials, and become part of the UIU delivery community.
            </p>
          </div>

          {/* Image */}
          <div className="flex-1 w-full flex items-center justify-center mb-10">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <img 
                src="/bg.jpg" 
                alt="UIU Campus" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-3 mt-auto">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-sm font-medium text-slate-700 shadow-sm">
              <span className="mr-2 text-lg">🍔</span> Campus Vendors
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-sm font-medium text-slate-700 shadow-sm">
              <span className="mr-2 text-lg">🚴</span> Student Delivery
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-sm font-medium text-slate-700 shadow-sm">
              <span className="mr-2 text-lg">⚡</span> Fast & Secure
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-[55%] p-8 lg:p-14 flex flex-col justify-center">
          
          <div className="flex items-center mb-10">
            <div className="bg-orange-500 p-2 rounded-xl mr-3">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-orange-500 tracking-tight">UIU Food and Items Delivery</h2>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h3>
            <p className="text-slate-500">Register using your university information.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Tonmoy"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">University ID</label>
                <input 
                  type="text" 
                  placeholder="011 213 086"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">UIU Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@bscse.uiu.ac.bd"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Role</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 appearance-none bg-white">
                <option value="" disabled selected>Select your campus role</option>
                <option value="student">Ordering Student</option>
                <option value="runner">Student Runner</option>
                <option value="shop">Shop Owner</option>
                <option value="admin">University Admin</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 tracking-widest"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-700 font-medium">
                I agree to the <a href="#" className="text-orange-500 hover:underline">Terms</a> & <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="button" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center mt-6 shadow-lg shadow-orange-500/30 group"
            >
              Create Account 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-600 mt-8 font-medium">
            Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Global Footer */}
      <div className="w-full max-w-6xl mt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium px-4">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h4 className="text-lg font-bold text-orange-700 mb-1">UIU Delivery</h4>
          <p className="text-slate-500 text-xs">© 2026 United International University • Version 1.0</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-slate-600">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Help Center</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Contact IT Support</a>
        </div>
      </div>
    </div>
  );
}

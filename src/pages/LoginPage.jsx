import React from 'react';
import { Mail, Lock, Eye, ArrowRight, BookOpen } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student'; // Default to student
  const { login } = useAuth();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 lg:p-8 font-sans">
      
      {/* Main Card */}
      <div className="bg-white w-full max-w-[1000px] rounded-[2rem] shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row overflow-hidden border border-slate-100">
        
        {/* Left Side - Information */}
        <div className="lg:w-1/2 bg-[#FCFBF9] p-8 lg:p-12 flex flex-col items-center relative text-center border-r border-slate-100">
          
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 border border-orange-200 text-orange-500 text-xs font-bold tracking-wider rounded-full uppercase">
              Official Campus Service
            </span>
          </div>

          {/* Image */}
          <div className="w-full max-w-[320px] aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white mb-8">
            <img 
              src="/bg.jpg" 
              alt="UIU Campus" 
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">
            UIU Food & Items Delivery Portal
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
            Order food, drinks, stationery, and campus essentials from trusted UIU vendors—delivered by fellow students across campus.
          </p>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold text-slate-600 shadow-sm border border-slate-100">
              <span className="mr-2 text-base">🚴</span> Student Delivery
            </div>
            <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold text-slate-600 shadow-sm border border-slate-100">
              <span className="mr-2 text-base">🍔</span> Campus Vendors
            </div>
            <div className="bg-white px-4 py-2 rounded-full flex items-center text-xs font-semibold text-slate-600 shadow-sm border border-slate-100 mt-1">
              <span className="mr-2 text-base">⚡</span> Fast Delivery
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center bg-white">
          
          <div className="flex justify-center mb-10">
            {/* Placeholder for UIU Logo */}
            <div className="flex flex-col items-center justify-center w-20 h-24 border-[3px] border-orange-400 rounded-t-xl rounded-b-3xl bg-white shadow-sm">
              <span className="text-orange-500 font-extrabold text-2xl tracking-tight leading-none mb-1">UIU</span>
              <div className="w-10 h-[2px] bg-orange-400 mb-1"></div>
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h3 className="text-[28px] font-bold text-slate-900 mb-2 tracking-tight capitalize">Sign in as {role}</h3>
            <p className="text-slate-500 text-sm">Sign in with your UIU account to continue.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">University Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="student@uiu.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 font-medium tracking-widest"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input 
                type="checkbox" 
                id="keep-signed-in" 
                className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="keep-signed-in" className="ml-3 text-sm text-slate-500 font-medium">
                Keep me signed in
              </label>
            </div>

            <button 
              type="button" 
              onClick={() => {
                login({ email: email || `${role}@uiu.ac.bd`, role });
                navigate(`/dashboard/${role}`);
              }}
              className="w-full bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center mt-4 shadow-lg shadow-orange-500/30 group"
            >
              Sign in 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 font-medium text-sm">
            Don't have an account? <Link to="/register" className="text-orange-500 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Global Footer */}
      <div className="w-full max-w-[1000px] mt-8 flex flex-wrap justify-center md:justify-between items-center text-[10px] font-bold text-slate-400 px-4 gap-y-4 tracking-wider uppercase">
        <div className="flex items-center space-x-2">
          <span>© 2026 UNITED INTERNATIONAL UNIVERSITY</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 mx-2"></span>
          <span>UIU FOOD & ITEMS DELIVERY PORTAL</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 mx-2"></span>
          <span>VERSION 1.0</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-orange-500 transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-orange-500 transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-orange-500 transition-colors">HELP CENTER</a>
          <a href="#" className="hover:text-orange-500 transition-colors">CONTACT IT SUPPORT</a>
        </div>
      </div>
    </div>
  );
}

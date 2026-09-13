import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const { login, loginApi } = useAuth();
  
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const demoAccounts = [
    { role: 'student', label: '🎓 Student', email: 'student@uiu.ac.bd', pass: 'password123', path: '/dashboard/student' },
    { role: 'runner', label: '🛵 Runner', email: 'runner@uiu.ac.bd', pass: 'password123', path: '/dashboard/runner' },
    { role: 'shop', label: '🏪 Shop Owner', email: 'shop@uiu.ac.bd', pass: 'password123', path: '/dashboard/shop' },
    { role: 'admin', label: '👑 Admin', email: 'admin@uiu.ac.bd', pass: 'password123', path: '/dashboard/admin' },
  ];

  const handleDemoLogin = async (demo) => {
    setIsLoading(true);
    setErrorMessage('');
    setEmail(demo.email);
    setPassword(demo.pass);
    setRole(demo.role);

    const result = await loginApi(demo.email, demo.pass);
    setIsLoading(false);

    if (result && result.success) {
      navigate(`/dashboard/${result.user.role || demo.role}`);
    } else {
      setErrorMessage(result?.error || 'Unable to sign in with demo account. Please check server connection.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your university email');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    const result = await loginApi(email.trim(), password);
    setIsLoading(false);

    if (result && result.success) {
      navigate(`/dashboard/${result.user.role || role}`);
    } else {
      setErrorMessage(result?.error || 'Invalid email or password');
    }
  };


  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 lg:p-8 font-sans">
      
      {/* Main Card */}
      <div className="bg-white w-full max-w-[1020px] rounded-[2rem] shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row overflow-hidden border border-slate-100">
        
        {/* Left Side - Information & Quick Demo Logins */}
        <div className="lg:w-1/2 bg-[#FCFBF9] p-8 lg:p-10 flex flex-col items-center relative text-center border-r border-slate-100">
          
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 border border-orange-200 text-[#9B5110] text-xs font-bold tracking-wider rounded-full uppercase">
              Official Campus Service
            </span>
          </div>

          {/* Image */}
          <div className="w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-4 border-white mb-6">
            <img 
              src="/UIU.webp" 
              alt="UIU Campus" 
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
            UIU Food & Items Delivery
          </h2>
          <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-sm">
            Order food, drinks, stationery, and campus essentials—delivered directly across academic floors.
          </p>

          {/* One-Click Demo Role Logins */}
          <div className="w-full bg-orange-50/70 border border-orange-200 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-[#9B5110]">
              <Sparkles className="w-4 h-4" />
              <span>One-Click Role Demo Sign In</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoLogin(demo)}
                  className="p-2.5 rounded-xl bg-white hover:bg-orange-500 hover:text-white border border-orange-200/80 text-xs font-bold text-slate-700 transition-all flex items-center justify-between shadow-2xs group cursor-pointer"
                >
                  <span>{demo.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
          
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center justify-center w-16 h-20 border-[3px] border-orange-400 rounded-t-xl rounded-b-2xl bg-white shadow-xs">
              <span className="text-orange-500 font-extrabold text-xl tracking-tight leading-none mb-1">UIU</span>
              <div className="w-8 h-[2px] bg-orange-400 mb-1"></div>
              <BookOpen className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight capitalize">
              Sign In to Your Account
            </h3>
            <p className="text-slate-500 text-xs">Enter your campus credentials to continue.</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-sm text-slate-800 bg-white font-medium"
              >
                <option value="student">🎓 Student Customer</option>
                <option value="runner">🛵 Student Runner</option>
                <option value="shop">🏪 Shop Owner</option>
                <option value="admin">👑 Campus Admin</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">University Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  placeholder={`${role}@uiu.ac.bd`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-sm text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <span className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-sm text-slate-800 placeholder-slate-400 font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-orange-500/25 group cursor-pointer active:scale-[0.99] text-sm mt-2"
            >
              {isLoading ? 'Signing In...' : 'Sign in'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6 font-medium text-xs">
            Don't have an account? <Link to="/register" className="text-orange-500 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Global Footer */}
      <div className="w-full max-w-[1020px] mt-6 flex flex-wrap justify-center md:justify-between items-center text-[10px] font-bold text-slate-400 px-4 gap-y-2 tracking-wider uppercase">
        <div className="flex items-center space-x-2">
          <span>© 2026 UNITED INTERNATIONAL UNIVERSITY</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 mx-2"></span>
          <span>UIU FOOD & ITEMS DELIVERY PORTAL</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-orange-500 transition-colors">Role Selector</Link>
          <Link to="/register" className="hover:text-orange-500 transition-colors">Register</Link>
        </div>
      </div>
    </div>
  );
}

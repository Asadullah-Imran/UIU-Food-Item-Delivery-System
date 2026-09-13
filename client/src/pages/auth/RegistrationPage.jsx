import React, { useState } from 'react';
import { Truck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { registerApi, login } = useAuth();
  
  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {

      setErrorMessage('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      password,
      role,
      universityId: role !== 'shop' ? universityId.trim() : undefined,
      phone: phone.trim(),
      shopName: role === 'shop' ? fullName.trim() : undefined
    };

    const res = await registerApi(payload);
    setIsLoading(false);

    if (res && res.success) {
      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate(`/dashboard/${res.user?.role || role}`);
      }, 1000);
    } else {
      setErrorMessage(res?.error || 'Registration failed. Please try again.');
    }
  };


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
            <h1 className="text-4xl lg:text-5xl font-bold text-orange-500 leading-tight mb-4 tracking-tight">
              Join the UIU Food & Items Delivery Portal
            </h1>
            <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-md">
              Create your account to order food, campus essentials, and become part of the UIU delivery community.
            </p>
          </div>

          {/* Image */}
          <div className="flex-1 w-full flex items-center justify-center mb-10">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <img 
                src="/UIU.webp" 
                alt="UIU Campus" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-3 mt-auto">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-sm font-medium text-slate-700 shadow-xs">
              <span className="mr-2 text-lg">🍔</span> Campus Vendors
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-sm font-medium text-slate-700 shadow-xs">
              <span className="mr-2 text-lg">🚴</span> Student Delivery
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-sm font-medium text-slate-700 shadow-xs">
              <span className="mr-2 text-lg">⚡</span> Fast & Secure
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-[55%] p-8 lg:p-14 flex flex-col justify-center">
          
          <div className="flex items-center mb-6">
            <div className="bg-orange-500 p-2 rounded-xl mr-3">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-orange-500 tracking-tight">UIU Food and Items Delivery</h2>
          </div>

          <div className="mb-6">
            <h3 className="text-3xl font-bold text-slate-900 mb-1">Create Your Account</h3>
            <p className="text-slate-500 text-sm">Register to start using the campus delivery portal.</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 bg-white text-sm font-medium"
              >
                <option value="student">🎓 Ordering Student</option>
                <option value="runner">🛵 Student Runner</option>
                <option value="shop">🏪 Shop Owner</option>
              </select>
            </div>

            <div className={`grid grid-cols-1 ${role !== 'shop' ? 'md:grid-cols-2' : ''} gap-4`}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {role === 'shop' ? 'Owner / Manager Name' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'shop' ? 'e.g., Mohammad Ali' : 'Rafiqul Haque'}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 text-sm font-medium"
                />
              </div>
              
              {role !== 'shop' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {role === 'runner' ? 'Runner / Student ID' : 'University ID'}
                  </label>
                  <input 
                    type="text" 
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    placeholder="011 213 086"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 text-sm font-medium"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 tracking-widest text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors text-slate-800 placeholder-slate-400 tracking-widest text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center mt-4 shadow-lg shadow-orange-500/30 group cursor-pointer active:scale-[0.99] text-sm"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-600 mt-6 font-medium text-xs">
            Already have an account? <Link to="/login" className="text-orange-500 hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Global Footer */}
      <div className="w-full max-w-6xl mt-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium px-4">
        <div className="mb-2 md:mb-0 text-center md:text-left">
          <h4 className="text-sm font-bold text-orange-700">UIU Food & Items Delivery</h4>
          <p className="text-slate-400 text-[10px]">© 2026 United International University</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-slate-500 text-xs">
          <Link to="/" className="hover:text-orange-500 transition-colors">Role Portal</Link>
          <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
        </div>
      </div>
    </div>
  );
}

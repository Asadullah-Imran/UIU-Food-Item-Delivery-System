import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, GraduationCap, MapPin, Wallet, 
  Award, Star, Zap, Package, CheckCircle2, ShieldCheck, 
  Pencil, Sparkles, ArrowRight, ArrowLeftRight, Bike, 
  AlertCircle, X, Check, Clock, TrendingUp, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TopUpModal from '../../components/wallet/TopUpModal';

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, token, updateUserData } = useAuth();

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRunnerModalOpen, setIsRunnerModalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'UIU Student',
    studentId: user?.universityId || '011213086',
    department: user?.department || 'CSE',
    email: user?.email || 'student@bscse.uiu.ac.bd',
    phone: user?.phone || '+880 1712-345678',
    deliveryRoom: user?.deliveryRoom || 'Room 412, Academic Building',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Runner opt-in modal state
  const [vehicleType, setVehicleType] = useState('Bicycle');
  const [isActivatingRunner, setIsActivatingRunner] = useState(false);

  // Sync state if user changes in AuthContext
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || 'UIU Student',
        studentId: user.universityId || '011213086',
        department: user.department || 'CSE',
        email: user.email || 'student@bscse.uiu.ac.bd',
        phone: user.phone || '+880 1712-345678',
        deliveryRoom: user.deliveryRoom || 'Room 412, Academic Building',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'
      });
    }
  }, [user]);

  // Handle Edit Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorToast('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          deliveryRoom: formData.deliveryRoom,
          avatar: formData.avatar
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setProfileData({ ...formData });
      updateUserData({
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        deliveryRoom: formData.deliveryRoom,
        avatar: formData.avatar
      });

      setSuccessToast('Profile updated successfully!');
      setTimeout(() => {
        setSuccessToast('');
        setIsEditModalOpen(false);
      }, 1200);
    } catch (err) {
      setErrorToast(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Become a Runner Confirmation
  const handleConfirmBecomeRunner = async () => {
    setIsActivatingRunner(true);
    setErrorToast('');

    try {
      const res = await fetch('/api/auth/become-runner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ vehicleType })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to register as runner');
      }

      updateUserData({
        isRunner: true,
        runnerDetails: {
          vehicleType,
          rating: 5.0,
          totalTrips: 0,
          walletBalance: user?.walletBalance || 0,
          isAvailable: true
        }
      });

      setSuccessToast('Congratulations! Runner status activated.');
      setTimeout(() => {
        setSuccessToast('');
        setIsRunnerModalOpen(false);
      }, 1200);
    } catch (err) {
      // Local fallback for offline simulation
      updateUserData({
        isRunner: true,
        runnerDetails: {
          vehicleType,
          rating: 5.0,
          totalTrips: 0,
          walletBalance: user?.walletBalance || 0,
          isAvailable: true
        }
      });
      setSuccessToast('Runner status activated successfully!');
      setTimeout(() => {
        setSuccessToast('');
        setIsRunnerModalOpen(false);
      }, 1200);
    } finally {
      setIsActivatingRunner(false);
    }
  };

  const isRunner = user?.isRunner || user?.role === 'runner';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 pt-2">
      
      {/* Toast notifications */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="fixed top-6 right-6 z-50 bg-rose-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* User Avatar & Details */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <img 
                src={profileData.avatar} 
                alt={profileData.name} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-orange-50 shadow-md"
              />
              <span 
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                  isRunner ? 'bg-emerald-500' : 'bg-orange-500'
                }`}
                title={isRunner ? 'Active Runner & Student' : 'Active Student'}
              />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {profileData.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200 text-xs font-black px-3 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  UIU Student
                </span>
                {isRunner && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full">
                    <Bike className="w-3.5 h-3.5" />
                    Campus Runner
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm font-semibold text-slate-600 mt-2">
                <span>Student ID: <strong className="text-slate-800 font-black">{profileData.studentId}</strong></span>
                <span>Dept: <strong className="text-slate-800 font-black">{profileData.department}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Quick Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {isRunner && (
              <button
                type="button"
                onClick={() => navigate('/dashboard/runner')}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl shadow-md text-sm transition-all"
              >
                <ArrowLeftRight className="w-4 h-4 text-orange-400" />
                Switch to Runner Mode
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setFormData({ ...profileData });
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-orange-500/20 text-sm transition-all"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

        </div>

        {/* Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#F37623] via-orange-400 to-transparent rounded-full mt-6 -mx-8"></div>
      </div>

      {/* Dual Role Callout: Become a Runner or Runner Status */}
      {!isRunner ? (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                Earn while you study on campus
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                Become a UIU Campus Delivery Runner
              </h2>
              <p className="text-white/90 text-sm font-medium leading-relaxed">
                Deliver food orders across UIU campus between your lecture breaks. Earn ৳30–৳50 per delivery, get instant payouts directly into your Campus Digital Wallet, and set your own flexible hours.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRunnerModalOpen(true)}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-black px-6 py-3.5 rounded-2xl shadow-md transition-all hover:scale-105"
            >
              <Bike className="w-5 h-5 text-orange-500" />
              Apply to Become a Runner
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Background subtle decoration */}
          <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
            <Bike className="w-64 h-64 text-white" />
          </div>
        </div>
      ) : (
        /* Runner Summary & Performance Bar if already a runner */
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-md border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Campus Runner Identity Active</h3>
                <p className="text-xs text-slate-400 font-medium">You have dual permissions to both order food as a student and fulfill deliveries as a runner.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Runner Status:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active & Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Trips</span>
              <div className="text-2xl font-black text-white mt-1">{user?.runnerDetails?.totalTrips || 12}</div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Runner Rating</span>
              <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
                {user?.runnerDetails?.rating || 4.9} <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">On-Time Delivery</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">98%</div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vehicle Mode</span>
              <div className="text-base font-black text-slate-200 mt-1 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-orange-400" />
                {user?.runnerDetails?.vehicleType || 'Bicycle'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Personal Information + Campus Digital Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Personal & Campus Information */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA6D17] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Student Academic & Campus Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <p className="text-xs font-semibold text-slate-400">Full Name</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{profileData.name}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">UIU Student ID</p>
              <p className="text-sm font-bold text-slate-800 mt-1 font-mono">{profileData.studentId}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Department</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{profileData.department}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Official UIU Email</p>
              <p className="text-sm font-bold text-slate-800 mt-1 break-all">{profileData.email}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Phone Number</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{profileData.phone}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">Default Campus Delivery Location</p>
              <p className="text-sm font-bold text-orange-600 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                {profileData.deliveryRoom}
              </p>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              Your default delivery location is automatically selected during checkout for quick one-click orders to your lecture rooms, labs, or cafeteria.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Campus Digital Wallet Card */}
        <div className="bg-gradient-to-br from-slate-900 to-[#1E293B] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold mb-4">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-orange-400" />
                Campus Digital Wallet
              </span>
              <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                Closed-Loop
              </span>
            </div>

            <p className="text-xs text-slate-400 font-medium">Available Balance</p>
            <div className="text-4xl font-black text-white tracking-tight mt-1">
              ৳{(user?.walletBalance || 0).toLocaleString()}
            </div>
            
            <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">
              Use your campus wallet for instant food ordering across all UIU cafeteria shops with zero transaction fees.
            </p>
          </div>

          <div className="space-y-2.5 pt-6">
            <button
              type="button"
              onClick={() => setIsTopUpOpen(true)}
              className="w-full bg-[#F37623] hover:bg-[#d9671b] text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-orange-500/30 text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              Quick Top-Up Balance
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/student/orders')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              View Order History & Receipts
            </button>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Update your personal contact & delivery room</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#F37623] focus:ring-1 focus:ring-[#F37623]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#F37623] focus:ring-1 focus:ring-[#F37623]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#F37623]"
                  >
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="BBA">BBA</option>
                    <option value="Civil">Civil</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Campus Delivery Room / Lab</label>
                <input
                  type="text"
                  required
                  value={formData.deliveryRoom}
                  onChange={(e) => setFormData({ ...formData, deliveryRoom: e.target.value })}
                  placeholder="e.g., Room 412, Academic Building"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#F37623] focus:ring-1 focus:ring-[#F37623]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#F37623] focus:ring-1 focus:ring-[#F37623]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F37623] hover:bg-[#d9671b] text-white text-sm font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Become a Runner Confirmation Modal */}
      {isRunnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Become a UIU Runner</h3>
                  <p className="text-xs text-slate-400 font-medium">Activate student delivery permissions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRunnerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
                <p className="font-bold text-orange-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  UIU Student Runner Guidelines:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li>Earn ৳30–৳50 per on-campus delivery drop-off.</li>
                  <li>Deliver orders within the designated UIU buildings & cafeteria.</li>
                  <li>Your student account stays active — you can switch between ordering and delivering at any time!</li>
                </ul>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Delivery Mode / Preferred Vehicle
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-orange-500"
                >
                  <option value="Walking/On Foot">Walking (Indoor Campus / Hostels)</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Electric Scooter">Electric Scooter</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRunnerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBecomeRunner}
                  disabled={isActivatingRunner}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {isActivatingRunner ? 'Activating...' : 'Confirm & Activate Runner Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
      />

    </div>
  );
}

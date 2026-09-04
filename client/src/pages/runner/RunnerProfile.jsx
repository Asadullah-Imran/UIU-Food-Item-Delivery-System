import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Pencil, Star, Wallet, Award, CheckCircle2,
  Phone, Mail, GraduationCap, Calendar, AlertCircle,
  MapPin, Zap, Package, X, Check
} from 'lucide-react';
import RunnerSidebarFix from './RunnerSidebarFix';
import runnerData from '../../data/runner.json';

export default function RunnerProfile() {
  const [isOnline, setIsOnline] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Editable personal info state
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Tanvir Ahmed',
    studentId: '011213086',
    dept: 'CSE',
    email: 'mtonmoy213086@bscse.uiu.ac.bd',
    phone: '+880 1700-000000',
    currentSemester: '10th Semester (Fall 26)',
    emergencyContact: '+880 1912-876543 (Father)',
    deliveryZone: 'Main Campus & Hostels',
  });

  const [formData, setFormData] = useState({ ...personalInfo });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setPersonalInfo({ ...formData });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 900);
  };

  const achievements = [
    {
      id: 'fast-delivery',
      name: 'Fast Delivery',
      progressText: '12/15',
      percentage: 80,
      icon: Zap,
      iconBg: 'bg-orange-100 text-orange-600',
      barColor: 'bg-orange-500'
    },
    {
      id: '100-deliveries',
      name: '100 Deliveries',
      progressText: '100/100',
      percentage: 100,
      icon: Package,
      iconBg: 'bg-blue-100 text-blue-600',
      barColor: 'bg-emerald-500'
    },
    {
      id: 'top-rated',
      name: 'Top Rated',
      progressText: '4.9/5.0',
      percentage: 98,
      icon: Star,
      iconBg: 'bg-amber-100 text-amber-600',
      barColor: 'bg-amber-500'
    },
    {
      id: 'perfect-attendance',
      name: 'Perfect Attendance',
      progressText: '28/30 days',
      percentage: 93,
      icon: Calendar,
      iconBg: 'bg-purple-100 text-purple-600',
      barColor: 'bg-purple-600'
    }
  ];

  return (
    <>
      <RunnerSidebarFix isProfile />

      <div className="max-w-[1200px] mx-auto space-y-6 pt-4 pb-12">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
            My Profile
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage your personal information, delivery performance, and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Avatar & Details */}
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" 
                  alt={personalInfo.name} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span 
                  className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white transition-colors duration-300 ${
                    isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  title={isOnline ? 'Online' : 'Offline'}
                />
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {personalInfo.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 bg-[#FFF4EB] text-[#EA6D17] border border-[#FCD8BE] text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs">
                    <Award className="w-3.5 h-3.5 fill-[#EA6D17]" />
                    Gold Runner
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm font-bold text-slate-600 mt-2">
                  <span>ID: <strong className="text-slate-800 font-black">{personalInfo.studentId}</strong></span>
                  <span>Dept: <strong className="text-slate-800 font-black">{personalInfo.dept}</strong></span>
                </div>
              </div>
            </div>

            {/* Status Toggle & Edit Button */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Status</span>
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                    isOnline ? 'bg-[#EA6D17]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Online Status"
                >
                  <div 
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                      isOnline ? 'translate-x-6' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData({ ...personalInfo });
                  setIsEditModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-[#F37623] hover:bg-[#d9671b] text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-orange-500/20 text-sm transition-all"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

          </div>

          {/* Accent Bottom Line */}
          <div className="h-1 bg-gradient-to-r from-[#F37623] via-orange-400 to-transparent rounded-full mt-6 -mx-8"></div>
        </div>

        {/* 5 Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Total Deliveries */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              TOTAL DELIVERIES
            </span>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">156</div>
              <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                +12 this week
              </div>
            </div>
          </div>

          {/* Card 2: Avg Rating */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              AVG RATING
            </span>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
                4.9 <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1">
                98 reviews
              </div>
            </div>
          </div>

          {/* Card 3: On-time Rate */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ON-TIME RATE
            </span>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">98%</div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#F37623] rounded-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Card 4: Lifetime Earnings */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              LIFETIME EARNINGS
            </span>
            <div className="mt-2">
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight">৳15,420</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">
                Joined Jan 2024
              </div>
            </div>
          </div>

          {/* Card 5: Current Balance (Dark Card) */}
          <div className="bg-[#1E293B] text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-slate-300 text-xs font-medium mb-1">
                <span>Current Balance</span>
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-3xl font-extrabold tracking-tight">৳1,250</div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Monthly Earnings: ৳4,800
              </p>
            </div>
            
            <Link 
              to="/dashboard/runner/earnings"
              className="w-full mt-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg transition-colors text-center block"
            >
              View Full Wallet
            </Link>
          </div>

        </div>

        {/* Bottom Section: Personal Info (2/3) + Achievements (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA6D17] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs font-semibold text-slate-400">Email Address</p>
                <p className="text-sm font-bold text-slate-800 mt-1 break-all">
                  {personalInfo.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">Phone Number</p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {personalInfo.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">Dept.</p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {personalInfo.dept}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">Current Semester</p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {personalInfo.currentSemester}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">Emergency Contact</p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {personalInfo.emergencyContact}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">Campus Delivery Zone</p>
                <p className="text-sm font-extrabold text-[#9B5110] mt-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-[#EA6D17] fill-[#FFF4EB]" />
                  {personalInfo.deliveryZone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Achievements */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA6D17] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Achievements
              </h3>
            </div>

            <div className="space-y-5">
              {achievements.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-1">
                        <span className="truncate">{item.name}</span>
                        <span className="text-xs text-slate-400 font-semibold ml-2">{item.progressText}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.barColor}`} 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-slate-400 font-medium">
            © 2024 UIU Campus Logistics. Authorized Runner Access Only.
          </p>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center text-emerald-600 flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 mb-2" />
                <p className="font-bold text-lg">Profile Updated Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Emergency Contact</label>
                  <input 
                    type="text" 
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Campus Delivery Zone</label>
                  <input 
                    type="text" 
                    value={formData.deliveryZone}
                    onChange={(e) => setFormData({ ...formData, deliveryZone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-sm font-semibold text-slate-800"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#F37623] hover:bg-[#d9671b] text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

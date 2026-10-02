import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  LogOut,
  ArrowRight,
  Building,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  XCircle,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ShopPendingApproval() {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();

  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());

  // Determine current status
  const isApproved = Boolean(user?.isApproved);
  const isRejected = user?.status === 'rejected';
  const isPending = !isApproved && !isRejected;

  // Auto-redirect if already approved
  useEffect(() => {
    if (user?.role === 'shop' && user?.isApproved && user?.status === 'active') {
      const timer = setTimeout(() => {
        navigate('/dashboard/shop');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setFeedback(null);
    try {
      const updatedUser = await refreshUser();
      setLastCheckedTime(new Date());

      if (updatedUser?.isApproved && updatedUser?.status === 'active') {
        setFeedback({
          type: 'success',
          title: '🎉 Congratulations! Shop Approved!',
          message: 'Your shop has been approved by campus administration. Redirecting to your dashboard...'
        });
        setTimeout(() => {
          navigate('/dashboard/shop');
        }, 1500);
      } else if (updatedUser?.status === 'rejected') {
        setFeedback({
          type: 'error',
          title: 'Application Not Approved',
          message: 'Campus administration has rejected this shop application. Please contact the campus admin office.'
        });
      } else {
        setFeedback({
          type: 'info',
          title: 'Still Under Review',
          message: 'Your application is currently pending admin review. We will notify you once approved.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Connection Issue',
        message: 'Could not connect to the server. Please try again in a few moments.'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const shopName = user?.shopDetails?.shopName || user?.shop?.name || 'Your Campus Shop';
  const ownerName = user?.name || 'Shop Owner';
  const email = user?.email || '—';
  const phone = user?.phone || '—';
  const location = user?.shopDetails?.campusLocation || user?.shop?.location || 'UIU Food Court Counter';
  const category = user?.shopDetails?.category || user?.shop?.category || 'Food Court';

  return (
    <div className="min-h-screen bg-[#F6F5F2] flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">UIU Food & Items Delivery</h1>
            <p className="text-xs text-slate-500 font-medium">Merchant Onboarding Portal</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all cursor-pointer hover:text-slate-900"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl w-full mx-auto my-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Status Header Banner */}
          <div
            className={`p-8 md:p-10 border-b ${
              isApproved
                ? 'bg-emerald-500/10 border-emerald-100'
                : isRejected
                ? 'bg-red-500/10 border-red-100'
                : 'bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border-orange-100'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isApproved
                      ? 'bg-emerald-500 text-white'
                      : isRejected
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-500 text-white shadow-orange-500/30'
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  ) : isRejected ? (
                    <XCircle className="w-8 h-8" />
                  ) : (
                    <Clock className="w-8 h-8 animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRejected
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isApproved ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-amber-500 animate-ping'
                        }`}
                      />
                      {isApproved
                        ? 'Approved & Active'
                        : isRejected
                        ? 'Application Rejected'
                        : 'Pending Administrator Approval'}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    {isApproved
                      ? 'Your Shop is Approved!'
                      : isRejected
                      ? 'Shop Application Not Approved'
                      : 'Shop Application Submitted'}
                  </h2>

                  <p className="text-slate-600 text-sm mt-1 max-w-xl leading-relaxed">
                    {isApproved
                      ? 'Your application has been verified. Welcome aboard the campus delivery ecosystem!'
                      : isRejected
                      ? 'Your application could not be approved by the campus administration at this time.'
                      : 'Your shop registration has been successfully recorded and is now queued for administrator review. Please wait for campus admin approval before opening your store.'}
                  </p>
                </div>
              </div>

              {/* Status Action / Refresh */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 flex-shrink-0">
                <button
                  onClick={handleCheckStatus}
                  disabled={isChecking || isApproved}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? 'Checking Status...' : 'Check Approval Status'}</span>
                </button>
                <span className="text-[11px] text-center text-slate-400 font-medium">
                  Last checked: {lastCheckedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback alert (if clicked) */}
          {feedback && (
            <div
              className={`mx-8 mt-6 p-4 rounded-2xl flex items-start gap-3 border text-sm ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : feedback.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : feedback.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{feedback.title}</p>
                <p className="text-xs mt-0.5 opacity-90">{feedback.message}</p>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-8 md:p-10 space-y-10">
            {/* Step-by-Step Approval Workflow */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
                Onboarding & Approval Pipeline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                      Step 1 Done
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Registration Submitted</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Shop profile, stall name, and credentials registered in database.
                  </p>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-5 rounded-2xl border relative ${
                    isApproved
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : isRejected
                      ? 'border-red-200 bg-red-50/40'
                      : 'border-orange-300 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isApproved
                          ? 'bg-emerald-500 text-white'
                          : isRejected
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white animate-pulse'
                      }`}
                    >
                      {isApproved ? '✓' : '2'}
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-700'
                          : isRejected
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {isApproved ? 'Approved' : isRejected ? 'Declined' : 'Under Review'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Admin Verification</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Campus admin verifies stall authorization and food safety standards.
                  </p>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-5 rounded-2xl border relative ${
                    isApproved
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-slate-200 bg-slate-50/50 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isApproved ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {isApproved ? '✓' : '3'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/70 px-2 py-0.5 rounded-full">
                      {isApproved ? 'Active' : 'Locked'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Storefront & Dashboard</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Add menu items, manage inventory, and receive student orders.
                  </p>
                </div>
              </div>
            </div>

            {/* Application Details Summary */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Submitted Application Summary
              </h3>

              <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Shop / Stall Name</span>
                    <span className="font-bold text-slate-800 text-base">{shopName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Category</span>
                    <span className="font-semibold text-slate-800">{category}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Stall / Campus Location</span>
                    <span className="font-semibold text-slate-800">{location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Owner / Contact</span>
                    <span className="font-semibold text-slate-800">
                      {ownerName} ({phone})
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2 pt-2 border-t border-slate-200/60">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Registered Account Email</span>
                    <span className="font-mono text-xs font-semibold text-slate-700">{email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help / Guidance Card */}
            <div className="bg-[#FAF8F5] border border-orange-200/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Need Expedited Approval?</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-lg">
                    Campus administrators review shop onboarding daily. If you are an authorized campus vendor or require urgent setup, please visit the Administration Office.
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 text-xs">
                <span className="font-bold text-slate-700 block">Admin Office</span>
                <span className="text-slate-500">Room 102, Ground Floor</span>
                <span className="text-orange-600 font-semibold block mt-0.5">admin@uiu.ac.bd</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-auto mx-auto text-center py-4">
        <p className="text-xs text-slate-400">
          UIU Food & Items Delivery System • Official Campus Vendor Portal © 2026
        </p>
      </footer>
    </div>
  );
}

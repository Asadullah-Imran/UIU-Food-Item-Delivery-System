import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  Bike, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export default function PendingApprovalPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = searchParams.get('role') || 'runner';
  const emailParam = searchParams.get('email') || '';
  const nameParam = searchParams.get('name') || '';

  const [checking, setChecking] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const isShop = roleParam === 'shop';
  const roleTitle = isShop ? 'Shop Owner' : 'Delivery Runner';
  const RoleIcon = isShop ? Store : Bike;

  const handleCheckStatus = async () => {
    if (!emailParam) {
      setStatusMessage('Please enter your email on the login page to check status.');
      return;
    }

    setChecking(true);
    setStatusMessage('');

    try {
      const res = await fetch(`/api/auth/check-status?email=${encodeURIComponent(emailParam)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setStatusResult(data);
        if (data.isFullyApproved) {
          setStatusMessage('🎉 Great news! Your application has been approved by campus administration.');
        } else if (data.status === 'rejected') {
          setStatusMessage('Your application was reviewed and rejected. Please contact campus admin for inquiries.');
        } else {
          setStatusMessage('Your application is currently in queue awaiting admin verification.');
        }
      } else {
        setStatusMessage(data.message || 'Unable to check status at this time.');
      }
    } catch (err) {
      setStatusMessage('Could not connect to verification server. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4F1] flex flex-col items-center justify-center p-4 lg:p-8 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-8 sm:p-12">
        
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Admin Verification Required
          </div>

          <div className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 shadow-sm border-2 border-orange-200/60">
            <RoleIcon className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
            {roleTitle} Application Submitted
          </h1>
          <p className="text-slate-600 text-sm max-w-md leading-relaxed mb-8">
            Thank you for registering on the UIU Campus Food & Items Delivery Portal. 
            To maintain campus safety and quality of service, all new {roleTitle.toLowerCase()} accounts must be verified and approved by a campus administrator before gaining access.
          </p>
        </div>

        {/* Application Summary Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Applicant Name</span>
            <span className="font-semibold text-slate-800">{nameParam || 'Registered User'}</span>
          </div>
          {emailParam && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500">Registered Email</span>
              <span className="font-mono text-slate-800 text-xs sm:text-sm">{emailParam}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500">Requested Role</span>
            <span className="font-bold text-orange-600 capitalize">{roleTitle}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-200">
            <span className="text-slate-500">Current Status</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              statusResult?.isFullyApproved 
                ? 'bg-emerald-100 text-emerald-800' 
                : statusResult?.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {statusResult?.isFullyApproved ? 'Approved' : statusResult?.status === 'rejected' ? 'Rejected' : 'Pending Review'}
            </span>
          </div>
        </div>

        {/* 3-Step Verification Pipeline */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center sm:text-left">
            Onboarding Verification Process
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-900">1. Registration</span>
              <span className="text-[11px] text-emerald-700">Form submitted</span>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col items-center sm:items-start text-center sm:text-left shadow-sm">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2 animate-pulse">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-amber-900">2. Admin Review</span>
              <span className="text-[11px] text-amber-700">In verification queue</span>
            </div>

            <div className={`border rounded-xl p-3.5 flex flex-col items-center sm:items-start text-center sm:text-left ${
              statusResult?.isFullyApproved 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${
                statusResult?.isFullyApproved ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">3. Access Granted</span>
              <span className="text-[11px]">Dashboard unlocked</span>
            </div>
          </div>
        </div>

        {/* Live Status Message Feedback */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-3 border ${
            statusResult?.isFullyApproved 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : statusResult?.status === 'rejected'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{statusMessage}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {emailParam && !statusResult?.isFullyApproved && (
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking Status...' : 'Check Approval Status'}
            </button>
          )}

          {statusResult?.isFullyApproved ? (
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Log In Now
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              Return to Login
            </button>
          )}
        </div>

        {/* Support Note */}
        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          Need fast verification? Contact UIU Delivery Portal admin office.
        </p>

      </div>
    </div>
  );
}

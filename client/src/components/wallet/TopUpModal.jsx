import React, { useState } from 'react';
import { 
  X, Wallet, CheckCircle2, ArrowRight, ShieldCheck, 
  Smartphone, CreditCard, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopUpModal({ isOpen, onClose, onSuccess }) {
  const { user, token, updateUserWallet, refreshUser } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Amount & Gateway, 2: PIN Simulator, 3: Success
  const [amount, setAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('bkash');
  const [phone, setPhone] = useState(user?.phone || '01712987654');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [transDetails, setTransDetails] = useState(null);

  if (!isOpen) return null;

  const presetAmounts = [100, 200, 300, 500, 1000];

  const handleAmountSelect = (val) => {
    setAmount(val);
    setCustomAmount('');
    setError('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val && !isNaN(val)) {
      setAmount(Number(val));
    }
    setError('');
  };

  const handleProceedToPin = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!phone || phone.length < 11) {
      setError('Please provide a valid 11-digit mobile number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConfirmTopUp = async (e) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setError('Please enter a 4-digit simulation PIN (e.g., 1234)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const methodName = method === 'bkash' 
        ? 'bKash In-App Simulator' 
        : method === 'nagad' 
        ? 'Nagad In-App Simulator' 
        : 'UIU Student Smart Card';

      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('uiu_auth_token')}`
        },
        body: JSON.stringify({
          amount,
          method: methodName,
          sourcePhone: phone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to top up wallet');
      }

      // Update auth context state
      updateUserWallet(data.walletBalance);
      await refreshUser();

      setTransDetails(data);
      setStep(3);

      if (onSuccess) {
        onSuccess(data.walletBalance);
      }
    } catch (err) {
      setError(err.message || 'Error processing top-up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setPin('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 p-6 text-white relative">
          <button 
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-100 bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                In-App Purchase
              </span>
              <h3 className="text-xl font-black">Top Up Campus Wallet</h3>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
            <span className="text-orange-100">Current Balance:</span>
            <span className="font-extrabold text-sm text-white">৳ {user?.walletBalance || 0}.00</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Select Amount & Gateway */}
          {step === 1 && (
            <form onSubmit={handleProceedToPin} className="space-y-6">
              
              {/* Select Gateway */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
                  Select Payment Simulator
                </label>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      method === 'bkash' 
                        ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-pink-600 text-white font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                      bK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">bKash</p>
                      <p className="text-[10px] text-slate-400">Simulation</p>
                    </div>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setMethod('nagad')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      method === 'nagad' 
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                      NG
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">Nagad</p>
                      <p className="text-[10px] text-slate-400">Simulation</p>
                    </div>
                  </button>

                  {/* Student Smart Card */}
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      method === 'card' 
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">UIU Card</p>
                      <p className="text-[10px] text-slate-400">Smart ID</p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Amount Quick Select */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">
                  Select Amount (৳)
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountSelect(val)}
                      className={`py-2 px-1 text-center rounded-xl font-bold text-sm transition-all ${
                        amount === val && !customAmount
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-500/30'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      ৳{val}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                  <input
                    type="number"
                    min="10"
                    placeholder="Or enter custom amount..."
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Mobile / ID Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  {method === 'card' ? 'Student ID Card Number' : 'Mobile Banking Account'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Bottom Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all group"
              >
                Proceed to Top Up ৳{amount}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* STEP 2: PIN Verification Simulator */}
          {step === 2 && (
            <form onSubmit={handleConfirmTopUp} className="space-y-6 py-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-3 shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-slate-800">Simulated PIN Verification</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Confirming <span className="font-bold text-slate-800">৳{amount}</span> deposit via {method.toUpperCase()} ({phone})
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Transfer Amount</span>
                  <span className="font-bold text-slate-800">৳{amount}.00</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Simulation Service Fee</span>
                  <span className="font-bold text-green-600">৳0.00 (Free)</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Wallet Credit</span>
                  <span className="text-orange-600">৳{amount}.00</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 text-center">
                  Enter 4-Digit Simulation PIN (e.g. 1234)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-[1em] text-2xl font-black py-3 bg-white border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-2 py-3.5 px-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Confirm & Deposit ৳${amount}`
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <div className="py-4 text-center space-y-5 animate-scaleUp">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-600/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mb-1">
                  Deposit Successful
                </span>
                <h4 className="text-2xl font-black text-slate-800">৳{amount}.00 Credited</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your Campus Wallet has been updated instantly.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-700">{transDetails?.transaction?.transactionId || 'TXN-SUCCESS'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">New Available Balance:</span>
                  <span className="font-extrabold text-orange-600 text-sm">৳{transDetails?.walletBalance || user?.walletBalance || 0}.00</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all"
              >
                Done / Return to Checkout
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

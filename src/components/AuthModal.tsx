import React, { useState } from 'react';
import { 
  X, Eye, EyeOff, Mail, Phone, Lock, User, Check, Globe, Sparkles 
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  // Swipe layout for desktop: 'login' or 'register'
  const [activePanel, setActivePanel] = useState<'login' | 'register'>('login');
  
  // General states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Login with OTP states
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isOpen) return null;

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(result.user);
      setAuthSuccess('Google sign-in successful!');
      setTimeout(() => {
        setAuthSuccess('');
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setAuthError('Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email / Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter email and password.');
      return;
    }
    setIsLoading(true);
    setAuthError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess(result.user);
      setAuthSuccess('Login successful! Welcome.');
      setTimeout(() => {
        setAuthSuccess('');
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setAuthError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!fullName || !email || !password) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setAuthError('Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      await updateProfile(result.user, {
        displayName: fullName
      });
      onAuthSuccess(result.user);
      setAuthSuccess('Account registered successfully!');
      setTimeout(() => {
        setAuthSuccess('');
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('This email is already in use.');
      } else {
        setAuthError('An error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Mock Phone OTP Flow
  const handleSendOtp = () => {
    if (!phone) {
      setAuthError('Please enter phone number.');
      return;
    }
    setAuthError('');
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      alert(`OTP Code 123456 has been sent to your number ${phone} (simulation)`);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456') {
      setAuthSuccess('Phone login successful!');
      // Simulate real user profile
      onAuthSuccess({
        uid: 'phone-user-' + Math.floor(Math.random() * 10000),
        email: email || `${phone}@zainsolar.com`,
        displayName: 'Solar Customer (Phone)',
        phoneNumber: phone
      });
      setTimeout(() => {
        setAuthSuccess('');
        onClose();
      }, 1500);
    } else {
      setAuthError('Invalid OTP code.');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setAuthError('Please enter your email to reset password.');
      return;
    }
    alert(`Password reset link has been sent to ${email}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      {/* Main glass card container */}
      <div className="relative bg-[#1A1A1A]/95 text-white border border-white/10 w-full max-w-4xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex z-10 animate-scaleIn text-left">
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* --- MOBILE VIEW: Click Tabs layout (hides split/swipe on small screens) --- */}
        <div className="md:hidden flex flex-col w-full h-full p-6 overflow-y-auto">
          <div className="flex gap-4 border-b border-white/10 pb-3 mb-6 shrink-0 justify-center">
            <button 
              onClick={() => { setActivePanel('login'); setIsOtpMode(false); }}
              className={`pb-1 text-sm font-bold ${activePanel === 'login' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setActivePanel('register'); }}
              className={`pb-1 text-sm font-bold ${activePanel === 'register' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-400'}`}
            >
              Register
            </button>
          </div>

          {/* Form wrapper */}
          <div className="flex-1 space-y-4">
            {authError && <p className="text-xs text-red-500 text-center font-bold bg-red-500/10 py-2 rounded-xl border border-red-500/20">{authError}</p>}
            {authSuccess && <p className="text-xs text-green-500 text-center font-bold bg-green-500/10 py-2 rounded-xl border border-green-500/20">{authSuccess}</p>}

            {activePanel === 'login' ? (
              /* Mobile Login */
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="email" required placeholder="Email Address"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red"
                    />
                    <Mail className="h-4 w-4 text-gray-400 absolute right-3 top-3.5" />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required placeholder="Password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-400">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    <span>Remember Me</span>
                  </label>
                  <button type="button" onClick={handleForgotPassword} className="hover:text-brand-red font-bold">Forgot Password?</button>
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#CC0000]"
                >
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* Mobile Register */
              <form onSubmit={handleRegister} className="space-y-3">
                <input 
                  type="text" required placeholder="Full Name"
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red"
                />
                <input 
                  type="email" required placeholder="Email Address"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red"
                />
                <input 
                  type="password" required placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red"
                />
                <input 
                  type="password" required placeholder="Confirm Password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red"
                />
                <label className="flex items-center gap-1 text-[10px] text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                  <span>I accept the terms and conditions.</span>
                </label>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#CC0000]"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
            )}

            {/* Google sign-in */}
            <div className="relative shrink-0 pt-4 border-t border-white/10 text-center">
              <button 
                onClick={handleGoogleLogin} 
                className="w-full py-2 bg-white text-gray-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP VIEW: Beautiful Sliding split screen layout --- */}
        <div className="hidden md:flex w-full h-full relative">
          
          {/* 1. Left Form Container */}
          <div className="w-1/2 h-full p-12 flex flex-col justify-between overflow-y-auto">
            
            {/* Logo/Brand intro */}
            <div className="flex items-center gap-2 shrink-0">
              <Globe className="h-5 w-5 text-brand-red" />
              <span className="text-base font-bold font-display">Zain<span className="text-brand-red">Solar</span> Account</span>
            </div>

            <div className="my-auto space-y-6">
              {authError && <p className="text-xs text-red-500 font-bold bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20">{authError}</p>}
              {authSuccess && <p className="text-xs text-green-500 font-bold bg-green-500/10 py-2 px-3 rounded-xl border border-green-500/20">{authSuccess}</p>}

              {/* Login block */}
              {activePanel === 'login' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold font-display">Welcome Back!</h3>
                    <p className="text-xs text-gray-400">Sign in to track orders, manage tickets, and check out faster.</p>
                  </div>

                  {!isOtpMode ? (
                    /* Email Login */
                    <form onSubmit={handleEmailLogin} className="space-y-3.5">
                      <div className="relative text-left">
                        <input 
                          type="email" required placeholder="Email Address"
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-4 pr-10 text-xs text-white outline-none focus:border-brand-red"
                        />
                        <Mail className="h-4 w-4 text-gray-400 absolute right-3 top-3.5" />
                      </div>

                      <div className="relative text-left">
                        <input 
                          type={showPassword ? "text" : "password"} required placeholder="Password"
                          value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-4 pr-10 text-xs text-white outline-none focus:border-brand-red"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-gray-400">
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                          <span>Remember me</span>
                        </label>
                        <button type="button" onClick={handleForgotPassword} className="hover:text-brand-red font-bold">Forgot password?</button>
                      </div>

                      <button 
                        type="submit" disabled={isLoading}
                        className="w-full py-3 bg-brand-red hover:bg-[#CC0000] text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                      >
                        {isLoading ? 'Logging in...' : 'Sign In'}
                      </button>

                      <button 
                        type="button" 
                        onClick={() => { setIsOtpMode(true); setAuthError(''); }}
                        className="w-full text-center text-xs text-gray-400 hover:text-white font-bold block pt-2 underline"
                      >
                        Sign in via Phone & OTP
                      </button>
                    </form>
                  ) : (
                    /* Phone OTP Login */
                    <div className="space-y-3.5">
                      {!otpSent ? (
                        <>
                          <div className="relative">
                            <input 
                              type="tel" required placeholder="Phone Number (e.g., 03001234567)"
                              value={phone} onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 pr-10 text-xs text-white outline-none focus:border-brand-red"
                            />
                            <Phone className="h-4 w-4 text-gray-400 absolute right-3 top-3.5" />
                          </div>
                          <button 
                            type="button" onClick={handleSendOtp} disabled={isLoading}
                            className="w-full py-3 bg-brand-red text-white text-xs font-bold rounded-xl"
                          >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-green-400">OTP code has been sent to your phone.</p>
                          <div className="relative">
                            <input 
                              type="text" required placeholder="Enter 6-digit OTP code"
                              value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-brand-red font-mono"
                            />
                          </div>
                          <button 
                            type="button" onClick={handleVerifyOtp}
                            className="w-full py-3 bg-brand-red text-white text-xs font-bold rounded-xl"
                          >
                            Verify OTP & Sign In
                          </button>
                        </>
                      )}

                      <button 
                        type="button" onClick={() => { setIsOtpMode(false); setOtpSent(false); setAuthError(''); }}
                        className="w-full text-center text-xs text-gray-400 hover:text-white font-bold block pt-2 underline"
                      >
                        Back to Email Login
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                /* Registration block */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold font-display">Create Account</h3>
                    <p className="text-xs text-gray-400">Sign up for free and get custom solar rates instantly.</p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="relative text-left">
                      <input 
                        type="text" required placeholder="Full Name"
                        value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-2 px-4 pr-10 text-xs text-white outline-none focus:border-brand-red"
                      />
                      <User className="h-4 w-4 text-gray-400 absolute right-3 top-3.5" />
                    </div>

                    <div className="relative text-left">
                      <input 
                        type="email" required placeholder="Email Address"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-2 px-4 pr-10 text-xs text-white outline-none focus:border-brand-red font-mono"
                      />
                      <Mail className="h-4 w-4 text-gray-400 absolute right-3 top-3.5" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="relative">
                        <input 
                          type="password" required placeholder="Password"
                          value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-2 px-4 text-xs text-white outline-none focus:border-brand-red"
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="password" required placeholder="Confirm Password"
                          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-2 px-4 text-xs text-white outline-none focus:border-brand-red"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-[10px] text-gray-400 cursor-pointer select-none">
                      <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                      <span>I accept all terms and conditions.</span>
                    </label>

                    <button 
                      type="submit" disabled={isLoading}
                      className="w-full py-2.5 bg-brand-red hover:bg-[#CC0000] text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Google provider */}
            <div className="shrink-0 pt-4 border-t border-white/10">
              <button 
                onClick={handleGoogleLogin} 
                className="w-full py-2.5 bg-white text-gray-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-md cursor-pointer"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>

          {/* 2. Right Sliding Banner Showcase Panel */}
          <div className="w-1/2 h-full bg-gradient-to-tr from-[#121212] via-[#1E1E1E] to-[#262626] border-l border-white/5 relative flex flex-col justify-between p-12 overflow-hidden text-left">
            
            {/* Background vector rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-brand-red/10 -z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-brand-red/5 -z-0"></div>

            <div className="shrink-0">
              <span className="text-[10px] font-mono tracking-widest text-brand-red font-bold uppercase font-display">JOIN THE GREEN REVOLUTION</span>
            </div>

            <div className="space-y-4 my-auto relative z-10">
              <div className="p-2.5 bg-brand-red text-white h-10 w-10 rounded-2xl flex items-center justify-center animate-bounce shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-tight">
                {activePanel === 'login' ? "Sign up now & get a 10% discount code!" : "Already have an account?"}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {activePanel === 'login' 
                  ? "Creating an account on Zain Solar is 100% free. Sign up to purchase panels, batteries, and inverters at wholesale rates."
                  : "Sign in with your account to track and complete your orders."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setActivePanel(activePanel === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="mt-2 px-6 py-2.5 bg-white text-gray-900 rounded-full text-xs font-bold hover:bg-brand-red hover:text-white transition-all shadow-lg cursor-pointer font-display"
              >
                {activePanel === 'login' ? 'Go to Register' : 'Go to Sign In'}
              </button>
            </div>

            <div className="shrink-0 text-gray-500 text-[10px] font-mono">
              ZAIN SOLAR PAKISTAN © 2026
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

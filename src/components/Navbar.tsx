import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Search, ShoppingCart, Heart, User, LogOut, LayoutDashboard, 
  MapPin, Mic, MicOff, SlidersHorizontal, Info, ShoppingBag, X, Check
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { UserProfile, Product } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onAuthClick: () => void;
  onCartClick: () => void;
  wishlistCount: number;
  cartCount: number;
  compareCount: number;
  onNavigate: (view: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  user,
  onAuthClick,
  onCartClick,
  wishlistCount,
  cartCount,
  compareCount,
  onNavigate,
  products,
  onSelectProduct,
  onLogout,
  searchQuery,
  onSearchChange
}: NavbarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [searchQuery, products]);

  // Handle outside click for suggestions and profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support voice search. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange(transcript);
      setShowSuggestions(true);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSignOut = async () => {
    try {
      onLogout();
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#1A1A1A] text-white border-b border-white/10 shadow-lg">
      {/* Top micro bar */}
      <div className="bg-brand-red text-white py-1.5 px-4 text-xs font-sans text-center md:flex md:justify-between md:items-center">
        <p className="font-medium">⚡ پاکستان کی نمبر 1 سولر کمپنی - صاف توانائی، سستا بل!</p>
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1">🗺️ <span className="font-mono">Office 4B, Gulberg II, Lahore</span></span>
          <span>📞 Support: 0300-1234567</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo" 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
            onClick={() => onNavigate('store')}
          >
            <div className="relative p-2 bg-brand-red rounded-xl shadow-md flex items-center justify-center animate-pulse">
              <Sun className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-bold font-display tracking-tight flex items-center">
                Zain<span className="text-brand-red ml-1.5">Solar</span>
              </span>
              <span className="block text-[9px] text-gray-400 font-sans tracking-widest text-right uppercase">Pakistani Brand</span>
            </div>
          </div>

          {/* Search bar & Voice Search */}
          <div className="relative flex-1 max-w-xl mx-4 hidden sm:block" ref={suggestionRef}>
            <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-brand-red/50 rounded-full py-1.5 pl-4 pr-10 focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/20 transition-all">
              <input
                type="text"
                placeholder="Search solar panels, batteries, inverters..."
                className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-400 text-white"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button 
                  onClick={handleVoiceSearch} 
                  className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${isListening ? 'text-brand-red bg-white/15 animate-bounce' : 'text-gray-400'}`}
                  title="Voice Search"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Suggestions drop card */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn overflow-hidden">
                <h4 className="text-[10px] text-gray-400 font-mono tracking-wider px-3 py-1 uppercase">سفارشات / Suggestions</h4>
                {suggestions.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      onSearchChange('');
                      setShowSuggestions(false);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all"
                  >
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-10 h-10 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-red">Rs {item.discountPrice?.toLocaleString() || item.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Nav links */}
            <button 
              onClick={() => onNavigate('store')} 
              className="hidden md:block text-sm font-medium px-2 py-1.5 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('store')} 
              className="hidden md:block text-sm font-medium px-2 py-1.5 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => {
                const ft = document.getElementById('main-footer');
                ft?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hidden md:block text-sm font-medium px-2 py-1.5 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              About Us
            </button>

            <div className="w-px h-6 bg-white/10 hidden md:block"></div>

            {/* Compare link with count badge */}
            <button 
              onClick={() => onNavigate('compare')}
              className="p-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-colors relative"
              title="Compare Products"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => {
                if (user) {
                  onNavigate('dashboard');
                } else {
                  onAuthClick();
                }
              }}
              className="p-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-colors relative"
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon with count */}
            <button 
              onClick={onCartClick}
              className="p-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="w-px h-6 bg-white/10"></div>

            {/* Profile Dropdown or Auth Button */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-white/5 rounded-full transition-colors focus:outline-none"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-8 h-8 rounded-full border border-brand-red"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-sm font-bold">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-scaleIn text-left">
                    <div className="px-3 py-2.5 border-b border-white/10">
                      <p className="text-xs text-gray-400 font-mono">Logged-in Account</p>
                      <p className="text-sm font-semibold truncate text-white">{user.displayName || 'Customer'}</p>
                      <p className="text-[10px] text-gray-400 truncate font-mono">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-block mt-1 bg-brand-red/10 border border-brand-red/30 text-brand-red text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase">
                          Administrator / Admin
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          onNavigate('dashboard');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <User className="h-4 w-4 text-brand-red" />
                        Profile & Orders
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-1">
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full border border-brand-red text-white bg-brand-red/10 hover:bg-brand-red transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Login / Register</span>
              </button>
            )}

          </nav>
        </div>
      </div>

      {/* Mobile search bar & Category links */}
      <div className="px-4 pb-3 sm:hidden border-t border-white/5 pt-2">
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full py-1.5 px-4 focus-within:border-brand-red">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent border-none outline-none text-xs placeholder-gray-400 text-white"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
          />
          <Search className="h-3.5 w-3.5 text-gray-400 absolute right-4" />
        </div>
        
        {/* Mobile quick links */}
        <div className="flex gap-4 overflow-x-auto pt-2 pb-1 scrollbar-none text-[11px] font-semibold text-gray-400">
          <button 
            onClick={() => onNavigate('store')} 
            className="text-gray-300 hover:text-white"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('store')} 
            className="text-gray-300 hover:text-white"
          >
            Products
          </button>
          <button 
            onClick={() => {
              const ft = document.getElementById('main-footer');
              ft?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="text-gray-300 hover:text-white"
          >
            About Us
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// Types
import { Product, Order, UserProfile, CartItem, Review } from './types';

// Core UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ProductDetail from './components/ProductDetail';
import CompareModal from './components/CompareModal';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
import SupportWidget from './components/SupportWidget';

// Static assets & lists
import { PRODUCTS } from './data/products';
import { Search, SlidersHorizontal, AlertCircle, ShoppingBag, Heart, LayoutDashboard } from 'lucide-react';

type ActiveView = 'store' | 'product-detail' | 'compare' | 'dashboard';

export default function App() {
  // Global Store States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // App views & navigation states
  const [currentView, setCurrentView] = useState<ActiveView>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart, Wishlist, Compare States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  // Drawer/Modal visibility controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Home Store search and filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1500000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);

  // 1. Listen to Firebase Auth state change & fetch Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Solar Customer',
            phoneNumber: firebaseUser.phoneNumber || '',
            isAdmin: firebaseUser.email === 'malikhassab4@gmail.com',
            photoURL: firebaseUser.photoURL || ''
          };

          if (!userDocSnap.exists()) {
            await setDoc(userDocRef, profile);
          } else {
            profile = { ...profile, ...userDocSnap.data() };
          }
          setUser(profile);
        } catch (err) {
          console.error("Error logging in/creating user Profile:", err);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch and Sync Products with Firestore, Auto-seeding if empty
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'products')));
        if (querySnapshot.empty) {
          // Auto-seed
          for (const prod of PRODUCTS) {
            await setDoc(doc(collection(db, 'products'), prod.id), prod);
          }
          setProducts(PRODUCTS);
        } else {
          const list: Product[] = [];
          querySnapshot.forEach(doc => {
            list.push(doc.data() as Product);
          });
          setProducts(list);
        }
      } catch (err) {
        console.error("Firestore product fetch failed, utilizing default set:", err);
        setProducts(PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  // 3. Fetch orders (All for Admin, personal for Customer)
  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      let orderQuery;
      if (user.isAdmin) {
        orderQuery = query(collection(db, 'orders'));
      } else {
        orderQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
      }
      const snapshot = await getDocs(orderQuery);
      const list: Order[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as Order);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentView('store');
  };

  // Cart Interactions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        product,
        quantity,
        savedForLater: false
      }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleToggleSaveForLater = (productId: string) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, savedForLater: !item.savedForLater } : item
    ));
  };

  const handlePlaceOrderSuccess = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setCurrentView('dashboard');
  };

  // Wishlist Interactions
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Compare Interactions
  const handleToggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 products.');
        return prev;
      }
      return [...prev, product];
    });
  };

  // Add review and sync with Firestore & State
  const handleAddReview = async (productId: string, newReview: Review) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const updatedReviews = [newReview, ...p.reviews];
        const newRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return { ...p, reviews: updatedReviews, rating: newRating };
      }
      return p;
    });

    setProducts(updatedProducts);

    // Sync specific product to Firestore
    try {
      const prodRef = doc(db, 'products', productId);
      const targetProduct = updatedProducts.find(p => p.id === productId);
      if (targetProduct) {
        await updateDoc(prodRef, {
          reviews: targetProduct.reviews,
          rating: targetProduct.rating
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to cancel this pending order?')) {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: 'Cancelled' });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const finalPrice = product.discountPrice || product.price;
    const matchesPrice = finalPrice >= minPrice && finalPrice <= maxPrice;
    const matchesStock = !showInStockOnly || product.stockStatus === 'In Stock';

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured/default
  });

  return (
    <div className="bg-white min-h-screen text-gray-950 font-sans antialiased selection:bg-brand-red selection:text-white flex flex-col justify-between">
      
      {/* 1. Header Navbar */}
      <Navbar 
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
        products={products}
        onSelectProduct={(prod) => {
          setSelectedProduct(prod);
          setCurrentView('product-detail');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onNavigate={(view) => {
          setCurrentView(view as any);
          setSelectedProduct(null);
        }}
      />

      {/* 2. Main Workspace View Router */}
      <main className="flex-grow">
        
        {/* VIEW A: Catalog Store & Frontpage */}
        {currentView === 'store' && !selectedProduct && (
          <div className="space-y-12 pb-20 text-left">
            {/* Promotional Hero sliders */}
            <Hero 
              onStartShopping={() => {
                // Smooth scroll to main category selector
                document.getElementById('brand-logo')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              onViewKits={() => {
                setSelectedCategory('Solar Complete Kits');
                document.getElementById('brand-logo')?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* Main store content container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Category selector panels row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-fadeIn">
                {[
                  { id: 'All', label: 'All Products', emoji: '📦' },
                  { id: 'Solar Panels', label: 'Solar Panels', emoji: '☀️' },
                  { id: 'Solar Batteries', label: 'Solar Batteries', emoji: '🔋' },
                  { id: 'Solar Inverters', label: 'Solar Inverters', emoji: '🔌' },
                  { id: 'Solar Accessories', label: 'Solar Accessories', emoji: '🛠️' },
                  { id: 'Solar Complete Kits', label: 'Solar Kits', emoji: '🏡' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedCategory === cat.id 
                        ? 'border-brand-red bg-brand-red/5 ring-1 ring-brand-red' 
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{cat.emoji}</span>
                    <span className="text-xs font-bold text-gray-800 block">{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Filtering and products dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-12">
                
                {/* Left Side: Refinement & Advanced Filtering Controls */}
                <div className="space-y-6 lg:col-span-1 border border-gray-100 p-6 rounded-3xl bg-white self-start">
                  <div className="flex items-center gap-1.5 pb-4 border-b border-gray-100">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-brand-red" />
                    <h3 className="text-sm font-bold text-gray-900 font-display">Refine Products</h3>
                  </div>

                  {/* Price sliders */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">Maximum Price: (Rs)</label>
                    <input 
                      type="range" 
                      min={1000} 
                      max={1500000} 
                      step={5000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-brand-red cursor-pointer"
                    />
                    <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
                      <span>Rs 1,000</span>
                      <span className="font-bold text-brand-red">Rs {maxPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stock checkbox */}
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      className="rounded border-gray-200 text-brand-red focus:ring-brand-red h-4 w-4"
                    />
                    <span>In Stock Only</span>
                  </label>

                  {/* Sort options select */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-600">Sort By:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-100 rounded-xl py-2 px-3 text-xs bg-white focus:border-brand-red outline-none cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>

                  {/* Instant support card */}
                  <div className="p-4 bg-brand-red/5 rounded-2xl border border-brand-red/10 space-y-2 text-center">
                    <span className="text-xl">📞</span>
                    <h5 className="text-xs font-bold text-brand-red">Need Free Consultation?</h5>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Register a callback ticket now to get quick guidance from our solar experts!</p>
                  </div>
                </div>

                {/* Right Side: Products Grid */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Total Results: <span className="text-gray-950 font-bold">{sortedProducts.length}</span> products found
                    </p>
                  </div>

                  {sortedProducts.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-gray-200 rounded-3xl space-y-3">
                      <span className="text-4xl">🔍</span>
                      <p className="text-sm font-semibold text-gray-800">No products match your filters!</p>
                      <p className="text-xs text-gray-400">Please try adjusting your search terms or filter criteria.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                      {sortedProducts.map((prod) => (
                        <ProductCard 
                          key={prod.id} 
                          product={prod} 
                          isInWishlist={wishlist.some(w => w.id === prod.id)}
                          isInCompareList={compareList.some(c => c.id === prod.id)}
                          onToggleWishlist={() => handleToggleWishlist(prod)}
                          onToggleCompare={() => handleToggleCompare(prod)}
                          onAddToCart={() => handleAddToCart(prod)}
                          onBuyNow={() => {
                            handleAddToCart(prod);
                            setIsCartOpen(true);
                          }}
                          onViewDetails={() => {
                            setSelectedProduct(prod);
                            setCurrentView('product-detail');
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* VIEW B: Product Detail Page */}
        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail 
            product={selectedProduct}
            user={user}
            isInWishlist={wishlist.some(w => w.id === selectedProduct.id)}
            isInCompareList={compareList.some(c => c.id === selectedProduct.id)}
            onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
            onToggleCompare={() => handleToggleCompare(selectedProduct)}
            onAddToCart={() => handleAddToCart(selectedProduct)}
            onBuyNow={() => {
              handleAddToCart(selectedProduct);
              setIsCartOpen(true);
            }}
            onBack={() => {
              setSelectedProduct(null);
              setCurrentView('store');
            }}
            onAddReview={handleAddReview}
          />
        )}

        {/* VIEW C: Compare Products Panel */}
        {currentView === 'compare' && (
          <CompareModal 
            compareList={compareList}
            onRemoveFromCompare={(pid) => setCompareList(prev => prev.filter(c => c.id !== pid))}
            onAddToCart={(prod) => handleAddToCart(prod)}
            onClearAll={() => setCompareList([])}
            onBackToHome={() => setCurrentView('store')}
          />
        )}

        {/* VIEW D: Customer Dashboard */}
        {currentView === 'dashboard' && (
          <UserDashboard 
            user={user}
            onUpdateUser={(updates) => setUser(prev => prev ? { ...prev, ...updates } : null)}
            wishlist={wishlist}
            onRemoveFromWishlist={(pid) => setWishlist(prev => prev.filter(w => w.id !== pid))}
            onAddToCart={(prod) => handleAddToCart(prod)}
            orders={orders}
            onCancelOrder={handleCancelOrder}
          />
        )}

      </main>

      {/* 3. Footer */}
      <Footer onNavigate={(v) => {
        setCurrentView(v as any);
        setSelectedProduct(null);
      }} />

      {/* 4. Support Widget & Floating Assistant */}
      <SupportWidget user={user} />

      {/* 5. Drawers / Overlays */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onToggleSaveForLater={handleToggleSaveForLater}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onClearCart={() => setCart([])}
        onAddOrder={handlePlaceOrderSuccess}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(firebaseUser) => {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Solar Customer',
            phoneNumber: firebaseUser.phoneNumber || '',
            isAdmin: firebaseUser.email === 'malikhassab4@gmail.com',
            photoURL: firebaseUser.photoURL || ''
          };
          setUser(newProfile);
        }}
      />

    </div>
  );
}

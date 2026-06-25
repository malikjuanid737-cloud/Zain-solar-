import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Heart, Settings, ShieldAlert, Truck, 
  MapPin, Clock, CheckCircle, XCircle, FileText, Upload, Trash2, ShoppingCart
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Order, Product, UserProfile } from '../types';

interface UserDashboardProps {
  user: UserProfile | null;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

export default function UserDashboard({
  user,
  onUpdateUser,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  orders,
  onCancelOrder
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  
  // Profile inputs
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Track specific order overlay
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhone(user.phoneNumber || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: name,
        phoneNumber: phone
      });
      onUpdateUser({ displayName: name, phoneNumber: phone });
      setSuccessMsg('Profile settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    // Elegant text popup to copy/print receipt details
    const invoiceContent = `
========================================
             ZAIN SOLAR PAKISTAN
        Official Sales & Tax Invoice
========================================
Invoice ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleString()}
Customer ID: ${order.userId}
----------------------------------------
Billed To:
Name: ${order.billingInfo.fullName}
Phone: ${order.billingInfo.phoneNumber}
Address: ${order.billingInfo.address}, ${order.billingInfo.city}
----------------------------------------
Order Items:
${order.items.map(i => `- ${i.name} (x${i.quantity}) @ Rs ${i.price.toLocaleString()}`).join('\n')}
----------------------------------------
Payment Method: ${order.paymentMethod}
Status: ${order.status}
Shipping cost: PKR 0 (FREE)
TOTAL AMOUNT: Rs ${order.total.toLocaleString()}
========================================
Thank you for choosing clean solar energy!
Zain Solar Lahore - zainsolar.com.pk
========================================
`;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="user-dashboard-page" className="bg-gray-50 min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile overview box */}
        <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl shadow-md mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-red border border-white/20 flex items-center justify-center text-2xl font-bold uppercase overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{user?.displayName?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">{user?.displayName || 'Customer Account'}</h2>
              <p className="text-xs text-gray-400 font-mono">{user?.email}</p>
              {user?.isAdmin && (
                <span className="inline-block mt-1 bg-brand-red text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase font-sans">
                  Administrator / Admin
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="h-4 w-4" /> },
              { id: 'wishlist', label: 'Wishlist', icon: <Heart className="h-4 w-4" /> },
              { id: 'profile', label: 'Profile Settings', icon: <Settings className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setTrackingOrder(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-brand-red text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && !trackingOrder && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-gray-900 font-display">My Orders (Order Record)</h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <span className="text-4xl block">📦</span>
                <p className="text-sm font-semibold text-gray-800">You have not placed any orders yet!</p>
                <p className="text-xs text-gray-400">Browse our solar panels, inverters, and packages to place your first order.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 border border-gray-100 rounded-2xl bg-white hover:border-brand-red/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#1A1A1A] font-mono">{order.id}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[10px] text-gray-400 font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-gray-300">|</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-700' 
                            : order.status === 'Cancelled' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status === 'Pending' ? 'Pending Approval' : order.status === 'Processing' ? 'Processing' : order.status === 'Shipped' ? 'Shipped' : order.status === 'Delivered' ? 'Delivered' : 'Cancelled'}
                        </span>
                      </div>
                      
                      {/* Products preview snippet */}
                      <p className="text-xs text-gray-600 line-clamp-1">
                        Items: <strong>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Total Amount:</p>
                      <p className="text-base font-extrabold text-brand-red font-mono">Rs {order.total.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto shrink-0 flex-wrap">
                      <button
                        onClick={() => setTrackingOrder(order)}
                        className="flex-1 md:flex-initial px-3.5 py-1.5 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-brand-red transition-all cursor-pointer"
                      >
                        Track Order
                      </button>

                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:border-brand-red hover:text-brand-red text-xs font-bold rounded-xl transition-all cursor-pointer"
                        title="Download Invoice Receipt"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      {order.status === 'Pending' && (
                        <button
                          onClick={() => onCancelOrder(order.id)}
                          className="px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order Tracking Timeline screen */}
        {activeTab === 'orders' && trackingOrder && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-8 animate-fadeIn">
            
            {/* Back to list trigger */}
            <button 
              onClick={() => setTrackingOrder(null)}
              className="text-xs text-[#1A1A1A] font-bold hover:underline"
            >
              ← Back to Orders
            </button>

            {/* Tracking header metadata */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-mono">TRACKING SUMMARY</p>
                <h4 className="text-sm font-extrabold text-gray-900 font-mono">ID: {trackingOrder.id}</h4>
                <p className="text-xs text-gray-500 font-mono">Tracking No: {trackingOrder.trackingNumber || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Payment Method:</p>
                <p className="text-xs font-bold text-gray-800">{trackingOrder.paymentMethod}</p>
                <p className="text-sm font-extrabold text-brand-red font-mono mt-1">Rs {trackingOrder.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Timeline graphics */}
            <div className="py-10 max-w-xl mx-auto">
              <div className="relative flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
                
                {/* Connecting Line (Horizontal on desktop, ignored on mobile fallback) */}
                <div className="absolute top-5 left-1/10 right-1/10 h-0.5 bg-gray-100 -z-10 hidden sm:block"></div>

                {[
                  { id: 'Pending', label: 'Order Booked', icon: <Clock className="h-4 w-4" />, date: 'Day 1' },
                  { id: 'Processing', label: 'Processing', icon: <Settings className="h-4 w-4" />, date: 'Day 2' },
                  { id: 'Shipped', label: 'Shipped', icon: <Truck className="h-4 w-4" />, date: 'Day 3' },
                  { id: 'Delivered', label: 'Delivered', icon: <CheckCircle className="h-4 w-4" />, date: 'Day 4' }
                ].map((node, idx) => {
                  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                  const orderIdx = statuses.indexOf(trackingOrder.status);
                  const nodeIdx = statuses.indexOf(node.id);
                  const isDone = trackingOrder.status === 'Cancelled' ? false : nodeIdx <= orderIdx;
                  const isCurrent = trackingOrder.status === node.id;

                  return (
                    <div key={node.id} className="flex flex-col items-center text-center space-y-2 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md border-2 transition-all ${
                        trackingOrder.status === 'Cancelled'
                          ? 'bg-red-500 border-red-200'
                          : isDone
                          ? 'bg-brand-red border-red-200'
                          : 'bg-gray-200 border-gray-100 text-gray-400'
                      } ${isCurrent ? 'scale-125 ring-4 ring-brand-red/20' : ''}`}>
                        {trackingOrder.status === 'Cancelled' ? <XCircle className="h-4 w-4" /> : node.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? 'text-gray-950' : 'text-gray-400'}`}>
                          {trackingOrder.status === 'Cancelled' ? 'Cancelled' : node.label}
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono font-medium block mt-0.5">{node.date}</span>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Address specifics */}
            <div className="p-4 border border-gray-100 rounded-2xl bg-white space-y-2">
              <h5 className="text-xs font-bold text-gray-800">Shipping Address:</h5>
              <p className="text-xs text-gray-600 leading-relaxed flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-red" />
                <span>{trackingOrder.billingInfo.fullName} - {trackingOrder.billingInfo.phoneNumber}</span>
              </p>
              <p className="text-xs text-gray-500 pl-4.5">{trackingOrder.billingInfo.address}, {trackingOrder.billingInfo.city}</p>
            </div>

          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-gray-900 font-display">Wishlist (Saved Items)</h3>
            
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <span className="text-4xl block">❤️</span>
                <p className="text-sm font-semibold text-gray-800">Your wishlist is empty!</p>
                <p className="text-xs text-gray-400">Save items from our catalog to monitor or buy them later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div key={product.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:border-brand-red/20 transition-all bg-white relative group">
                    <button 
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    
                    <div className="space-y-2">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-32 object-cover rounded-xl bg-gray-50"
                        referrerPolicy="no-referrer"
                      />
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                      <p className="text-xs font-extrabold text-brand-red font-mono">
                        Rs {product.discountPrice?.toLocaleString() || product.price.toLocaleString()}
                      </p>
                    </div>

                    <button 
                      onClick={() => onAddToCart(product)}
                      className="mt-4 w-full py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-lg hover:bg-brand-red transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-gray-900 font-display">Profile Settings (Profile Management)</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {successMsg && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-3 rounded-xl text-xs font-bold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle className="h-4 w-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name (Display Name) *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number (Phone Number)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Example: 03001234567"
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-brand-red font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Email Address (Non-editable)</label>
                <input 
                  type="text" 
                  disabled
                  value={user?.email || ''}
                  className="w-full border border-gray-100 rounded-xl py-2.5 px-3 text-xs bg-gray-100 text-gray-400 cursor-not-allowed font-mono"
                />
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-brand-red hover:bg-[#CC0000] text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Updating Profile...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

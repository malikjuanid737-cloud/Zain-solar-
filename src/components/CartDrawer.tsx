import React, { useState } from 'react';
import { 
  X, Trash2, ShieldCheck, Ticket, CreditCard, ChevronLeft, 
  MapPin, Check, Sparkles, Building2, ShoppingBag, Landmark
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { CartItem, Product, BillingInfo, Order, UserProfile } from '../types';
import { COUPONS } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onToggleSaveForLater: (productId: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onClearCart: () => void;
  onAddOrder: (order: Order) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSaveForLater,
  user,
  onOpenAuth,
  onClearCart,
  onAddOrder
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; isFlat?: boolean } | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Checkout path states
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [billing, setBilling] = useState<BillingInfo>({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const activeItems = cartItems.filter(item => !item.savedForLater);
  const savedItems = cartItems.filter(item => item.savedForLater);

  // Totals calculations
  const subtotal = activeItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.isFlat) {
      discountAmount = Math.min(appliedCoupon.discount, subtotal);
    } else {
      discountAmount = subtotal * appliedCoupon.discount;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const codeUpper = couponCode.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === codeUpper);
    if (found) {
      if (found.code === 'CLEANENERGY' && subtotal < 100000) {
        setCouponError('This coupon is only valid for orders above PKR 100,000.');
        return;
      }
      setAppliedCoupon({
        code: found.code,
        discount: found.discount,
        isFlat: 'isFlat' in found ? true : false
      });
      setCouponCode('');
    } else {
      setCouponError('Sorry, this coupon code is invalid.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!billing.fullName || !billing.phoneNumber || !billing.address || !billing.city) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const orderId = 'JS-ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNo = 'JS-TRK-' + Math.floor(10000000 + Math.random() * 90000000);

    const newOrder: Order = {
      id: orderId,
      userId: user.uid,
      items: activeItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      total: finalTotal,
      billingInfo: billing,
      paymentMethod: paymentMethod,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      trackingNumber: trackingNo
    };

    try {
      // Save order to Firestore
      const orderRef = doc(collection(db, 'orders'), orderId);
      await setDoc(orderRef, newOrder);
      
      setPlacedOrder(newOrder);
      onAddOrder(newOrder);
      onClearCart();
      setStep('success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer content body */}
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col z-10 animate-slideLeft text-left">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-red" />
            <h3 className="text-lg font-bold font-display">
              {step === 'cart' ? 'Shopping Cart' : step === 'checkout' ? 'Checkout' : 'Order Placed!'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'cart' && (
          <>
            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {activeItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <span className="text-5xl block">🛒</span>
                  <h4 className="text-base font-bold text-gray-800">Your cart is empty!</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">Browse our solar panels, inverters, and packages to get started.</p>
                  <button 
                    onClick={onClose}
                    className="mt-2 px-5 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-bold hover:bg-brand-red transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Cart Items ({activeItems.length})</h4>
                  {activeItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-brand-red/10 transition-all shadow-sm">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h5 className="text-xs font-bold text-gray-800 line-clamp-2">{item.product.name}</h5>
                        <p className="text-[10px] text-gray-400 font-mono">SKU: {item.product.sku}</p>
                        
                        {/* Quantity picker & delete actions */}
                        <div className="flex items-center justify-between gap-2 pt-2">
                          <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden bg-gray-50/50">
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 text-xs hover:bg-gray-100 font-bold"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-mono font-bold text-gray-700">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 text-xs hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => onToggleSaveForLater(item.product.id)}
                              className="text-[10px] text-gray-500 hover:text-brand-red underline"
                            >
                              Save for later
                            </button>
                            <button 
                              onClick={() => onRemoveItem(item.product.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <span className="text-xs font-extrabold text-[#1A1A1A]">
                          Rs {((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved For Later Items Area */}
              {savedItems.length > 0 && (
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Saved for Later ({savedItems.length})</h4>
                  {savedItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 opacity-80">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-gray-700 truncate">{item.product.name}</h5>
                        <p className="text-xs font-bold text-gray-800 mt-1">
                          Rs {(item.product.discountPrice || item.product.price).toLocaleString()}
                        </p>
                        <button 
                          onClick={() => onToggleSaveForLater(item.product.id)}
                          className="mt-2 text-xs text-brand-red font-bold hover:underline block"
                        >
                          Move to Cart
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Bottom summary and checkouts */}
            {activeItems.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-4">
                {/* Coupon input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Enter coupon code... (e.g., ZAINSOLAR10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red uppercase"
                    />
                    <Ticket className="h-4 w-4 text-gray-400 absolute right-3 top-2.5" />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-brand-red transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}

                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-100 text-green-700 px-3 py-2 rounded-xl text-xs">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Coupon <strong>{appliedCoupon.code}</strong> applied successfully!
                    </span>
                    <button onClick={handleRemoveCoupon} className="font-bold text-red-500 hover:underline">Remove</button>
                  </div>
                )}

                {/* Costs details */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Coupon Discount</span>
                      <span className="font-mono">-Rs {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-900">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-900 font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-brand-red font-mono text-base">Rs {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                {user ? (
                  <button 
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-brand-red hover:bg-[#CC0000] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-red/15 transition-all cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </button>
                ) : (
                  <button 
                    onClick={onOpenAuth}
                    className="w-full py-3 bg-brand-red hover:bg-[#CC0000] text-white text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Login to Place Order
                  </button>
                )}
                
                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  Secure checkout & manufacturer warranty included.
                </p>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Form Fields Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Back Button */}
              <button 
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs text-[#1A1A1A] font-bold hover:underline flex items-center gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back to Cart</span>
              </button>

              {/* Billing Info Section */}
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Shipping Details (Billing Info)</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={billing.fullName}
                      onChange={(e) => setBilling({...billing, fullName: e.target.value})}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      value={billing.phoneNumber}
                      onChange={(e) => setBilling({...billing, phoneNumber: e.target.value})}
                      placeholder="E.g., 03001234567"
                      className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Shipping Address *</label>
                    <textarea 
                      required
                      rows={2}
                      value={billing.address}
                      onChange={(e) => setBilling({...billing, address: e.target.value})}
                      placeholder="House or office address, street number, area..."
                      className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">City *</label>
                      <input 
                        type="text" 
                        required
                        value={billing.city}
                        onChange={(e) => setBilling({...billing, city: e.target.value})}
                        placeholder="E.g. Lahore, Karachi, Islamabad"
                        className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">Postal Code</label>
                      <input 
                        type="text" 
                        value={billing.postalCode}
                        onChange={(e) => setBilling({...billing, postalCode: e.target.value})}
                        placeholder="54000"
                        className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method section */}
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Payment Method</h4>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'Cash On Delivery', label: 'Cash On Delivery', desc: 'Pay in cash upon delivery', icon: <Building2 className="h-4 w-4" /> },
                    { id: 'EasyPaisa', label: 'EasyPaisa', desc: 'Transfer to our EasyPaisa wallet', icon: <CreditCard className="h-4 w-4" /> },
                    { id: 'JazzCash', label: 'JazzCash', desc: 'Transfer to our JazzCash wallet', icon: <CreditCard className="h-4 w-4" /> },
                    { id: 'Bank Transfer', label: 'Bank Transfer', desc: 'Transfer to our Alfalah/Meezan account', icon: <Landmark className="h-4 w-4" /> }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 border rounded-xl cursor-pointer transition-all flex flex-col justify-between h-24 ${
                        paymentMethod === method.id 
                          ? 'border-brand-red bg-red-500/5 text-brand-red ring-1 ring-brand-red' 
                          : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {method.icon}
                        {paymentMethod === method.id && <div className="h-1.5 w-1.5 bg-brand-red rounded-full"></div>}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{method.label}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod !== 'Cash On Delivery' && (
                  <div className="bg-[#1A1A1A] text-white p-3.5 rounded-2xl space-y-1.5 text-xs font-sans leading-relaxed text-left">
                    <p className="font-bold text-yellow-400">💳 Payment Transfer Details:</p>
                    <p>Bank: <strong>Meezan Bank Limited</strong></p>
                    <p>Title: <strong>Zain Solar Pakistan PVT LTD</strong></p>
                    <p className="font-mono">Account Number: 1234-5678-9012-3456</p>
                    <p className="text-[10px] text-gray-400">Note: After transferring, please share a screenshot of the receipt on WhatsApp support at 0300-1234567.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom confirmation panel */}
            <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Order Total:</span>
                <span className="text-brand-red font-mono text-lg font-extrabold">Rs {finalTotal.toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-red hover:bg-[#CC0000] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing order...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {step === 'success' && placedOrder && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl animate-bounce">
              ✓
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-gray-800">Thank you! Your order has been placed.</h4>
              <p className="text-xs text-brand-red font-bold font-mono">Order Number: {placedOrder.id}</p>
              <p className="text-[11px] text-gray-400 font-mono">Tracking Code: {placedOrder.trackingNumber}</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl w-full text-xs text-gray-600 text-left space-y-1">
              <p>Customer: <strong>{placedOrder.billingInfo.fullName}</strong></p>
              <p>City: <strong>{placedOrder.billingInfo.city}</strong></p>
              <p>Payment Method: <strong>{placedOrder.paymentMethod}</strong></p>
              <p>Total Amount: <strong className="text-brand-red font-mono">Rs {placedOrder.total.toLocaleString()}</strong></p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Our representative will contact you shortly to confirm your order and schedule the delivery.
            </p>

            <button 
              onClick={() => {
                setStep('cart');
                onClose();
              }}
              className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-xs font-bold hover:bg-brand-red transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

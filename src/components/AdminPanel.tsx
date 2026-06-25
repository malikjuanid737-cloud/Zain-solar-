import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Plus, Edit2, Trash2, ShoppingBag, Users, Layers, TrendingUp, CheckCircle, 
  Clock, Package, AlertCircle, RefreshCw, Save, X, Eye, DollarSign
} from 'lucide-react';
import { Product, Order, UserProfile } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function AdminPanel({
  products,
  orders,
  users,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  
  // Product Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    discountPrice: 0,
    category: 'Solar Panels',
    sku: '',
    stockStatus: 'In Stock',
    stockQuantity: 10,
    description: '',
    specifications: {},
    images: ['https://picsum.photos/seed/solarprod/600/600']
  });
  
  // Specs builder state
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  // 1. Calculations & Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const inStockCount = products.filter(p => p.stockStatus === 'In Stock').length;
  const lowStockCount = products.filter(p => p.stockStatus === 'Low Stock').length;

  // Chart 1: Category share
  const categoryShareData = Array.from(
    new Set(products.map(p => p.category))
  ).map(cat => ({
    name: cat,
    value: products.filter(p => p.category === cat).length
  }));

  // Chart 2: Revenue over time mock
  const monthlyRevenueData = [
    { name: 'Jan', sales: totalRevenue * 0.15 },
    { name: 'Feb', sales: totalRevenue * 0.2 },
    { name: 'Mar', sales: totalRevenue * 0.25 },
    { name: 'Apr', sales: totalRevenue * 0.4 },
    { name: 'May', sales: totalRevenue * 0.6 },
    { name: 'Jun', sales: totalRevenue }
  ];

  const COLORS = ['#FF0000', '#1A1A1A', '#334155', '#475569', '#64748B'];

  // Handle product save (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.sku || !prodForm.price) {
      alert('براہ کرم تمام لازمی تفصیلات پُر کریں۔');
      return;
    }

    if (isAddingNew) {
      const newProduct: Product = {
        id: 'js-' + prodForm.sku.toLowerCase(),
        name: prodForm.name,
        price: Number(prodForm.price),
        discountPrice: prodForm.discountPrice ? Number(prodForm.discountPrice) : undefined,
        sku: prodForm.sku,
        stockStatus: Number(prodForm.stockQuantity) > 10 ? 'In Stock' : Number(prodForm.stockQuantity) > 0 ? 'Low Stock' : 'Out of Stock',
        stockQuantity: Number(prodForm.stockQuantity),
        category: prodForm.category || 'Solar Panels',
        description: prodForm.description || '',
        specifications: prodForm.specifications || {},
        images: prodForm.images || ['https://picsum.photos/seed/solarprod/600/600'],
        rating: 5.0,
        reviews: []
      };
      onAddProduct(newProduct);
      setIsAddingNew(false);
    } else if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: prodForm.name,
        price: Number(prodForm.price),
        discountPrice: prodForm.discountPrice ? Number(prodForm.discountPrice) : undefined,
        sku: prodForm.sku || editingProduct.sku,
        stockQuantity: Number(prodForm.stockQuantity),
        stockStatus: Number(prodForm.stockQuantity) > 10 ? 'In Stock' : Number(prodForm.stockQuantity) > 0 ? 'Low Stock' : 'Out of Stock',
        category: prodForm.category || editingProduct.category,
        description: prodForm.description || '',
        specifications: prodForm.specifications || editingProduct.specifications,
        images: prodForm.images || editingProduct.images
      };
      onUpdateProduct(updated);
      setEditingProduct(null);
    }

    // Reset Form
    setProdForm({
      name: '', price: 0, discountPrice: 0, category: 'Solar Panels', sku: '',
      stockStatus: 'In Stock', stockQuantity: 10, description: '', specifications: {},
      images: ['https://picsum.photos/seed/solarprod/600/600']
    });
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setProdForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specVal.trim()
      }
    }));
    setSpecKey('');
    setSpecVal('');
  };

  const handleRemoveSpec = (key: string) => {
    const updated = { ...prodForm.specifications };
    delete updated[key];
    setProdForm(prev => ({ ...prev, specifications: updated }));
  };

  const triggerEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddingNew(false);
    setProdForm({
      name: p.name,
      price: p.price,
      discountPrice: p.discountPrice,
      category: p.category,
      sku: p.sku,
      stockQuantity: p.stockQuantity,
      description: p.description,
      specifications: p.specifications,
      images: p.images
    });
  };

  const triggerAddNew = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setProdForm({
      name: '', price: 0, discountPrice: 0, category: 'Solar Panels', sku: '',
      stockStatus: 'In Stock', stockQuantity: 10, description: '', specifications: {},
      images: ['https://picsum.photos/seed/solarprod/600/600']
    });
  };

  return (
    <div id="admin-management-view" className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-red animate-spin" />
              <span>ایڈمن مینیجر کنٹرول (Zain Solar Admin Portal)</span>
            </h2>
            <p className="text-xs text-gray-400">سولر انوینٹری، فنانس چارٹس، اور آرڈر مینجمنٹ پینل۔</p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'dashboard', label: 'ڈیش بورڈ', icon: <TrendingUp className="h-4 w-4" /> },
              { id: 'products', label: 'مصنوعات (Products)', icon: <Package className="h-4 w-4" /> },
              { id: 'orders', label: 'آرڈرز (Orders)', icon: <ShoppingBag className="h-4 w-4" /> },
              { id: 'users', label: 'صارفین (Users)', icon: <Users className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsAddingNew(false);
                  setEditingProduct(null);
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

        {/* 1. Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Metric widgets grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold">کل فروخت آمدنی</span>
                  <h4 className="text-xl font-extrabold text-[#1A1A1A] font-mono">Rs {totalRevenue.toLocaleString()}</h4>
                </div>
                <div className="p-3 bg-red-500/10 text-brand-red rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold">کل موصولہ آرڈرز</span>
                  <h4 className="text-xl font-extrabold text-[#1A1A1A] font-mono">{orders.length}</h4>
                </div>
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold">بکنگز پینڈنگ</span>
                  <h4 className="text-xl font-extrabold text-[#1A1A1A] font-mono">{pendingOrders}</h4>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                  <Clock className="h-5 w-5" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold">کل رجسٹرڈ صارفین</span>
                  <h4 className="text-xl font-extrabold text-[#1A1A1A] font-mono">{users.length}</h4>
                </div>
                <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
                  <Users className="h-5 w-5" />
                </div>
              </div>

            </div>

            {/* Recharts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly sales trend */}
              <div className="lg:col-span-2 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-950 font-display">ماہانہ سولر فروخت گراف (Revenue Trend)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#FF0000" strokeWidth={3} name="آمدنی (PKR)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category distribution */}
              <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-gray-950 font-display">کیٹیگریز تقسیم (Category Distribution)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. Products Management Tab */}
        {activeTab === 'products' && !isAddingNew && !editingProduct && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-base font-bold text-gray-900 font-display">انوینٹری لسٹ (Solar Products Inventory)</h3>
              <button
                onClick={triggerAddNew}
                className="px-4 py-2 bg-brand-red hover:bg-[#CC0000] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>نیا پروڈکٹ شامل کریں</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-50">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead className="bg-gray-50 text-gray-500 uppercase font-mono border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">تصویر</th>
                    <th className="px-6 py-3">نام</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">کیٹیگری</th>
                    <th className="px-6 py-3">قیمت (PKR)</th>
                    <th className="px-6 py-3">اسٹاک گنجائش</th>
                    <th className="px-6 py-3 text-center">ایکشنز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/55 transition-colors">
                      <td className="px-6 py-3.5">
                        <img 
                          src={p.images[0]} 
                          alt="" 
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-gray-900 line-clamp-2 mt-2 leading-tight max-w-[200px]">{p.name}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-500">{p.sku}</td>
                      <td className="px-6 py-3.5 text-gray-600">{p.category}</td>
                      <td className="px-6 py-3.5 font-mono font-bold text-brand-red">Rs {p.discountPrice?.toLocaleString() || p.price.toLocaleString()}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stockQuantity > 20 
                            ? 'bg-green-100 text-green-700' 
                            : p.stockQuantity > 0 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {p.stockQuantity} Pcs ({p.stockStatus})
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center flex items-center justify-center gap-2">
                        <button 
                          onClick={() => triggerEdit(p)}
                          className="p-1.5 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                          title="ترمیم کریں"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="خارج کریں"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2b. Add / Edit Product Form Screen */}
        {(isAddingNew || editingProduct) && (
          <form onSubmit={handleSaveProduct} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn max-w-3xl mx-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 font-display">
                {isAddingNew ? 'نیا سولر پروڈکٹ درج کریں' : `پروڈکٹ ترمیم کریں: ${editingProduct?.sku}`}
              </h3>
              <button 
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">پروڈکٹ کا نام (Product Name) *</label>
                <input 
                  type="text" required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({...prodForm, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                  placeholder="مثال: Zain Solar 550W Panel"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">پروڈکٹ SKU کوڈ *</label>
                <input 
                  type="text" required
                  value={prodForm.sku}
                  onChange={(e) => setProdForm({...prodForm, sku: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none uppercase font-mono"
                  placeholder="JS-PL-550W"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">اصل ہول سیل قیمت (PKR) *</label>
                <input 
                  type="number" required
                  value={prodForm.price || ''}
                  onChange={(e) => setProdForm({...prodForm, price: Number(e.target.value)})}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none font-mono"
                  placeholder="32000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">خصوصی فروخت ڈسکاؤنٹ قیمت (PKR)</label>
                <input 
                  type="number"
                  value={prodForm.discountPrice || ''}
                  onChange={(e) => setProdForm({...prodForm, discountPrice: Number(e.target.value)})}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none font-mono"
                  placeholder="28500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">کیٹیگری منتخب کریں *</label>
                <select
                  value={prodForm.category}
                  onChange={(e) => setProdForm({...prodForm, category: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none bg-white"
                >
                  <option value="Solar Panels">Solar Panels</option>
                  <option value="Solar Batteries">Solar Batteries</option>
                  <option value="Solar Inverters">Solar Inverters</option>
                  <option value="Solar Accessories">Solar Accessories</option>
                  <option value="Solar Complete Kits">Solar Complete Kits</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">موجود اسٹاک تعداد (Quantity) *</label>
                <input 
                  type="number" required
                  value={prodForm.stockQuantity || ''}
                  onChange={(e) => setProdForm({...prodForm, stockQuantity: Number(e.target.value)})}
                  className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none font-mono"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">پروڈکٹ کی اردو تفصیل (Urdu Description)</label>
              <textarea 
                rows={3}
                value={prodForm.description}
                onChange={(e) => setProdForm({...prodForm, description: e.target.value})}
                className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none text-right"
                placeholder="پروڈکٹ کی کارکردگی اور وارنٹی کے متعلق معلومات یہاں لکھیں۔"
              />
            </div>

            {/* Specifications matrix builder */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">تکنیکی خصوصیات شامل کریں (Specifications Table Builder)</h4>
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="خصوصیت کا عنوان (مثال: Efficiency)"
                  className="flex-1 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
                <input 
                  type="text" 
                  value={specVal}
                  onChange={(e) => setSpecVal(e.target.value)}
                  placeholder="ویلیو (مثال: 21.3%)"
                  className="flex-1 border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none"
                />
                <button 
                  type="button"
                  onClick={handleAddSpec}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-brand-red transition-all cursor-pointer"
                >
                  شامل کریں
                </button>
              </div>

              {/* Current specs table view */}
              {prodForm.specifications && Object.keys(prodForm.specifications).length > 0 && (
                <div className="border border-gray-100 rounded-xl overflow-hidden mt-3 max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-gray-50">
                      {Object.entries(prodForm.specifications).map(([k, v]) => (
                        <tr key={k} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-bold w-1/3 text-gray-700">{k}</td>
                          <td className="px-4 py-2 text-gray-600">{v}</td>
                          <td className="px-4 py-2 text-right">
                            <button 
                              type="button"
                              onClick={() => handleRemoveSpec(k)}
                              className="text-red-500 hover:underline font-bold"
                            >
                              خارج
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-brand-red hover:bg-[#CC0000] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              محفوظ کریں (Save Product)
            </button>
          </form>
        )}

        {/* 3. Orders Management Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-gray-900 font-display">صارفین آرڈرز لسٹ (Customer Orders Management)</h3>
            
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">سسٹم میں فی الحال کوئی آرڈر موجود نہیں ہے۔</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-50">
                <table className="w-full text-xs text-left min-w-[850px]">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-mono border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3">آرڈر ID</th>
                      <th className="px-6 py-3">خریدار</th>
                      <th className="px-6 py-3">شہر</th>
                      <th className="px-6 py-3">طریقہ ادائیگی</th>
                      <th className="px-6 py-3">کل رقم (PKR)</th>
                      <th className="px-6 py-3">تاریخ</th>
                      <th className="px-6 py-3">آرڈر اسٹیٹس</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-gray-800">{order.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div>
                            <p className="font-bold">{order.billingInfo.fullName}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{order.billingInfo.phoneNumber}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{order.billingInfo.city}</td>
                        <td className="px-6 py-4 font-semibold text-gray-600">{order.paymentMethod}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#1A1A1A]">Rs {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                            className={`p-1.5 border rounded-xl font-bold bg-white text-[11px] ${
                              order.status === 'Delivered' 
                                ? 'text-green-600 border-green-200' 
                                : order.status === 'Cancelled' 
                                ? 'text-red-600 border-red-200' 
                                : 'text-blue-600 border-blue-200'
                            }`}
                          >
                            <option value="Pending">منظوری کا انتظار (Pending)</option>
                            <option value="Processing">پروسیسنگ (Processing)</option>
                            <option value="Shipped">روانہ ہو گیا (Shipped)</option>
                            <option value="Delivered">ڈیلیور ہو گیا (Delivered)</option>
                            <option value="Cancelled">منسوخ کر دیا (Cancelled)</option>
                            <option value="Returned">واپس کر دیا (Returned)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. Users Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-gray-900 font-display">رجسٹرڈ صارف ریکارڈ (User Database Accounts)</h3>
            
            <div className="overflow-x-auto rounded-2xl border border-gray-50">
              <table className="w-full text-xs text-left min-w-[650px]">
                <thead className="bg-gray-50 text-gray-500 uppercase font-mono border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">تصویر</th>
                    <th className="px-6 py-3">صارف نام</th>
                    <th className="px-6 py-3">ای میل ایڈریس</th>
                    <th className="px-6 py-3">فون نمبر</th>
                    <th className="px-6 py-3">رول (Privilege Role)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="w-8 h-8 rounded-full bg-brand-red text-white font-bold flex items-center justify-center uppercase overflow-hidden">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span>{u.displayName?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-gray-900">{u.displayName || 'گمنام کسٹمر'}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-500">{u.email || 'N/A'}</td>
                      <td className="px-6 py-3.5 font-mono text-gray-600">{u.phoneNumber || 'N/A'}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.isAdmin ? 'bg-red-100 text-brand-red' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {u.isAdmin ? 'Administrator' : 'Customer'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

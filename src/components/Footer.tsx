import React from 'react';
import { Sun, Phone, Mail, MapPin, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="main-footer" className="bg-[#1A1A1A] text-white pt-16 border-t border-white/10">
      
      {/* Brand Values / Trust Badges Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 bg-brand-red rounded-xl text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">100% Genuine Products</h4>
              <p className="text-xs text-gray-400 mt-1">All solar panels and inverters come with certified manufacturer warranties.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 bg-brand-red rounded-xl text-white">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Secure Nationwide Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">Fast, reliable, and insured shipping across all regions of Pakistan.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 bg-brand-red rounded-xl text-white">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">24/7 Expert Support</h4>
              <p className="text-xs text-gray-400 mt-1">Our expert solar engineers are always ready to help with free consultation.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="p-3 bg-brand-red rounded-xl text-white">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Easy Returns & Refund</h4>
              <p className="text-xs text-gray-400 mt-1">Hassle-free 14-day replacement and return policy if not fully satisfied.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-red rounded-lg">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">Zain<span className="text-brand-red">Solar</span></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Zain Solar is Pakistan's premier solar e-commerce platform, providing top-grade solar panels, deep-cycle batteries, and smart hybrid inverters at wholesale rates.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center text-xs transition-colors">FB</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center text-xs transition-colors">TW</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center text-xs transition-colors">IG</a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center text-xs transition-colors">WA</a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 font-mono">Solar Categories</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => onNavigate('store')} className="hover:text-brand-red transition-colors">Solar Panels</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-brand-red transition-colors">Solar Batteries</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-brand-red transition-colors">Solar Inverters</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-brand-red transition-colors">Complete Kits</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-brand-red transition-colors">Cables & Accessories</button></li>
            </ul>
          </div>

          {/* Pages Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 font-mono">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => onNavigate('store')} className="hover:text-brand-red transition-colors">Home</button></li>
              <li><button onClick={() => {
                const ft = document.getElementById('main-footer');
                ft?.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-brand-red transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('compare')} className="hover:text-brand-red transition-colors">Compare Products</button></li>
              <li><button onClick={() => {
                const ft = document.getElementById('main-footer');
                ft?.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-brand-red transition-colors">FAQs</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-brand-red transition-colors">My Account / Orders</button></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3 text-xs text-gray-400">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-2 font-mono">Contact Us</h4>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-red shrink-0" />
              <span>Office 4B, Gulberg II, Lahore, Pakistan</span>
            </p>
            <p className="flex items-center gap-2 font-mono">
              <Phone className="h-4 w-4 text-brand-red shrink-0" />
              <span>+92 (300) 123-4567</span>
            </p>
            <p className="flex items-center gap-2 font-mono">
              <Mail className="h-4 w-4 text-brand-red shrink-0" />
              <span>support@zainsolar.com.pk</span>
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Legal, Payments & Copyright */}
      <div className="bg-[#121212] py-6 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © 2026 Zain Solar Pakistan. All rights reserved.
          </p>
          
          {/* Payment Methods Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] text-gray-500 font-mono">We accept:</span>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 font-semibold font-mono">JazzCash</span>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 font-semibold font-mono">EasyPaisa</span>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 font-semibold font-mono">COD</span>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 font-semibold font-mono">Bank Transfer</span>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 font-semibold font-mono">Visa / Mastercard</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

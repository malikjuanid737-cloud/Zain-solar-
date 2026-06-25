import React, { useState } from 'react';
import { 
  MessageSquare, Send, Phone, X, Check, HelpCircle, 
  ChevronDown, Search, MessageCircle, AlertCircle
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FAQS } from '../data/products';

interface SupportWidgetProps {
  user: any;
}

export default function SupportWidget({ user }: SupportWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'ticket' | 'faq'>('chat');
  
  // Chat simulator states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: 'Hello! Welcome to Zain Solar Customer Service. How can we help you today?', time: 'now' }
  ]);

  // Callback Ticket states
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ search state
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'now' }]);
    setChatInput('');

    // Generate responsive solar support answer in English
    setTimeout(() => {
      let reply = "Thank you! Your message has been received. Our solar experts will contact you shortly on your provided contact details. For immediate help, feel free to call us.";
      
      const query = userMsg.toLowerCase();
      if (query.includes('panel') || query.includes('solar')) {
        reply = "Zain Solar offers premium 550W Mono-PERC solar panels with a certified 25-year performance warranty.";
      } else if (query.includes('battery') || query.includes('lithium') || query.includes('backup')) {
        reply = "Our Li-Ultra Lithium Iron Phosphate (LiFePO4) 10kWh batteries feature over 6,000 lifecycles and a 10-year warranty.";
      } else if (query.includes('inverter') || query.includes('hybrid')) {
        reply = "We offer smart hybrid 5kW and 10kW inverters complete with Wi-Fi app monitoring and full net-metering approvals.";
      } else if (query.includes('price') || query.includes('rate') || query.includes('cost')) {
        reply = "Our individual solar panels start from PKR 28,500 and lithium batteries from PKR 345,000. Full turnkey smart home packages are listed on the home page.";
      } else if (query.includes('net') || query.includes('export') || query.includes('meter')) {
        reply = "Yes! All our 10kW and other premium hybrid kits include professional filing and support for net-metering approval to sell electricity back to the grid.";
      }

      setChatMessages(prev => [...prev, { sender: 'agent', text: reply, time: 'now' }]);
    }, 1000);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketPhone || !ticketMsg) return;

    setIsSubmitting(true);
    setTicketSuccess('');
    const ticketId = 'JS-TCK-' + Math.floor(100000 + Math.random() * 900000);

    const ticketData = {
      id: ticketId,
      name: ticketName || user?.displayName || 'Anonymous Customer',
      phone: ticketPhone,
      message: ticketMsg,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(collection(db, 'tickets'), ticketId), ticketData);
      setTicketSuccess(`Callback ticket registered successfully! Ticket ID: ${ticketId}`);
      setTicketName('');
      setTicketPhone('');
      setTicketMsg('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tickets/${ticketId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div id="support-widget" className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Messenger bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-brand-red text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer animate-pulse ring-4 ring-brand-red/20"
          title="Zain Solar Customer Support"
        >
          <MessageSquare className="h-6 w-6 stroke-[2.5]" />
        </button>
      )}

      {/* Floating support panel */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white border border-gray-150 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#1A1A1A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
              <div>
                <h4 className="text-xs font-bold font-display">Zain Solar Customer Helpline</h4>
                <p className="text-[10px] text-gray-400">Our solar engineers are online</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Quick tab navigation buttons */}
          <div className="grid grid-cols-3 border-b border-gray-100 text-center text-xs shrink-0">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 font-bold transition-all ${activeTab === 'chat' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Live Chat
            </button>
            <button 
              onClick={() => setActiveTab('ticket')}
              className={`py-2.5 font-bold transition-all ${activeTab === 'ticket' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Callback Ticket
            </button>
            <button 
              onClick={() => setActiveTab('faq')}
              className={`py-2.5 font-bold transition-all ${activeTab === 'faq' ? 'text-brand-red border-b-2 border-brand-red' : 'text-gray-500 hover:text-gray-700'}`}
            >
              FAQs
            </button>
          </div>

          {/* --- TAB 1: Live Chat Simulator --- */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-red text-white rounded-br-none text-right' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm text-left'
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat action input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex gap-2 bg-white shrink-0">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about solar panels, batteries, rates..."
                  className="flex-1 bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red"
                />
                <button 
                  type="submit"
                  className="p-2.5 bg-brand-red text-white rounded-xl hover:bg-[#CC0000] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {/* Direct WhatsApp Call */}
              <div className="px-3 pb-3 shrink-0">
                <a 
                  href="https://wa.me/923001234567?text=Hello%20Zain%20Solar!%20I%20am%20interested%20in%20your%20solar%20power%20solutions." 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Chat directly on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* --- TAB 2: Callback Form --- */}
          {activeTab === 'ticket' && (
            <form onSubmit={handleTicketSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 text-left">
              <h5 className="text-xs font-bold text-gray-700">Request a Free Engineering Callback:</h5>
              
              {ticketSuccess && (
                <p className="text-xs text-green-600 font-bold bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-1">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{ticketSuccess}</span>
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Full Name</label>
                  <input 
                    type="text"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Mobile Phone Number *</label>
                  <input 
                    type="tel" required
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    placeholder="Example: 03001234567"
                    className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Details / Solar Requirements *</label>
                  <textarea 
                    rows={3} required
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    placeholder="E.g., house load (1.5 Ton AC, 5 fans, fridge) and location..."
                    className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#CC0000] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting request...' : 'Submit Callback Request'}
              </button>
            </form>
          )}

          {/* --- TAB 3: Searchable FAQs --- */}
          {activeTab === 'faq' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 text-left">
              {/* Search bar */}
              <div className="p-3 bg-white border-b border-gray-100 shrink-0 relative flex items-center">
                <input 
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search frequently asked questions..."
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-1.5 px-3 text-xs outline-none focus:border-brand-red pr-8"
                />
                <Search className="h-4 w-4 text-gray-400 absolute right-6" />
              </div>

              {/* FAQs accordion scroll area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {filteredFaqs.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-10">No results found.</p>
                ) : (
                  filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full px-4 py-3 flex items-center justify-between gap-4 font-bold text-xs text-gray-800 hover:bg-gray-50 text-left"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 text-brand-red transition-transform shrink-0 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-4 pb-3.5 pt-1 border-t border-gray-50 text-xs text-gray-600 leading-relaxed text-left">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

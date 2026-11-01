import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  Mail,
  MessageSquare,
  HelpCircle,
  Send,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SupportTicket } from '../../types';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'faq' | 'ticket' | 'chat'>('faq');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Ticket Form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'delivery' | 'product_quality' | 'refund' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Live Chat Simulator state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to SUPER MART Customer Care. How can we help you with your supermarket groceries today?',
      time: '10:00 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/support/tickets')
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.data) setTickets(d.data);
        })
        .catch((e) => console.error(e));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How fast is SUPER MART 60-Minute Express Delivery?',
      a: 'Orders in Dhanmondi, Gulshan, Banani, Uttara, and Mirpur are dispatched immediately from local micro-fulfillment hubs using cold-insulated carrier bags to arrive within 60 minutes.'
    },
    {
      q: 'What if a fresh vegetable, fruit or fish does not meet my quality expectations?',
      a: 'We offer a 100% Doorstep Freshness Guarantee. You can inspect all fresh items upon delivery and hand back anything unsatisfactory directly to the rider for an instant refund or replacement.'
    },
    {
      q: 'How does bKash / Nagad / Rocket payment verification work?',
      a: 'You can pay directly through your bKash or Nagad mobile app to our official merchant account (01899-SUPERMART) and enter your Transaction ID (TrxID) during checkout for automated real-time verification.'
    },
    {
      q: 'What is the minimum order for FREE Delivery?',
      a: 'All orders of ৳1,500 and above qualify for completely FREE doorstep delivery across all serviced zones in Bangladesh.'
    }
  ];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setTicketSuccess('');

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'cust-1',
          userName: user?.name || 'Customer',
          userPhone: user?.phone || '01711223344',
          subject,
          category,
          message
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTickets((prev) => [data.data, ...prev]);
        setTicketSuccess(`Support Ticket #${data.data.ticketNumber} created successfully! Our representative will call you shortly.`);
        setSubject('');
        setMessage('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');

    // Simulate smart support reply
    setTimeout(() => {
      let botResponse = 'Thank you for your message! Our hub manager has received your query and is looking into your account.';
      const lower = userText.toLowerCase();
      if (lower.includes('deliver') || lower.includes('late') || lower.includes('rider')) {
        botResponse = 'Our dispatch system confirms your order is on the fastest delivery route. You can view the live rider timeline in the "Track Order" button!';
      } else if (lower.includes('coupon') || lower.includes('discount')) {
        botResponse = 'You can use active coupon codes SUPER100 for ৳100 flat discount or RAMADAN20 for 15% off during checkout!';
      } else if (lower.includes('hilsa') || lower.includes('fish') || lower.includes('meat')) {
        botResponse = 'All our fish and meats are freshly received each morning and 100% Halal certified with cold-chain storage.';
      }
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="bg-[#0B6623] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">SUPER MART Help &amp; Support</h2>
              <p className="text-xs text-emerald-200">24/7 Dedicated Supermarket Customer Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Support Hotline Banner */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-emerald-50 border-b border-emerald-100 text-xs">
          <a
            href="tel:16999"
            className="flex items-center justify-center gap-2 p-2 bg-white rounded-xl border border-emerald-200 text-[#0B6623] font-bold hover:bg-emerald-100 transition"
          >
            <PhoneCall className="w-4 h-4 text-orange-500" />
            <span>Hotline: 16999</span>
          </a>
          <a
            href="mailto:support@supermart.bd"
            className="flex items-center justify-center gap-2 p-2 bg-white rounded-xl border border-emerald-200 text-[#0B6623] font-bold hover:bg-emerald-100 transition"
          >
            <Mail className="w-4 h-4 text-orange-500" />
            <span>support@supermart.bd</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'faq' ? 'border-[#0B6623] text-[#0B6623] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'chat' ? 'border-[#0B6623] text-[#0B6623] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Help Desk</span>
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'ticket' ? 'border-[#0B6623] text-[#0B6623] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Submit Ticket ({tickets.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[55vh] overflow-y-auto">
          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <h4 className="text-xs font-bold text-gray-900">{f.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-80 justify-between">
              <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                        m.sender === 'user'
                          ? 'bg-[#0B6623] text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`text-[9px] block mt-1 ${
                          m.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question about delivery, orders..."
                  className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                />
                <button
                  type="submit"
                  className="bg-[#0B6623] hover:bg-emerald-800 text-white p-2.5 rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TICKET TAB */}
          {activeTab === 'ticket' && (
            <div className="space-y-4">
              {ticketSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200">
                  {ticketSuccess}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                  >
                    <option value="delivery">Delivery &amp; Delay Inquiry</option>
                    <option value="product_quality">Freshness &amp; Product Quality</option>
                    <option value="refund">Refund or Payment Discrepancy</option>
                    <option value="general">General Supermarket Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question about order SM-2026-8801"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Message Details</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please explain the issue or question..."
                    rows={3}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#0B6623] hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

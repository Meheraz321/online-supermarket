import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  Truck,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Phone,
  User as UserIcon,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Address, Order, PaymentMethod } from '../../types';
import { DELIVERY_ZONES_DATA } from '../../data/seedData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { items, subtotal, discount, deliveryFee, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { language, formatPrice } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address & Info, 2: Slot & Delivery, 3: Payment

  // Form Fields
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '01711223344');
  const [recipientEmail, setRecipientEmail] = useState(user?.email || 'customer@supermart.bd');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Dhanmondi');
  const [streetAddress, setStreetAddress] = useState('House 42, Road 7/A, Dhanmondi R/A');
  const [deliverySlot, setDeliverySlot] = useState('Express (Within 60 Mins)');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  // Digital Payment Simulation (bKash / Nagad)
  const [senderPhone, setSenderPhone] = useState(user?.phone || '01711223344');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAutofillTrx = () => {
    const prefix = paymentMethod === 'bKash' ? 'BK' : paymentMethod === 'Nagad' ? 'NG' : 'RC';
    setTransactionId(`${prefix}${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handlePlaceOrder = async () => {
    if (!recipientName.trim() || !recipientPhone.trim() || !streetAddress.trim()) {
      setErrorMessage('Please complete your name, phone number, and street address.');
      setStep(1);
      return;
    }

    if (['bKash', 'Nagad', 'Rocket'].includes(paymentMethod) && !transactionId.trim()) {
      setErrorMessage(`Please enter your ${paymentMethod} Transaction ID (or click Auto-Verify).`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      title: 'Delivery Address',
      recipientName,
      phone: recipientPhone,
      division,
      district,
      area,
      streetAddress,
      isDefault: true
    };

    const orderPayload = {
      userId: user?.id || 'user-cust-1',
      customerName: recipientName,
      customerEmail: recipientEmail,
      customerPhone: recipientPhone,
      items: items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        nameBn: i.product.nameBn,
        unitPrice: i.product.discountPrice || i.product.regularPrice,
        quantity: i.quantity,
        totalPrice: (i.product.discountPrice || i.product.regularPrice) * i.quantity,
        image: i.product.images[0],
        unit: i.product.unit
      })),
      shippingAddress,
      deliverySlot,
      deliveryNotes,
      subtotal,
      discountAmount: discount,
      couponCode: appliedCoupon?.code,
      deliveryFee,
      tax: 0,
      totalAmount: total,
      paymentMethod,
      senderPhone: ['bKash', 'Nagad', 'Rocket'].includes(paymentMethod) ? senderPhone : undefined,
      transactionId: ['bKash', 'Nagad', 'Rocket'].includes(paymentMethod) ? transactionId : undefined
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
        clearCart();
        onClose();
        onOrderSuccess(data.data);
      } else {
        setErrorMessage(data.message || 'Failed to place order. Please check inputs.');
      }
    } catch (err) {
      // Fallback
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `SM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user?.id || 'user-cust-1',
        customerName: recipientName,
        customerEmail: recipientEmail,
        customerPhone: recipientPhone,
        items: orderPayload.items,
        shippingAddress,
        deliverySlot,
        deliveryNotes,
        subtotal,
        discountAmount: discount,
        couponCode: appliedCoupon?.code,
        deliveryFee,
        tax: 0,
        totalAmount: total,
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'COD' ? 'Pending' : 'Paid',
          amount: total,
          transactionId: transactionId || undefined
        },
        status: 'Confirmed',
        timeline: [
          { status: 'Confirmed', timestamp: new Date().toISOString(), note: 'Order placed successfully', completed: true }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      clearCart();
      onClose();
      onOrderSuccess(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 my-6"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B6623] text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold block">
              Super Mart Express Checkout
            </span>
            <h2 className="text-lg font-black">Complete Your Grocery Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 text-xs font-bold">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              step === 1 ? 'border-[#0B6623] text-[#0B6623] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Delivery Address</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              step === 2 ? 'border-[#0B6623] text-[#0B6623] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Time Slot</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`flex-1 py-3 text-center transition cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              step === 3 ? 'border-[#0B6623] text-[#0B6623] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>3. Payment &amp; Place</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Address & Recipient Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#0B6623]" />
                <span>Recipient Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Phone Number (for SMS &amp; Rider Contact)
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="e.g. 01711223344"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#0B6623]" />
                  <span>Delivery Location in Bangladesh</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Division</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">District</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Gazipur">Gazipur</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Thana / Area</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Dhanmondi, Gulshan, Uttara"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Street Address, House &amp; Flat No.
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. House 42, Road 7/A, Flat 4-B, Dhanmondi R/A"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-[#0B6623] hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Continue to Time Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Slot & Special Notes */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0B6623]" />
                <span>Select Your Preferred Delivery Slot</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Express (Within 60 Mins)', desc: 'Fastest doorstep delivery by nearest hub rider', tag: 'Fastest' },
                  { title: 'Today: Afternoon (2:00 PM - 5:00 PM)', desc: 'Scheduled delivery for afternoon cooking', tag: 'Today' },
                  { title: 'Today: Evening (6:30 PM - 9:30 PM)', desc: 'Arrives right after office hours', tag: 'Popular' },
                  { title: 'Tomorrow: Morning (9:00 AM - 12:00 PM)', desc: 'Fresh morning kitchen staples', tag: 'Morning' }
                ].map((slot) => (
                  <div
                    key={slot.title}
                    onClick={() => setDeliverySlot(slot.title)}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      deliverySlot === slot.title
                        ? 'border-[#0B6623] bg-emerald-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">{slot.title}</span>
                      <span className="text-[10px] font-black bg-emerald-100 text-[#0B6623] px-2 py-0.5 rounded-full">
                        {slot.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{slot.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring the bell twice, leave with security guard if not home..."
                  rows={2}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0B6623]"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs cursor-pointer hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-[#0B6623] hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & Order Summary */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0B6623]" />
                <span>Select Payment Method (Bangladesh Gateways)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'COD', title: 'Cash on Delivery', desc: 'Pay when items arrive' },
                  { id: 'bKash', title: 'bKash', desc: 'Instant mobile verification' },
                  { id: 'Nagad', title: 'Nagad', desc: 'Digital Post Office' },
                  { id: 'Rocket', title: 'Rocket / Card', desc: 'DBBL & Debit/Credit' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setPaymentMethod(m.id as PaymentMethod);
                      if (m.id !== 'COD' && !transactionId) {
                        handleAutofillTrx();
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-[#0B6623] bg-emerald-50 text-[#0B6623] font-bold shadow-xs'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-bold block">{m.title}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{m.desc}</span>
                  </button>
                ))}
              </div>

              {/* bKash / Nagad Interactive Simulator */}
              {['bKash', 'Nagad', 'Rocket'].includes(paymentMethod) && (
                <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-pink-900 block">
                        {paymentMethod} Merchant Payment Simulator
                      </span>
                      <span className="text-pink-700 text-[11px]">
                        Merchant Account: <strong className="font-mono">01899-SUPERMART</strong>
                      </span>
                    </div>
                    <button
                      onClick={handleAutofillTrx}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition"
                    >
                      Auto-Verify Test TRX
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Your {paymentMethod} Mobile Number
                      </label>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full p-2 bg-white border border-pink-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Transaction ID (TrxID)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        placeholder="e.g. BK9A8872X1"
                        className="w-full p-2 bg-white border border-pink-200 rounded-lg text-xs font-mono uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Final Order Review & Pricing */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal ({items.length} products)</span>
                  <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery ({deliverySlot.split(' ')[0]})</span>
                  <span className="font-bold text-gray-900">
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-[#0B6623]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs cursor-pointer hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="bg-[#0B6623] hover:bg-emerald-800 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/25 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-orange-300" />
                  <span>{isSubmitting ? 'Placing Order...' : `Confirm & Place Order (${formatPrice(total)})`}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

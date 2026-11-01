import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface OrderTrackingModalProps {
  isOpen: boolean;
  initialOrder: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, initialOrder, onClose }) => {
  const { formatPrice } = useLanguage();
  const [searchInput, setSearchInput] = useState(initialOrder?.orderNumber || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (initialOrder) {
      setCurrentOrder(initialOrder);
      setSearchInput(initialOrder.orderNumber);
    }
  }, [initialOrder, isOpen]);

  if (!isOpen) return null;

  const statusSteps: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Packed',
    'Out for Delivery',
    'Delivered'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchInput.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentOrder(data.data);
      } else {
        setErrorMsg('No order found with this tracking ID. Please verify your order number.');
      }
    } catch (err) {
      setErrorMsg('Failed to query order tracking.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStatus = (step: OrderStatus) => {
    if (!currentOrder) return 'upcoming';
    const currentIndex = statusSteps.indexOf(currentOrder.status);
    const stepIndex = statusSteps.indexOf(step);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
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
        <div className="px-6 py-4 bg-[#0B6623] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-400" />
            <div>
              <h2 className="text-base font-black">Live Order Tracking</h2>
              <p className="text-[11px] text-emerald-200">Real-time status of your supermarket grocery dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tracking Query Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. SM-2026-8801)"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-[#0B6623]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0B6623] hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {currentOrder && (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Tracking Order</span>
                  <h3 className="font-mono font-bold text-gray-900 text-sm">{currentOrder.orderNumber}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currentOrder.items.length} items &bull; Total {formatPrice(currentOrder.totalAmount)} ({currentOrder.payment.method})
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-[#0B6623] font-bold text-xs rounded-full">
                    {currentOrder.status}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">Slot: {currentOrder.deliverySlot}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4 px-2">
                {statusSteps.map((step, idx) => {
                  const state = getStepStatus(step);
                  const isCompleted = state === 'completed';
                  const isCurrent = state === 'current';

                  return (
                    <div key={step} className="flex items-start gap-4 relative">
                      {/* Connecting Line */}
                      {idx < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] transition-colors ${
                            isCompleted ? 'bg-[#0B6623]' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                          isCompleted
                            ? 'bg-[#0B6623] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-orange-500 text-white shadow-md animate-pulse'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-orange-600 font-extrabold'
                                : isCompleted
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {step}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {step === 'Pending' && 'Customer order received and logged in system.'}
                          {step === 'Confirmed' && 'Payment and order verified by Super Mart.'}
                          {step === 'Processing' && 'Picking fresh groceries from Dhanmondi hub.'}
                          {step === 'Packed' && 'Sealed in sanitized supermarket reusable bags.'}
                          {step === 'Out for Delivery' && 'Rider is on the road heading to destination.'}
                          {step === 'Delivered' && 'Order successfully delivered to customer.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rider Contact Card */}
              {currentOrder.assignedDeliveryAgentName && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0B6623] text-white flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800">Assigned Delivery Rider</span>
                      <h4 className="font-bold text-gray-900 text-xs">{currentOrder.assignedDeliveryAgentName}</h4>
                      <p className="text-[11px] text-gray-500">{currentOrder.assignedDeliveryAgentPhone}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${currentOrder.assignedDeliveryAgentPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B6623] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Rider</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

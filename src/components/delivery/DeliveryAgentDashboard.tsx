import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Order, OrderStatus } from '../../types';

interface DeliveryAgentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
}

export const DeliveryAgentDashboard: React.FC<DeliveryAgentDashboardProps> = ({
  isOpen,
  onClose,
  onViewInvoice
}) => {
  const { formatPrice } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRiderOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        // Show active dispatches or all
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRiderOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeDeliveries = orders.filter((o) =>
    ['Confirmed', 'Processing', 'Packed', 'Out for Delivery'].includes(o.status)
  );

  const completedDeliveries = orders.filter((o) => o.status === 'Delivered');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="bg-orange-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black">Rider Dispatch Portal</h2>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Rider #104 (Sojib)
                </span>
              </div>
              <p className="text-xs text-orange-100">Super Mart Rapid Fulfillment - Hub 01</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rider Quick KPI */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-orange-50/70 border-b border-orange-100 text-center text-xs">
          <div className="p-2 bg-white rounded-xl border border-orange-200/60">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Assigned</span>
            <span className="text-base font-black text-orange-900">{activeDeliveries.length}</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-orange-200/60">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Completed</span>
            <span className="text-base font-black text-[#0B6623]">{completedDeliveries.length}</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-orange-200/60">
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Shift Status</span>
            <span className="text-base font-black text-emerald-700">On Duty 🟢</span>
          </div>
        </div>

        {/* Assigned Orders List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Active Deliveries ({activeDeliveries.length})
          </h3>

          {activeDeliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              All assigned orders have been completed. Great job!
            </div>
          ) : (
            activeDeliveries.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border-2 border-orange-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-900 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      ⚡ {ord.deliverySlot}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 bg-orange-100 text-orange-800 text-xs font-black rounded-lg">
                    {ord.status}
                  </span>
                </div>

                {/* Customer & Address Details */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{ord.customerName}</span>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="inline-flex items-center gap-1 text-[#0B6623] font-bold hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{ord.customerPhone}</span>
                    </a>
                  </div>
                  <div className="flex items-start gap-1.5 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span>
                      {ord.shippingAddress.streetAddress}, {ord.shippingAddress.area}
                    </span>
                  </div>
                  {ord.deliveryNotes && (
                    <p className="text-[11px] text-amber-800 italic bg-amber-50 p-1.5 rounded">
                      Note: "{ord.deliveryNotes}"
                    </p>
                  )}
                </div>

                {/* Payment Info */}
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Payment Collection:</span>
                    <span className="font-black text-gray-900">
                      {ord.payment.method === 'COD' ? (
                        <span className="text-red-700 font-bold">
                          Collect {formatPrice(ord.totalAmount)} Cash
                        </span>
                      ) : (
                        <span className="text-[#0B6623] font-bold">
                          Already Paid ({ord.payment.method})
                        </span>
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => onViewInvoice(ord)}
                    className="text-xs text-gray-500 hover:text-black font-semibold underline cursor-pointer"
                  >
                    View Receipt
                  </button>
                </div>

                {/* Status Advancement Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  {ord.status !== 'Out for Delivery' ? (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Out for Delivery')}
                      className="col-span-2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Start Ride (Out for Delivery)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                      className="col-span-2 py-2.5 bg-[#0B6623] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm Delivered &amp; Cash Collected</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

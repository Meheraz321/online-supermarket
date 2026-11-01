import React from 'react';
import { X, Printer, CheckCircle, Truck, ShoppingBag, Download, ArrowRight } from 'lucide-react';
import { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose, onTrackOrder }) => {
  const { formatPrice } = useLanguage();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
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
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#0B6623]" />
            <span className="font-bold text-gray-900 text-xs sm:text-sm">
              Order Placed Successfully! (Invoice #{order.orderNumber})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B6623] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Supermarket Invoice Area */}
        <div id="printable-invoice" className="p-6 sm:p-8 text-gray-800 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xl sm:text-2xl font-black text-[#0B6623]">SUPER</span>
                <span className="text-xl sm:text-2xl font-black text-orange-500">MART</span>
              </div>
              <p className="text-xs text-gray-500">Online Supermarket &amp; Hypermarket Ltd.</p>
              <p className="text-[11px] text-gray-400">BIN / VAT Reg No: 002918847-0102</p>
              <p className="text-[11px] text-gray-400">Fulfillment Hub: Dhanmondi, Dhaka-1205</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-[#0B6623] border border-emerald-200 rounded-lg text-xs font-bold mb-1">
                {order.payment.status === 'Paid' ? 'PAID INVOICE' : 'CASH ON DELIVERY'}
              </span>
              <p className="text-xs font-mono font-bold text-gray-900">Order: {order.orderNumber}</p>
              <p className="text-[11px] text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Customer & Delivery Slot Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Billed To &amp; Delivery Address:
              </span>
              <p className="font-bold text-gray-900">{order.customerName}</p>
              <p className="text-gray-600">{order.customerPhone}</p>
              <p className="text-gray-600">{order.shippingAddress.streetAddress}</p>
              <p className="text-gray-600">
                {order.shippingAddress.area}, {order.shippingAddress.district}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Dispatch Details:
              </span>
              <p className="font-semibold text-emerald-800">Slot: {order.deliverySlot}</p>
              <p className="text-gray-600">Method: {order.payment.method}</p>
              {order.payment.transactionId && (
                <p className="text-gray-600 font-mono text-[10px]">
                  TRX: {order.payment.transactionId}
                </p>
              )}
              {order.assignedDeliveryAgentName && (
                <p className="text-gray-600 text-[11px]">Rider: {order.assignedDeliveryAgentName}</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Unit</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2.5 font-medium text-gray-900 pr-2">
                      {item.productName}
                    </td>
                    <td className="py-2.5 text-center text-gray-500">{item.unit}</td>
                    <td className="py-2.5 text-center font-bold text-gray-800">{item.quantity}</td>
                    <td className="py-2.5 text-right text-gray-600">{formatPrice(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-bold text-gray-900">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-gray-200 pt-3 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({order.couponCode || 'Promo'})</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (Included)</span>
                <span>৳0.00</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-[#0B6623]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Supermarket Barcode & Stamp */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
            <div>
              <p className="font-mono text-gray-600 tracking-widest uppercase">
                ||| | ||||| |||| || |||||| | ||| |||
              </p>
              <p>Thank you for shopping at SUPER MART!</p>
            </div>
            <div className="text-right">
              <p>Helpline: 16999 &bull; info@supermart.bd</p>
              <p>Keep this receipt for returns &amp; exchanges.</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between no-print">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0B6623] hover:underline cursor-pointer"
          >
            <Truck className="w-4 h-4 text-orange-500" />
            <span>Track Order Timeline &rarr;</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

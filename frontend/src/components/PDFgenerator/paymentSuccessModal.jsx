// Create a new component: src/components/PaymentSuccessModal.jsx
import React, { useEffect } from 'react';
import { CheckCircle, Download, X } from 'lucide-react';
import { downloadReceipt, openReceiptInNewTab } from './generateReceiptPDF';


const PaymentSuccessModal = ({ isOpen, onClose, paymentData, plan, userData }) => {
  useEffect(() => {
    // Disable scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleDownloadReceipt = () => {
    downloadReceipt(paymentData, plan, userData);
  };
  
  const handleViewReceipt = () => {
    openReceiptInNewTab(paymentData, plan, userData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
        >
          <X size={20} />
        </button>
        
        {/* Success icon */}
        <div className="flex justify-center pt-10 pb-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Payment Successful!
          </h2>
          <p className="text-gray-300 mb-6">
            Your subscription to the {plan.name} plan has been activated successfully.
          </p>
          
          {/* Payment details */}
          <div className="bg-white/10 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Payment ID:</span>
              <span className="text-white font-medium">{paymentData.razorpay_payment_id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Amount Paid:</span>
              <span className="text-white font-medium">{plan.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white font-medium">{plan.name}</span>
            </div>
          </div>
          
          {/* Receipt buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={18} />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={handleViewReceipt}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              View Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
// First, install the required packages:
// npm install jspdf jspdf-autotable date-fns

// Create a new utility file: src/utils/receiptGenerator.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Generates a PDF receipt for subscription payments
 * @param {Object} paymentData - Data from the Razorpay payment response
 * @param {Object} plan - Subscription plan details
 * @param {Object} userData - User information
 */
export const generateReceiptPDF = (paymentData, plan, userData = {}) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  const receiptNumber = `RCPT-${paymentData.razorpay_payment_id.substring(0, 8)}`;
  
  // Add company logo (optional)
  // doc.addImage(logoBase64, 'PNG', 15, 10, 50, 20);
  
  // Add company info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // Dark blue
  doc.text('AlgoSpace', 15, 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Gray
  doc.text('Your Career Partner', 15, 32);
  doc.text('support@algospace.com', 15, 38);
  doc.text('www.algospace.com', 15, 44);
  
  // Add receipt title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80); // Dark blue
  doc.text('PAYMENT RECEIPT', 105, 38, { align: 'center' });
  
  // Add receipt details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100); // Gray
  
  doc.text(`Receipt #: ${receiptNumber}`, 150, 20, { align: 'right' });
  doc.text(`Date: ${currentDate}`, 150, 26, { align: 'right' });
  doc.text(`Payment ID: ${paymentData.razorpay_payment_id}`, 150, 32, { align: 'right' });
  doc.text(`Order ID: ${paymentData.razorpay_order_id}`, 150, 38, { align: 'right' });
  
  // Add customer info section
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.rect(15, 55, 180, 25, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text('Customer Information', 20, 63);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${userData.name || 'N/A'}`, 20, 70);
  doc.text(`Email: ${userData.email || 'N/A'}`, 90, 70);
  doc.text(`Customer ID: ${userData.id || 'N/A'}`, 20, 76);
  
  // Add subscription details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Subscription Details', 15, 95);
  
  // Create table
  const tableColumn = ['Plan', 'Description', 'Price', 'Duration', 'Start Date'];
  const tableRows = [
    [
      plan.name, 
      plan.description, 
      plan.price, 
      '1 Month', 
      format(new Date(), 'dd/MM/yyyy')
    ]
  ];
  
  autoTable(doc,{
    head: [tableColumn],
    body: tableRows,
    startY: 100,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      halign: 'left'
    },
    headStyles: {
      fillColor: [66, 135, 245],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 }
    }
  });
  
  // Add payment summary
  const paymentY = doc.lastAutoTable.finalY + 20;
  
  doc.setFillColor(245, 245, 245);
  doc.rect(110, paymentY, 85, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text('Payment Summary', 115, paymentY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Subtotal:', 115, paymentY + 18);
  doc.text('Tax (18% GST):', 115, paymentY + 26);
  doc.text('Total Paid:', 115, paymentY + 34);
  
  // Calculate values - For proper implementation, use actual tax calculations
  const subtotal = parseFloat(plan.priceInPaisa / 100);
  const taxAmount = parseFloat((subtotal * 0.18).toFixed(2));
  const total = subtotal; // In this example, the price already includes tax
  
  doc.setFont('helvetica', 'normal');
  doc.text(`₹ ${subtotal.toFixed(2)}`, 180, paymentY + 18, { align: 'right' });
  doc.text(`₹ ${taxAmount.toFixed(2)} (Included)`, 180, paymentY + 26, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`₹ ${total.toFixed(2)}`, 180, paymentY + 34, { align: 'right' });
  
  // Add thank you note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for subscribing to AlgoSpace!', 105, paymentY + 55, { align: 'center' });
  doc.text('For any inquiries, please contact our support team.', 105, paymentY + 62, { align: 'center' });
  
  // Add footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('This is a computer-generated receipt and does not require a signature.', 105, 280, { align: 'center' });
  
  // Return the PDF document
  return doc;
};

// Function to download the PDF receipt
export const downloadReceipt = (paymentData, plan, userData = {}) => {
  const doc = generateReceiptPDF(paymentData, plan, userData);
  
  // Generate filename
  const filename = `AlgoSpace_Receipt_${paymentData.razorpay_payment_id.substring(0, 8)}.pdf`;
  
  // Download the PDF
  doc.save(filename);
  
  return filename;
};

// Function to open the PDF in a new tab
export const openReceiptInNewTab = (paymentData, plan, userData = {}) => {
  const doc = generateReceiptPDF(paymentData, plan, userData);
  
  // Open in new tab
  window.open(URL.createObjectURL(doc.output('blob')), '_blank');
};
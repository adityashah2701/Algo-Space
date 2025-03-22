import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Generates a clean, professional black and white PDF receipt
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
  
  // Define monochrome colors
  const black = [0, 0, 0];
  const darkGray = [50, 50, 50];
  const mediumGray = [100, 100, 100];
  const lightGray = [200, 200, 200];
  const veryLightGray = [240, 240, 240];
  
  // Add company logo (using styled text as logo placeholder)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...black);
  doc.text('AlgoSpace', 15, 30);
  
  // Add a styled underline for the logo
  doc.setDrawColor(...darkGray);
  doc.setLineWidth(0.5);
  doc.line(15, 32, 75, 32);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mediumGray);
  doc.text('Your Career Partner', 15, 38);
  doc.text('support@algospace.com', 15, 44);
  doc.text('www.algospace.com', 15, 50);
  
  // Add receipt header
  doc.setFillColor(...veryLightGray);
  doc.rect(105, 20, 90, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...black);
  doc.text('PAYMENT RECEIPT', 105, 68, { align: 'center' });
  
  // Add receipt details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  
  const receiptDetailX = 185;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt #:', 110, 30);
  doc.text('Date:', 110, 38);
  doc.text('Payment ID:', 110, 46);
  doc.text('Order ID:', 110, 54);
  
  doc.setFont('helvetica', 'normal');
  doc.text(receiptNumber, receiptDetailX, 30, { align: 'right' });
  doc.text(currentDate, receiptDetailX, 38, { align: 'right' });
  doc.text(paymentData.razorpay_payment_id, receiptDetailX, 46, { align: 'right' });
  doc.text(paymentData.razorpay_order_id, receiptDetailX, 54, { align: 'right' });
  
  // Add divider
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(15, 75, 195, 75);
  
  // Add customer info section with styled header
  doc.setFillColor(20, 20, 20);
  doc.rect(15, 85, 180, 6, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('  CUSTOMER INFORMATION', 15, 90);
  
  doc.setFillColor(...veryLightGray);
  doc.rect(15, 91, 180, 25, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  
  doc.text('Name:', 25, 103);
  doc.text('Email:', 25, 111);
  
  doc.text('Customer ID:', 110, 103);
  
  doc.setFont('helvetica', 'normal');
  doc.text(userData.name || 'N/A', 60, 103);
  doc.text(userData.email || 'N/A', 60, 111);
  doc.text(userData.id || 'N/A', 145, 103);
  
  // Add subscription details section with styled header
  doc.setFillColor(20, 20, 20);
  doc.rect(15, 125, 180, 6, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('  SUBSCRIPTION DETAILS', 15, 130);
  
  // Create table with clean styling
  autoTable(doc, {
    startY: 135,
    head: [['Plan', 'Description', 'Price', 'Duration', 'Start Date']],
    body: [
      [
        plan.name, 
        plan.description, 
        plan.price, 
        '1 Month', 
        currentDate
      ]
    ],
    theme: 'grid',
    styles: { 
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 6,
      overflow: 'linebreak',
      lineColor: [...lightGray],
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [...veryLightGray]
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center' }
    }
  });
  
  // Add payment summary with clean styling
  const paymentY = doc.lastAutoTable.finalY + 25;
  
  doc.setFillColor(...veryLightGray);
  doc.rect(110, paymentY, 85, 60, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...black);
  doc.text('Payment Summary', 152.5, paymentY + 15, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(...mediumGray);
  doc.line(120, paymentY + 20, 185, paymentY + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  
  doc.text('Subtotal:', 120, paymentY + 32);
  doc.text('Tax (18% GST):', 120, paymentY + 42);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(...mediumGray);
  doc.line(120, paymentY + 48, 185, paymentY + 48);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Total Paid:', 120, paymentY + 58);
  
  // Calculate values
  const subtotal = parseFloat(plan.priceInPaisa / 100);
  const taxAmount = parseFloat((subtotal * 0.18).toFixed(2));
  const total = subtotal; // In this example, the price already includes tax
  
  doc.setFont('helvetica', 'normal');
  doc.text(`₹ ${subtotal.toFixed(2)}`, 185, paymentY + 32, { align: 'right' });
  doc.text(`₹ ${taxAmount.toFixed(2)} (Included)`, 185, paymentY + 42, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...black);
  doc.setFontSize(12);
  doc.text(`₹ ${total.toFixed(2)}`, 185, paymentY + 58, { align: 'right' });
  
  // Add thank you note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...mediumGray);
  doc.text('Thank you for subscribing to AlgoSpace!', 105, paymentY + 80, { align: 'center' });
  doc.text('For any inquiries, please contact our support team.', 105, paymentY + 88, { align: 'center' });
  
  // Add footer with a subtle design
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(15, 275, 195, 275);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mediumGray);
  doc.text('This is a computer-generated receipt and does not require a signature.', 105, 280, { align: 'center' });
  doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, 105, 285, { align: 'center' });
  
  // Add company stamp placeholder (optional)
  // doc.setFillColor(...veryLightGray);
  // doc.circle(40, paymentY + 30, 20, 'F');
  // doc.setFont('helvetica', 'bold');
  // doc.setFontSize(8);
  // doc.setTextColor(...mediumGray);
  // doc.text('Company Stamp', 40, paymentY + 60, { align: 'center' });
  
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
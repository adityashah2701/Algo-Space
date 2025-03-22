import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with your key credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plans data (can be moved to a config file or database)
const plans = {
  basic: {
    name: 'Basic',
    amount: 19900, // Amount in paisa (₹199)
    currency: 'INR'
  },
  premium: {
    name: 'Premium',
    amount: 49900, // Amount in paisa (₹499)
    currency: 'INR'
  },
  enterprise: {
    name: 'Enterprise',
    amount: 99900, // Amount in paisa (₹999)
    currency: 'INR'
  }
};

// Create payment order
export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!plans[planId]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    const plan = plans[planId];
    
    // Create order
    const options = {
      amount: plan.amount,
      currency: plan.currency,
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        planId: planId,
        planName: plan.name
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    return res.status(200).json({
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating payment order', error: error.message });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    // Compare signatures
    if (expectedSignature === razorpay_signature) {
      // Payment successful, update your database here
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};


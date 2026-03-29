const express = require('express');
const {
    checkout,
    getOrder,
    getOrders,
    paymentCallback,
    vnpayCallback,
    vnpayIPN,
    getStrategies
} = require('../controllers/checkoutController');

const router = express.Router();

// Checkout - Initiate payment and generate QR code
router.post('/checkout', checkout);

// Get available strategies
router.get('/checkout/strategies', getStrategies);

// Get specific order
router.get('/orders/:orderId', getOrder);

// Get all orders
router.get('/orders', getOrders);

// Payment callback handler
router.post('/payment-callback', paymentCallback);

// VNPay callback (return from payment gateway)
router.get('/vnpay-callback', vnpayCallback);

// VNPay IPN (instant payment notification)
router.get('/vnpay-ipn', vnpayIPN);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'checkout' });
});

module.exports = router;

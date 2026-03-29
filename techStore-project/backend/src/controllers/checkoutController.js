const crypto = require('crypto');
const paymentConfig = require('../config/payment-config');

const mockOrders = [];

const encodeVnpValue = (value) => encodeURIComponent(String(value)).replace(/%20/g, '+');

/**
 * Generate Momo QR Code for payment
 */
const generateMomoQR = async (orderId, amount, orderInfo = 'Thanh toán tại TechStore') => {
    try {
        // Use environment variables or config defaults
        const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
        const accessKey = process.env.MOMO_ACCESS_KEY || 'F8635FE50F2829C0';
        const secretKey = process.env.MOMO_SECRET_KEY || 'bJiLvbQ54PH28XnSxpAqReOHUw6KP1nV';
        const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
        const redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/products';
        const ipnUrl = process.env.MOMO_IPN_URL || 'http://localhost:5000/api/payment-callback';
        
        const requestId = orderId;
        // Momo signature must include these parameters in alphabetical order
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
        const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
        
        console.log('[Momo] Amount:', amount, 'Type:', typeof amount);
        console.log('[Momo] RawSignature:', rawSignature);
        console.log('[Momo] Generated signature:', signature);

        const requestBody = {
            partnerCode: partnerCode,
            partnerName: 'TechStore',
            storeId: 'TechStore001',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: 'vi',
            requestType: 'captureWallet',
            autoCapture: true,
            extraData: '',
            signature: signature
        };

        console.log('[Momo] Creating payment for order:', orderId, 'amount:', amount);
        console.log('[Momo] Request body:', requestBody);
        console.log('[Momo] Using endpoint:', endpoint);

        const momoResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const momoResult = await momoResponse.json();
        
        console.log('[Momo] API Response status:', momoResponse.status);
        console.log('[Momo] API Response:', momoResult);

        if (momoResult && momoResult.payUrl) {
            return {
                success: true,
                payUrl: momoResult.payUrl,
                qrCode: momoResult.qrCodeUrl || null,
                requestId: momoResult.requestId,
                message: 'Momo QR generated',
                raw: momoResult
            };
        }

        return {
            success: false,
            message: momoResult?.message || 'Failed to generate Momo QR',
            raw: momoResult
        };
    } catch (error) {
        console.error('[Momo Error]:', error.message);
        return {
            success: false,
            message: error.message || 'Momo QR generation failed'
        };
    }
};

/**
 * Generate VNPay Payment URL with QR
 */
const generateVNPayQR = (orderId, amount, orderInfo = 'Thanh toán tại TechStore') => {
    try {
        const config = paymentConfig.vnpay.sandbox;
        
        // Format CreateDate correctly: YYYYMMDDHHmmss
        const now = new Date();
        const vnp_CreateDate = 
            now.getFullYear() + 
            String(now.getMonth() + 1).padStart(2, '0') + 
            String(now.getDate()).padStart(2, '0') + 
            String(now.getHours()).padStart(2, '0') + 
            String(now.getMinutes()).padStart(2, '0') + 
            String(now.getSeconds()).padStart(2, '0');

        console.log('[VNPay] CreateDate formatted:', vnp_CreateDate);
        
        // Generate VNPay signature
        const params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: config.tmnCode,
            vnp_Amount: Math.round(amount * 100),
            vnp_CurrCode: 'VND',
            vnp_TxnRef: `${orderId}-${Date.now()}`,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: '200000',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: config.returnUrl,
            vnp_CreateDate: vnp_CreateDate,
            vnp_IpAddr: '127.0.0.1'
        };

        // Sort params alphabetically
        const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

        // Build signature data theo đúng format VNPay (encode value, space -> +)
        const signData = Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${encodeVnpValue(value)}`)
            .join('&');

        console.log('[VNPay] Full SignData:', signData);

        // Create HMAC SHA512
        const hmac = crypto
            .createHmac('sha512', config.hashSecret)
            .update(signData)
            .digest('hex');

        console.log('[VNPay] Generated SecureHash:', hmac);
        console.log('[VNPay] Using HashSecret:', config.hashSecret);

        // Build URL theo query string thủ công để tránh double-encode
        const queryString = Object.entries(sortedParams)
            .map(([key, value]) => `${key}=${encodeVnpValue(value)}`)
            .join('&');
        const vnpUrl = `${config.endpoint}?${queryString}&vnp_SecureHash=${hmac}`;

        console.log('[VNPay] Final payment URL generated');

        return {
            success: true,
            payUrl: vnpUrl,
            message: 'VNPay payment URL generated',
            orderId: orderId,
            amount: amount
        };
    } catch (error) {
        console.error('[VNPay Error]:', error.message);
        return {
            success: false,
            message: error.message || 'VNPay payment URL generation failed'
        };
    }
};

/**
 * Main Checkout Endpoint
 */
exports.checkout = async (req, res) => {
    try {
        const {
            amount,
            paymentStrategy = 'CREDIT_CARD',
            customerTypeStrategy = 'PERSONAL',
            cardInfo,
            orderInfo = 'Thanh toán tại TechStore',
            redirectUrl
        } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount',
                data: null
            });
        }

        const orderId = 'ORD-' + Date.now();
        let paymentResult = { success: true };

        // Generate QR codes for payment methods
        if (paymentStrategy === 'E_WALLET') {
            paymentResult = await generateMomoQR(orderId, Math.round(amount), orderInfo);
        } else if (paymentStrategy === 'VNPAY') {
            paymentResult = await generateVNPayQR(orderId, Math.round(amount), orderInfo);
        } else if (paymentStrategy === 'CREDIT_CARD') {
            paymentResult = { success: true, message: 'Credit card payment ready' };
        } else if (paymentStrategy === 'COD') {
            paymentResult = { success: true, message: 'COD payment ready' };
        }

        // Store order
        const newOrder = {
            orderId,
            amount,
            paymentStrategy,
            customerTypeStrategy,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            paymentData: paymentResult
        };

        mockOrders.push(newOrder);

        return res.json({
            success: true,
            message: 'Checkout successful',
            data: {
                orderId,
                amount,
                paymentStrategy,
                payUrl: paymentResult.payUrl || null,
                qrCode: paymentResult.qrCode || null,
                ...paymentResult
            }
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Checkout failed',
            data: null
        });
    }
};

/**
 * Get specific order by ID
 */
exports.getOrder = (req, res) => {
    try {
        const { orderId } = req.params;
        const order = mockOrders.find(o => o.orderId === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
                data: null
            });
        }

        return res.json({
            success: true,
            message: 'Order retrieved',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get order'
        });
    }
};

/**
 * Get all orders
 */
exports.getOrders = (req, res) => {
    try {
        return res.json({
            success: true,
            message: 'Orders retrieved',
            data: {
                orders: mockOrders,
                total: mockOrders.length
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get orders'
        });
    }
};

/**
 * Payment Callback Handler
 */
exports.paymentCallback = (req, res) => {
    try {
        const { orderId, status = 'COMPLETED', transactionId } = req.body;

        const order = mockOrders.find(o => o.orderId === orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        order.status = status;
        order.transactionId = transactionId;
        order.completedAt = new Date().toISOString();

        return res.json({
            success: true,
            message: 'Payment callback processed',
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Callback processing failed'
        });
    }
};

/**
 * VNPay Payment Callback Handler
 */
exports.vnpayCallback = (req, res) => {
    try {
        const vnpayResponse = req.query;
        const responseCode = vnpayResponse.vnp_ResponseCode;
        const orderInfo = vnpayResponse.vnp_OrderInfo;
        const txnRef = vnpayResponse.vnp_TxnRef;
        
        console.log('[VNPay Callback] Response Code:', responseCode);
        console.log('[VNPay Callback] TxnRef:', txnRef);
        console.log('[VNPay Callback] Order Info:', orderInfo);

        if (responseCode === '00') {
            // Payment successful
            return res.json({
                success: true,
                message: 'Payment successful',
                responseCode: responseCode,
                txnRef: txnRef
            });
        } else {
            // Payment failed
            return res.json({
                success: false,
                message: 'Payment failed',
                responseCode: responseCode,
                txnRef: txnRef
            });
        }
    } catch (error) {
        console.error('[VNPay Callback Error]:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'VNPay callback processing failed'
        });
    }
};

/**
 * VNPay IPN Handler (Instant Payment Notification)
 */
exports.vnpayIPN = (req, res) => {
    try {
        const vnpayResponse = req.query;
        const responseCode = vnpayResponse.vnp_ResponseCode;
        const txnRef = vnpayResponse.vnp_TxnRef;
        
        console.log('[VNPay IPN] Response Code:', responseCode);
        console.log('[VNPay IPN] TxnRef:', txnRef);

        // Always respond 0 to VNPay IPN
        return res.json({ RspCode: '00', Message: 'Confirm received' });
    } catch (error) {
        console.error('[VNPay IPN Error]:', error);
        return res.json({ RspCode: '01', Message: 'Confirm received' });
    }
};

/**
 * Get available strategies
 */
exports.getStrategies = (req, res) => {
    return res.json({
        success: true,
        data: {
            paymentStrategies: [
                { id: 'CREDIT_CARD', name: 'Credit Card', fee: '2%' },
                { id: 'E_WALLET', name: 'Momo', fee: '0%' },
                { id: 'VNPAY', name: 'VNPay', fee: '0%' },
                { id: 'COD', name: 'Cash on Delivery', fee: '30k' }
            ],
            customerTypeStrategies: [
                { id: 'PERSONAL', name: 'Personal (VAT 10%)' },
                { id: 'BUSINESS', name: 'Business (No VAT)' },
                { id: 'EDUCATION', name: 'Education (VAT 5%)' }
            ]
        }
    });
};

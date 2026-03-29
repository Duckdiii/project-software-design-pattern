const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const { Order } = require('./src/models/order');
const { ConcreteProduct } = require('./src/patterns/structural/decorator/IOrderItem');
const WarrantyDecorator = require('./src/patterns/structural/decorator/WarrantyDecorator');
const ScreenProtectorDecorator = require('./src/patterns/structural/decorator/ScreenProtectorDecorator');

const {
    StandardTaxStrategy,
    NoTaxStrategy,
    ReducedTaxStrategy,
    PercentagePromotionStrategy,
    FixedAmountPromotionStrategy,
    NoPromotionStrategy,
    CashPaymentStrategy,
    MoMoPaymentStrategy,
    CreditCardPaymentStrategy,
} = require('./src/models/order');

const VNPayPaymentStrategy = require('./src/patterns/behavioral/strategy/VNPayPaymentStrategy');
const paymentConfig = require('./src/config/payment-config');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(bodyParser.json());

function buildTaxStrategy(type) {
    switch ((type || '').toLowerCase()) {
        case 'standard':
            return new StandardTaxStrategy();
        case 'reduced':
            return new ReducedTaxStrategy();
        case 'none':
            return new NoTaxStrategy();
        default:
            return new StandardTaxStrategy();
    }
}

function buildPromotionStrategy(type, value) {
    switch ((type || '').toLowerCase()) {
        case 'percentage':
            return new PercentagePromotionStrategy(Number(value) || 0.1);
        case 'fixed':
            return new FixedAmountPromotionStrategy(Number(value) || 10000);
        case 'none':
            return new NoPromotionStrategy();
        default:
            return new NoPromotionStrategy();
    }
}

function buildPaymentStrategy(type, options = {}) {
    const isSandbox = options.isSandbox !== undefined ? options.isSandbox : paymentConfig.DEFAULT_SANDBOX_MODE;

    switch ((type || '').toLowerCase()) {
        case 'cash':
            return new CashPaymentStrategy();
        case 'momo':
            const momoConfig = paymentConfig.getMoMoConfig(isSandbox);
            return new MoMoPaymentStrategy(momoConfig.feeRate, {
                isSandbox: isSandbox,
                partnerCode: momoConfig.partnerCode,
                accessKey: momoConfig.accessKey,
                secretKey: momoConfig.secretKey,
                publicKey: momoConfig.publicKey,
                redirectUrl: momoConfig.redirectUrl,
            });
        case 'vnpay':
            const vnpayConfig = paymentConfig.getVNPayConfig(isSandbox);
            return new VNPayPaymentStrategy(vnpayConfig.feeRate, {
                isSandbox: isSandbox,
                tmnCode: vnpayConfig.tmnCode,
                hashSecret: vnpayConfig.hashSecret,
                returnUrl: vnpayConfig.returnUrl,
            });
        case 'creditcard':
        case 'credit':
            return new CreditCardPaymentStrategy();
        default:
            return new CashPaymentStrategy();
    }
}

app.post('/api/checkout', (req, res) => {
    const { items = [], taxType = 'standard', promotionType = 'none', promotionValue, paymentType = 'cash', isSandbox = true } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items phải là một mảng và không được rỗng.' });
    }

    const orderItems = items.map((item) => {
        let product = new ConcreteProduct(item.name, Number(item.price));

        if (item.decorators && Array.isArray(item.decorators)) {
            if (item.decorators.includes('warranty')) {
                product = new WarrantyDecorator(product);
            }
            if (item.decorators.includes('screen-protector')) {
                product = new ScreenProtectorDecorator(product);
            }
        }

        return product;
    });

    const order = new Order({
        items: orderItems,
        taxStrategy: buildTaxStrategy(taxType),
        promotionStrategy: buildPromotionStrategy(promotionType, promotionValue),
        paymentStrategy: buildPaymentStrategy(paymentType, { isSandbox }),
    });

    const receipt = order.checkout();
    return res.json({
        items: orderItems.map((item) => ({
            description: item.getDescription(),
            price: item.getPrice(),
        })),
        ...receipt,
    });
});

// VNPay Payment URL Generation
app.post('/api/vnpay-payment', (req, res) => {
    const { orderId, amount, orderInfo = 'Thanh toán tại TechStore', isSandbox = true } = req.body;

    if (!orderId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Thiếu orderId hoặc amount không hợp lệ' });
    }

    try {
        const vnpayStrategy = buildPaymentStrategy('vnpay', { isSandbox });
        const paymentUrl = vnpayStrategy.generatePaymentUrl(orderId, amount, orderInfo);

        return res.json({
            success: true,
            paymentUrl: paymentUrl,
            message: `VNPay payment URL generated (${isSandbox ? 'Sandbox' : 'Production'} mode)`,
            gatewayInfo: vnpayStrategy.getGatewayInfo(),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi tạo URL thanh toán VNPay',
            message: error.message,
        });
    }
});

// MoMo Payment Request
app.post('/api/momo-payment', (req, res) => {
    const { orderId, amount, orderInfo = 'Thanh toán tại TechStore', isSandbox = true } = req.body;

    if (!orderId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Thiếu orderId hoặc amount không hợp lệ' });
    }

    try {
        const momoStrategy = buildPaymentStrategy('momo', { isSandbox });
        const paymentUrl = momoStrategy.generatePaymentUrl(orderId, amount, orderInfo);

        return res.json({
            success: true,
            paymentUrl: paymentUrl,
            message: `MoMo payment URL generated (${isSandbox ? 'Sandbox' : 'Production'} mode)`,
            endpoint: momoStrategy.getEndpoint(),
            gatewayInfo: momoStrategy.getGatewayInfo(),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Lỗi khi tạo URL thanh toán MoMo',
            message: error.message,
        });
    }
});

// VNPay Callback Handler
app.get('/api/vnpay-callback', (req, res) => {
    const vnpayParams = req.query;
    const vnpSecureHash = vnpayParams.vnp_SecureHash;

    try {
        const isSandbox = paymentConfig.DEFAULT_SANDBOX_MODE;
        const vnpayStrategy = buildPaymentStrategy('vnpay', { isSandbox });

        // Remove vnp_SecureHash and vnp_SecureHashType from params for verification
        const params = { ...vnpayParams };
        delete params.vnp_SecureHash;
        delete params.vnp_SecureHashType;

        const isValidSignature = vnpayStrategy.verifyResponseSignature(params, vnpSecureHash);

        if (!isValidSignature) {
            return res.status(400).json({
                success: false,
                message: 'Chữ ký không hợp lệ',
                responseCode: '97',
            });
        }

        const responseCode = vnpayParams.vnp_ResponseCode;
        if (responseCode === '00') {
            return res.json({
                success: true,
                message: 'Thanh toán thành công',
                transactionNo: vnpayParams.vnp_TransactionNo,
                orderId: vnpayParams.vnp_TxnRef,
                responseCode: responseCode,
            });
        } else {
            return res.json({
                success: false,
                message: `Giao dịch thất bại: ${responseCode}`,
                responseCode: responseCode,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Lỗi xử lý callback VNPay',
            message: error.message,
        });
    }
});

// Payment Status
app.get('/api/payment-status', (req, res) => {
    return res.json({
        sandboxMode: paymentConfig.DEFAULT_SANDBOX_MODE,
        availablePaymentMethods: ['cash', 'momo', 'vnpay', 'creditcard'],
        momoConfig: {
            ...paymentConfig.getMoMoConfig(paymentConfig.DEFAULT_SANDBOX_MODE),
            secretKey: '***hidden***',
        },
        vnpayConfig: {
            ...paymentConfig.getVNPayConfig(paymentConfig.DEFAULT_SANDBOX_MODE),
            hashSecret: '***hidden***',
        },
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'TechStore backend with strategy + decorator checkout API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

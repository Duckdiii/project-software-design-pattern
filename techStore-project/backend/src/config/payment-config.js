// Payment Gateway Configuration
// Supports MoMo and VNPay sandbox/production modes

module.exports = {
    // MoMo Configuration
    momo: {
        sandbox: {
            enabled: true,
            partnerCode: 'MOMOBKUN20180529',
            accessKey: process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j',
            secretKey: process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa',
            publicKey: process.env.MOMO_PUBLIC_KEY || '',
            endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
            redirectUrl: process.env.MOMO_REDIRECT_URL || 'http://localhost:5173/products',
            feeRate: 0.02, // 2% fee
        },
        production: {
            enabled: false,
            partnerCode: process.env.MOMO_PARTNER_CODE || '',
            accessKey: process.env.MOMO_ACCESS_KEY_PROD || '',
            secretKey: process.env.MOMO_SECRET_KEY_PROD || '',
            publicKey: process.env.MOMO_PUBLIC_KEY_PROD || '',
            endpoint: 'https://payment.momo.vn/v2/gateway/api/create',
            redirectUrl: process.env.MOMO_REDIRECT_URL_PROD || '',
            feeRate: 0.02,
        },
    },

    // VNPay Configuration
    vnpay: {
        sandbox: {
            enabled: true,
            tmnCode: process.env.VNPAY_TMN_CODE || '2QXVM2PI', // Test merchant code
            hashSecret: process.env.VNPAY_SECURE_SECRET || 'XBNVBFP2WUHJVPNL', // Test hash secret
            endpoint: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            apiEndpoint: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
            feeRate: 0.01, // 1% fee
            returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5000/vnpay-return.html',
            ipnUrl: process.env.VNPAY_IPN_URL || 'http://localhost:5000/api/vnpay-ipn',
        },
        production: {
            enabled: false,
            tmnCode: process.env.VNPAY_TMN_CODE_PROD || '',
            hashSecret: process.env.VNPAY_HASH_SECRET_PROD || '',
            endpoint: 'https://payment.vnpayment.vn/vpcpay.html',
            apiEndpoint: 'https://api.vnpayment.vn/merchant_webapi/api/transaction',
            feeRate: 0.01,
            returnUrl: process.env.VNPAY_RETURN_URL_PROD || '',
            ipnUrl: process.env.VNPAY_IPN_URL_PROD || '',
        },
    },

    // Get active configuration
    getMoMoConfig: function (isSandbox = true) {
        return isSandbox ? this.momo.sandbox : this.momo.production;
    },

    getVNPayConfig: function (isSandbox = true) {
        return isSandbox ? this.vnpay.sandbox : this.vnpay.production;
    },

    // Default mode (sandbox for testing)
    DEFAULT_SANDBOX_MODE: process.env.PAYMENT_SANDBOX_MODE === 'false' ? false : true,
};

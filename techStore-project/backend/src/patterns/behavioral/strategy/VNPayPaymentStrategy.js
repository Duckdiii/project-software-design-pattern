const IPaymentStrategy = require('./IPaymentStrategy');
const crypto = require('crypto');

class VNPayPaymentStrategy extends IPaymentStrategy {
    constructor(feeRate = 0.01, options = {}) {
        super();
        this.feeRate = feeRate;
        this.isSandbox = options.isSandbox ?? (process.env.VNPAY_NODE_ENV !== 'production');
        this.tmnCode = options.tmnCode || process.env.VNPAY_TMN_CODE || ''; 
        this.hashSecret = options.hashSecret || process.env.VNPAY_HASH_SECRET || process.env.VNPAY_SECURE_SECRET || '';
        this.returnUrl = options.returnUrl || process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment-result';
    }

    calculateFee(amount) {
        return Number(amount || 0) * this.feeRate;
    }

    // Get sandbox or production endpoint
    getEndpoint() {
        return this.isSandbox
            ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
            : 'https://payment.vnpayment.vn/vpcpay.html';
    }

    // Get API endpoint
    getApiEndpoint() {
        return this.isSandbox
            ? 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
            : 'https://api.vnpayment.vn/merchant_webapi/api/transaction';
    }

    encodeVnpValue(value) {
        return encodeURIComponent(String(value)).replace(/%20/g, '+');
    }

    // Generate VNPay payment URL
    generatePaymentUrl(orderId, amount, orderInfo = 'Thanh toán tại TechStore') {
        const vnpUrl = this.getEndpoint(); // Lấy URL gốc
        const params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: Math.round(Number(amount) * 100),
            vnp_CurrCode: 'VND',
            vnp_TxnRef: `${orderId}-${Date.now()}`,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: '200000',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: this.returnUrl,
            vnp_CreateDate: this.getCurrentDateTime(),
            vnp_IpAddr: '127.0.0.1',
        };
    
        // 1. Sắp xếp tham số (Bạn đã có hàm sortObject)
        const sortedParams = this.sortObject(params);

        // 2. Tạo chuỗi dữ liệu ký theo format VNPay (encode value, space -> +)
        const signData = this.buildSignData(sortedParams);
    
        // 3. Tạo mã băm SHA512
        const hmac = crypto
            .createHmac('sha512', this.hashSecret)
            .update(Buffer.from(signData, 'utf-8'))
            .digest('hex');
    
        // 4. Tạo URL cuối cùng theo cùng format encode với signData
        const searchParams = Object.keys(sortedParams)
            .map((key) => `${key}=${this.encodeVnpValue(sortedParams[key])}`)
            .join('&');
    
        return `${vnpUrl}?${searchParams}&vnp_SecureHash=${hmac}`;
    }

    // Generate transaction request object
    generateTransactionRequest(orderId, amount, orderInfo = 'techstore.vn') {
        return {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: Math.round(Number(amount) * 100),
            vnp_CurrCode: 'VND',
            vnp_TxnRef: `${orderId}-${Date.now()}`,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: 'other',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: this.returnUrl,
            vnp_CreateDate: this.getCurrentDateTime(),
            vnp_IpAddr: '127.0.0.1',
        };
    }

    // Verify VNPay response signature
    verifyResponseSignature(responseParams, vnpSecureHash) {
        const sortedParams = this.sortObject(responseParams);
        delete sortedParams.vnp_SecureHash;
        delete sortedParams.vnp_SecureHashType;

        const signData = this.buildSignData(sortedParams);
        const hmac = crypto
            .createHmac('sha512', this.hashSecret)
            .update(Buffer.from(signData, 'utf-8'))
            .digest('hex');

        return hmac === vnpSecureHash;
    }

    // Helper: Sort object keys
    sortObject(obj) {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        keys.forEach((key) => {
            sorted[key] = obj[key];
        });
        return sorted;
    }

    // Helper: Build sign data from sorted params
    buildSignData(sortedParams) {
        return Object.keys(sortedParams)
            .map((key) => `${key}=${this.encodeVnpValue(sortedParams[key])}`)
            .join('&');
    }

    // Helper: Get current datetime in YYYYMMDDHHmmss format
    getCurrentDateTime() {
        const now = new Date();
        return (
            now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0')
        );
    }

    // Check if sandbox mode is enabled
    isSandboxMode() {
        return this.isSandbox;
    }

    getGatewayInfo() {
        return {
            name: 'VNPay',
            mode: this.isSandbox ? 'Sandbox' : 'Production',
            endpoint: this.getEndpoint(),
            fee: `${this.feeRate * 100}%`,
            tmnCode: this.tmnCode,
        };
    }
}

module.exports = VNPayPaymentStrategy;

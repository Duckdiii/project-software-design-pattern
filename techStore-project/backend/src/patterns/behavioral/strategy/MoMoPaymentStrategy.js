const IPaymentStrategy = require('./IPaymentStrategy');
const crypto = require('crypto');

class MoMoPaymentStrategy extends IPaymentStrategy {
    constructor(feeRate = 0.02, options = {}) {
        super();
        this.feeRate = feeRate;
        this.isSandbox = options.isSandbox || false;
        this.partnerCode = options.partnerCode || 'MOMO';
        this.accessKey = options.accessKey || '';
        this.secretKey = options.secretKey || '';
        this.publicKey = options.publicKey || '';
        this.redirectUrl = options.redirectUrl || 'http://localhost:5173/products';
    }

    calculateFee(amount) {
        return Number(amount || 0) * this.feeRate;
    }

    // Get sandbox or production endpoint
    getEndpoint() {
        return this.isSandbox
            ? 'https://test-payment.momo.vn/v2/gateway/api/create'
            : 'https://payment.momo.vn/v2/gateway/api/create';
    }

    // Generate transaction request for MoMo
    generateTransactionRequest(orderId, amount, orderInfo = 'Thanh toán đơn hàng') {
        return {
            partnerCode: this.partnerCode,
            accessKey: this.accessKey,
            requestId: `${orderId}-${Date.now()}`,
            amount: Math.round(Number(amount) || 0),
            orderId: orderId,
            orderInfo: orderInfo,
            requestType: 'captureWallet',
            ipnUrl: 'https://your-domain.com/webhook/momo',
            redirectUrl: this.redirectUrl,
            extraData: '',
            timestamp: Math.floor(Date.now() / 1000),
        };
    }

    // Generate MoMo payment URL for redirect
    generatePaymentUrl(orderId, amount, orderInfo = 'Thanh toán đơn hàng') {
        const transactionRequest = this.generateTransactionRequest(orderId, amount, orderInfo);
        
        // Create signature
        const dataStr = `accessKey=${this.accessKey}&amount=${transactionRequest.amount}&extraData=${transactionRequest.extraData}&ipnUrl=${transactionRequest.ipnUrl}&orderId=${transactionRequest.orderId}&orderInfo=${transactionRequest.orderInfo}&partnerCode=${transactionRequest.partnerCode}&redirectUrl=${transactionRequest.redirectUrl}&requestId=${transactionRequest.requestId}&requestType=${transactionRequest.requestType}&timestamp=${transactionRequest.timestamp}`;
        
        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(dataStr)
            .digest('hex');

        // Build URL
        const url = new URL(this.getEndpoint());
        Object.keys(transactionRequest).forEach(key => {
            url.searchParams.append(key, transactionRequest[key]);
        });
        url.searchParams.append('signature', signature);

        return url.toString();
    }

    // Check if sandbox mode is enabled
    isSandboxMode() {
        return this.isSandbox;
    }

    getGatewayInfo() {
        return {
            name: 'MoMo',
            mode: this.isSandbox ? 'Sandbox' : 'Production',
            endpoint: this.getEndpoint(),
            fee: `${this.feeRate * 100}%`,
        };
    }
}

module.exports = MoMoPaymentStrategy;

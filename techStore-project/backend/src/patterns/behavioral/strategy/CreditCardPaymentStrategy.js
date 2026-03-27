const IPaymentStrategy = require('./IPaymentStrategy');

class CreditCardPaymentStrategy extends IPaymentStrategy {
    constructor(feeRate = 0.015, fixedFee = 5000) {
        super();
        this.feeRate = feeRate;
        this.fixedFee = fixedFee;
    }

    calculateFee(amount) {
        return Number(amount || 0) * this.feeRate + this.fixedFee;
    }
}

module.exports = CreditCardPaymentStrategy;

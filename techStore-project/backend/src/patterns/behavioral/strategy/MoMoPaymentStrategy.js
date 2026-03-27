const IPaymentStrategy = require('./IPaymentStrategy');

class MoMoPaymentStrategy extends IPaymentStrategy {
    constructor(feeRate = 0.02) {
        super();
        this.feeRate = feeRate;
    }

    calculateFee(amount) {
        return Number(amount || 0) * this.feeRate;
    }
}

module.exports = MoMoPaymentStrategy;

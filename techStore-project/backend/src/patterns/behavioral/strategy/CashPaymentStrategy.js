const IPaymentStrategy = require('./IPaymentStrategy');

class CashPaymentStrategy extends IPaymentStrategy {
    calculateFee(amount) {
        return 0;
    }
}

module.exports = CashPaymentStrategy;

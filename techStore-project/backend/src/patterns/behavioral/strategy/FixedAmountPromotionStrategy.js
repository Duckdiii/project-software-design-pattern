const IPromotionStrategy = require('./IPromotionStrategy');

class FixedAmountPromotionStrategy extends IPromotionStrategy {
    constructor(discount = 10000) {
        super();
        this.discount = discount;
    }

    calculateDiscount(amount) {
        const subtotal = Number(amount || 0);
        return Math.min(subtotal, this.discount);
    }
}

module.exports = FixedAmountPromotionStrategy;

const IPromotionStrategy = require('./IPromotionStrategy');

class PercentagePromotionStrategy extends IPromotionStrategy {
    constructor(rate = 0.1) {
        super();
        this.rate = rate;
    }

    calculateDiscount(amount) {
        return Number(amount || 0) * this.rate;
    }
}

module.exports = PercentagePromotionStrategy;

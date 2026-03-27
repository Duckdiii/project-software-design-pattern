const IPromotionStrategy = require('./IPromotionStrategy');

class NoPromotionStrategy extends IPromotionStrategy {
    calculateDiscount(amount) {
        return 0;
    }
}

module.exports = NoPromotionStrategy;

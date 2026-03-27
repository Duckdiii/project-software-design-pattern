class IPromotionStrategy {
    calculateDiscount(amount) {
        throw new Error('Phải ghi đè phương thức calculateDiscount');
    }
}

module.exports = IPromotionStrategy;

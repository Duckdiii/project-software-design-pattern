class IPaymentStrategy {
    calculateFee(amount) {
        throw new Error('Phải ghi đè phương thức calculateFee');
    }
}

module.exports = IPaymentStrategy;

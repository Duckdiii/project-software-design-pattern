class ITaxStrategy {
    calculateTax(amount) {
        throw new Error('Phải ghi đè phương thức calculateTax');
    }
}

module.exports = ITaxStrategy;

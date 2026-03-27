const ITaxStrategy = require('./ITaxStrategy');

class NoTaxStrategy extends ITaxStrategy {
    calculateTax(amount) {
        return 0;
    }
}

module.exports = NoTaxStrategy;

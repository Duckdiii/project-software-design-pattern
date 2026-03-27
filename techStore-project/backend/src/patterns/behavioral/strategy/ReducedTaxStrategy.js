const ITaxStrategy = require('./ITaxStrategy');

class ReducedTaxStrategy extends ITaxStrategy {
    constructor(rate = 0.05) {
        super();
        this.rate = rate;
    }

    calculateTax(amount) {
        return Number(amount || 0) * this.rate;
    }
}

module.exports = ReducedTaxStrategy;

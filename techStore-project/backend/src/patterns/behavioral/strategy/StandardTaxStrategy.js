const ITaxStrategy = require('./ITaxStrategy');

class StandardTaxStrategy extends ITaxStrategy {
    constructor(rate = 0.1) {
        super();
        this.rate = rate;
    }

    calculateTax(amount) {
        return Number(amount || 0) * this.rate;
    }
}

module.exports = StandardTaxStrategy;

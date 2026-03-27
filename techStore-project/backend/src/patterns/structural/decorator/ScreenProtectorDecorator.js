const ServiceDecorator = require('./ServiceDecorator');

class ScreenProtectorDecorator extends ServiceDecorator {
    constructor(orderItem, protectorFee = 15000) {
        super(orderItem);
        this.protectorFee = protectorFee;
    }

    getPrice() {
        return this.orderItem.getPrice() + this.protectorFee;
    }

    getDescription() {
        return `${this.orderItem.getDescription()} + Dán màn hình`;
    }
}

module.exports = ScreenProtectorDecorator;

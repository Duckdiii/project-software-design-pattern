const ServiceDecorator = require('./ServiceDecorator');

class WarrantyDecorator extends ServiceDecorator {
    constructor(orderItem, warrantyFee = 50000) {
        super(orderItem);
        this.warrantyFee = warrantyFee;
    }

    getPrice() {
        return this.orderItem.getPrice() + this.warrantyFee;
    }

    getDescription() {
        return `${this.orderItem.getDescription()} + Bảo hành mở rộng`;
    }
}

module.exports = WarrantyDecorator;

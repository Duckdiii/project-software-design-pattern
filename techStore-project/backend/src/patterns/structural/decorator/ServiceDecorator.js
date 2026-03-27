const { IOrderItem } = require('./IOrderItem');

class ServiceDecorator extends IOrderItem {
    constructor(orderItem) {
        super();
        this.orderItem = orderItem; 
    }

    getPrice() {
        return this.orderItem.getPrice();
    }

    getDescription() {
        return this.orderItem.getDescription();
    }
}

module.exports = ServiceDecorator;
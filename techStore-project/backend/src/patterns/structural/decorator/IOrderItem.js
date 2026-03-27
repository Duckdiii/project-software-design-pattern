
class IOrderItem {
    getPrice() {
        throw new Error("Phải ghi đè phương thức getPrice");
    }

    getDescription() {
        throw new Error("Phải ghi đè phương thức getDescription");
    }
}

class ConcreteProduct extends IOrderItem {
    constructor(name, price) {
        super();
        this.name = name;
        this.price = price;
    }

    getPrice() {
        return this.price;
    }

    getDescription() {
        return this.name;
    }
}

module.exports = { IOrderItem, ConcreteProduct };
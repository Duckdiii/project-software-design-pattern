const StandardTaxStrategy = require('../patterns/behavioral/strategy/StandardTaxStrategy');
const NoTaxStrategy = require('../patterns/behavioral/strategy/NoTaxStrategy');
const ReducedTaxStrategy = require('../patterns/behavioral/strategy/ReducedTaxStrategy');
const PercentagePromotionStrategy = require('../patterns/behavioral/strategy/PercentagePromotionStrategy');
const FixedAmountPromotionStrategy = require('../patterns/behavioral/strategy/FixedAmountPromotionStrategy');
const NoPromotionStrategy = require('../patterns/behavioral/strategy/NoPromotionStrategy');
const CashPaymentStrategy = require('../patterns/behavioral/strategy/CashPaymentStrategy');
const MoMoPaymentStrategy = require('../patterns/behavioral/strategy/MoMoPaymentStrategy');
const CreditCardPaymentStrategy = require('../patterns/behavioral/strategy/CreditCardPaymentStrategy');
const VNPayPaymentStrategy = require('../patterns/behavioral/strategy/VNPayPaymentStrategy');

class Order {
    constructor({ items = [], taxStrategy = new StandardTaxStrategy(), promotionStrategy = new NoPromotionStrategy(), paymentStrategy = new CashPaymentStrategy() } = {}) {
        this.items = items;
        this.taxStrategy = taxStrategy;
        this.promotionStrategy = promotionStrategy;
        this.paymentStrategy = paymentStrategy;
    }

    getSubTotal() {
        return this.items.reduce((sum, item) => sum + Number(item.getPrice()), 0);
    }

    getTax() {
        return this.taxStrategy.calculateTax(this.getSubTotal());
    }

    getDiscount() {
        return this.promotionStrategy.calculateDiscount(this.getSubTotal());
    }

    getPaymentFee() {
        const base = this.getSubTotal() - this.getDiscount() + this.getTax();
        return this.paymentStrategy.calculateFee(base);
    }

    getTotal() {
        const subTotal = this.getSubTotal();
        const discount = this.getDiscount();
        const tax = this.getTax();
        const paymentFee = this.getPaymentFee();
        return subTotal - discount + tax + paymentFee;
    }

    checkout() {
        return {
            subTotal: this.getSubTotal(),
            discount: this.getDiscount(),
            tax: this.getTax(),
            paymentFee: this.getPaymentFee(),
            total: this.getTotal(),
        };
    }
}

module.exports = {
    Order,
    StandardTaxStrategy,
    NoTaxStrategy,
    ReducedTaxStrategy,
    PercentagePromotionStrategy,
    FixedAmountPromotionStrategy,
    NoPromotionStrategy,
    CashPaymentStrategy,
    MoMoPaymentStrategy,
    CreditCardPaymentStrategy,
    VNPayPaymentStrategy,
};

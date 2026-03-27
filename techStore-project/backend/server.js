const express = require('express');
const bodyParser = require('body-parser');

const { Order } = require('./src/models/order');
const { ConcreteProduct } = require('./src/patterns/structural/decorator/IOrderItem');
const WarrantyDecorator = require('./src/patterns/structural/decorator/WarrantyDecorator');
const ScreenProtectorDecorator = require('./src/patterns/structural/decorator/ScreenProtectorDecorator');

const {
    StandardTaxStrategy,
    NoTaxStrategy,
    ReducedTaxStrategy,
    PercentagePromotionStrategy,
    FixedAmountPromotionStrategy,
    NoPromotionStrategy,
    CashPaymentStrategy,
    MoMoPaymentStrategy,
    CreditCardPaymentStrategy,
} = require('./src/models/order');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

function buildTaxStrategy(type) {
    switch ((type || '').toLowerCase()) {
        case 'standard':
            return new StandardTaxStrategy();
        case 'reduced':
            return new ReducedTaxStrategy();
        case 'none':
            return new NoTaxStrategy();
        default:
            return new StandardTaxStrategy();
    }
}

function buildPromotionStrategy(type, value) {
    switch ((type || '').toLowerCase()) {
        case 'percentage':
            return new PercentagePromotionStrategy(Number(value) || 0.1);
        case 'fixed':
            return new FixedAmountPromotionStrategy(Number(value) || 10000);
        case 'none':
            return new NoPromotionStrategy();
        default:
            return new NoPromotionStrategy();
    }
}

function buildPaymentStrategy(type) {
    switch ((type || '').toLowerCase()) {
        case 'cash':
            return new CashPaymentStrategy();
        case 'momo':
            return new MoMoPaymentStrategy();
        case 'creditcard':
        case 'credit':
            return new CreditCardPaymentStrategy();
        default:
            return new CashPaymentStrategy();
    }
}

app.post('/api/checkout', (req, res) => {
    const { items = [], taxType = 'standard', promotionType = 'none', promotionValue, paymentType = 'cash' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items phải là một mảng và không được rỗng.' });
    }

    const orderItems = items.map((item) => {
        let product = new ConcreteProduct(item.name, Number(item.price));

        if (item.decorators && Array.isArray(item.decorators)) {
            if (item.decorators.includes('warranty')) {
                product = new WarrantyDecorator(product);
            }
            if (item.decorators.includes('screen-protector')) {
                product = new ScreenProtectorDecorator(product);
            }
        }

        return product;
    });

    const order = new Order({
        items: orderItems,
        taxStrategy: buildTaxStrategy(taxType),
        promotionStrategy: buildPromotionStrategy(promotionType, promotionValue),
        paymentStrategy: buildPaymentStrategy(paymentType),
    });

    const receipt = order.checkout();
    return res.json({
        items: orderItems.map((item) => ({
            description: item.getDescription(),
            price: item.getPrice(),
        })),
        ...receipt,
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'TechStore backend with strategy + decorator checkout API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

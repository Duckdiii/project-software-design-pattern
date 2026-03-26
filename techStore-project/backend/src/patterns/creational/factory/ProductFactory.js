/**
 * ProductFactory.js
 * Factory Manager — the single entry point for the entire pattern.
 *
 * Usage:
 *   const ProductFactory = require('./ProductFactory');
 *
 *   const laptop = ProductFactory.create('LAPTOP', { cpu: 'i7', ram: 16 });
 *   const result = laptop.validateAttributes(); // { valid: true, errors: [] }
 */

const { LaptopFactory }    = require('./LaptopFactory');
const { SmarthomeFactory } = require('./SmarthomeFactory');

// ─── Registry ─────────────────────────────────────────────────────────────────
// Add new product types here without touching the create() logic.
const FACTORY_REGISTRY = {
  LAPTOP:     new LaptopFactory(),
  SMARTHOME:  new SmarthomeFactory(),
};

// ─── Factory Manager ──────────────────────────────────────────────────────────

const ProductFactory = {
  /**
   * Creates the appropriate product for the given type.
   *
   * @param {string} type  - Product type key: 'LAPTOP' | 'SMARTHOME'
   * @param {Object} data  - Raw JSON attributes for the product
   * @returns {Product}      A fully constructed product instance
   *
   * @throws {Error} When `type` is not registered in FACTORY_REGISTRY
   */
  create(type, data) {
    const normalizedType = String(type).toUpperCase();
    const factory = FACTORY_REGISTRY[normalizedType];

    if (!factory) {
      const supported = Object.keys(FACTORY_REGISTRY).join(', ');
      throw new Error(
        `Unknown product type: "${type}". Supported types are: ${supported}`
      );
    }

    return factory.createProduct(data);
  },

  /**
   * Returns all registered product type keys.
   * Useful for API validation or UI dropdowns.
   * @returns {string[]}
   */
  getSupportedTypes() {
    return Object.keys(FACTORY_REGISTRY);
  },
};

module.exports = ProductFactory;

// ─── Quick smoke-test (node ProductFactory.js) ────────────────────────────────
if (require.main === module) {
  console.log('=== Factory Pattern Smoke Test ===\n');

  // Valid laptop
  const laptop = ProductFactory.create('LAPTOP', { cpu: 'Intel Core i7-12700H', ram: 16 });
  console.log(laptop.getSummary());
  console.log('Validation:', laptop.validateAttributes());

  // Invalid laptop (missing cpu)
  const badLaptop = ProductFactory.create('LAPTOP', { ram: 8 });
  console.log('\n' + badLaptop.getSummary());
  console.log('Validation:', badLaptop.validateAttributes());

  // Valid smarthome
  const home = ProductFactory.create('SMARTHOME', { network: 'HomeNet_5G', connection_type: 'wifi' });
  console.log('\n' + home.getSummary());
  console.log('Validation:', home.validateAttributes());

  // Unknown type
  try {
    ProductFactory.create('TABLET', {});
  } catch (e) {
    console.log('\nExpected error:', e.message);
  }
}

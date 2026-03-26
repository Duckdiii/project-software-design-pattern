/**
 * LaptopFactory.js
 * Concrete Product: Laptop
 * Concrete Factory:  LaptopFactory
 */

const Product = require('./IProductFactory');

// ─── Concrete Product ────────────────────────────────────────────────────────

class Laptop extends Product {
  /** Required top-level keys for a valid laptop configuration */
  static REQUIRED_ATTRIBUTES = ['ram', 'cpu'];

  constructor(data) {
    super(data);
  }

  /**
   * Checks that `ram` and `cpu` are present in the supplied JSON.
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validateAttributes() {
    const errors = [];

    for (const attr of Laptop.REQUIRED_ATTRIBUTES) {
      if (this.data[attr] === undefined || this.data[attr] === null) {
        errors.push(`Missing required attribute: "${attr}"`);
      }
    }

    // Extra type-level checks
    if (this.data.ram !== undefined && typeof this.data.ram !== 'number') {
      errors.push('"ram" must be a number (GB)');
    }
    if (this.data.cpu !== undefined && typeof this.data.cpu !== 'string') {
      errors.push('"cpu" must be a string (e.g. "Intel Core i7-12700H")');
    }

    return { valid: errors.length === 0, errors };
  }

  getSummary() {
    return `Laptop — CPU: ${this.data.cpu ?? 'N/A'}, RAM: ${this.data.ram ?? 'N/A'} GB`;
  }
}

// ─── Concrete Factory ─────────────────────────────────────────────────────────

class LaptopFactory {
  /**
   * Creates and returns a new Laptop instance.
   * @param {Object} data - Raw attribute JSON
   * @returns {Laptop}
   */
  createProduct(data) {
    return new Laptop(data);
  }
}

module.exports = { Laptop, LaptopFactory };

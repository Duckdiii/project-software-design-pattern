/**
 * IProductFactory.js
 * Base class (Abstract Product) - defines the contract
 * all concrete products must fulfill.
 */

class Product {
  /**
   * @param {Object} data - Raw JSON attributes for the product
   */
  constructor(data) {
    if (new.target === Product) {
      throw new Error('Product is an abstract class and cannot be instantiated directly.');
    }
    this.data = data;
  }

  /**
   * Validates whether the provided data contains all required attributes.
   * Must be implemented by every concrete subclass.
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validateAttributes() {
    throw new Error(`validateAttributes() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Returns a summary of the product for display/logging.
   * @returns {string}
   */
  getSummary() {
    throw new Error(`getSummary() must be implemented by ${this.constructor.name}`);
  }
}

module.exports = Product;

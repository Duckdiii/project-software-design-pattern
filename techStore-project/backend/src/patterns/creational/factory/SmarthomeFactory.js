/**
 * SmarthomeFactory.js
 * Concrete Product: Smarthome
 * Concrete Factory:  SmarthomeFactory
 */

const Product = require('./IProductFactory');

// ─── Concrete Product ────────────────────────────────────────────────────────

class Smarthome extends Product {
  /** Required top-level keys for a valid smart-home configuration */
  static REQUIRED_ATTRIBUTES = ['network', 'connection_type'];

  /** Allowed values for connection_type */
  static ALLOWED_CONNECTION_TYPES = ['wifi', 'zigbee', 'z-wave', 'bluetooth', 'ethernet'];

  constructor(data) {
    super(data);
  }

  /**
   * Checks that `network` and `connection_type` are present and valid.
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validateAttributes() {
    const errors = [];

    for (const attr of Smarthome.REQUIRED_ATTRIBUTES) {
      if (this.data[attr] === undefined || this.data[attr] === null) {
        errors.push(`Missing required attribute: "${attr}"`);
      }
    }

    if (
      this.data.connection_type !== undefined &&
      !Smarthome.ALLOWED_CONNECTION_TYPES.includes(
        String(this.data.connection_type).toLowerCase()
      )
    ) {
      errors.push(
        `"connection_type" must be one of: ${Smarthome.ALLOWED_CONNECTION_TYPES.join(', ')}`
      );
    }

    if (this.data.network !== undefined && typeof this.data.network !== 'string') {
      errors.push('"network" must be a string (SSID or network name)');
    }

    return { valid: errors.length === 0, errors };
  }

  getSummary() {
    return `Smarthome — Network: ${this.data.network ?? 'N/A'}, Connection: ${
      this.data.connection_type ?? 'N/A'
    }`;
  }
}

// ─── Concrete Factory ─────────────────────────────────────────────────────────

class SmarthomeFactory {
  /**
   * Creates and returns a new Smarthome instance.
   * @param {Object} data - Raw attribute JSON
   * @returns {Smarthome}
   */
  createProduct(data) {
    return new Smarthome(data);
  }
}

module.exports = { Smarthome, SmarthomeFactory };

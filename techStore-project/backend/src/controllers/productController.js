/**
 * productController.js
 * Place in: src/controllers/productController.js
 */

const supabase       = require('../config/supabase');
const ProductFactory = require('../patterns/creational/factory/ProductFactory');

// ─── POST /api/products ───────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, base_price, category_type, specific_attributes } = req.body;

    if (!name || base_price === undefined || !category_type || !specific_attributes) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, base_price, category_type, specific_attributes',
      });
    }

    // Factory Pattern — 1 dòng thần thánh
    const newProduct = ProductFactory.create(category_type, specific_attributes);

    // Validate dynamic attributes
    const { valid, errors } = newProduct.validateAttributes();
    if (!valid) {
      return res.status(422).json({
        success: false,
        message: 'Invalid product attributes',
        errors,
      });
    }

    // Insert vào Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        base_price,
        category_type : category_type.toUpperCase(),
        specific_attributes,          // Supabase tự handle JSON object
        status        : 'ACTIVE',
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...data,
        summary: newProduct.getSummary(),
      },
    });

  } catch (error) {
    if (error.message?.startsWith('Unknown product type')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        supported_types: ProductFactory.getSupportedTypes(),
      });
    }
    console.error('[createProduct]', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

// ─── GET /api/products ────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const { min_price, max_price, category_type } = req.query;

    // Base query — chỉ lấy sản phẩm ACTIVE
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    // Filter theo category
    if (category_type) {
      query = query.eq('category_type', category_type.toUpperCase());
    }

    // Filter theo giá
    if (min_price !== undefined) {
      query = query.gte('base_price', Number(min_price));
    }
    if (max_price !== undefined) {
      query = query.lte('base_price', Number(max_price));
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.status(200).json({
      success: true,
      total  : data.length,
      data,
    });

  } catch (error) {
    console.error('[getProducts]', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

module.exports = { createProduct, getProducts };
/**
 * productRoutes.js
 * Place in: src/routes/productRoutes.js
 */

const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin }     = require('../middlewares/isAdmin');
const { createProduct, getProducts } = require('../controllers/productController');

// GET  /api/products  — public, ai cũng xem được
router.get('/', getProducts);

// POST /api/products  — chỉ Admin
router.post('/', verifyToken, isAdmin, createProduct);

module.exports = router;
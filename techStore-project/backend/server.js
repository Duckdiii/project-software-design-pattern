
// 26/3/2026 - LeVan - Factory Pattern routes

const express = require('express');
const http    = require('http');

const app    = express();
const PORT   = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());                  // parse JSON body
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'TechStore backend is running' });
});

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

// ── Start server ──────────────────────────────────────────────────────────────
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
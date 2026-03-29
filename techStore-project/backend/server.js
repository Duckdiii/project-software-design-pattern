const http = require('http');
const PORT = process.env.PORT || 5000;
const authRoutes = require('./src/routes/authRoutes');
const express = require('express');

const app = express();
app.use('/api/auth', authRoutes);


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'TechStore backend is running' }));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

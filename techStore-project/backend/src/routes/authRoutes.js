const express = require('express');
const router = express.Router();

// Tạm thời để route trống để server không bị crash
router.post('/register', (req, res) => {
    res.json({ message: "API Register đang chờ code logic" });
});

router.post('/login', (req, res) => {
    res.json({ message: "API Login đang chờ code logic" });
});

module.exports = router;
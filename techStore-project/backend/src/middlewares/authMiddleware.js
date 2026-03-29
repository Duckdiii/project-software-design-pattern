const jwt = require('jsonwebtoken');

// Check if the user is authenticated
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Take the token from the "Authorization" header

    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        req.user = decoded; // Return decoded user info (user_id, role) for use in later middleware/routes
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Phiên làm việc hết hạn hoặc token không hợp lệ.' });
    }
};

// Check for admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ dành cho Admin.' });
    }
};

module.exports = { verifyToken, isAdmin };
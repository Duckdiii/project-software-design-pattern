const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase'); // Import the Supabase client
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Used to keep login timing consistent when the email does not exist.
const DUMMY_PASSWORD_HASH = process.env.DUMMY_PASSWORD_HASH || bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 10);

const validateRegisterInput = ({ email, password, full_name, phone_number }) => {
    if (!email || !password || !full_name || !phone_number) {
        return 'Vui lòng nhập đầy đủ thông tin đăng ký.';
    }

    const normalizedEmail = String(email).trim();
    const normalizedFullName = String(full_name).trim();
    const normalizedPhone = String(phone_number).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        return 'Email không hợp lệ.';
    }

    if (String(password).length < 8) {
        return 'Mật khẩu phải có ít nhất 8 ký tự.';
    }

    if (normalizedFullName.length < 2) {
        return 'Họ tên không hợp lệ.';
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(normalizedPhone)) {
        return 'Số điện thoại không hợp lệ.';
    }

    return null;
};

const validateLoginInput = ({ email, password }) => {
    if (!email || !password) {
        return 'Vui lòng nhập email và mật khẩu.';
    }

    const normalizedEmail = String(email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        return 'Email không hợp lệ.';
    }

    return null;
};

const register = async (req, res) => {
    const { email, password, full_name, phone_number } = req.body;

    const validationError = validateRegisterInput({ email, password, full_name, phone_number });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedFullName = String(full_name).trim();
    const normalizedPhone = String(phone_number).trim();

    try {
        // Check for repetitive email addresses
        const { data: existingUser } = await supabase
            .from('Users')
            .select('email')
            .eq('email', normalizedEmail)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng.' });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const { error } = await supabase
            .from('Users')
            .insert([{
                email: normalizedEmail,
                password_hash,
                full_name: normalizedFullName,
                phone_number: normalizedPhone,
                role: 'CUSTOMER',       // Default role for new users
                tier_state: 'SILVER'    // Default tier state for new users
            }]);

        if (error) throw error;

        return res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const validationError = validateLoginInput({ email, password });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    try {
        // Find user by email
        const { data: user, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', normalizedEmail)
            .single();

        const passwordHashToCompare = user?.password_hash || DUMMY_PASSWORD_HASH;
        const isMatch = await bcrypt.compare(String(password || ''), passwordHashToCompare);

        if (!user || error || !isMatch) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu.' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Lỗi cấu hình máy chủ: thiếu JWT secret.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Hiệu lực 1 ngày
        );

        // Return user info and token
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: { id: user.user_id, name: user.full_name, role: user.role }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };
import { useState } from 'react';
import { Input, Button, Form, message } from 'antd';

export default function Register() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            message.error('Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            message.error('Passwords do not match');
            return;
        }
        console.log('Register:', { email, password });
        message.success('Registration successful!');
    };

    return (
        <Form style={{ width: '100%', maxWidth: 300 }} layout="vertical">
            <Form.Item label="Email">
                <Input 
                    placeholder="Email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Password">
                <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                />
            </Form.Item>
            <Form.Item label="Confirm Password">
                <Input.Password
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    visibilityToggle={{ visible: confirmPasswordVisible, onVisibleChange: setConfirmPasswordVisible }}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" block onClick={handleRegister}>
                    Sign Up
                </Button>
            </Form.Item>
        </Form>
    );
}
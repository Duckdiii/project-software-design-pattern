import { useState } from 'react';
import { Button, Form, Input, Space, message } from 'antd';

export default function Login() {
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      message.error('Please fill all fields');
      return;
    }

    console.log('Login:', { email, password });
    message.success('Login successful!');
  };

  return (
    <Form style={{ width: '100%', maxWidth: 300 }} layout="vertical">
      <Form.Item label="Email">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item label="Password">
        <Space>
          <Input.Password
            placeholder="Input password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
          <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prev) => !prev)}>
            {passwordVisible ? 'Hide' : 'Show'}
          </Button>
        </Space>
      </Form.Item>

      <Form.Item>
        <Button type="primary" block onClick={handleLogin}>
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}

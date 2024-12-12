import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '@/lib/authenticate';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';

export default function RegisterPage() {
  const router = useRouter();
  const [userName, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await registerUser(userName, password, password2);
      console.log(userName, password, password2);
      router.push('/login'); // Redirect to login page
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h1>Register</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={password2}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

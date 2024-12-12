import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { authenticateUser } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setFavourites] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authenticateUser(userName, password); // Authenticate and store token
      setFavourites(await getFavourites()); // Update favourites
      setSearchHistory(await getHistory()); // Update search history
      setUser("");
      setPassword("");
      router.push('/favourites'); // Redirect to favourites page
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h1>Login</h1>
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
          <Button type="submit" variant="primary">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

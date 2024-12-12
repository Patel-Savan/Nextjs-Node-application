import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store'; // Import the searchHistoryAtom from store
import { Form, FormControl, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { addToHistory } from '@/lib/userData'; // Import API function to add to search history

export default function SearchPage() {
  const router = useRouter();
  const [searchField, setSearchField] = useState('');
  const [searching, setSearching] = useState(false); // State to show loading indicator
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // Get and set search history
  const [error, setError] = useState(null); // State for error handling

  // Handle form submission
  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchField.trim() !== '') {
      try {
        setSearching(true); // Show loading state
        const query = `title=true&q=${searchField}`;

        // Add search to backend and update atom
        await addToHistory(query);
        setSearchHistory((currentHistory) => [...currentHistory, query]);

        router.push(`/artwork?${query}`); // Navigate to the artwork page with search query
      } catch (err) {
        setError('Failed to save search to history. Please try again.');
      } finally {
        setSearching(false); // Reset loading state
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="my-4 text-center">Advanced Search</h1>

      <Row className="justify-content-center">
        <Col md={8}>
          <Form className="d-flex" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search Artwork"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="me-2"
            />
            <Button type="submit" variant="outline-primary" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </Form>
        </Col>
      </Row>

      {error && (
        <Row className="mt-3">
          <Col md={8} className="mx-auto">
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <h4>Search for artwork by title or other criteria</h4>
              <p>Use the search bar above to find artwork based on your query.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12}>
          <Card>
            <Card.Body>
              <h5>Instructions:</h5>
              <ul>
                <li>Enter a title to search for artwork by its name.</li>
                <li>You can modify your search terms later for more specific results.</li>
                <li>Try including more details like artist name, medium, or date in the search.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

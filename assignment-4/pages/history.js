import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { ListGroup, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getHistory, removeFromHistory } from '@/lib/userData'; // Import API functions for history management

export default function HistoryPage() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // Access the search history atom
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state
  const router = useRouter();

  // Fetch search history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory(); // Fetch history from the API
        setSearchHistory(data || []); // Update atom with fetched data
        setLoading(false);
      } catch (err) {
        setError('Failed to load search history. Please try again.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [setSearchHistory]);

  // Function to handle click on a history item (navigate to that search)
  const historyClicked = (index) => {
    router.push(`/artwork?${searchHistory[index]}`); // Navigate to the selected search
  };

  // Function to handle removing an item from the history
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); // Prevent triggering historyClicked on button click
    try {
      const query = searchHistory[index];
      await removeFromHistory(query); // Remove the item from the backend
      setSearchHistory((current) => {
        const updatedHistory = [...current];
        updatedHistory.splice(index, 1); // Remove the selected history item
        return updatedHistory;
      });
    } catch (err) {
      setError('Failed to remove search history item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading Search History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="my-4">Search History</h1>
      {searchHistory.length > 0 ? (
        <ListGroup>
          {searchHistory.map((query, index) => {
            // Parse the query string to make it human-readable
            const params = new URLSearchParams(query);
            const parsedQuery = Object.fromEntries(params.entries());

            return (
              <ListGroup.Item
                key={index}
                onClick={() => historyClicked(index)} // Navigate on click
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  {/* Display each key-value pair in the query string */}
                  {Object.keys(parsedQuery).map((key) => (
                    <span key={key}>
                      {key}: <strong>{parsedQuery[key]}</strong>&nbsp;
                    </span>
                  ))}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => removeHistoryClicked(e, index)} // Remove history on button click
                >
                  &times;
                </Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try searching for some artwork to see your history.</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

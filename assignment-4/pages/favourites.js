import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import { useEffect, useState } from 'react';
import { getFavourites } from '@/lib/userData';

export default function FavouritesPage() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); // Retrieve and update the favourites list
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state

  // Fetch favourites from the backend
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const data = await getFavourites(); // Fetch favourites from the API
        setFavouritesList(data || []); // Update atom with fetched data
        setLoading(false);
      } catch (err) {
        setError('Failed to load favourites. Please try again.');
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [setFavouritesList]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading Favourites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <Card>
          <Card.Body>
            <h4>Error</h4>
            <p>{error}</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="my-4">Favourites</h1>
      {favouritesList.length > 0 ? (
        <Row className="gy-4">
          {favouritesList.map((objectID) => (
            <Col sm={12} md={6} lg={4} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try adding some artwork to your favourites list.</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

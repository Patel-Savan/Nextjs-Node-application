import { useAtom } from 'jotai';
import useSWR from 'swr';
import Error from 'next/error';
import { Card, Button } from 'react-bootstrap';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData'; // Import API functions for favourites management

// Fetcher function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error fetching data');
  return res.json();
};

export default function ArtworkCardDetail({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
    fetcher
  );

  console.log(data);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); // Use the favouritesAtom to manage the list

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  const {
    primaryImage,
    title,
    objectDate,
    classification,
    medium,
    artistDisplayName,
    artistWikidata_URL,
    creditLine,
    dimensions,
  } = data;

  // Check if the current artwork is in the favourites list
  const isFavourite = favouritesList?.includes(objectID);

  // Function to handle adding/removing from favourites
  const toggleFavourite = async () => {
    try {
      if (isFavourite) {
        await removeFromFavourites(objectID); // Remove from API
        setFavouritesList(favouritesList.filter((id) => id !== objectID)); // Update state
      } else {
        await addToFavourites(objectID); // Add to API
        setFavouritesList([...favouritesList, objectID]); // Update state
      }
    } catch (err) {
      console.error('Error updating favourites:', err);
    }
  };

  console.log(primaryImage);

  return (
    <Card style={{ margin: '1rem' }}>
      {primaryImage && <Card.Img variant="top" src={primaryImage} alt={title || 'Image Not Available'} />}
      <Card.Body>
        <Card.Title>{title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || 'N/A'} <br />
          <strong>Classification:</strong> {classification || 'N/A'} <br />
          <strong>Medium:</strong> {medium || 'N/A'} <br />
          <br />
          <strong>Artist:</strong> {artistDisplayName || 'N/A'}
          {artistWikidata_URL && (
            <>
              {' '}
              <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
                wiki
              </a>
            </>
          )}
          <br />
          <strong>Credit:</strong> {creditLine || 'N/A'} <br />
          <strong>Dimensions:</strong> {dimensions || 'N/A'}
        </Card.Text>
        {/* Add to Favourites Button */}
        <Button variant={isFavourite ? 'primary' : 'outline-primary'} onClick={toggleFavourite}>
          {isFavourite ? '+ Favourite (added)' : '+ Favourite'}
        </Button>
      </Card.Body>
    </Card>
  );
}

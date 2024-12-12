import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ArtworkCard from '@/components/ArtworkCard';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import Error from 'next/error';
import validObjectIDList from '@/public/data/validObjectIDList.json';

const PER_PAGE = 12;

export default function ArtworkPage() {
  const router = useRouter();
  const { query } = router;
  const [artworkList, setArtworkList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (query.q) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query.q}`
          );

          if (!response.ok) {
            throw new Error('API error');
          }

          const data = await response.json();

          if (data && data.objectIDs) {

            // Filter valid object IDs
            const filteredResults = validObjectIDList.objectIDs.filter((id) =>
              data.objectIDs.includes(id)
            );

            // Paginate filtered results
            let results = [];
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
              results.push(filteredResults.slice(i, i + PER_PAGE));
            }

            setArtworkList(results);
            setPage(1);
          } else {
            setArtworkList([]);
          }
        } catch (error) {
          console.error('API Error:', error);
          setApiError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [query]);

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < artworkList.length) setPage(page + 1);
  };

  if (loading) return <p>Loading...</p>;
  if (apiError) return <Error statusCode={404} />;

  return (
    <div>
      {artworkList.length > 0 ? (
        <>
          <Row className="gy-4">
            {artworkList[page - 1].map((objectID) => (
              <Col sm={12} md={6} lg={4} key={objectID}>
                <ArtworkCard objectID={objectID} />
              </Col>
            ))}
          </Row>
          <Row>
            <Col>
              <Pagination>
                <Pagination.Prev onClick={previousPage} />
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next onClick={nextPage} />
              </Pagination>
            </Col>
          </Row>
        </>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try searching for something else.</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

import Image from 'react-bootstrap/Image';
import { Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg"
        alt="Metropolitan Museum of Art"
        fluid
        rounded
        className="mb-4"
      />

      <Row>
        <Col lg={6}>
          <p>
            The Metropolitan Museum of Art in New York City, colloquially "the Met", is the largest art museum 
            in the Americas. Its permanent collection contains over two million works, divided among 17 curatorial 
            departments. The main building at 1000 Fifth Avenue is one of the world's largest art museums. 
          </p>
        </Col>
        <Col lg={6}>
          <p>
            The museum's collection includes works of art from classical antiquity and Ancient Egypt, paintings, 
            sculptures from nearly all European masters, and an extensive collection of American and modern art. 
          </p>
          <p>
            For more details, visit the official Wikipedia page: 
            <a 
              href="https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art" 
              target="_blank" 
              rel="noreferrer"
            >
              here
            </a>.
          </p>
        </Col>
      </Row>
    </>
  );
}

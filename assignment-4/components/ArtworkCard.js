import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button } from "react-bootstrap";

export default function ArtworkCard({ objectID }) {
  const [artworkImage, setArtworkImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [artworkDetails, setArtworkDetails] = useState({}); // To store additional artwork details

  useEffect(() => {
    const fetchArtworkData = async () => {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      );
      const data = await response.json();
      setArtworkImage(data.primaryImage || "N/A"); // Fallback to a default image if no primaryImage
      setArtworkDetails({
        title: data.title,
        date: data.objectDate || "N/A",
        classification: data.classification || "N/A",
        medium: data.medium || "N/A"
      });
      setLoading(false);
    };

    fetchArtworkData();
  }, [objectID]);

  if (loading) return <p>Loading Image...</p>;

  return (
    <Card className="artwork-card">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          overflow: "hidden"
        }}
      >
        {artworkImage == "N/A" ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#888",
              fontSize: "16px",
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            Image Not Available
          </div>
        ) : (
          <Card.Img
            variant="top"
            src={artworkImage}
            alt="Artwork Image"
            style={{ objectFit: "cover", width: "100%", height: "100%" }} // Ensuring the image covers the space
          />
        )}
      </div>
      <Card.Body>
        <Card.Title>{artworkDetails.title}</Card.Title>
        {/* Display additional artwork details */}
        <Card.Text>
          <strong>Date:</strong> {artworkDetails.date} <br />
          <strong>Classification:</strong> {artworkDetails.classification}{" "}
          <br />
          <strong>Medium:</strong> {artworkDetails.medium} <br />
          <Link href={`/artwork/${objectID}`} passHref>
            <Button className="bg-white text-black mt-2">
              <strong>Object ID : </strong> {objectID} <br />
            </Button>
          </Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

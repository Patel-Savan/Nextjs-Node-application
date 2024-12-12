import { useRouter } from 'next/router';
import ArtworkCardDetail from '@/components/ArtworkCardDetail'; // Import ArtworkCardDetail

export default function ArtworkDetailPage() {
  const router = useRouter();
  const { objectID } = router.query; // Retrieve objectID from the URL

  if (!objectID) {
    return <p>No artwork selected.</p>; // Handle the case where objectID is not available yet
  }

  return (
    <div>
      <h1>Artwork Details</h1>
      <ArtworkCardDetail objectID={objectID} /> {/* Pass objectID to ArtworkCardDetail */}
    </div>
  );
}

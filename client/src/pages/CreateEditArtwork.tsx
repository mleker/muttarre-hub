import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Artwork {
  title: string;
  description: string;
  imagesUrl: string[];
  price: number,
  artistId: string,
  isPublished: boolean,
  shopifyProductId: string,
  createdAt: Date,
}

function CreateEditArtwork() {
  const { id } = useParams();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      // if the id is present, fetch the artwork data
      fetchArtwork(id);
    }
  }, [id]);

  const fetchArtwork = async (artworkId: string) => {
    const response = await fetch(`/api/artworks/${artworkId}`);
    const data = await response.json();
    setArtwork(data);
  };

  return (
    <div>
      <div>
        {artwork ? (
          <form>
            <div>
              <label>
                Title
                <input type="text" value={artwork.title} />
              </label>
            </div>
            <div>
              <label>
                Description
                <textarea value={artwork.description} />
              </label>
            </div>
            <div>
              <label>
                Images
                <input type="file" />
              </label>
            </div>
            <div>
              {editing ? (
                <button type="submit">{'Save'}</button>
              ) : (
                <button onClick={() => setEditing(true)}>{'Edit'}</button>
              )}
            </div>
          </form>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default CreateEditArtwork;

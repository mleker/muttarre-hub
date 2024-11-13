import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Artwork } from '../types';
import { Layout } from '../../components/layout/Layout';
import styles from './artwork.module.css';
import { BACKEND_API } from '../../api/config';

// TODO: add form validation
// TODO: add error handling
// TODO: refactor in smaller components
export const CreateEditArtwork = () => {
  const { id } = useParams();

  const [artwork, setArtwork] = useState<Artwork>({
    _id: '',
    title: '',
    description: '',
    imageUrls: [],
    price: 0,
    height: 0,
    width: 0,
    depth: 0,
    technik: '',
    // TODO: get artistId from auth
    artistId: '603d74fbf4b3b3b3b8b3b3b3',
    isPublished: false,
    shopifyProductId: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      // if the id is present, fetch the artwork data
      fetchArtwork(id);
    }
  }, [id]);

  const fetchArtwork = async (artworkId: string) => {
    const response = await fetch(`${BACKEND_API}/api/artworks/${artworkId}`);
    const data = await response.json();
    setArtwork(data);
    // Generate full URLs for saved images
    const fullImageUrls = data.imageUrls.map((url: string) => `${BACKEND_API}${url}`);
    setPreviewUrls(fullImageUrls);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImageFiles([...imageFiles, ...files]); // Add selected files to state

    // Generate and set preview URLs for each selected file
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    setArtwork({ ...artwork, imageUrls: artwork.imageUrls?.filter((_, i) => i !== index) });
  };

  const saveArtwork = async (artwork: Artwork) => {
    fetch(`${BACKEND_API}/api/artworks/${artwork._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artwork),
    });
  }

  const deleteArtwork = async (artwork: Artwork) => {
    if (window.confirm('Are you sure?')) {
      await fetch(`${BACKEND_API}/api/artworks/${artwork._id}`, {
        method: 'DELETE',
      });
    }

    window.location.href = '/artworks';
  }

  const createArtwork = async () => {
    const formData = new FormData();

    // Add artwork data to formData
    formData.append('title', artwork.title);
    formData.append('description', artwork.description);
    formData.append('price', artwork.price.toString());
    formData.append('height', artwork.height.toString());
    formData.append('width', artwork.width.toString());
    formData.append('depth', artwork.depth.toString());
    formData.append('technik', artwork.technik);
    formData.append('artistId', artwork.artistId);
    formData.append('shopifyProductId', artwork.shopifyProductId);

    // Add image files to formData
    imageFiles.forEach((file) => {
      formData.append('images', file); // Field name 'images' should match the field name in the backend
    });

    try {
      const response = await fetch(`${BACKEND_API}/api/artworks`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании artwork');
      }

      const data = await response.json();
      console.log('Artwork created:', data);
      window.location.href = '/artworks';
    } catch (error) {
      console.error('Error creating artwork:', error);
    }
  };


  return (
    <Layout>
      {artwork || (!artwork && !id) ? (
        // TODO: form validation
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onChange={() => setEditing(true)}
        >
          {/* artwork data */}
          <div>
            <div>
              <input
                type="text"
                value={artwork?.title || ''}
                onChange={(e) =>
                  setArtwork({ ...artwork, title: e.target.value })
                }
                placeholder='title'
              />
            </div>
            <div>
              <input
                type="text"
                value={artwork?.price || ''}
                onChange={(e) =>
                  setArtwork({ ...artwork, price: +e.target.value })
                }
                placeholder='price'
              />
            </div>
            <div>
              <textarea
                value={artwork?.description || ''}
                onChange={(e) => setArtwork({ ...artwork, description: e.target.value })}
                placeholder='description'
              />
            </div>

            <div>
              {/* i want it to be able to upload multiple images and preview them*/}
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                name="images"
              />
              <div className={styles.imagesPreviewContainer}>
                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    className={styles.imagePreviewContainer}
                  >
                    <img
                      src={url}
                      alt={`preview ${i + 1}`}
                      className={styles.imagePreview}
                      width='150'
                      height='100'
                    />
                    <div
                      className={styles.imagePreviewDeleteIcon}
                      onClick={() => removeImage(i)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                value={artwork?.height || ''}
                onChange={(e) =>
                  setArtwork({ ...artwork, height: +e.target.value })
                }
                placeholder='height'
              />
            </div>

            <div>
              <input
                type="text"
                value={artwork?.width || ''}
                onChange={(e) =>
                  setArtwork({ ...artwork, width: +e.target.value })
                }
                placeholder='width'
              />
            </div>
            <div>
              <input
                type="text"
                value={artwork?.depth || ''}
                onChange={(e) =>
                  setArtwork({ ...artwork, depth: +e.target.value })
                }
                placeholder='depth'
              />
            </div>
          </div>

          {/* buttons */}
          {id ? (
            <div>
              <div>

                <button
                  type="submit"
                  disabled={!editing}
                  className={styles.button}
                  onClick={() => artwork && saveArtwork(artwork)}
                >
                  {'Save'}
                </button>
              </div>
              <div>
                <button
                  className={`${styles.button} ${styles.buttonDelete}`}
                  onClick={() => artwork && deleteArtwork(artwork)}
                >
                  {'Delete'}
                </button>
              </div>
            </div>
          ) : (
            // if no id then create new artwork
            <button
              type="submit"
              disabled={!editing}
              className={styles.button}
              onClick={createArtwork}
            >
              {'Create'}
            </button>
          )}

        </form>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  );
}
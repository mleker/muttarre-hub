import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_API } from '../../api/config';
import { Layout } from '../../components/layout/Layout';
import { Artwork } from '../types';
import styles from './artworks.module.css';

export const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    fetchArtworks();
  }, [])

  const fetchArtworks = async () => {
    try {
      const response = await fetch(`${BACKEND_API}/api/artworks/`);
      if (!response.ok) throw new Error('Ошибка при загрузке данных');
      const data = await response.json();
      setArtworks(data)
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <Layout>
      <div className={styles.artworks}>
        <div className={styles.artworksPeview}>
          {artworks ? (
            artworks.map((item, i) => (
              <Link
                to={`/artworks/edit/${item._id}`}
                key={i}
                className={styles.artworksPreview}>
                <img
                  className={styles.artworksPreviewImage}
                  src={`${BACKEND_API}${item.imageUrls[0]}`}
                  alt='artwork-preview'
                  height={200}
                  width={300}
                />

              </Link>
            ))
          ) : (
            'No artworks yet'
          )}
        </div>
        <Link
          className={styles.artworksNewButton}
          to='/artworks/new'
        >
          Add
        </Link>
      </div>
    </Layout>
  );
}
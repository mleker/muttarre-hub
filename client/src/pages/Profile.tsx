import { useContext, useState } from 'react';
import styles from './artwork/artwork.module.css';
import { ArtistContext } from '../../context';
import { BACKEND_API } from '../api/config';
import { Artist } from './types';
import { Layout } from '../components/layout/Layout';

export const Profile = () => {
  // хочу иметь возможность менять контекст
  const { _id, name, bio, email } = useContext(ArtistContext);
  const [artist, setArtist] = useState<Artist>({ _id, name, bio, email });
  const [editing, setEditing] = useState(false);

  const saveArtist = async (artist: Artist) => {
    fetch(`${BACKEND_API}/api/artist/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artist),
    });
  }

  return (
    <Layout>
      {/* TODO: form validation */}
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onChange={() => setEditing(true)}
      >
        <div>
          <div>
            <input
              type="text"
              value={artist.name || ''}
              onChange={(e) =>
                setArtist({ ...artist, name: e.target.value })
              }
              placeholder='name'
            />
          </div>
          <div>
            <textarea
              value={artist?.bio || ''}
              onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
              placeholder='bio'
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!editing}
            className={styles.button}
            onClick={() => saveArtist(artist)}
          >
            {'Save'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
import React from 'react';
import { Artist } from './src/pages/types';

export const ArtistContext = React.createContext<Artist>({
  _id: '',
  name: '',
  email: '',
  bio: ''
});
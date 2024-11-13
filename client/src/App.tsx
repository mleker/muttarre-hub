import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import { Profile } from './pages/Profile';
import { Artworks } from './pages/artworks/Artworks';
import { CreateEditArtwork } from './pages/artwork/CreateEditArtwork';
import { ArtistContext } from '../context';



function App() {
  return (
    <ArtistContext.Provider value={{
      _id: '603d74fbf4b3b3b3b8b3b3b3',
      name: 'lenfant',
      email: 'katyaquel@gmail.com',
      bio: 'Amazing autor, who creates amazing things',
    }}>
      <Router>
        <Routes>
          <Route index element={<Artworks />} />
          <Route path="artworks" element={<Artworks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="artworks/new" element={<CreateEditArtwork />} />
          <Route path="artworks/edit/:id" element={<CreateEditArtwork />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </Router>
    </ArtistContext.Provider>
  )
}

export default App


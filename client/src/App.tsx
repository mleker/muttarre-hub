import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import { Profile } from './pages/Profile';
import { Artworks } from './pages/artworks/Artworks';
import { CreateEditArtwork } from './pages/artwork/CreateEditArtwork';

function App() {
  return (
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
  )
}

export default App


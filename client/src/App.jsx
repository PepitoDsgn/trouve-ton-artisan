import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import ListeArtisans from './pages/ListeArtisans';
import DetailArtisan from './pages/DetailArtisan';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <SearchBar />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/artisans" element={<ListeArtisans />} />
          <Route path="/artisans/:id" element={<DetailArtisan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

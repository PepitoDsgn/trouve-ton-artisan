import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Accueil from './pages/Accueil';
import ListeArtisans from './pages/ListeArtisans';
import DetailArtisan from './pages/DetailArtisan';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <a href="#contenu-principal" className="visually-hidden-focusable">
          Aller au contenu principal
        </a>
        <Navbar />
        <SearchBar />
        <main id="contenu-principal">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/artisans" element={<ProtectedRoute><ListeArtisans /></ProtectedRoute>} />
            <Route path="/artisans/:id" element={<ProtectedRoute><DetailArtisan /></ProtectedRoute>} />
            <Route path="/cookies" element={<LegalPage title="Cookies" />} />
            <Route path="/mentions-legales" element={<LegalPage title="Mentions légales" />} />
            <Route path="/accessibilite" element={<LegalPage title="Accessibilité" />} />
            <Route path="/donnees-personnelles" element={<LegalPage title="Données personnelles" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

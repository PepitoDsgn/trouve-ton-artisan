import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { FavorisProvider } from './context/FavorisContext';
import Accueil from './pages/Accueil';
import ListeArtisans from './pages/ListeArtisans';
import DetailArtisan from './pages/DetailArtisan';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Favoris from './pages/Favoris';
import MonCompte from './pages/MonCompte';
import DonneesPersonnelles from './pages/DonneesPersonnelles';
import AdminArtisans from './pages/admin/AdminArtisans';
import AdminArtisanForm from './pages/admin/AdminArtisanForm';
import AdminMessages from './pages/admin/AdminMessages';
import MentionsLegales from './pages/MentionsLegales';
import Cookies from './pages/Cookies';
import Accessibilite from './pages/Accessibilite';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavorisProvider>
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
              <Route path="/favoris" element={<ProtectedRoute><Favoris /></ProtectedRoute>} />
              <Route path="/compte" element={<ProtectedRoute><MonCompte /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminArtisans /></ProtectedRoute>} />
              <Route path="/admin/artisans/nouveau" element={<ProtectedRoute role="admin"><AdminArtisanForm /></ProtectedRoute>} />
              <Route path="/admin/artisans/:id" element={<ProtectedRoute role="admin"><AdminArtisanForm /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/accessibilite" element={<Accessibilite />} />
              <Route path="/donnees-personnelles" element={<DonneesPersonnelles />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </FavorisProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Footer() {
  return (
    <footer className="footer-artisan" aria-label="Pied de page">
      <div className="container">
        <div className="row align-items-start gy-4">
          <div className="col-12 col-md-4 d-none d-md-block">
            <div className="footer-logo">
              <img src={logo} alt="Trouve ton artisan ! – Avec la région Auvergne-Rhône-Alpes" height="56" />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <address style={{ fontStyle: 'normal', lineHeight: 1.8 }}>
              101 cours Charlemagne
              <br />
              CS 20033 - 69269 LYON CEDEX 02
              <br />
              +33 (0)4 26 73 40 00
            </address>
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex flex-wrap gap-3">
              <Link to="/cookies">Cookies</Link>
              <Link to="/mentions-legales">Mentions légales</Link>
              <Link to="/accessibilite">Accessibilité</Link>
              <Link to="/donnees-personnelles">Données personnelles</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

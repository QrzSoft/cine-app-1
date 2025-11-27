import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>
      <Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''}>Películas</Link>
      <Link to="/series" className={location.pathname === '/series' ? 'active' : ''}>Series</Link>
      <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>Favoritos</Link>
    </nav>
  );
};

export default Navbar;

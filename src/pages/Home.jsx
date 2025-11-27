import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { movieAPI } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Home.css';

const GENRES = { 28: "Acción", 12: "Aventura", 16: "Animación", 35: "Comedia", 80: "Crimen", 99: "Documental", 18: "Drama", 10751: "Familia", 14: "Fantasía", 36: "Historia", 27: "Terror", 10402: "Música", 9648: "Misterio", 10749: "Romance", 878: "Ciencia Ficción", 10770: "Película de TV", 53: "Suspenso", 10752: "Bélica", 37: "Western" };

const Home = () => {  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useLocalStorage('userData', {});

  const MOVIES_PER_PAGE = 10;


  useEffect(()=>{
    setPage(1);
  }, [query, genreFilter]);


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = query
          ? await movieAPI.searchMulti(query)
          : await movieAPI.getPopularMovies();

        const moviesWithUserData = res.data.results.map(movie => ({
          ...movie,
          ...userData[movie.id],
          comments: userData[movie.id]?.comments || [],
          genre_names: movie.genre_ids?.map(id => GENRES[id]) || [],
        }));

        setMovies(moviesWithUserData);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [query, userData]);

  const handleLike = (id) => {
    const currentData = userData[id] || {};
    setUserData(prev => ({
      ...prev,
      [id]: { ...prev[id], liked: !currentData.liked, likes: (currentData.likes || 0) + (currentData.liked ? -1 : 1), comments: currentData.comments || [] }
    }));
  };

  const handleComment = (id, text) => {
    const currentData = userData[id] || {};
    setUserData(prev => ({
      ...prev,
      [id]: { ...prev[id], comments: [...(currentData.comments || []), text], liked: currentData.liked || false, likes: currentData.likes || 0 }
    }));
  };

  const filteredMovies = genreFilter ? movies.filter(m => m.genre_names.includes(genreFilter)) : movies;
  const start = (page - 1) * MOVIES_PER_PAGE;
  const paginatedMovies = filteredMovies.slice(start, start + MOVIES_PER_PAGE);
  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);

  return (
    <div className="home">
      <div className="controls">
        <input type="text" placeholder="Buscar películas o series..." value={query} onChange={e => setQuery(e.target.value)} className="search-bar"/>
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">Todos los géneros</option>
          {Object.values(GENRES).map((g, i) => <option key={i} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? <div className="loading">Cargando...</div> :
      <>
        <div className="movies-grid">
          {paginatedMovies.map(movie => (
            <MovieCard key={movie.id} item={movie} onLike={handleLike} onComment={handleComment} />
          ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </>}
    </div>
  );
};

export default Home;


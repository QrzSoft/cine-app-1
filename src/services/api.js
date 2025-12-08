// Paso 1: Importar axios
import axios from 'axios';

// Paso 2: Configurar la URL base y parámetros
const API_KEY = '1398c4b2e5d13af50d651bbaa1c13299';
const BASE_URL = 'https://api.themoviedb.org/3';

// Paso 3: Crear instancia de axios con configuración
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES'
  }
});

// Paso 4: Exportar funciones para diferentes endpoints
export const movieAPI = {
  // Películas y series populares
  getPopularMovies: () => api.get('/movie/popular'),
  getPopularSeries: () => api.get('/tv/popular'),

  // Buscar por nombre
  searchMulti: (query) =>
    api.get('/search/multi', { params: { query } }),

  // 🔥 NUEVOS ENDPOINTS (NECESARIOS PARA DETALLES Y TRAILER)

  // Detalles de película por ID
  getMovieDetails: (id) => api.get(`/movie/${id}`),

  // Detalles de serie por ID
  getSeriesDetails: (id) => api.get(`/tv/${id}`),

  // Videos y trailers de película (YouTube)
  getMovieVideos: (id) => api.get(`/movie/${id}/videos`)
};

export default api;

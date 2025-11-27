// Paso 1: Importar axios
import axios from 'axios';


// Paso 2: Configurar la URL base y parámetros
const API_KEY = 'tu_api_key_aqui';
const BASE_URL = 'https://api.themoviedb.org/3';


// Paso 3: Crear instancia de axios con configuración
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: "1398c4b2e5d13af50d651bbaa1c13299",
    language: 'es-ES'
  }
});


// Paso 4: Exportar funciones para diferentes endpoints
export const movieAPI = {
  getPopularMovies: () => api.get('/movie/popular'),
  getPopularSeries: () => api.get('/tv/popular'),
  searchMulti: (query) => 
    api.get('/search/multi', { params: { query } })
};

export default api;
// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";

function App() {
  // 1️⃣ Estado para almacenar al usuario logueado
  const [user, setUser] = useState(null);

  // 2️⃣ Detectar si el usuario inicia/cierra sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u); // guardamos al usuario (o null si cerró sesión)
    });

    // limpieza cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {/* PASAMOS user al Navbar para mostrar foto/nombre/botón logout si quieres */}
      <Navbar user={user} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/movies" element={<Movies user={user} />} />
          <Route path="/series" element={<Series user={user} />} />
          <Route path="/favorites" element={<Favorites user={user} />} />

          {/* Aquí añades la ruta de detalles y le pasas user */}
          <Route path="/movie/:id" element={<MovieDetails user={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

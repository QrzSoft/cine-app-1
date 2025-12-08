// src/pages/Favorites.jsx
import React from "react";

export default function Favorites({ user }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Favoritos</h1>

      {user ? (
        <div>
          <p>Hola {user.displayName || user.email}, aquí están tus favoritos:</p>
          {/* Aquí puedes mapear tus favoritos: */}
          <p className="mt-4 text-sm text-gray-600">Aún no tienes favoritos guardados.</p>
        </div>
      ) : (
        <p>Inicia sesión para ver tus favoritos.</p>
      )}
    </div>
  );
}

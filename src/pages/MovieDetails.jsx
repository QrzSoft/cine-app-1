// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { movieAPI } from "../services/api";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const MovieDetails = ({ user }) => {
  const { id } = useParams(); // id de la ruta /movie/:id
  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comentarios
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  // Cargar detalles y videos (trailer)
  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const [detailsRes, videosRes] = await Promise.all([
          movieAPI.getMovieDetails(id),
          movieAPI.getMovieVideos(id),
        ]);
        if (!mounted) return;
        setDetails(detailsRes.data || {});
        setVideos(videosRes.data?.results || []);
      } catch (err) {
        console.error("Error cargando detalles:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Escuchar comentarios en tiempo real (Firestore)
  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, `comments-${id}`);
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const arr = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setComments(arr);
      },
      (err) => {
        console.error("Error en snapshot de comentarios:", err);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const trailer =
    videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    videos.find((v) => v.site === "YouTube") ||
    null;

  const handlePostComment = async (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;
    if (!user) return alert("Debes iniciar sesión para publicar un comentario.");
    setPosting(true);
    try {
      await addDoc(collection(db, `comments-${id}`), {
        text: commentText.trim(),
        uid: user.uid,
        displayName: user.displayName || "Anon",
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
    } catch (err) {
      console.error("Error publicando comentario:", err);
      alert("No se pudo publicar. Reintenta.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Cargando detalles...</div>;

  if (!details) return <div style={{ padding: 20 }}>No se encontraron detalles.</div>;

  return (
    <div className="movie-details" style={{ padding: 20, maxWidth: 980 }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: 12 }}>
        ← Volver
      </Link>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Poster e info lateral */}
        <div style={{ flex: "0 0 300px", width: "300px" }}>
          {details.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title || details.name}
              style={{
                dispaly: "block", 
                width: "100%",
                height: "auto",
                borderRadius: 8,
                objectFit: "cover" 
              }}
            />
          ) : (
            <div style={{ width: 300, height: 450, background: "#ddd", borderRadius: 8 }} />
          )}
        </div>

        {/* Texto principal */}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginTop: 0 }}>{details.title || details.name}</h1>
          <p style={{ color: "#666" }}>
            {details.release_date ? `Estreno: ${details.release_date}` : ""}
            {details.first_air_date ? ` • Primera emisión: ${details.first_air_date}` : ""}
          </p>

          <p style={{ lineHeight: 1.6 }}>{details.overview || "Sin descripción."}</p>

          {/* Datos extra */}
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {details.genres?.map((g) => (
              <span
                key={g.id}
                style={{
                  background: "#eee",
                  padding: "6px 10px",
                  borderRadius: 18,
                  fontSize: 13,
                }}
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Trailer */}
          <div style={{ marginTop: 20 }}>
            <h3>Trailer</h3>
            {trailer ? (
              <div style={{ maxWidth: 720 }}>
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p>No se encontró trailer disponible.</p>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DE COMENTARIOS */}
      <div style={{ marginTop: 36 }}>
        <h3>Comentarios</h3>

        {/* Formulario */}
        <form onSubmit={handlePostComment} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={user ? "Escribe un comentario..." : "Inicia sesión para comentar..."}
            disabled={!user || posting}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={!user || posting}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: user ? "#1976d2" : "#999",
              color: "#fff",
              cursor: user ? "pointer" : "not-allowed",
            }}
          >
            {posting ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {/* Mensaje si no autenticado */}
        {!user && (
          <p style={{ color: "#444", marginTop: 6 }}>
            <strong>Nota:</strong> Debes iniciar sesión para publicar comentarios.
          </p>
        )}

        {/* Lista de comentarios */}
        <div style={{ marginTop: 12 }}>
          {comments.length === 0 ? (
            <p style={{ color: "#666" }}>Aún no hay comentarios. Sé el primero.</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 12,
                  borderRadius: 8,
                  background: "#fafafa",
                  marginBottom: 8,
                }}
              >
                <div style={{ width: 44, height: 44 }}>
                  {c.photoURL ? (
                    <img src={c.photoURL} alt={c.displayName} style={{ width: 44, height: 44, borderRadius: 22 }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: "#ddd" }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong>{c.displayName || "Anon"}</strong>
                    <small style={{ color: "#888" }}>
                      {c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString() : ""}
                    </small>
                  </div>
                  <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

// src/components/MovieCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import LikeIcon from "../assets/icons/like.png";
import LikedIcon from "../assets/icons/liked.png";

const MovieCard = ({ item, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(item.id, commentText);
      setCommentText("");
    }
  };

  // Evitar que clicks en botones (like, comentar) disparen el Link padre
  const stop = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="movie-card">
      {/* Enlazamos imagen + título a la página de detalle */}
      <Link to={`/movie/${item.id}`} className="movie-link" style={{ textDecoration: "none", color: "inherit" }}>
        <img
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : "/placeholder-image.jpg"
          }
          alt={item.title || item.name}
          className="movie-poster"
        />
        <div className="movie-info">
          <h3>{item.title || item.name}</h3>
          <p className="overview">{item.overview?.substring(0, 150)}...</p>
        </div>
      </Link>

      {/* Controles (no deben propagar el click al Link) */}
      <div className="controls" style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <div
          className="like-container"
          onClick={(e) => {
            stop(e);
            onLike(item.id);
          }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <img src={item.liked ? LikedIcon : LikeIcon} alt="like" width={24} height={24} />
          <span>{item.likes || 0}</span>
        </div>

        <button
          className="comment-toggle-btn"
          onClick={(e) => {
            stop(e);
            setShowComments((prev) => !prev);
          }}
        >
          💬 Comentarios ({item.comments?.length || 0})
        </button>
      </div>

      {/* Sección de comentarios (no envía el form fuera) */}
      {showComments && (
        <div className="comments" onClick={stop}>
          <div className="comments-list">
            {item.comments?.map((c, i) => (
              <p key={i} className="comment-item">• {c}</p>
            )) || <p style={{ color: "#666" }}>Sin comentarios.</p>}
          </div>

          <form onSubmit={handleCommentSubmit} className="comment-form" style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un comentario"
              style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc" }}
            />
            <button type="submit" style={{ padding: "8px 12px", borderRadius: 6 }}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MovieCard;

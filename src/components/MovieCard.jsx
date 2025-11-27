import { useState } from 'react';
import './MovieCard.css';
import LikeIcon from '../assets/icons/like.png';
import LikedIcon from '../assets/icons/liked.png';

const MovieCard = ({ item, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(item.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="movie-card">
      <img
        src={item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : '/placeholder-image.jpg'}
        alt={item.title || item.name}
      />
      <div className="movie-info">
        <h3>{item.title || item.name}</h3>
        <p>{item.overview?.substring(0, 150)}...</p>

        {/* Sección de Like */}
        <div
          className="like-container"
          onClick={() => onLike(item.id)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <img
            src={item.liked ? LikedIcon : LikeIcon}
            alt="like"
            width={24}
            height={24}
          />
          <span>{item.likes || 0}</span>
        </div>

        {/* Sección de Comentarios */}
        <button onClick={() => setShowComments(prev => !prev)} className="comment-toggle">
          💬 Comentarios
        </button>

        {showComments && (
          <div className="comments">
            {item.comments?.map((c, i) => (
              <p key={i}>• {c}</p>
            ))}

            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe un comentario"
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

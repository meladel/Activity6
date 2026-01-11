import { useState, useEffect } from 'react';
import { getMovies, deleteMovie } from '../services/api';
import './MovieList.css';

function MovieList({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await getMovies();
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) return <div className='loading'>Loading cinema database...</div>;

  return (
    <div className='movie-list'>
      <div className='movie-list-header'>
        <h2>Now Showing</h2>
      </div>
      
      {movies.length === 0 ? (
        <div className='no-movies'>
            <p>The projection room is empty.</p>
            <p>Click 'Add New Movie' above to start the show.</p>
        </div>
      ) : (
        <div className='movies-grid'>
          {movies.map((movie) => (
            <div key={movie.id} className='movie-card' onClick={() => onSelectMovie(movie.id)}>
              <div className='card-content'>
                  <h3>{movie.title}</h3>
                  <p className='movie-genre'>{movie.genre} • {movie.releaseYear}</p>
                  <p className='movie-description'>{movie.description.substring(0, 100)}{movie.description.length > 100 ? '...' : ''}</p>
                  
                  <div className='movie-rating'>
                    <div className='rating-stars'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${star <= Math.round(calculateAverageRating(movie.reviews)) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className='rating-value'>{calculateAverageRating(movie.reviews)}</span>
                    <span className='review-count'>({movie.reviews?.length || 0})</span>
                  </div>
              </div>

              <div className='movie-actions'>
                <button className='btn-view' onClick={(e) => { e.stopPropagation(); onSelectMovie(movie.id); }}>
                  Details
                </button>
                <button className='btn-delete' onClick={(e) => handleDelete(movie.id, e)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
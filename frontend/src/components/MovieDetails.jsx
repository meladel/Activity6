import { useState, useEffect } from 'react';
import { getMovie, getMovieReviews, createReview, deleteReview } from '../services/api';
import './MovieDetails.css';

function MovieDetails({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const [movieRes, reviewsRes] = await Promise.all([
        getMovie(movieId),
        getMovieReviews(movieId),
      ]);
      setMovie(movieRes.data);
      setReviews(reviewsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        ...reviewForm,
        movieId: movieId,
      });
      setReviewForm({ userName: '', comment: '', rating: 5 });
      setShowReviewForm(false);
      fetchMovieDetails();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        fetchMovieDetails();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (loading) return <div className='loading'>Loading catch...</div>;
  if (!movie) return <div className='error'>Movie not found</div>;

  return (
    <div className='movie-details'>
      <button className='btn-back' onClick={onBack}>← Back to Movies</button>
      
      <div className='movie-header'>
        <h1>{movie.title}</h1>
        <p className='movie-meta'>{movie.genre} • {movie.releaseYear}</p>
        <p className='movie-full-description'>{movie.description}</p>
        
        <div className='rating-summary'>
          <div className='rating-display'>
            <div className='rating-stars-display'>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= Math.round(parseFloat(calculateAverageRating())) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className='rating-number'>{calculateAverageRating()} / 5</span>
          </div>
          <p className='review-count'>Based on {reviews.length} reviews</p>
        </div>
      </div>

      <div className='reviews-section'>
        <div className='reviews-header'>
          <h2>Audience Reviews</h2>
          <button className='btn-primary' onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Cancel Review' : '+ Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <form className='review-form' onSubmit={handleReviewSubmit}>
            <h3>Write your review</h3>
            <div className='form-group'>
              <label>Your Name</label>
              <input
                type='text'
                value={reviewForm.userName}
                onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
                required
              />
            </div>
            <div className='form-group'>
              <label>Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
              >
                <option value='5'>5 - Masterpiece</option>
                <option value='4'>4 - Great</option>
                <option value='3'>3 - Good</option>
                <option value='2'>2 - Fair</option>
                <option value='1'>1 - Poor</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                required
                rows='4'
              />
            </div>
            <div className='form-actions'>
              <button type='submit' className='btn-primary'>Submit Review</button>
            </div>
          </form>
        )}

        <div className='review-list'>
          {reviews.length === 0 ? (
            <p className='no-reviews'>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className='review-card'>
                <div className='review-header'>
                  <div>
                    <span className='reviewer-name'>{review.userName}</span>
                    <span className='review-date'> • {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className='review-rating'>
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className='star filled'>★</span>
                    ))}
                  </div>
                </div>
                <p className='review-comment'>{review.comment}</p>
                <button 
                  className='btn-text' 
                  style={{color: '#cf6679', fontSize: '0.8rem', marginTop: '1rem', padding: 0}}
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete Review
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
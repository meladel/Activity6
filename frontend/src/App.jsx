import { useState } from 'react'
import MovieList from './components/MovieList'
import MovieDetails from './components/MovieDetails'
import AddMovieForm from './components/AddMovieForm'
import './App.css'

function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectMovie = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleBackToList = () => {
    setSelectedMovieId(null);
    setRefreshKey(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleMovieAdded = () => {
    setRefreshKey(prev => prev + 1);
    setShowAddMovie(false);
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>Cinefy</h1>
        {!selectedMovieId && (
          <button 
            className='btn-primary' 
            onClick={() => setShowAddMovie(true)}
          >
            + Add New Movie
          </button>
        )}
      </header>

      <main className='app-main'>
        {selectedMovieId ? (
          <MovieDetails 
            movieId={selectedMovieId} 
            onBack={handleBackToList} 
          />
        ) : (
          <MovieList 
            key={refreshKey}
            onSelectMovie={handleSelectMovie}
          />
        )}
      </main>

      {showAddMovie && (
        <AddMovieForm
          onClose={() => setShowAddMovie(false)}
          onMovieAdded={handleMovieAdded}
        />
      )}
    </div>
  );
}

export default App
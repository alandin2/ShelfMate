import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import BookPopUp from '../components/BookPopUp';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem('shelfmate_favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    };

    loadFavorites();

    // Listen for favorites updates
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('favorites-updated', handleStorageChange);
    return () => window.removeEventListener('favorites-updated', handleStorageChange);
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleRemoveFromFavorites = (bookToRemove, e) => {
    if (e) {
      e.stopPropagation();
    }
    const updated = favorites.filter(book => book.id !== bookToRemove.id);
    localStorage.setItem('shelfmate_favorites', JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#703923' }}>My Favourites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center mb-4">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#703923" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No favourites yet</p>
            <p className="text-gray-500 text-sm mt-2">Start adding books you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((book) => (
              <div key={book.id} className="relative flex flex-col">
                {/* Remove button */}
                <button
                  onClick={(e) => handleRemoveFromFavorites(book, e)}
                  className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow-md"
                  style={{ 
                    border: '1.5px solid #703923',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#703923" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <BookCard book={book} onClick={handleBookClick} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookPopUp
          book={selectedBook}
          onClose={handleCloseModal}
          onHeart={() => handleRemoveFromFavorites(selectedBook)}
          onNotHeart={handleCloseModal}
          isLiked={true}
          hideAddToFavorites={true}
        />
      )}
    </div>
  );
}

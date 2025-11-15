import { useState, useEffect, useRef } from 'react';
import { SAMPLE_BOOKS } from '../data/books';

export default function DiscoveryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // 'like' or 'dislike'
  const isLikingRef = useRef(false); // Track if we're in the middle of a like action
  const cardRef = useRef(null);

  useEffect(() => {
    // Load favorites from localStorage
    const loadBooks = () => {
      try {
        const stored = localStorage.getItem('shelfmate_favorites');
        const favorites = stored ? JSON.parse(stored) : [];
        const favoriteIds = favorites.map(book => book.id);
        
        // Filter out books that are already in favorites
        const availableBooks = SAMPLE_BOOKS.filter(book => !favoriteIds.includes(book.id));
        setBooks(availableBooks);
      } catch (e) {
        console.error('Failed to load books:', e);
        setBooks(SAMPLE_BOOKS);
      }
    };

    loadBooks();

    // Listen for favorites updates
    const handleFavoritesUpdate = () => {
      // Don't reload books if we're in the middle of a like action
      if (!isLikingRef.current) {
        loadBooks();
      }
    };

    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    return () => window.removeEventListener('favorites-updated', handleFavoritesUpdate);
  }, []);

  const currentBook = books[currentIndex];

  const addToFavorites = (book) => {
    try {
      const stored = localStorage.getItem('shelfmate_favorites');
      const favorites = stored ? JSON.parse(stored) : [];
      
      // Check if book is already in favorites
      if (!favorites.find(fav => fav.id === book.id)) {
        favorites.push(book);
        localStorage.setItem('shelfmate_favorites', JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('favorites-updated'));
      }
    } catch (e) {
      console.error('Failed to add to favorites:', e);
    }
  };

  const handleLike = () => {
    if (currentBook) {
      setActiveButton('like');
      isLikingRef.current = true; // Set flag to prevent book list reload
      addToFavorites(currentBook);
      
      // Remove the current book from the list manually
      setTimeout(() => {
        const updatedBooks = books.filter(book => book.id !== currentBook.id);
        setBooks(updatedBooks);
        // Keep the same index, which will now point to the next book
        setActiveButton(null);
        isLikingRef.current = false; // Reset flag
      }, 200);
    }
  };

  const handleDislike = () => {
    setActiveButton('dislike');
    setTimeout(() => {
      moveToNextBook();
      setActiveButton(null);
    }, 200);
  };

  const moveToNextBook = () => {
    if (currentIndex < books.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to beginning or show "no more books" message
      setCurrentIndex(0);
    }
  };

  // Touch/Mouse event handlers for swipe
  const handleDragStart = (clientX) => {
    setDragStart(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (clientX) => {
    if (dragStart !== null && isDragging) {
      const offset = clientX - dragStart;
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        // Swiped right - like
        handleLike();
      } else {
        // Swiped left - dislike
        handleDislike();
      }
    }
    
    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleDragMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  if (!currentBook) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-20 max-w-2xl mx-auto w-full">
        <div className="text-center">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#703923" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <p className="text-gray-600 text-lg mb-2">No more books to discover!</p>
          <p className="text-gray-500 text-sm">Check back later for more recommendations</p>
        </div>
      </div>
    );
  }

  const rotation = dragOffset * 0.05;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-between w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-24"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Book Card */}
      <div className="flex-1 flex items-center justify-center w-full max-w-[90vw] sm:max-w-md">
        <div
          ref={cardRef}
          className="relative w-full select-none"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicators */}
          {isDragging && (
            <>
              <div
                className="absolute top-4 sm:top-8 left-4 sm:left-8 text-green-500 text-lg sm:text-2xl font-bold transform rotate-[-20deg] pointer-events-none"
                style={{
                  opacity: dragOffset > 0 ? Math.min(dragOffset / 100, 1) : 0,
                  border: '3px solid currentColor',
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}
              >
                LIKE
              </div>
              <div
                className="absolute top-4 sm:top-8 right-4 sm:right-8 text-red-500 text-lg sm:text-2xl font-bold transform rotate-[20deg] pointer-events-none"
                style={{
                  opacity: dragOffset < 0 ? Math.min(Math.abs(dragOffset) / 100, 1) : 0,
                  border: '3px solid currentColor',
                  padding: '6px 12px',
                  borderRadius: '8px'
                }}
              >
                NOPE
              </div>
            </>
          )}

          {/* Book Image */}
          <div 
            className="bg-gray-200 rounded-lg shadow-lg overflow-hidden mb-3 sm:mb-4"
            style={{ 
              aspectRatio: '2/3',
              maxHeight: 'min(65vh, 600px)',
              width: '100%'
            }}
          >
            <img
              src={currentBook.cover}
              alt={currentBook.title}
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>

          {/* Book Info */}
          <div className="text-center mb-4 sm:mb-6 px-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 line-clamp-2" style={{ color: '#703923' }}>
              {currentBook.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 line-clamp-1">{currentBook.author}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 sm:gap-8 items-center justify-center pb-2 sm:pb-4 w-full">
        {/* Dislike Button */}
        <button
          onClick={handleDislike}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
          style={{
            border: '3px solid #703923',
            backgroundColor: activeButton === 'dislike' ? '#703923' : 'white',
            transform: activeButton === 'dislike' ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <svg
            width="28"
            height="28"
            className="sm:w-8 sm:h-8"
            viewBox="0 0 24 24"
            fill={activeButton === 'dislike' ? 'white' : 'none'}
            stroke={activeButton === 'dislike' ? 'white' : '#703923'}
            strokeWidth={activeButton === 'dislike' ? '3' : '2.5'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
          style={{
            border: '3px solid #703923',
            backgroundColor: activeButton === 'like' ? '#703923' : 'white',
            transform: activeButton === 'like' ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <svg
            width="28"
            height="28"
            className="sm:w-8 sm:h-8"
            viewBox="0 0 24 24"
            fill={activeButton === 'like' ? 'white' : 'none'}
            stroke={activeButton === 'like' ? 'white' : '#703923'}
            strokeWidth={activeButton === 'like' ? '3' : '2.5'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

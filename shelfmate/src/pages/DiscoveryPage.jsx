import { useState, useEffect, useRef } from 'react';
import { SAMPLE_BOOKS } from '../data/books';

export default function DiscoveryPage({ onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // 'like' or 'dislike'
  const [showToast, setShowToast] = useState(false); // Show "Added to Favorites" toast
  const [lastAction, setLastAction] = useState(null); // Track last action for undo: { type: 'like'|'dislike', book, index }
  const [showUndo, setShowUndo] = useState(false); // Show undo button
  const isLikingRef = useRef(false); // Track if we're in the middle of a like action
  const cardRef = useRef(null);
  const undoTimerRef = useRef(null);

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

  const removeFromFavorites = (book) => {
    try {
      const stored = localStorage.getItem('shelfmate_favorites');
      const favorites = stored ? JSON.parse(stored) : [];
      const updated = favorites.filter(fav => fav.id !== book.id);
      localStorage.setItem('shelfmate_favorites', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('favorites-updated'));
    } catch (e) {
      console.error('Failed to remove from favorites:', e);
    }
  };

  const handleLike = () => {
    if (currentBook) {
      setActiveButton('like');
      isLikingRef.current = true; // Set flag to prevent book list reload
      addToFavorites(currentBook);
      
      // Show toast notification
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      
      // Store action for undo
      setLastAction({ type: 'like', book: currentBook, index: currentIndex });
      setShowUndo(true);
      
      // Clear any existing undo timer
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      
      // Hide undo button after 5 seconds
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
        setLastAction(null);
      }, 5000);
      
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

  const handleSwipeLike = () => {
    if (currentBook) {
      // Don't set activeButton for swipes
      isLikingRef.current = true;
      addToFavorites(currentBook);
      
      // Show toast notification
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      
      // Store action for undo
      setLastAction({ type: 'like', book: currentBook, index: currentIndex });
      setShowUndo(true);
      
      // Clear any existing undo timer
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      
      // Hide undo button after 5 seconds
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
        setLastAction(null);
      }, 5000);
      
      // Remove the current book from the list manually
      const updatedBooks = books.filter(book => book.id !== currentBook.id);
      setBooks(updatedBooks);
      isLikingRef.current = false;
    }
  };

  const handleDislike = () => {
    if (currentBook) {
      setActiveButton('dislike');
      
      // Store action for undo
      setLastAction({ type: 'dislike', book: currentBook, index: currentIndex });
      setShowUndo(true);
      
      // Clear any existing undo timer
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      
      // Hide undo button after 5 seconds
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
        setLastAction(null);
      }, 5000);
      
      setTimeout(() => {
        moveToNextBook();
        setActiveButton(null);
      }, 200);
    }
  };

  const handleSwipeDislike = () => {
    if (currentBook) {
      // Don't set activeButton for swipes
      
      // Store action for undo
      setLastAction({ type: 'dislike', book: currentBook, index: currentIndex });
      setShowUndo(true);
      
      // Clear any existing undo timer
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      
      // Hide undo button after 5 seconds
      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
        setLastAction(null);
      }, 5000);
      
      moveToNextBook();
    }
  };

  const handleUndo = () => {
    if (!lastAction) return;
    
    // Clear the undo timer
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    
    const { type, book, index } = lastAction;
    
    if (type === 'like') {
      // Remove from favorites
      removeFromFavorites(book);
      
      // Add book back to the list at the same position
      setBooks(prevBooks => {
        const newBooks = [...prevBooks];
        newBooks.splice(index, 0, book);
        return newBooks;
      });
      
      // Go back to that book
      setCurrentIndex(index);
    } else if (type === 'dislike') {
      // Just go back to the previous book
      setCurrentIndex(index);
    }
    
    // Hide undo and clear action
    setShowUndo(false);
    setLastAction(null);
    setShowToast(false);
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
        // Swiped right - like (don't fill button)
        handleSwipeLike();
      } else {
        // Swiped left - dislike (don't fill button)
        handleSwipeDislike();
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
      {/* Back Button */}
      <div className="w-full flex justify-between items-center mb-3 mt-2">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: '#703923',
            color: 'white',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Go back to home"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Title */}
        <h1 className="text-xl font-bold" style={{ color: '#703923' }}>
          Discover Books
        </h1>
        
        {/* Placeholder for symmetry */}
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div 
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          style={{
            backgroundColor: '#703923',
            color: 'white',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="font-medium text-xs">Added to Favorites!</span>
        </div>
      )}

      {/* Book Card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[90vw] sm:max-w-md">
        {/* Swipe instruction text */}
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Swipe left or right to continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </p>

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
          {/* Static swipe direction indicators */}
          {!isDragging && (
            <>
              <div
                className="absolute top-1/2 -left-8 transform -translate-y-1/2 pointer-events-none opacity-30"
                style={{ color: '#703923' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
              <div
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 pointer-events-none opacity-30"
                style={{ color: '#703923' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </>
          )}

          {/* Book Image */}
          <div 
            className="rounded-lg shadow-lg overflow-hidden mb-3"
            style={{ 
              aspectRatio: '2/3',
              maxHeight: 'min(40vh, 350px)',
              width: '100%'
            }}
          >
            <img
              src={currentBook.cover}
              alt={currentBook.title}
              className="w-full h-full object-contain"
              draggable="false"
            />
          </div>

          {/* Book Info */}
          <div className="text-center mb-2 px-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 line-clamp-2" style={{ color: '#703923' }}>
              {currentBook.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 line-clamp-1">{currentBook.author}</p>
          </div>
        </div>
        
        {/* Undo Button - Positioned between book info and action buttons */}
        {showUndo && (
          <div className="w-full flex justify-center mb-2">
            <button
              onClick={handleUndo}
              className="px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: '#703923',
                color: 'white',
                animation: 'slideUp 0.3s ease-out'
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
              </svg>
              <span className="font-medium text-sm">Undo</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 sm:gap-8 items-center justify-center pb-2 sm:pb-4 w-full">
        {/* Dislike Button */}
          <button
            onClick={handleDislike}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
            style={{
              border: '3px solid #703923',
              backgroundColor: activeButton === 'dislike' ? '#703923' : 'white',
              transform: activeButton === 'dislike' ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <svg
              width="24"
              height="24"
              className="sm:w-7 sm:h-7"
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
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
            style={{
              border: '3px solid #703923',
              backgroundColor: activeButton === 'like' ? '#703923' : 'white',
              transform: activeButton === 'like' ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <svg
              width="24"
              height="24"
              className="sm:w-7 sm:h-7"
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

import { useRef, useState } from 'react';
import BookCard from './BookCard';

export default function ScrollableBookSection({ title, books, onBookClick, keyPrefix = '' }) {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollClick = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    scroll(direction);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3" style={{ color: '#703923' }}>{title}</h2>
      <div 
        className="relative"
        onMouseEnter={() => {
          setShowLeftButton(true);
          setShowRightButton(true);
        }}
        onMouseLeave={() => {
          setShowLeftButton(false);
          setShowRightButton(false);
        }}
      >
        {/* Left Scroll Button */}
        {showLeftButton && (
          <button
            onClick={(e) => handleScrollClick(e, 'left')}
            type="button"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 transition-opacity"
            style={{
              background: 'rgba(112, 57, 35, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Scroll Button */}
        {showRightButton && (
          <button
            onClick={(e) => handleScrollClick(e, 'right')}
            type="button"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 transition-opacity"
            style={{
              background: 'rgba(112, 57, 35, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {books.map((book) => (
            <BookCard key={`${keyPrefix}${book.id}`} book={book} onClick={onBookClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

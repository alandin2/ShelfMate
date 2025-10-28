import { useState } from 'react';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { SAMPLE_BOOKS } from '../data/books';

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [likedBooks, setLikedBooks] = useState([]);

  // Combine all visible books into one array for navigation
  const allVisibleBooks = [
    ...SAMPLE_BOOKS.slice(0, 4),  // Top Picks
    ...SAMPLE_BOOKS.slice(4, 8),  // Trending
    ...SAMPLE_BOOKS.slice(2, 6)   // Fall Reads
  ];

  const getNextBook = (currentBook) => {
    if (!currentBook) return null;
    const currentIndex = allVisibleBooks.findIndex(book => book.id === currentBook.id);
    if (currentIndex === -1 || currentIndex === allVisibleBooks.length - 1) {
      return null; // Return null if we're at the last book
    }
    return allVisibleBooks[currentIndex + 1];
  };

  const handleLike = (book) => {
    // Update liked status
    setLikedBooks(prev => {
      const newLikedBooks = prev.includes(book.id)
        ? prev.filter(id => id !== book.id)
        : [...prev, book.id];
      
      // Move to next book after updating like status
      setTimeout(() => {
        const nextBook = getNextBook(book);
        setSelectedBook(nextBook);
      }, 300); // Small delay to show the heart animation

      return newLikedBooks;
    });
  };

  const handleDislike = () => {
    // Move to next book after disliking
    const nextBook = getNextBook(selectedBook);
    setSelectedBook(nextBook);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Top Picks for You</h2>
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '1.0rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {SAMPLE_BOOKS.slice(0, 4).map(book => (
            <BookCard key={book.id} book={book} onClick={setSelectedBook} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Trending Books</h2>
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '0.75rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {SAMPLE_BOOKS.slice(4, 8).map(book => (
            <BookCard key={book.id} book={book} onClick={setSelectedBook} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Fall Reads</h2>
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '0.75rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {SAMPLE_BOOKS.slice(2, 6).map(book => (
            <BookCard key={book.id} book={book} onClick={setSelectedBook} />
          ))}
        </div>
      </div>

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onLike={() => handleLike(selectedBook)}
        onDislike={handleDislike}
        isLiked={selectedBook ? likedBooks.includes(selectedBook.id) : false}
      />
    </div>
  );
}
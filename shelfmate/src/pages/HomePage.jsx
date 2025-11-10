import { useEffect, useState, useRef } from "react";
import BookCard from "../components/BookCard";
import BookPopUp from "../components/BookPopUp";
import ScrollableBookSection from "../components/ScrollableBookSection";
import { SAMPLE_BOOKS } from "../data/books";

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [transientHeart, setTransientHeart] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);

  // derived search results (title or author, case-insensitive)
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? SAMPLE_BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(normalizedQuery) ||
          b.author.toLowerCase().includes(normalizedQuery)
      )
    : [];

  // ordered list of visible books
  const allVisibleBooks = (() => {
    const sections = [
      SAMPLE_BOOKS, // main carousel
      SAMPLE_BOOKS.slice(0, 5), // New Arrivals
      SAMPLE_BOOKS.slice(5, 10) // Staff Picks
    ];
    const seen = new Set();
    const result = [];
    for (const sec of sections) {
      for (const b of sec) {
        if (!seen.has(b.id)) {
          seen.add(b.id);
          result.push(b);
        }
      }
    }
    return result;
  })();

  const getNextBook = (current) => {
    if (!current) return null;
    const idx = allVisibleBooks.findIndex(b => b.id === current.id);
    if (idx === -1 || idx === allVisibleBooks.length - 1) return null;
    return allVisibleBooks[idx + 1];
  };

  //open book when click on carousel
  const handleBookClick = (book) => {
    // Reset the heart  when opening a book
    setTransientHeart(false);
    setSelectedBook(book);
  };

  //close d popup
  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  // heart/not heart for popup
  const handleHeart = () => {
    if (!selectedBook) return;

    // Add to favorites
    try {
      const stored = localStorage.getItem('shelfmate_favorites');
      const favorites = stored ? JSON.parse(stored) : [];
      
      // Check if already in favorites
      if (!favorites.find(book => book.id === selectedBook.id)) {
        favorites.push(selectedBook);
        localStorage.setItem('shelfmate_favorites', JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('favorites-updated'));
      }
    } catch (e) {
      console.error('Failed to add to favorites:', e);
    }

    // show the filled heart briefly
    setTransientHeart(true);
    setTimeout(() => setTransientHeart(false), 400);

    // Close popup after adding to favorites
    setTimeout(() => setSelectedBook(null), 150);
  };

  const handleNotHeart = () => {
    if (!selectedBook) return;
    const nextBook = getNextBook(selectedBook);
    setTimeout(() => setSelectedBook(nextBook), 150);
  };

  // back button 
  useEffect(() => {
    const goHome = () => setSelectedBook(null);
    window.addEventListener("navigate-home", goHome);
    return () => window.removeEventListener("navigate-home", goHome);
  }, []);

  // keep search input focused
  useEffect(() => {
    if (searchInputRef.current && !selectedBook) {
      searchInputRef.current.focus();
    }
  }, [query, selectedBook]);

  // Maintain focus on any click within the page (except when popup is open)
  useEffect(() => {
    const handleClick = () => {
      if (searchInputRef.current && !selectedBook) {
        searchInputRef.current.focus();
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [selectedBook]);

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Search Bar */}
      <div className="px-4 py-3 mt-4">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search books or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 pl-10 border-2 rounded-3xl focus:outline-none focus:border-opacity-75"
            style={{ borderColor: '#703923' }}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            style={{ color: '#703923' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      {/* Conditional: show search results or default sections */}
      {normalizedQuery ? (
        <div className="p-4 pt-0">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#703923' }}>Search Results</h2>
          {searchResults.length ? (
            <div
              className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {searchResults.map((book) => (
                <BookCard key={`sr-${book.id}`} book={book} onClick={handleBookClick} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No matches found.</p>
          )}
        </div>
      ) : (
        <div className="p-4">
          <ScrollableBookSection 
            title="Top Picks for You"
            books={SAMPLE_BOOKS.slice(0, 10)}
            onBookClick={handleBookClick}
            keyPrefix=""
          />
          <ScrollableBookSection 
            title="New Arrivals"
            books={SAMPLE_BOOKS.slice(10, 18)}
            onBookClick={handleBookClick}
            keyPrefix="new-"
          />
          <ScrollableBookSection 
            title="Staff Picks"
            books={SAMPLE_BOOKS.slice(18, 25)}
            onBookClick={handleBookClick}
            keyPrefix="staff-"
          />
        </div>
      )}

      {/* Pop-up Feature (kept outside conditional so it persists during search) */}
      {selectedBook && (
        <BookPopUp
          book={selectedBook}
          onClose={handleCloseModal}
          onHeart={handleHeart}
          onNotHeart={handleNotHeart}
          isLiked={transientHeart}
        />
      )}
    </div>
  );
}

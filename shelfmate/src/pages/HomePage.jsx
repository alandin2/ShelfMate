import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookPopUp from "../components/BookPopUp";
import { SAMPLE_BOOKS } from "../data/books";

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [transientHeart, setTransientHeart] = useState(false);

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

    // show the filled heart briefly
    setTransientHeart(true);
    setTimeout(() => setTransientHeart(false), 400);

    // heart fill
    const nextBook = getNextBook(selectedBook);
    setTimeout(() => setSelectedBook(nextBook), 150);
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

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        {/* Section Header */}
        <h2 className="text-xl font-semibold mb-3">Top Picks for You</h2>

        {/* Horizontal scroll */}
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {SAMPLE_BOOKS.map((book, index) => (
            <BookCard
              key={index}
              book={book}
              onClick={handleBookClick}
            />
          ))}
        </div>

        {/* Section Header */}
        <h2 className="text-xl font-semibold mb-3 mt-6">New Arrivals</h2>

        {/* Horizontal scroll */}
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {SAMPLE_BOOKS.slice(0, 5).map((book, index) => (
            <BookCard
              key={`new-${index}`}
              book={book}
              onClick={handleBookClick}
            />
          ))}
        </div>

        {/* Section Header */}
        <h2 className="text-xl font-semibold mb-3 mt-6">Staff Picks</h2>

        {/* Horizontal scroll */}
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {SAMPLE_BOOKS.slice(5, 10).map((book, index) => (
            <BookCard
              key={`staff-${index}`}
              book={book}
              onClick={handleBookClick}
            />
          ))}
        </div>

        {/* Pop-up Feature */}
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
    </div>
  );
}

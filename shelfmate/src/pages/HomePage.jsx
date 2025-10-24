import React from 'react';
import BookCard from '../components/BookCard';
import { SAMPLE_BOOKS } from '../data/books';

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Top Picks for You</h2>
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {SAMPLE_BOOKS.slice(0, 4).map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Trending Books</h2>
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {SAMPLE_BOOKS.slice(4, 8).map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Fall Reads</h2>
        <div
          className="flex flex-row items-start gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {SAMPLE_BOOKS.slice(2, 6).map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
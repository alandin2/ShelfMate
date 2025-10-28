import React from "react";
import BookCard from "../components/BookCard";
import { SAMPLE_BOOKS } from "../data/books";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Top Picks */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Top Picks for You</h2>
        {/* add horizontal scroll feature like Netlfix */}
        <div
          className="flex flex-row gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {/* slice splits book array for a different list feel */}
          {SAMPLE_BOOKS.slice(0, 4).map((book) => (
            <div key={book.id} className="snap-start">
              <BookCard book={book} size="large" />
            </div>
          ))}
        </div>
      </div>
      {/* Trending Books */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Trending Books</h2>

        <div
          className="flex flex-row gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {SAMPLE_BOOKS.slice(4, 8).map((book) => (
            <div key={book.id} className="snap-start">
              <BookCard book={book} size="large" />
            </div>
          ))}
        </div>
      </div>
      {/* Fall Reads */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Fall Reads</h2>

        <div
          className="flex flex-row gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {SAMPLE_BOOKS.slice(2, 6).map((book) => (
            <div key={book.id} className="snap-start">
              <BookCard book={book} size="large" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

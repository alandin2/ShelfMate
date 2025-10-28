import React from "react";

export default function BookCard({ book, size = "normal", onClick }) {
  //tailwind sizing for different display platforms
  const cardWidth = size === "large" ? "w-40" : "w-32";
  const coverHeight = size === "large" ? "h-60" : "h-48";

  return (
    <div
      onClick={() => onClick && onClick(book)} //to click on a book
      className={`flex-none ${cardWidth} rounded-lg cursor-pointer transition-transform hover:scale-105 flex flex-col`}
      style={{ scrollSnapAlign: "start" }}
    >
      <div
        className={`${coverHeight} w-full rounded-lg mb-2 overflow-hidden bg-gray-200`} //book cover settings
      >
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover" //bookcover fills entire box
        />
      </div>
      <h3 className="text-sm font-medium line-clamp-1">{book.title}</h3>
      <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
    </div>
  );
}

import React from 'react';

export default function BookCard({ book, size = 'normal', onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(book)}
      // prevent stretching and enable snap alignment
      className={`flex-none rounded-lg cursor-pointer transition-transform hover:scale-105 flex flex-col ${
        size === 'large' ? 'w-40' : 'w-32'
      }`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div
        className={`${size === 'large' ? 'h-60' : 'h-48'} w-full rounded-lg mb-2`}
        style={{
          // If `book.cover` looks like a URL, render it as a background image;
          // otherwise treat it as a color string. We also set a minHeight fallback
          // so the cover remains visible even if Tailwind classes are not applied.
          ...(typeof book.cover === 'string' && (book.cover.startsWith('http') || book.cover.startsWith('data:'))
            ? { backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: book.cover }),
          minHeight: size === 'large' ? '15rem' : '12rem'
        }}
      />
      <h3 className="text-sm font-medium line-clamp-1">{book.title}</h3>
      <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
    </div>
  );
}
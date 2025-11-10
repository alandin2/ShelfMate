export default function BookDetailsView({ book, onClose, onAddToFavourites }) {
  const handleShareCopy = async () => {
    const bookUrl = book.amazonLink;
    
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}`,
          url: bookUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // If share fails, copy to clipboard
          copyToClipboard(bookUrl);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(bookUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="#703923">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#703923" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#703923" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Title and meta */}
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        <h2 className="text-base font-semibold" style={{ color: '#703923', marginBottom: 2 }}>
          {book.title}
        </h2>
        <p className="text-sm text-gray-600">{book.author}</p>
      </div>

      {/* Meta info grid - compact */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12, fontSize: '12px' }}>
        <div>
          <p className="text-xs font-medium" style={{ color: '#703923' }}>Genre:</p>
          <p className="text-xs text-gray-600">
            {book.genre}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: '#703923' }}>Published:</p>
          <p className="text-xs text-gray-600">
            {book.published}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: '#703923' }}>Language:</p>
          <p className="text-xs text-gray-600">
            {book.language}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: '#703923' }}>Rating:</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <p className="text-xs text-gray-600">
              {book.rating}
            </p>
            <div style={{ display: 'flex', gap: 2 }}>
              {renderStars(book.rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Summary - scrollable */}
      <p className="text-sm text-gray-700 text-center" style={{ lineHeight: 1.5, marginBottom: 12, maxHeight: 110, overflow: 'auto' }}>
        {book.summary}
      </p>

      {/* Buttons - compact */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto', paddingTop: 8 }}>
        <a
          href={book.amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-full font-medium text-white text-center transition-all active:scale-95 active:opacity-80"
          style={{ backgroundColor: '#703923', textDecoration: 'none', border: '2px solid #703923' }}
        >
          Find it on Amazon
        </a>

        <button
          type="button"
          className="w-full py-3 rounded-full font-medium transition-all active:scale-95 active:bg-gray-100"
          style={{ 
            border: '2px solid #703923',
            color: '#703923',
            backgroundColor: 'white'
          }}
          onClick={handleShareCopy}
        >
          Share / Copy Link
        </button>
      </div>
    </div>
  );
}

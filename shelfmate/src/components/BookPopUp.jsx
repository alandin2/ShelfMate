import { useState } from 'react';
import BookDetailsView from './BookDetailsView';

export default function BookPopUp({ book, onClose, onHeart, onNotHeart, isLiked = false, hideAddToFavorites = false, onAddToCollection }) {
  const [detailsClicked, setDetailsClicked] = useState(false);

  const handleBackToHome = () => {
    onClose && onClose();
    window.dispatchEvent(new CustomEvent('navigate-home'));
  };

  if (!book) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl p-5 w-80 max-w-[90vw]"
        style={{
          borderRadius: 20,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          padding: 20,
          background: 'white',
          width: '320px',
          maxWidth: '90vw',
          height: '620px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        {/* Left button*/}
        <button
          type="button"
          onClick={detailsClicked ? () => setDetailsClicked(false) : handleBackToHome}
          aria-label={detailsClicked ? "Back to summary" : "Back to home"}
          className="transition-all active:scale-90 active:opacity-70"
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 44,
            height: 44,
            borderRadius: 9999,
            border: '2px solid #e5e7eb',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            boxSizing: 'border-box',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            zIndex: 10,
            color: '#703923',
            cursor: 'pointer'
          }}
        >
          <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right button */}
        {detailsClicked && (
          <button
            type="button"
            onClick={handleBackToHome}
            aria-label="Close to home"
            className="transition-all active:scale-90 active:opacity-80"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 44,
              height: 44,
              borderRadius: 9999,
              border: 'none',
              background: '#703923',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxSizing: 'border-box',
              boxShadow: '0 2px 6px rgba(112, 57, 35, 0.3)',
              zIndex: 10,
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Book cover */}
        <div
          className="mx-auto rounded-lg mb-4 overflow-hidden"
          style={{
            width: detailsClicked ? '80%' : '75%',
            height: detailsClicked ? '52%' : '48%',
            minHeight: detailsClicked ? 220 : 200,
            marginTop: 18,
            borderRadius: 12,
            boxSizing: 'border-box',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
          }}
        >
          {typeof book.cover === 'string' ? (
            <img
              src={book.cover}
              alt={book.title}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', backgroundColor: 'white' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: book.cover }} />
          )}
        </div>

        {/* Details section */}
        <div style={{ width: '100%', padding: '12px 12px 16px', boxSizing: 'border-box' }}>
          {detailsClicked ? (
            <BookDetailsView 
              book={book} 
              onClose={() => setDetailsClicked(false)}
              onAddToFavourites={onHeart}
            />
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <div className="text-base font-semibold" style={{ color: '#703923' }}>{book.title}</div>
                <div className="text-sm text-gray-600">{book.author}</div>
              </div>

              <p className="text-sm text-gray-700 text-center" style={{ lineHeight: 1.5, maxHeight: 110, overflow: 'auto' }}>
                {book.summary || 'No summary available.'}
              </p>

              <div className="mt-5 flex flex-col gap-3 w-full">
                <button
                  type="button"
                  className="w-full py-3 rounded-full font-medium transition-all active:scale-95 active:opacity-80"
                  style={{ 
                    border: '2px solid #703923',
                    color: detailsClicked ? 'white' : '#703923', 
                    backgroundColor: detailsClicked ? '#703923' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => setDetailsClicked(!detailsClicked)}
                >
                  More Details
                </button>

                {onAddToCollection && (
                  <button
                    type="button"
                    className="w-full py-3 rounded-full font-medium transition-all active:scale-95 active:opacity-80"
                    style={{ 
                      border: '2px solid #703923',
                      color: '#703923',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={onAddToCollection}
                  >
                    Add to Collection
                  </button>
                )}

                {!hideAddToFavorites && (
                  <button
                    type="button"
                    className="w-full py-3 rounded-full font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95 active:opacity-80"
                    style={{ backgroundColor: '#703923', cursor: 'pointer' }}
                    onClick={onHeart}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.182l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                    Add to Favourites
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default function BookModal({ book, onClose, onLike, onDislike, isLiked = false }) {
  const handleBackToHome = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('navigate-home'));
  };
  if (!book) return null;

  return (
    <div
      // Inline styles as a fallback in case utility classes aren't applied
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
      onClick={(e) => {
        // close when clicking the overlay (but not when clicking the modal)
        if (e.target === e.currentTarget) onClose && onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl p-4 w-80 max-w-[90vw] border-2 border-black"
        style={{
          borderRadius: 20,
          border: '2px solid black',
          padding: 16,
          background: 'white',
          // Make the modal taller and layout its children vertically so the cover
          // sits centered near the top and actions remain at the bottom like the
          // design mockup.
          width: '320px',
          maxWidth: '90vw',
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Back button: positioned at top-left corner of modal */}
        <button
          type="button"
          onClick={handleBackToHome}
          aria-label="Back to home"
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 44,
            height: 44,
            borderRadius: 9999,
            border: '2px solid black',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            boxSizing: 'border-box',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            zIndex: 10
          }}
        >
          <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Book cover */}
        <div
          className="mx-auto rounded-lg mb-4"
          style={{
            // Larger cover so it reads as the main visual element.
            width: '70%',
            height: '60%',
            minHeight: 220,
            marginTop: 18,
            ...(typeof book.cover === 'string' && (book.cover.startsWith('http') || book.cover.startsWith('data:'))
              ? { backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundColor: book.cover })
          }}
        />

        {/* Footer: left/right circular buttons with centered title/author between them */}
        <div style={{ width: '100%', padding: '12px 8px', position: 'relative', boxSizing: 'border-box' }}>
          <button
            type="button"
            onClick={onDislike}
            aria-label="Dislike"
            style={{
              position: 'absolute',
              left: 12,
              bottom: 8,
              width: 56,
              height: 56,
              borderRadius: 9999,
              border: '3px solid black',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg style={{ width: 28, height: 28 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div style={{ textAlign: 'center', padding: '0 80px' }}>
            <div className="text-base font-medium">{book.title}</div>
            <div className="text-sm text-gray-600">{book.author}</div>
          </div>

          <button
            type="button"
            onClick={onLike}
            aria-label="Like"
            style={{
              position: 'absolute',
              right: 12,
              bottom: 8,
              width: 56,
              height: 56,
              borderRadius: 9999,
              border: isLiked ? '3px solid #ef4444' : '3px solid black',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLiked ? (
              <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.02 4.02 4 6.5 4c1.74 0 3.41 1 4.13 2.44C11.09 5 12.76 4 14.5 4 16.98 4 19 6.02 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg style={{ width: 28, height: 28 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.182l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
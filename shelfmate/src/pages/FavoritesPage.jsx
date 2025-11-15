import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookPopUp from "../components/BookPopUp";

const FAVORITES_KEY = "shelfmate_favorites";
const COLLECTIONS_KEY = "shelfmate_collections";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // collections state
  const [collections, setCollections] = useState([]);
  const [openCollectionId, setOpenCollectionId] = useState(null);

  // collection editor state
  const [isCollectionEditorOpen, setIsCollectionEditorOpen] = useState(false);
  const [collectionEditorName, setCollectionEditorName] = useState("");
  const [collectionEditorSearchTerm, setCollectionEditorSearchTerm] =
    useState("");
  const [collectionEditorSelectedIds, setCollectionEditorSelectedIds] =
    useState(new Set());

  // load favorites n collections frm local storage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        } else {
          setFavorites([]);
        }
      } catch (e) {
        console.error("Failed to load favorites:", e);
      }
    };

    const loadCollections = () => {
      try {
        const stored = localStorage.getItem(COLLECTIONS_KEY);
        if (stored) {
          setCollections(JSON.parse(stored));
        } else {
          setCollections([]);
        }
      } catch (e) {
        console.error("Failed to load collections:", e);
      }
    };

    const handleDataChange = () => {
      loadFavorites();
      loadCollections();
    };

    loadFavorites();
    loadCollections();

    // favorites n collections updates
    window.addEventListener("favorites-updated", handleDataChange);
    window.addEventListener("collections-updated", handleDataChange);

    return () => {
      window.removeEventListener("favorites-updated", handleDataChange);
      window.removeEventListener("collections-updated", handleDataChange);
    };
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseBookPopup = () => {
    setSelectedBook(null);
  };

  const handleRemoveFromFavorites = (bookToRemove, e) => {
    if (e) {
      e.stopPropagation();
    }
    const updated = favorites.filter((book) => book.id !== bookToRemove.id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new CustomEvent("favorites-updated"));
  };

  // collection functions

  const openCollectionEditor = (preSelectedBookId = null) => {
    setIsCollectionEditorOpen(true);
    setCollectionEditorName("");
    setCollectionEditorSearchTerm("");
    setCollectionEditorSelectedIds(preSelectedBookId ? new Set([preSelectedBookId]) : new Set());
  };

  const handleAddToCollection = () => {
    if (selectedBook) {
      setSelectedBook(null);
      openCollectionEditor(selectedBook.id);
    }
  };

  const closeCollectionEditor = () => {
    setIsCollectionEditorOpen(false);
    setCollectionEditorName("");
    setCollectionEditorSearchTerm("");
    setCollectionEditorSelectedIds(new Set());
  };

  const toggleCollectionEditorSelection = (bookId) => {
    // Safety check: ensure bookId is a number, not an event or object
    const id = typeof bookId === 'number' ? bookId : (bookId?.id || null);
    if (id === null || typeof id !== 'number') {
      console.error('Invalid bookId passed to toggleCollectionEditorSelection:', bookId);
      return;
    }
    
    setCollectionEditorSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateCollection = () => {
    if (!collectionEditorName.trim()) {
      alert("Please enter a name for your collection.");
      return;
    }

    if (collectionEditorSelectedIds.size === 0) {
      alert("Please select at least one book.");
      return;
    }

    const existingRaw = localStorage.getItem(COLLECTIONS_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];

    // Convert Set to Array and filter to ensure only numbers
    const bookIdsArray = Array.from(collectionEditorSelectedIds).filter(
      id => typeof id === 'number'
    );

    if (bookIdsArray.length === 0) {
      alert("Error: Invalid book IDs selected. Please try again.");
      return;
    }

    const newCollection = {
      id: Date.now(),
      name: collectionEditorName.trim(),
      bookIds: bookIdsArray,
      createdAt: new Date().toISOString(),
    };

    const updatedCollections = [...existing, newCollection];
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
    setCollections(updatedCollections);

    window.dispatchEvent(new CustomEvent("collections-updated"));

    closeCollectionEditor();
    alert("Collection created! 🎉");
  };

  const handleDeleteCollection = (collectionId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (window.confirm("Are you sure you want to delete this collection?")) {
      const updatedCollections = collections.filter(
        (collection) => collection.id !== collectionId
      );
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
      window.dispatchEvent(new CustomEvent("collections-updated"));
      
      if (openCollectionId === collectionId) {
        setOpenCollectionId(null);
      }
    }
  };

  const handleRemoveBookFromCollection = (collectionId, bookId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          bookIds: collection.bookIds.filter((id) => id !== bookId)
        };
      }
      return collection;
    });
    
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
    setCollections(updatedCollections);
    window.dispatchEvent(new CustomEvent("collections-updated"));
  };

  const filteredFavoritesForEditor = favorites.filter((book) => {
    if (!collectionEditorSearchTerm.trim()) return true;
    const query = collectionEditorSearchTerm.toLowerCase();
    return (
      (book.title && book.title.toLowerCase().includes(query)) ||
      (book.author && book.author.toLowerCase().includes(query))
    );
  });

  // add the books into a collection frm favorites
  const getBooksForCollection = (collection) => {
    return favorites.filter((book) => collection.bookIds.includes(book.id));
  };

  const toggleCollectionOpen = (collectionId) => {
    setOpenCollectionId((prev) =>
      prev === collectionId ? null : collectionId
    );
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        {/* Header row: title + new collection button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ color: "#703923" }}>
            My Favorites
          </h1>

          <button
            onClick={openCollectionEditor}
            className="px-3 py-1 text-sm rounded-full border"
            style={{
              borderColor: "#703923",
              color: "#703923",
            }}
          >
            New Collection
          </button>
        </div>

        {/* favorites grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center mb-4">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#703923"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No favorites yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start adding books you love!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((book) => (
              <div key={book.id} className="relative flex flex-col">
                {/* button to remove from favorites */}
                <button
                  onClick={(e) => handleRemoveFromFavorites(book, e)}
                  className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow-md"
                  style={{
                    border: "1.5px solid #703923",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#703923"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <BookCard book={book} onClick={handleBookClick} />
              </div>
            ))}
          </div>
        )}

        {/* collections section */}
        <div className="mt-8">
          <h2
            className="text-xl font-bold mb-3"
            style={{ color: "#703923" }}
          >
            My Collections
          </h2>

          {collections.length === 0 ? (
            <div className="border-2 rounded-xl px-4 py-8 bg-white text-center" style={{ borderColor: "#703923" }}>
              <svg 
                width="56" 
                height="56" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#703923" 
                strokeWidth="2"
                className="mx-auto mb-3 opacity-50"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-base font-medium text-gray-700 mb-1">No collections yet</p>
              <p className="text-sm text-gray-500">Organize your favorites into collections</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map((collection) => {
                const booksInCollection = getBooksForCollection(collection);

                return (
                  <div
                    key={collection.id}
                    className="border rounded-lg px-3 py-2 bg-white"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleCollectionOpen(collection.id)}
                        className="flex-1 flex items-center justify-between"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">
                            {collection.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {booksInCollection.length} book
                            {booksInCollection.length !== 1 && "s"}
                          </span>
                        </div>
                        <span className="text-lg">
                          {openCollectionId === collection.id ? "▴" : "▾"}
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteCollection(collection.id, e)}
                        className="ml-2 p-1 rounded-full transition-all active:scale-90 active:opacity-70"
                        style={{
                          backgroundColor: "#703923",
                          color: "white",
                          cursor: "pointer",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "none",
                          flexShrink: 0
                        }}
                        aria-label="Delete collection"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {openCollectionId === collection.id && (
                      <div className="mt-3">
                        {booksInCollection.length === 0 ? (
                          <p className="text-xs text-gray-500">
                            No books currently in this collection. They may have
                            been removed from favorites.
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {booksInCollection.map((book) => (
                              <div
                                key={book.id}
                                className="relative flex flex-col"
                              >
                                <button
                                  onClick={(e) => handleRemoveBookFromCollection(collection.id, book.id, e)}
                                  className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow-md transition-all active:scale-90 active:opacity-70"
                                  style={{
                                    border: "1.5px solid #703923",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                  }}
                                  aria-label="Remove from collection"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#703923"
                                    strokeWidth="2.5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                                <div>
                                  <BookCard book={book} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Book details popup */}
      {selectedBook && (
        <BookPopUp
          book={selectedBook}
          onClose={handleCloseBookPopup}
          onHeart={() => handleRemoveFromFavorites(selectedBook)}
          onNotHeart={handleCloseBookPopup}
          isLiked={true}
          hideAddToFavorites={true}
          onAddToCollection={handleAddToCollection}
        />
      )}

      {isCollectionEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2
                className="text-lg font-semibold"
                style={{ color: "#703923" }}
              >
                New Collection
              </h2>
              <button
                onClick={closeCollectionEditor}
                className="p-2 rounded-full transition-all active:scale-90 active:opacity-70"
                style={{ 
                  backgroundColor: "#703923",
                  color: "white",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none"
                }}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-3 space-y-3 overflow-y-auto">
              {/* collection name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Collection name
                </label>
                <input
                  type="text"
                  value={collectionEditorName}
                  onChange={(e) => setCollectionEditorName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  style={{ borderColor: "#703923" }}
                  placeholder="e.g., Fall TBR, Romance Wishlist"
                />
              </div>

              {/* Search frm favorites */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Add from favorites
                </label>
                <input
                  type="text"
                  value={collectionEditorSearchTerm}
                  onChange={(e) =>
                    setCollectionEditorSearchTerm(e.target.value)
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-1"
                  style={{ borderColor: "#703923" }}
                  placeholder="Search your favorite books..."
                />

                <div className="border rounded-md max-h-52 overflow-y-auto">
                  {filteredFavoritesForEditor.length === 0 ? (
                    <p className="text-sm text-gray-500 p-3">
                      No favorites match this search.
                    </p>
                  ) : (
                    filteredFavoritesForEditor.map((book) => {
                      const checked = collectionEditorSelectedIds.has(book.id);
                      return (
                        <button
                          key={book.id}
                          type="button"
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                          onClick={() =>
                            toggleCollectionEditorSelection(book.id)
                          }
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              readOnly
                              checked={checked}
                              className="h-4 w-4"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {book.title}
                              </span>
                              {book.author && (
                                <span className="text-xs text-gray-500">
                                  {book.author}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <button
                onClick={closeCollectionEditor}
                className="px-3 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-3 py-2 text-sm rounded-md text-white"
                style={{ backgroundColor: "#703923" }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

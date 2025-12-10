import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookPopUp from "../components/BookPopUp";
import { SAMPLE_BOOKS } from "../data/books";

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
  const [collectionMode, setCollectionMode] = useState("new");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");

  // search feature state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // load favorites n collections
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch (_) {
        setFavorites([]);
      }
    };

    const loadCollections = () => {
      try {
        const stored = localStorage.getItem(COLLECTIONS_KEY);
        setCollections(stored ? JSON.parse(stored) : []);
      } catch (_) {
        setCollections([]);
      }
    };

    const refresh = () => {
      loadFavorites();
      loadCollections();
    };

    loadFavorites();
    loadCollections();

    window.addEventListener("favorites-updated", refresh);
    window.addEventListener("collections-updated", refresh);

    return () => {
      window.removeEventListener("favorites-updated", refresh);
      window.removeEventListener("collections-updated", refresh);
    };
  }, []);

  // favorite n pop-up handling

  const handleBookClick = (book) => setSelectedBook(book);

  const handleCloseBookPopup = () => setSelectedBook(null);

  const handleRemoveFromFavorites = (book, e) => {
    if (e) e.stopPropagation();
    const updated = favorites.filter((b) => b.id !== book.id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new CustomEvent("favorites-updated"));
  };

  const handleAddToCollection = () => {
    if (selectedBook?.id) {
      const preId = selectedBook.id;
      setSelectedBook(null);
      openCollectionEditor(preId);
    }
  };

  // collection logic

  const openCollectionEditor = (preSelectedBookId = null) => {
    setIsCollectionEditorOpen(true);
    setCollectionEditorName("");
    setCollectionEditorSearchTerm("");
    setCollectionEditorSelectedIds(
      preSelectedBookId ? new Set([preSelectedBookId]) : new Set()
    );
    setCollectionMode("new");
    setSelectedCollectionId("");
  };

  const closeCollectionEditor = () => {
    setIsCollectionEditorOpen(false);
    setCollectionEditorName("");
    setCollectionEditorSearchTerm("");
    setCollectionEditorSelectedIds(new Set());
    setCollectionMode("new");
    setSelectedCollectionId("");
  };

  const toggleCollectionOpen = (collectionId) => {
    setOpenCollectionId((prev) =>
      prev === collectionId ? null : collectionId
    );
  };

  const getBooksForCollection = (collection) =>
    favorites.filter((book) => collection.bookIds.includes(book.id));

  // toggle selected favorites inside the collection editor
  const toggleCollectionEditorSelection = (bookId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const id = typeof bookId === "number" ? bookId : bookId?.id ?? null;
    if (id === null || typeof id !== "number") {
      console.error(
        "Invalid bookId passed to toggleCollectionEditorSelection:",
        bookId
      );
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

  // create a new collection OR add to an existing one
  const handleCreateCollection = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Add to existing collection
    if (collectionMode === "existing") {
      if (!selectedCollectionId) {
        alert("Please select a collection.");
        return;
      }
      if (collectionEditorSelectedIds.size === 0) {
        alert("Please select at least one book.");
        return;
      }

      const existingRaw = localStorage.getItem(COLLECTIONS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const bookIdsToAdd = Array.from(collectionEditorSelectedIds);

      const updatedCollections = existing.map((collection) => {
        if (collection.id === parseInt(selectedCollectionId, 10)) {
          const mergedBookIds = Array.from(
            new Set([...collection.bookIds, ...bookIdsToAdd])
          );
          return { ...collection, bookIds: mergedBookIds };
        }
        return collection;
      });

      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
      window.dispatchEvent(new CustomEvent("collections-updated"));

      closeCollectionEditor();
      alert("Books added to collection! 🎉");
      return;
    }

    // Create new collection
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

    const bookIdsArray = Array.from(collectionEditorSelectedIds).filter(
      (id) => typeof id === "number"
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

  // delete a whole collection
  const handleDeleteCollection = (collectionId, e) => {
    if (e) e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this collection?")) {
      const updatedCollections = collections.filter(
        (c) => c.id !== collectionId
      );
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
      window.dispatchEvent(new CustomEvent("collections-updated"));
      if (openCollectionId === collectionId) {
        setOpenCollectionId(null);
      }
    }
  };

  // remove a single book from a collection
  const handleRemoveBookFromCollection = (collectionId, bookId, e) => {
    if (e) e.stopPropagation();

    const updatedCollections = collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          bookIds: collection.bookIds.filter((id) => id !== bookId),
        };
      }
      return collection;
    });

    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updatedCollections));
    setCollections(updatedCollections);
    window.dispatchEvent(new CustomEvent("collections-updated"));
  };

  //favorites filtered inside the collection editor search
  const filteredFavoritesForEditor = favorites.filter((book) => {
    if (!collectionEditorSearchTerm.trim()) return true;
    const q = collectionEditorSearchTerm.toLowerCase();
    return (
      (book.title && book.title.toLowerCase().includes(q)) ||
      (book.author && book.author.toLowerCase().includes(q))
    );
  });

  // search feature functionalitye

  const openSearch = () => {
    setIsSearchVisible(true);
    setSearchQuery("");
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults =
    normalizedQuery.length === 0
      ? []
      : SAMPLE_BOOKS.filter(
          (b) =>
            !favorites.some((f) => f.id === b.id) &&
            (b.title.toLowerCase().includes(normalizedQuery) ||
              b.author.toLowerCase().includes(normalizedQuery))
        );

  const addBookFromSearch = (book) => {
    const updated = [...favorites, book];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new CustomEvent("favorites-updated"));
    closeSearch();
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ color: "#703923" }}>
            My Favorites
          </h1>

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="px-3 py-1 text-sm rounded-full border"
              style={{ borderColor: "#703923", color: "#703923" }}
            >
              Search
            </button>

            <button
              onClick={openCollectionEditor}
              className="px-3 py-1 text-sm rounded-full border"
              style={{ borderColor: "#703923", color: "#703923" }}
            >
              New Collection
            </button>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No favorites yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start adding books you love!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((book) => (
              <div key={book.id} className="relative flex flex-col">
                <button
                  onClick={(e) => handleRemoveFromFavorites(book, e)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                  style={{ border: "1.5px solid #703923" }}
                >
                  ✕
                </button>
                <BookCard book={book} onClick={handleBookClick} />
              </div>
            ))}
          </div>
        )}

        {/* Collections UI */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: "#703923" }}>
            My Collections
          </h2>

          {collections.length === 0 ? (
            <div className="border-2 rounded-xl px-4 py-8 text-center">
              <p>No collections yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map((collection) => {
                const books = getBooksForCollection(collection);

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
                            {books.length} book
                            {books.length !== 1 && "s"}
                          </span>
                        </div>
                        <span className="text-lg">
                          {openCollectionId === collection.id ? "▴" : "▾"}
                        </span>
                      </button>

                      <button
                        onClick={(e) =>
                          handleDeleteCollection(collection.id, e)
                        }
                        className="ml-2 p-1 rounded-full"
                        style={{
                          backgroundColor: "#703923",
                          color: "white",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "none",
                          flexShrink: 0,
                          cursor: "pointer",
                        }}
                        aria-label="Delete collection"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {openCollectionId === collection.id && (
                      <div className="mt-3">
                        {books.length === 0 ? (
                          <p className="text-xs text-gray-500">
                            No books currently in this collection. They may have
                            been removed from favorites.
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {books.map((book) => (
                              <div
                                key={book.id}
                                className="relative flex flex-col"
                              >
                                <button
                                  onClick={(e) =>
                                    handleRemoveBookFromCollection(
                                      collection.id,
                                      book.id,
                                      e
                                    )
                                  }
                                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                                  style={{
                                    border: "1.5px solid #703923",
                                    width: "28px",
                                    height: "28px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
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
                                <BookCard book={book} />
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

      {/* Book Details Popup */}
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

      {/* Collection Editor */}
      {isCollectionEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2
                className="text-lg font-semibold"
                style={{ color: "#703923" }}
              >
                New Collection
              </h2>
              <button
                onClick={closeCollectionEditor}
                className="p-2 rounded-full"
                style={{
                  backgroundColor: "#703923",
                  color: "white",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close collection editor"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-3 overflow-y-auto">
              {/* Mode selector */}
              {collections.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Choose action
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCollectionMode("new")}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor:
                          collectionMode === "new" ? "#703923" : "white",
                        color: collectionMode === "new" ? "white" : "#703923",
                        border: "2px solid #703923",
                      }}
                    >
                      Create New
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollectionMode("existing")}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor:
                          collectionMode === "existing" ? "#703923" : "white",
                        color:
                          collectionMode === "existing" ? "white" : "#703923",
                        border: "2px solid #703923",
                      }}
                    >
                      Add to Existing
                    </button>
                  </div>
                </div>
              )}

              {/* Name or dropdown */}
              {collectionMode === "new" ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select collection
                  </label>
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1"
                    style={{ borderColor: "#703923" }}
                  >
                    <option value="">Choose a collection...</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search favorites to add */}
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
                    // If user has no favorites at all, show a friendlier call-to-action
                    favorites.length === 0 ? (
                      <div className="text-center p-4">
                        <p className="text-sm text-gray-600">No favorites found. Start adding books you love.</p>
                        <p className="text-sm text-gray-600 mt-2"></p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              // Close the collection pop-up and open book search so users can add favorites
                              closeCollectionEditor();
                              openSearch();
                            }}
                            className="px-3 py-1 rounded-md text-white"
                            style={{ backgroundColor: "#703923" }}
                          >
                            Search books
                          </button>
                          <button
                            onClick={closeCollectionEditor}
                            className="px-3 py-1 rounded-md border"
                            style={{ borderColor: "#703923", color: "#703923" }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-3">No favorites match this search.</p>
                    )
                  ) : (
                    filteredFavoritesForEditor.map((book) => {
                      const checked = collectionEditorSelectedIds.has(book.id);
                      return (
                        <button
                          key={book.id}
                          type="button"
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                          onClick={(e) =>
                            toggleCollectionEditorSelection(book.id, e)
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

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <button
                onClick={closeCollectionEditor}
                className="px-3 py-2 text-sm rounded-md border"
                style={{ borderColor: "#703923", color: "#703923" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-3 py-2 text-sm rounded-md text-white"
                style={{ backgroundColor: "#703923" }}
              >
                {collectionMode === "new" ? "Create" : "Add to Collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Feature */}
      {isSearchVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2
                className="text-lg font-semibold"
                style={{ color: "#703923" }}
              >
                Search Books
              </h2>
              <button
                onClick={closeSearch}
                className="p-2 rounded-full"
                style={{ backgroundColor: "#703923", color: "white" }}
              >
                ✕
              </button>
            </div>

            {/* Input & Results */}
            <div className="px-4 py-3 space-y-3 overflow-y-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Search by title or author"
                style={{ borderColor: "#703923" }}
              />

              <div className="border rounded-md max-h-64 overflow-y-auto">
                {!normalizedQuery ? (
                  <p className="text-sm text-gray-500 p-3">
                    Start typing to search...
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 p-3">
                    No matches, or already in favorites.
                  </p>
                ) : (
                  searchResults.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between px-3 py-2 border-b"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {book.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {book.author}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => addBookFromSearch(book)}
                        className="px-3 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: "#703923" }}
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t px-4 py-3">
              <button
                onClick={closeSearch}
                className="px-3 py-2 text-sm rounded-md border"
                style={{ borderColor: "#703923", color: "#703923" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

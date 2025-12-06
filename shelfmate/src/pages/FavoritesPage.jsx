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
                  >
                    <button
                      onClick={() => toggleCollectionOpen(collection.id)}
                      className="flex justify-between w-full"
                    >
                      <div>
                        <span>{collection.name}</span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {books.length} book{books.length !== 1 && "s"}
                        </span>
                      </div>
                      <span>
                        {openCollectionId === collection.id ? "▴" : "▾"}
                      </span>
                    </button>

                    {openCollectionId === collection.id && (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {books.map((book) => (
                          <BookCard key={book.id} book={book} />
                        ))}
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
          onClose={() => setSelectedBook(null)}
          onHeart={() => handleRemoveFromFavorites(selectedBook)}
          onNotHeart={() => setSelectedBook(null)}
          isLiked={true}
          hideAddToFavorites={true}
          onAddToCollection={handleAddToCollection}
        />
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

            {/* Input n Results */}
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

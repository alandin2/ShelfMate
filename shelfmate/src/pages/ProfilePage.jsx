import { useEffect, useRef, useState } from "react";
import { GENRE_OPTIONS } from "../data/books";
import { USER } from "../data/user";

export default function ProfilePage() {
  const STORAGE_KEY = "shelfmate_profile_v1";
  const READING_GOAL_KEY = "shelfmate_reading_goal";

  const defaultProfile = {
    name: USER.name,
    username: USER.username,
    avatar: USER.avatar,
    genres: USER.genres,
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [editingGenreIndex, setEditingGenreIndex] = useState(null);
  const [editingGenreValue, setEditingGenreValue] = useState("");
  const [isGenrePickerOpen, setIsGenrePickerOpen] = useState(false);
  const [genreSearchTerm, setGenreSearchTerm] = useState("");
  const [readingGoal, setReadingGoal] = useState(20);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("20");
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {
      // ignore
    }

    try {
      const goalRaw = localStorage.getItem(READING_GOAL_KEY);
      if (goalRaw) setReadingGoal(parseInt(goalRaw, 10));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(READING_GOAL_KEY, readingGoal.toString());
    } catch (e) {
      // ignore
    }
  }, [readingGoal]);

  function handleNameEdit() {
    setNameDraft(profile.name || "");
    setEditingName(true);
  }

  function saveName() {
    setProfile((p) => ({ ...p, name: nameDraft || "Reader" }));
    setEditingName(false);
  }

  function handleAvatarPick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  }

  function triggerAvatarPick() {
    fileInputRef.current?.click();
  }

  function addGenre(g) {
    const genre = (g || "").trim();
    if (!genre) return;
    if (profile.genres.includes(genre)) return;
    setProfile((p) => ({ ...p, genres: [...p.genres, genre] }));
  }

  function startEditGenre(i) {
    setEditingGenreIndex(i);
    setEditingGenreValue(profile.genres[i]);
  }

  function saveEditGenre(i) {
    const v = editingGenreValue.trim();
    if (!v) return;
    setProfile((p) => {
      const g = [...p.genres];
      g[i] = v;
      return { ...p, genres: g };
    });
    setEditingGenreIndex(null);
    setEditingGenreValue("");
  }

  function deleteGenre(i) {
    setProfile((p) => ({
      ...p,
      genres: p.genres.filter((_, idx) => idx !== i),
    }));
  }

  const filteredSuggestions = GENRE_OPTIONS.filter((s) =>
    s.toLowerCase().includes(genreSearchTerm.toLowerCase())
  );

  // Get stats
  const getFavoritesCount = () => {
    try {
      const stored = localStorage.getItem("shelfmate_favorites");
      return stored ? JSON.parse(stored).length : 0;
    } catch (e) {
      return 0;
    }
  };

  const getCollectionsCount = () => {
    try {
      const stored = localStorage.getItem("shelfmate_collections");
      return stored ? JSON.parse(stored).length : 0;
    } catch (e) {
      return 0;
    }
  };

  const favoritesCount = getFavoritesCount();
  const collectionsCount = getCollectionsCount();
  const genresCount = profile.genres.length;
  const progress = Math.min(
    Math.round((favoritesCount / readingGoal) * 100),
    100
  );

  const handleEditGoal = () => {
    setGoalDraft(readingGoal.toString());
    setEditingGoal(true);
  };

  const handleSaveGoal = () => {
    const parsed = parseInt(goalDraft, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setReadingGoal(parsed);
    }
    setEditingGoal(false);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 pb-20"
      style={{ WebkitOverflowScrolling: "touch", overflowY: "scroll" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2"
                style={{ borderColor: "#703923" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold border-2"
                style={{ borderColor: "#703923", color: "#703923" }}
              >
                {profile.name
                  ? profile.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")
                  : "JD"}
              </div>
            )}
            <button
              onClick={triggerAvatarPick}
              className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border"
              style={{ borderColor: "#703923", color: "#703923" }}
              aria-label="Edit avatar"
            >
              ✎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarPick}
            />
          </div>

          <div className="flex-1">
            {!editingName ? (
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold">{profile.name}</h2>
                  <p className="text-sm text-gray-600">@{profile.username}</p>
                </div>
                <button
                  onClick={handleNameEdit}
                  className="text-sm px-2 py-1 border rounded"
                  style={{ borderColor: "#703923", color: "#703923" }}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  className="border p-1 rounded flex-1"
                  style={{ borderColor: "#703923" }}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                />
                <button
                  onClick={saveName}
                  className="px-3 py-1 text-white rounded"
                  style={{ backgroundColor: "#703923" }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="px-2 py-1 border rounded"
                  style={{ borderColor: "#703923", color: "#703923" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-bold" style={{ color: "#703923" }}>
            Book Preferences
          </p>
          {/* DESCRIPTION */}
          <p className="text-xs text-gray-600 mt-1">My Selected Genres:</p>
        </div>

        <div className="mt-2">
          <div className="flex flex-wrap gap-2 items-center">
            {profile.genres.map((g, i) => (
              <div
                key={g + i}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full border"
                style={{ borderColor: "#703923" }}
              >
                {editingGenreIndex === i ? (
                  <div className="flex items-center space-x-2">
                    <input
                      className="border px-2 py-1 rounded"
                      style={{ borderColor: "#703923" }}
                      value={editingGenreValue}
                      onChange={(e) => setEditingGenreValue(e.target.value)}
                    />
                    <button
                      onClick={() => saveEditGenre(i)}
                      className="px-2 py-1 text-white rounded"
                      style={{ backgroundColor: "#703923" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingGenreIndex(null);
                        setEditingGenreValue("");
                      }}
                      className="px-2 py-1 border rounded"
                      style={{ borderColor: "#703923", color: "#703923" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {/* SHOW GENRE SELECTED */}
                    <span
                      className="text-xs mr-1"
                      aria-hidden="true"
                      style={{ color: "#703923" }}
                    >
                      ✓
                    </span>
                    {/* BOLDEN GENRE PICKED */}
                    <span className="text-sm font-medium">{g}</span>
                    <button
                      onClick={() => deleteGenre(i)}
                      className="ml-2 text-xs px-1"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* Add button */}
            <button
              onClick={() => {
                setIsGenrePickerOpen(true);
                setGenreSearchTerm("");
              }}
              className="ml-1 w-8 h-8 rounded-full border flex items-center justify-center"
              style={{ borderColor: "#703923", color: "#703923" }}
              aria-label="Add genre"
            >
              +
            </button>
          </div>
        </div>

        {/* Reading Stats Cards */}
        <div className="mt-6">
          <h3 className="text-sm font-bold mb-3" style={{ color: "#703923" }}>
            My Library
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Favorites Card */}
            <div
              className="bg-white border-2 rounded-xl p-3 flex flex-col items-center justify-center"
              style={{ borderColor: "#703923" }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#703923"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.182l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
              <p
                className="text-2xl font-bold mt-2"
                style={{ color: "#703923" }}
              >
                {favoritesCount}
              </p>
              <p className="text-xs text-gray-600">Favorites</p>
            </div>

            {/* Collections Card */}
            <div
              className="bg-white border-2 rounded-xl p-3 flex flex-col items-center justify-center"
              style={{ borderColor: "#703923" }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#703923"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p
                className="text-2xl font-bold mt-2"
                style={{ color: "#703923" }}
              >
                {collectionsCount}
              </p>
              <p className="text-xs text-gray-600">Collections</p>
            </div>

            {/* Genres Card */}
            <div
              className="bg-white border-2 rounded-xl p-3 flex flex-col items-center justify-center"
              style={{ borderColor: "#703923" }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#703923"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <p
                className="text-2xl font-bold mt-2"
                style={{ color: "#703923" }}
              >
                {genresCount}
              </p>
              <p className="text-xs text-gray-600">Genres</p>
            </div>
          </div>
        </div>

        {/* Reading Goal Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold" style={{ color: "#703923" }}>
              Reading Goal
            </h3>
            {!editingGoal && (
              <button
                onClick={handleEditGoal}
                className="text-xs px-2 py-1 border rounded"
                style={{ borderColor: "#703923", color: "#703923" }}
              >
                Edit
              </button>
            )}
          </div>

          {editingGoal ? (
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                className="border p-2 rounded flex-1"
                style={{ borderColor: "#703923" }}
                value={goalDraft}
                onChange={(e) => setGoalDraft(e.target.value)}
                min="1"
              />
              <button
                onClick={handleSaveGoal}
                className="px-3 py-2 text-white rounded"
                style={{ backgroundColor: "#703923" }}
              >
                Save
              </button>
              <button
                onClick={() => setEditingGoal(false)}
                className="px-2 py-2 border rounded"
                style={{ borderColor: "#703923", color: "#703923" }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              className="bg-white border-2 rounded-xl p-4"
              style={{ borderColor: "#703923" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-bold" style={{ color: "#703923" }}>
                    {favoritesCount}
                  </span>{" "}
                  / {readingGoal} books
                </p>
                <p className="text-sm font-bold" style={{ color: "#703923" }}>
                  {progress}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "#703923",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* genre picker */}
      {isGenrePickerOpen && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setIsGenrePickerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-xl md:rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  autoFocus
                  value={genreSearchTerm}
                  onChange={(e) => setGenreSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="w-full border px-3 py-2 rounded-full focus:outline-none"
                  style={{ borderColor: "#703923" }}
                />
              </div>
              <button
                onClick={() => setIsGenrePickerOpen(false)}
                className="ml-2 px-3 py-2 rounded-full text-white transition-all active:scale-95 active:opacity-80"
                style={{ backgroundColor: "#703923", cursor: "pointer" }}
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 max-h-60 overflow-auto">
              {filteredSuggestions.length === 0 ? (
                <div className="text-sm text-gray-500">No suggestions</div>
              ) : (
                filteredSuggestions.map((s) => {
                  // show selected genre instead of hiding it from the list
                  const isSelected = profile.genres.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        addGenre(s);
                      }}
                      className="px-3 py-1 rounded-full border text-sm flex items-center gap-1"
                      style={{
                        borderColor: "#703923",
                        backgroundColor: isSelected ? "#703923" : "#f3f4f6", // highlight what was chosen
                        color: isSelected ? "white" : "#111827",
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {isSelected && (
                        <span aria-hidden="true" className="text-xs">
                          ✓
                        </span>
                      )}
                      {s}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

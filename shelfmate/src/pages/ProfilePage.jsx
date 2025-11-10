import React, { useEffect, useState, useRef } from 'react';
import { GENRE_OPTIONS } from '../data/books';
import { USER } from '../data/user';

export default function ProfilePage() {
  const STORAGE_KEY = 'shelfmate_profile_v1';

  const defaultProfile = {
    name: USER.name,
    username: USER.username,
    avatar: USER.avatar, 
    genres: USER.genres,
  };


  const [profile, setProfile] = useState(defaultProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [editingGenreIndex, setEditingGenreIndex] = useState(null);
  const [editingGenreValue, setEditingGenreValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
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

  function handleNameEdit() {
    setNameDraft(profile.name || '');
    setEditingName(true);
  }

  function saveName() {
    setProfile((p) => ({ ...p, name: nameDraft || 'Reader' }));
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
    const genre = (g || '').trim();
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
    setEditingGenreValue('');
  }

  function deleteGenre(i) {
    setProfile((p) => ({ ...p, genres: p.genres.filter((_, idx) => idx !== i) }));
  }

  const filteredSuggestions = GENRE_OPTIONS.filter((s) =>
    s.toLowerCase().includes(modalSearch.toLowerCase()) && !profile.genres.includes(s)
  );

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-black" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 border-2 border-black">
                {profile.name ? profile.name.split(' ').map(s => s[0]).slice(0,2).join('') : 'JD'}
              </div>
            )}
            <button
              onClick={triggerAvatarPick}
              className="absolute -bottom-2 -right-2 bg-white border border-black rounded-full p-1 shadow-md"
              aria-label="Edit avatar"
            >
              ✎
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          </div>

          <div className="flex-1">
            {!editingName ? (
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold">{profile.name}</h2>
                  <p className="text-sm text-gray-600">@{profile.username}</p>
                </div>
                <button onClick={handleNameEdit} className="text-sm px-2 py-1 border rounded">Edit</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input className="border p-1 rounded flex-1" value={nameDraft} onChange={(e)=>setNameDraft(e.target.value)} />
                <button onClick={saveName} className="px-3 py-1 bg-black text-white rounded">Save</button>
                <button onClick={()=>setEditingName(false)} className="px-2 py-1 border rounded">Cancel</button>
              </div>
            )}
            {/* subtitle moved to sit under the name for clearer hierarchy */}
          </div>
        </div>

        {/* Subtitle under name + avatar, above the genres */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Book Preferences</p>
        </div>

        <div className="mt-2">
          <div className="flex flex-wrap gap-2 items-center">
            {profile.genres.map((g, i) => (
              <div key={g + i} className="flex items-center bg-gray-100 px-3 py-1 rounded-full border">
                {editingGenreIndex === i ? (
                  <div className="flex items-center space-x-2">
                    <input className="border px-2 py-1 rounded" value={editingGenreValue} onChange={(e)=>setEditingGenreValue(e.target.value)} />
                    <button onClick={()=>saveEditGenre(i)} className="px-2 py-1 bg-black text-white rounded">Save</button>
                    <button onClick={()=>{setEditingGenreIndex(null); setEditingGenreValue('')}} className="px-2 py-1 border rounded">Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{g}</span>
                    <button onClick={()=>deleteGenre(i)} className="ml-2 text-xs px-1">✕</button>
                  </>
                )}
              </div>
            ))}

            {/* Add button */}
            <button
              onClick={()=>{ setModalOpen(true); setModalSearch(''); }}
              className="ml-1 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700"
              aria-label="Add genre"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Modal: genre picker/search */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30" onClick={()=>setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-xl md:rounded-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  autoFocus
                  value={modalSearch}
                  onChange={(e)=>setModalSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button onClick={()=>setModalOpen(false)} className="ml-2 px-3 py-2 border rounded">Close</button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 max-h-60 overflow-auto">
              {filteredSuggestions.length === 0 ? (
                <div className="text-sm text-gray-500">No suggestions</div>
              ) : (
                filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={()=>{ addGenre(s); }}
                    className="bg-gray-100 px-3 py-1 rounded-full border text-sm"
                  >
                    {s}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

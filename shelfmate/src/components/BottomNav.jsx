import React from 'react';

export default function BottomNav({ currentView, onNavigate }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black">
      <div className="flex justify-around items-center py-3">
        <button
          onClick={() => onNavigate('home')}
          className={`p-2 ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={currentView === 'home' ? 2.5 : 2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate('favorites')}
          className={`p-2 ${currentView === 'favorites' ? 'text-black' : 'text-gray-400'}`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={currentView === 'favorites' ? 2.5 : 2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate('swipe')}
          className={`p-2 ${currentView === 'swipe' ? 'text-black' : 'text-gray-400'}`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={currentView === 'swipe' ? 2.5 : 2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className={`p-2 ${currentView === 'profile' ? 'text-black' : 'text-gray-400'}`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={currentView === 'profile' ? 2.5 : 2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
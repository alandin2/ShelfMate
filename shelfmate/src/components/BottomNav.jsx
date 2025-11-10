import React, { useEffect } from 'react';

export default function BottomNav({ currentView, onNavigate }) {
  // Handle viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const navItems = [
    {
      name: 'home',
      label: 'Home',
      icon: (isActive) => (
        <svg className="w-7 h-7" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isActive ? 1 : 2} viewBox="0 0 20 24">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      name: 'discover',
      label: 'Discover',
      icon: (isActive) => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" fill={isActive ? 'currentColor' : 'none'} />
        </svg>
      )
    },
    {
      name: 'favorites',
      label: 'Favorites',
      icon: (isActive) => (
        <svg className="w-7 h-7" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isActive ? 1.5 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: (isActive) => (
        <svg className="w-7 h-7" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isActive ? 1.5 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 safe-bottom" style={{ borderColor: '#703923' }}>
      <div className="mx-auto max-w-2xl bg-white">
        <div className="flex justify-around items-center h-[60px] px-4">
          {navItems.map((item) => {
            const isActive = currentView === item.name;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.name)}
                className={`flex flex-col items-center justify-center w-full p-1 min-h-[48px] transition-all duration-200 ease-in-out rounded-lg
                  touch-manipulation select-none
                  active:shadow-lg active:bg-gray-100 active:scale-95
                  ${isActive ? 'transform scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                style={isActive ? { color: '#703923' } : {}}
              >
                {item.icon(isActive)}
                <span className={`text-xs mt-1 font-medium transition-colors duration-200
                  ${isActive ? '' : 'text-gray-500'}`}
                  style={isActive ? { color: '#703923' } : {}}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-black">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">ShelfMate</h1>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'home' && <HomePage />}
      {currentView === 'favorites' && (
        <div className="flex-1 flex items-center justify-center">
          <p>Favorites Page (Coming Soon)</p>
        </div>
      )}
      {currentView === 'discover' && (
        <div className="flex-1 flex items-center justify-center">
          <p>Discover Page (Coming Soon)</p>
        </div>
      )}
      {currentView === 'profile' && <ProfilePage />}

      {/* Bottom Navigation */}
      <BottomNav 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
    </div>
  );
}
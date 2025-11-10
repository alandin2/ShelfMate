import { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  const handleLogout = () => {
    setShowOnboarding(true);
  };

  if (showOnboarding) {
    return <OnboardingPage onGetStarted={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <div className="px-4 py-3 border-b-2" style={{ backgroundColor: '#703923', borderColor: '#703923' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">ShelfMate</h1>
          <button
            onClick={handleLogout}
            className="text-white text-sm font-medium px-3 py-1 border border-white rounded-full hover:bg-white hover:text-[#703923] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'home' && <HomePage />}
      {currentView === 'favorites' && <FavoritesPage />}
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
import { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import DiscoveryPage from './pages/DiscoveryPage';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const handleGetStarted = () => {
    setShowOnboarding(false);
    setShowLogin(true);
  };

  const handleLogin = () => {
    setShowLogin(false);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowOnboarding(true);
  };

  // Show onboarding first
  if (showOnboarding) {
    return <OnboardingPage onGetStarted={handleGetStarted} />;
  }

  // Then show login
  if (showLogin && !isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
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
      {currentView === 'discover' && <DiscoveryPage onNavigate={setCurrentView} />}
      {currentView === 'profile' && <ProfilePage />}

      {/* Bottom Navigation */}
      <BottomNav 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
    </div>
  );
}
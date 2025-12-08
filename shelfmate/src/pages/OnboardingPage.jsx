import React, { useState } from 'react';
import onboardingImage from '../assets/onboarding.JPG';
import OnboardingCarousel from '../components/OnboardingCarousel';

export default function OnboardingPage({ onGetStarted }) {
  const [showCarousel, setShowCarousel] = useState(false);

  const handleStartClick = () => {
    // show the onboarding carousel after tapping Get Started
    setShowCarousel(true);
  };

  const handleCarouselFinish = () => {
    setShowCarousel(false);
    onGetStarted && onGetStarted();
  };

  const handleCarouselBack = () => {
    // return to initial onboarding image
    setShowCarousel(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Image Container - Takes about 75% of screen */}
      <div className="flex-shrink-0" style={{ height: '75vh' }}>
        {showCarousel ? (
          <div className="w-full h-full flex items-center justify-center">
            {/* supply friendly titles for each slide */}
            <OnboardingCarousel
              onFinish={handleCarouselFinish}
              onBack={handleCarouselBack}
              slideCount={4}
              slideTitles={[
                'Welcome to ShelfMate',
                'Discover by Swiping',
                'Save books to Favorites',
                'Customize your Profile',
              ]}
            />
          </div>
        ) : (
          <img 
            src={onboardingImage} 
            alt="Onboarding" 
            className="w-full h-full object-cover"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          />
        )}
      </div>

      {/* Button Container */}
      {!showCarousel && (
        <div className="px-6 pb-8">
          <button
            onClick={handleStartClick}
            style={{ backgroundColor: '#703923' }}
            className="w-4/5 mx-auto block text-white py-3 px-5 rounded-3xl text-base font-semibold hover:opacity-90 active:bg-white active:text-[#703923] active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}
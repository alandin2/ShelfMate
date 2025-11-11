import React from 'react';
import onboardingImage from '../assets/onboarding.JPG';

export default function OnboardingPage({ onGetStarted }) {
  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Image Container - Takes about 75% of screen */}
      <div className="flex-shrink-0" style={{ height: '75vh' }}>
        <img 
          src={onboardingImage} 
          alt="Onboarding" 
          className="w-full h-full object-cover"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        />
      </div>
      
      {/* Button Container */}
      <div className="px-6 pb-8">
        <button
          onClick={onGetStarted}
          style={{ backgroundColor: '#703923' }}
          className="w-4/5 mx-auto block text-white py-3 px-5 rounded-3xl text-base font-semibold hover:opacity-90 active:bg-white active:text-[#703923] active:scale-95 transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
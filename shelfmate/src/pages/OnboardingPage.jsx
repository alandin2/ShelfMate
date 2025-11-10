import React from 'react';
import onboardingImage from '../assets/onboarding.JPG';

export default function OnboardingPage({ onGetStarted }) {
  return (
    <div className="h-screen bg-white flex flex-col max-w-md mx-auto" style={{ userSelect: 'none', cursor: 'default' }}>
      {/* Image Container - Takes most of the screen */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img 
          src={onboardingImage} 
          alt="Onboarding" 
          className="w-full h-full object-cover"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        />
      </div>
      
      {/* Button Container */}
      <div className="px-6 pb-8" style={{ userSelect: 'none' }}>
        <button
          onClick={onGetStarted}
          style={{ backgroundColor: '#703923', cursor: 'pointer' }}
          className="w-4/5 mx-auto block text-white py-3 px-5 rounded-3xl text-base font-semibold hover:opacity-90 active:bg-white active:text-[#703923] active:scale-95 transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

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
        />
      </div>
      
      {/* Button Container - With whitespace below */}
      <div className="flex-1 flex flex-col justify-center px-6 bg-white pb-32">
        <button
          onClick={onGetStarted}
          style={{ backgroundColor: '#703923' }}
          className="w-full max-w-xs mx-auto text-white py-4 px-6 rounded-full text-lg font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
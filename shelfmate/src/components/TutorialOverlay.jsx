import React from 'react';
import onboardingImage from '../assets/onboarding.JPG';

export default function TutorialOverlay({ onClose }) {
  return (
    <div className="px-6 pb-4">
      <div className="bg-white/90 rounded-xl p-4 shadow-md border" style={{ borderColor: '#f0e6e2' }}>
        <h3 className="text-lg font-bold mb-2" style={{ color: '#703923' }}>Quick tour</h3>
        <p className="text-sm text-gray-700 mb-3">Here’s how ShelfMate works so you can get started quickly.</p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#703923] flex items-center justify-center text-white font-semibold">Nav</div>
            <div>
              <div className="text-sm font-medium">Use the bottom navigation</div>
              <div className="text-xs text-gray-600">Home · Discover · Favorites · Profile</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-14 rounded-sm bg-gray-200 overflow-hidden flex items-center justify-center">
              <div style={{ width: 28, height: 42, backgroundColor: '#f7f5f3', borderRadius: 6, position: 'relative' }}>
                <img src={onboardingImage} alt="mock" style={{ width: 28, height: 42, objectFit: 'cover', opacity: 0.9 }} />
                <div className="swipe-arrow" style={{ position: 'absolute', left: -20, top: '40%', width: 18, height: 18 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Discover is swipe-first</div>
              <div className="text-xs text-gray-600">Swipe right to like (adds to Favorites), swipe left to skip.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-yellow-400 flex items-center justify-center text-white font-semibold">♥</div>
            <div>
              <div className="text-sm font-medium">Favorites</div>
              <div className="text-xs text-gray-600">All books you like are saved to Favorites for later.</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            style={{ backgroundColor: '#703923' }}
            className="text-white py-2 px-4 rounded-2xl font-semibold hover:opacity-90 transition-all"
          >
            Got it
          </button>
        </div>

        <style>{`
          .swipe-arrow { animation: swipe 1.2s linear infinite; }
          @keyframes swipe {
            0% { transform: translateX(0); opacity: 0.2 }
            40% { transform: translateX(18px); opacity: 1 }
            100% { transform: translateX(36px); opacity: 0 }
          }
        `}</style>
      </div>
    </div>
  );
}

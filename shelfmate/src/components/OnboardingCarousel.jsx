import React, { useState, useEffect, useRef } from 'react';

export default function OnboardingCarousel({ onFinish, slideCount = 4, slideTitles = [], onBack }) {
  const slides = Array.from({ length: slideCount }).map((_, i) => i + 1);
  const [index, setIndex] = useState(0);
  const [videoSources, setVideoSources] = useState([]);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [preloadSrc, setPreloadSrc] = useState(null);

  // load a single video per slide
  useEffect(() => {
    const exts = ['mp4'];
    const loaded = slides.map((slideNum) => {
      for (const ext of exts) {
        try {
          const src = require(`../assets/onboarding-slide-${slideNum}.${ext}`);
          return { src, type: ext };
        } catch (e) {
          // not found
        }
      }
      return null;
    });
    setVideoSources(loaded);
  }, [slideCount]);

  // play current video when index changes
  useEffect(() => {
    setProgress(0);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }

    // preload next video
    const nextIndex = Math.min(index + 1, videoSources.length - 1);
    const next = videoSources[nextIndex];
    if (next && (next.type === 'mp4')) {
      setPreloadSrc(next.src);
    } else {
      setPreloadSrc(null);
    }
  }, [index, videoSources]);

  // timeupdate handler updates progress
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration || isNaN(v.duration)) return;
    setProgress(Math.min(1, v.currentTime / v.duration));
  };

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));

  const current = videoSources[index];

  const title = (slideTitles && slideTitles[index]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-0 w-full h-full">
      <div className="w-full flex-1 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm overflow-hidden relative">
        {/* Slide title */}
        <div className="w-full px-4 pt-4 text-center">
          <h3 className="text-lg font-semibold" style={{ color: '#703923' }}>{title}</h3>
        </div>
        <div className="flex items-center justify-center w-full h-full">
          {current ? (
            <video
              ref={videoRef}
              src={current.src}
              autoPlay
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div className="text-center px-4 text-black">
              <div className="text-sm">No video for slide {index + 1}</div>
            </div>
          )}
        </div>

  {/* progress bar */}
        <div className="absolute left-0 right-0 bottom-0 h-2 bg-black/30">
          <div className="h-full bg-[#703923] transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>

        {/* preload next video hidden */}
        {preloadSrc && <video src={preloadSrc} preload="auto" style={{ display: 'none' }} />}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 my-3">
        <button
          onClick={() => {
            if (index === 0) {
              // if first slide, go back to onboarding
              if (onBack) onBack();
            } else {
              prev();
            }
          }}
          className={`px-3 py-2 rounded-md border ${index === 0 ? 'opacity-90' : ''}`}
        >
          Prev
        </button>

        {index < slides.length - 1 ? (
          <button
            onClick={next}
            className="px-4 py-2 rounded-2xl bg-[#703923] text-white font-semibold"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="px-4 py-2 rounded-2xl bg-[#703923] text-white font-semibold"
          >
            Done
          </button>
        )}
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-0 mb-4">
        {slides.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-[#703923]' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
}


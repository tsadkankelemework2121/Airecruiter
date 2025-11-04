"use client";

import { useState, useRef, useCallback } from "react";
import { Play, Pause } from "lucide-react";

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error("Error toggling video playback:", error);
    }
  }, [isPlaying]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          src="/airecruiter.webm"
          className="w-full h-auto"
          loop
          playsInline
          preload="auto"
          controls={false}
          onLoadedData={() => setIsLoaded(true)}
          onCanPlay={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Play/Pause Button Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300 hover:bg-black/30 cursor-pointer group"
          onClick={togglePlay}
          style={{
            opacity: isPlaying ? 0 : (isLoaded ? 1 : 0),
            pointerEvents: isLoaded ? "auto" : "none",
          }}
          onMouseEnter={(e) => {
            if (isPlaying && isLoaded) {
              e.currentTarget.style.opacity = "0.3";
            }
          }}
          onMouseLeave={(e) => {
            if (isPlaying) {
              e.currentTarget.style.opacity = "0";
            }
          }}
        >
          {isLoaded && (
            <div className="bg-orange-500/90 backdrop-blur-md rounded-full p-6 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:bg-orange-500 group-hover:shadow-orange-500/50">
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" strokeWidth={3} />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" strokeWidth={3} fill="white" />
              )}
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Floating control button */}
        <button
          onClick={togglePlay}
          className={`absolute bottom-4 right-4 z-30 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-3 shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center gap-2 group`}
          style={{
            boxShadow: isPlaying 
              ? "0 10px 30px rgba(255, 165, 0, 0.4), 0 0 20px rgba(255, 165, 0, 0.2)" 
              : "0 10px 30px rgba(255, 165, 0, 0.6), 0 0 20px rgba(255, 165, 0, 0.3)",
          }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" strokeWidth={3} />
              <span className="text-sm font-semibold hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 ml-0.5" strokeWidth={3} fill="white" />
              <span className="text-sm font-semibold hidden sm:inline">Play</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


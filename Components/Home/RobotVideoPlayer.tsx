"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

export default function RobotVideoPlayer() {
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
    <div className="relative w-full max-w-md lg:max-w-lg">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl transform rotate-6 opacity-20 blur-2xl"></div>
      
      {/* Main container */}
      <div className="relative">
        {/* Robot Image */}
        <Image
          src="/Aiimage.png"
          alt="AI Robot helping with recruitment"
          width={600}
          height={700}
          className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
          priority
        />

        {/* Video Overlay - Positioned on the robot's rectangle face screen */}
        <div 
          className="absolute z-20"
          style={{
            // Position the video overlay precisely on the robot's rectangle face screen
            // Fine-tuned for rectangular face shape - adjust these if needed:
            // top: vertical position (increase = lower on image)
            // width: size of rectangle (increase = bigger)
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "42%", // Large enough to fit the rectangle face
            aspectRatio: "16 / 9", // Widescreen ratio for rectangle face
            borderRadius: "6px", // Slight rounding to match rectangular face edges
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(255, 165, 0, 0.6), inset 0 0 25px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 0, 0, 0.3)",
            border: "3px solid rgba(255, 165, 0, 0.2)",
          }}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src="/airecruiter.webm"
            className="w-full h-full object-cover"
            loop
            playsInline
            preload="auto"
            controls={false}
            style={{
              filter: "brightness(0.85) contrast(1.15) saturate(1.1)",
              objectFit: "cover",
            }}
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
              <div className="bg-orange-500/90 backdrop-blur-md rounded-full p-4 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:bg-orange-500 group-hover:shadow-orange-500/50">
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" strokeWidth={3} />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" strokeWidth={3} fill="white" />
                )}
              </div>
            )}
          </div>

          {/* Loading indicator */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Glowing border effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(255, 165, 0, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.5)",
              border: "2px solid rgba(255, 165, 0, 0.3)",
            }}
          />
        </div>

        {/* Floating control button outside the video area */}
        <button
          onClick={togglePlay}
          className={`absolute bottom-8 right-8 z-30 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-4 shadow-xl transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center gap-2 group`}
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


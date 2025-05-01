'use client'

import { useEffect, useRef, useCallback, useState } from 'react';
import type { YT } from '../types/youtube';

// Define YouTube Player types
interface YouTubePlayerProps {
  videoId: string;
  onPlayerReady?: (player: YT.Player) => void;
  onStateChange?: (state: number) => void;
}

// Single global variable to track if API is loaded
let youtubeApiLoaded = false;

export default function YouTubePlayer({
  videoId,
  onPlayerReady,
  onStateChange,
}: YouTubePlayerProps) {
  const playerElementId = 'youtube-player-container';
  const playerInstanceRef = useRef<YT.Player | null>(null);
  const isPlayerReady = useRef<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const isInitializing = useRef<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const retryCount = useRef<number>(0);
  const maxRetries = 3;

  // Function to create the player with error handling
  const initializePlayer = useCallback(() => {
    // Return early if YouTube API is not loaded or already initializing
    if (!window.YT || isInitializing.current || document.getElementById(playerElementId)?.hasChildNodes()) {
      return;
    }
    
    isInitializing.current = true;
    console.log("Initializing player with videoId:", videoId);
    setPlayerError(null);
    setCurrentVideoId(videoId);
    
    const player = new window.YT.Player(playerElementId, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,      // Autoplay when ready
        controls: 0,      // Hide YouTube controls
        disablekb: 1,     // Disable keyboard controls
        playsinline: 1,   // Play inline (not fullscreen) on mobile 
        modestbranding: 1, // Minimal YouTube branding
        origin: window.location.origin, // Set origin explicitly for CORS
        host: 'https://www.youtube-nocookie.com', // Privacy-enhanced mode
        rel: 0            // Don't show related videos
      },
      events: {
        onReady: (event: YT.PlayerEvent) => {
          console.log("YouTube player ready");
          isPlayerReady.current = true;
          playerInstanceRef.current = event.target;
          isInitializing.current = false;
          retryCount.current = 0;
          
          // Set default volume
          event.target.setVolume(100);
          
          // Explicitly start playing the video
          event.target.playVideo();
          
          // Call the onPlayerReady callback if provided
          if (onPlayerReady) {
            onPlayerReady(event.target);
          }
        },
        onStateChange: (event: YT.PlayerEvent) => {
          console.log("YouTube state change:", event.data);
          // Call the onStateChange callback if provided
          if (onStateChange) {
            onStateChange(event.data);
          }
        },
        onError: (event: YT.PlayerEvent) => {
          console.error('YouTube Player Error:', event.data);
          isInitializing.current = false;
          
          let errorMessage = "An error occurred with the video player.";
          
          // Handle specific error codes
          switch(event.data) {
            case 2:
              errorMessage = "Invalid video ID parameter.";
              break;
            case 5:
              errorMessage = "Error with HTML5 player.";
              break;
            case 100:
              errorMessage = "Video not found or removed.";
              break;
            case 101:
            case 150:
              errorMessage = "Video cannot be played in embedded players or on this device.";
              // Try to recover by using youtube-nocookie.com domain
              if (retryCount.current < maxRetries) {
                retryCount.current++;
                tryAlternativeEmbedMethod(videoId);
                return;
              }
              break;
          }
          
          setPlayerError(errorMessage);
        }
      }
    });
  }, [videoId, onPlayerReady, onStateChange]);
  
  // Alternative embed method for error 150
  const tryAlternativeEmbedMethod = useCallback((videoId: string) => {
    console.log("Trying alternative embed method...");
    const container = document.getElementById(playerElementId);
    
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create iframe directly
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.border = "0";
    
    container.appendChild(iframe);
    setPlayerError(null);
    
    // Try to get reference to player
    setTimeout(() => {
      if (window.YT && iframe.contentWindow) {
        try {
          const player = new window.YT.Player(iframe);
          playerInstanceRef.current = player;
          isPlayerReady.current = true;
          setCurrentVideoId(videoId);
          
          if (onPlayerReady) {
            onPlayerReady(player);
          }
        } catch (err) {
          console.error("Failed to initialize alternate player:", err);
        }
      }
    }, 2000);
  }, [onPlayerReady]);

  // Load YouTube API and create player instance once
  useEffect(() => {
    // Load the YouTube API if not already loaded
    if (!youtubeApiLoaded) {
      // Add global callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        youtubeApiLoaded = true;
        initializePlayer();
      };
      
      // Create script tag and insert YouTube API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player && !playerInstanceRef.current) {
      // If API is already loaded, initialize the player directly only once
      initializePlayer();
    }

    // Clean up when component unmounts
    return () => {
      if (playerInstanceRef.current && typeof playerInstanceRef.current.destroy === 'function') {
        playerInstanceRef.current.destroy();
        isPlayerReady.current = false;
        isInitializing.current = false;
        setCurrentVideoId(null);
      }
    };
  }, []); // Empty dependency array to ensure this only runs once

  // Handle video ID changes - only load a new video if the ID has changed
  useEffect(() => {
    if (!playerInstanceRef.current || !isPlayerReady.current) return;
    
    // Only load new video if the videoId has changed
    if (videoId !== currentVideoId) {
      console.log(`Loading new video: ${videoId} (previous: ${currentVideoId})`);
      
      try {
        playerInstanceRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: 0
        });
        setCurrentVideoId(videoId);
        setPlayerError(null);
      } catch (err) {
        console.error("Error loading new video:", err);
        // If loading fails, try alternative method
        tryAlternativeEmbedMethod(videoId);
      }
    }
  }, [videoId, currentVideoId, tryAlternativeEmbedMethod]);

  return (
    <div className="youtube-player-wrapper">
      <div id={playerElementId} className="w-100 h-100"/>
      {playerError && (
        <div className="player-error-overlay d-flex align-items-center justify-content-center flex-column text-center">
          <p className="text-danger mb-2">{playerError}</p>
          <p className="text-muted small">Try refreshing the page or selecting a different video</p>
        </div>
      )}
      <style jsx>{`
        .youtube-player-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        #${playerElementId} {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        #${playerElementId} iframe {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .player-error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

// Add global type definition for YouTube
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}
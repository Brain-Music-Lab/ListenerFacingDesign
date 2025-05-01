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

  // Function to create the player
  const initializePlayer = useCallback(() => {
    // Return early if YouTube API is not loaded or already initializing
    if (!window.YT || isInitializing.current || document.getElementById(playerElementId)?.hasChildNodes()) {
      return;
    }
    
    isInitializing.current = true;
    console.log("Initializing player with videoId:", videoId);
    setCurrentVideoId(videoId);
    
    const player = new window.YT.Player(playerElementId, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,      // Autoplay when ready
        controls: 0,      // Hide YouTube controls
        disablekb: 1,     // Disable keyboard controls
        playsinline: 1,   // Play inline (not fullscreen) on mobile 
        modestbranding: 1 // Minimal YouTube branding
      },
      events: {
        onReady: (event: YT.PlayerEvent) => {
          console.log("YouTube player ready");
          isPlayerReady.current = true;
          playerInstanceRef.current = event.target;
          isInitializing.current = false;
          
          // Set default volume
          event.target.setVolume(100);
          
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
        }
      }
    });
  }, [videoId, onPlayerReady, onStateChange]);

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
      playerInstanceRef.current.loadVideoById({
        videoId: videoId,
        startSeconds: 0
      });
      setCurrentVideoId(videoId);
    }
  }, [videoId, currentVideoId]);

  return (
    <div className="youtube-player-wrapper">
      <div id={playerElementId} className="w-100 h-100"/>
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
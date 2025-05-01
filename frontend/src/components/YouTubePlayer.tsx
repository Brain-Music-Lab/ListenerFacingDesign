'use client'

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Player, PlayerEvent } from '../types/youtube';

// Define YouTube Player types
interface YouTubePlayerProps {
  videoId: string;
  onPlayerReady?: (player: Player) => void;
  onStateChange?: (state: number) => void;
}

// Single global variable to track if API is loaded
let youtubeApiLoaded = false;

export default function YouTubePlayer({
  videoId,
  onPlayerReady,
  onStateChange,
}: YouTubePlayerProps) {
  console.log('📺 YouTubePlayer component rendering with videoId:', videoId);
  const playerElementId = 'youtube-player-container';
  const playerInstanceRef = useRef<Player | null>(null);
  const isPlayerReady = useRef<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const isInitializing = useRef<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const retryCount = useRef<number>(0);
  const maxRetries = 3;
  const isUnmounting = useRef<boolean>(false);

  // Track component unmounting
  useEffect(() => {
    isUnmounting.current = false;
    return () => {
      console.log('🔴 YouTubePlayer component is unmounting');
      isUnmounting.current = true;
    };
  }, []);

  // Alternative embed method for error 150
  const tryAlternativeEmbedMethod = useCallback((videoId: string) => {
    console.log("🔄 Trying alternative embed method for videoId:", videoId);
    const container = document.getElementById(playerElementId);
    
    if (!container) {
      console.error("❌ Alternative method failed: container not found:", playerElementId);
      return;
    }
    
    console.log("🧹 Clearing container and creating iframe directly");
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
    console.log("⏱️ Starting timeout to initialize alternative player");
    setTimeout(() => {
      if (window.YT && iframe.contentWindow) {
        try {
          console.log("🔄 Creating YT.Player with iframe in alternative method");
          const player = new window.YT.Player(iframe, {
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              playsinline: 1,
              modestbranding: 1,
              origin: window.location.origin,
              host: 'https://www.youtube-nocookie.com',
              rel: 0
            }
          });
          console.log("✅ Alternative player created:", player);
          playerInstanceRef.current = player;
          isPlayerReady.current = true;
          setCurrentVideoId(videoId);
          
          if (onPlayerReady) {
            console.log("📣 Calling onPlayerReady from alternative method");
            onPlayerReady(player);
          }
        } catch (err) {
          console.error("❌ Failed to initialize alternate player:", err);
        }
      } else {
        console.error("❌ Alternative method failed: YouTube API or iframe.contentWindow not available");
      }
    }, 2000);
  }, [onPlayerReady, playerElementId]);
  
  // Function to create the player with error handling
  const initializePlayer = useCallback(() => {
    console.log("🚀 initializePlayer called, videoId:", videoId, "isInitializing:", isInitializing.current);
    
    // Return early if YouTube API is not loaded or already initializing
    if (!window.YT) {
      console.warn("⚠️ YouTube API not loaded yet, skipping initialization");
      return;
    }
    
    if (isInitializing.current) {
      console.warn("⚠️ Player already initializing, skipping");
      return;
    }
    
    const containerElement = document.getElementById(playerElementId);
    if (!containerElement) {
      console.error("❌ Player container not found:", playerElementId);
      return;
    }
    
    if (containerElement.hasChildNodes()) {
      console.warn("⚠️ Container already has children, skipping initialization");
      return;
    }
    
    isInitializing.current = true;
    console.log("🔧 Starting player initialization with videoId:", videoId);
    setPlayerError(null);
    setCurrentVideoId(videoId);
    
    // Store the player instance when it's created
    try {
      console.log("🔄 Creating YT.Player instance with element:", playerElementId);
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
          onReady: (event: { target: Player }) => {
            console.log("🎉 YouTube player onReady fired!", event.target);
            isPlayerReady.current = true;
            playerInstanceRef.current = event.target;
            isInitializing.current = false;
            retryCount.current = 0;
            
            // Set default volume
            console.log("🔊 Setting player volume to 100");
            event.target.setVolume(100);
            
            // Explicitly start playing the video
            console.log("▶️ Calling playVideo");
            event.target.playVideo();
            
            // Call the onPlayerReady callback if provided
            if (onPlayerReady) {
              console.log("📣 Calling onPlayerReady callback");
              onPlayerReady(event.target);
            }
          },
          onStateChange: (event: PlayerEvent) => {
            console.log("🔄 YouTube state change:", event.data);
            // Call the onStateChange callback if provided
            if (onStateChange) {
              onStateChange(event.data);
            }
          },
          onError: (event: PlayerEvent) => {
            console.error("❌ YouTube Player Error:", event.data);
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
                  console.log("🔄 Trying alternative method after error, attempt:", retryCount.current);
                  tryAlternativeEmbedMethod(videoId);
                  return;
                }
                break;
            }
            
            console.error("⚠️ Setting player error:", errorMessage);
            setPlayerError(errorMessage);
          }
        }
      });
      
      // Store the player reference immediately after creation to avoid losing it
      // This provides a backup in case the onReady event doesn't fire properly
      if (player) {
        console.log("📌 Storing initial player reference:", player);
        playerInstanceRef.current = player;
      } else {
        console.warn("⚠️ YT.Player constructor did not return a player instance");
      }
    } catch (err) {
      console.error("❌ Error initializing YouTube player:", err);
      isInitializing.current = false;
      setPlayerError("Failed to initialize player");
    }
  }, [videoId, onPlayerReady, onStateChange, playerElementId, tryAlternativeEmbedMethod]);
  
  // Load YouTube API and create player instance once
  useEffect(() => {
    console.log("🔄 YouTube API load effect running, API loaded:", youtubeApiLoaded);
    
    // Load the YouTube API if not already loaded
    if (!youtubeApiLoaded) {
      console.log("📥 Loading YouTube API");
      // Add global callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        console.log("🎉 YouTube API ready callback fired");
        youtubeApiLoaded = true;
        initializePlayer();
      };
      
      // Create script tag and insert YouTube API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      console.log("📤 Inserting YouTube API script");
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player) {
      console.log("🔄 YouTube API already loaded, initializing player if needed");
      const containerElement = document.getElementById(playerElementId);
      if (!playerInstanceRef.current && containerElement && !containerElement.hasChildNodes()) {
        console.log("🔄 Initializing player as it doesn't exist");
        initializePlayer();
      } else if (playerInstanceRef.current) {
        console.log("✅ Player already exists, no need to initialize");
      } else {
        console.warn("⚠️ Cannot initialize player: container issue");
      }
    } else {
      console.warn("⚠️ youtubeApiLoaded is true but window.YT is not available");
    }

    // Don't destroy the player in the cleanup function - this causes the video to disappear
    // Instead, only do cleanup on component unmount, not on re-renders
    return () => {
      // Check if we're actually unmounting vs just re-rendering
      if (isUnmounting.current) {
        console.log("♻️ YouTubePlayer UNMOUNT cleanup, destroying player");
        if (playerInstanceRef.current && typeof playerInstanceRef.current.destroy === 'function') {
          console.log("🗑️ Destroying player instance on UNMOUNT");
          playerInstanceRef.current.destroy();
          isPlayerReady.current = false;
          isInitializing.current = false;
          setCurrentVideoId(null);
        } else {
          console.log("⚠️ No player to destroy or destroy method not available");
        }
      }
    };
  }, [initializePlayer, playerElementId]);

  // Handle video ID changes - only load a new video if the ID has changed
  useEffect(() => {
    console.log("🔄 Video ID change effect, current:", currentVideoId, "new:", videoId, 
                "player ready:", isPlayerReady.current, "player ref:", !!playerInstanceRef.current);
    
    if (!playerInstanceRef.current) {
      console.warn("⚠️ Cannot change video: playerInstanceRef.current is null");
      return;
    }
    
    if (!isPlayerReady.current) {
      console.warn("⚠️ Cannot change video: player not ready");
      return;
    }
    
    // Only load new video if the videoId has changed
    if (videoId !== currentVideoId) {
      console.log(`🔄 Loading new video: ${videoId} (previous: ${currentVideoId})`);
      
      try {
        console.log("▶️ Calling loadVideoById");
        playerInstanceRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: 0
        });
        setCurrentVideoId(videoId);
        setPlayerError(null);
      } catch (err) {
        console.error("❌ Error loading new video:", err);
        // If loading fails, try alternative method
        console.log("🔄 Trying alternative method after load failure");
        tryAlternativeEmbedMethod(videoId);
      }
    } else {
      console.log("ℹ️ Video ID unchanged, no action needed");
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
          object-fit: cover; /* Changed from 'contain' to 'cover' to fill the container */
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
    YT?: {
      Player: new (elementId: string | HTMLElement, options: {
        videoId: string;
        playerVars?: {
          autoplay?: number;
          controls?: number;
          disablekb?: number;
          playsinline?: number;
          modestbranding?: number;
          origin?: string;
          host?: string;
          rel?: number;
        };
        events?: {
          onReady?: (event: { target: Player }) => void;
          onStateChange?: (event: { target: Player; data: number }) => void;
          onError?: (event: { target: Player; data: number }) => void;
        };
      }) => Player;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
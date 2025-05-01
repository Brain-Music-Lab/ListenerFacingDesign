'use client'

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { YT } from '../types/youtube';
import { YouTubeSearchResult } from '../lib/youtube';

// Define a Memory type
interface Memory {
  memoryText: string;
  timestamp: number;
}

interface VideoState {
  videoId: string | null;
  player: YT.Player | null;
  isPlaying: boolean;
  currentVideoTitle: string | null;
  playerError: string | null;
  selectedVideo: YouTubeSearchResult | null;
  sessionId: string;
  setVideoId: (id: string | null) => void;
  setPlayer: (player: YT.Player | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentVideoTitle: (title: string | null) => void;
  setPlayerError: (error: string | null) => void;
  setSelectedVideo: (video: YouTubeSearchResult | null) => void;
  saveMemory: (memoryText: string) => Promise<void>;
  handlePlayerStateChange: (state: number) => void;
  resetSession: () => void;
}

const defaultVideoState: VideoState = {
  videoId: null,
  player: null,
  isPlaying: false,
  currentVideoTitle: null,
  playerError: null,
  selectedVideo: null,
  sessionId: new Date().getTime().toString(),
  setVideoId: () => {},
  setPlayer: () => {},
  setIsPlaying: () => {},
  setCurrentVideoTitle: () => {},
  setPlayerError: () => {},
  setSelectedVideo: () => {},
  saveMemory: async () => {},
  handlePlayerStateChange: () => {},
  resetSession: () => {},
};

const VideoContext = createContext<VideoState>(defaultVideoState);

export const useVideo = () => useContext(VideoContext);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeSearchResult | null>(null);
  const [sessionId, setSessionId] = useState<string>(new Date().getTime().toString());

  // Save memory text to API
  const saveMemory = useCallback(async (memoryText: string) => {
    if (!selectedVideo || !memoryText.trim()) return;
    
    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          videoId: selectedVideo.id,
          videoTitle: selectedVideo.title,
          memoryText: memoryText.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save memory');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error saving memory:', error);
      throw error;
    }
  }, [selectedVideo, sessionId]);

  // Reset session (used when returning to dashboard)
  const resetSession = useCallback(() => {
    console.log('Resetting session in VideoContext');
    // Generate a new session ID
    const newSessionId = new Date().getTime().toString();
    setSessionId(newSessionId);
    
    // Reset all video/player state
    setVideoId(null);
    setPlayer(null);
    setIsPlaying(false);
    setCurrentVideoTitle(null);
    setPlayerError(null);
    setSelectedVideo(null);
  }, []);

  // Parse player state changes
  const handlePlayerStateChange = (state: number) => {
    console.log('Player state changed:', state);
    
    // YT.PlayerState equivalents:
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    switch (state) {
      case -1:
        console.log('Video unstarted');
        setIsPlaying(false);
        break;
      case 0:
        console.log('Video ended');
        setIsPlaying(false);
        break;
      case 1:
        console.log('Video playing');
        setIsPlaying(true);
        setPlayerError(null); // Clear any errors once video starts playing
        break;
      case 2:
        console.log('Video paused');
        setIsPlaying(false);
        break;
      case 3:
        console.log('Video buffering');
        // Don't change isPlaying state during buffering
        break;
      case 5:
        console.log('Video cued');
        setIsPlaying(false);
        break;
      default:
        console.log('Unknown player state:', state);
    }
  };

  const value = {
    videoId,
    player,
    isPlaying,
    currentVideoTitle,
    playerError,
    selectedVideo,
    sessionId,
    setVideoId,
    setPlayer,
    setIsPlaying,
    setCurrentVideoTitle,
    setPlayerError,
    setSelectedVideo,
    saveMemory,
    handlePlayerStateChange,
    resetSession,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}
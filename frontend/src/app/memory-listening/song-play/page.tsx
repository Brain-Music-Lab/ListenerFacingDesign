'use client'

import { useRouter } from 'next/navigation';
import { useVideo } from '../../../contexts/VideoContext';
import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import YouTubePlayer from '../../../components/YouTubePlayer';
import WebSocketListener from '../../../components/WebSocketListener';
import type { YT } from '../../../types/youtube';

// Define YouTube player states
const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5
};

export default function SongPlay() {
  const router = useRouter();
  const { selectedVideo, sessionId } = useVideo();
  const [isPlaying, setIsPlaying] = useState(false); // Start with false until player is ready
  const [memoryText, setMemoryText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Redirect if no video is selected
    if (!selectedVideo) {
      router.push('/memory-listening/song-select');
    }
  }, [selectedVideo, router]);

  // Handle when player is ready
  const handlePlayerReady = (player: YT.Player) => {
    console.log("Player ready, storing reference");
    playerRef.current = player;
    
    // Ensure video starts playing when player is ready
    player.playVideo();
    setIsPlaying(true);
  };

  // Handle player state changes
  const handleStateChange = (state: number) => {
    console.log("handleStateChange called with state:", state);
    if (state === PlayerState.PLAYING) {
      console.log("Setting isPlaying to true");
      setIsPlaying(true);
    } else if (state === PlayerState.PAUSED || state === PlayerState.ENDED) {
      console.log("Setting isPlaying to false");
      setIsPlaying(false);
    }
  };

  // Play or pause the video
  const handlePlayPause = () => {
    if (!playerRef.current) {
      console.log("Can't play/pause - playerRef.current is null");
      return;
    }
    
    console.log("handlePlayPause called, current isPlaying:", isPlaying);
    
    if (isPlaying) {
      // Pause the video if currently playing
      console.log("Calling pauseVideo()");
      playerRef.current.pauseVideo();
    } else {
      // Play the video if currently paused
      console.log("Calling playVideo()");
      playerRef.current.playVideo();
    }
  };

  // Stop functionality commented out as requested
  /*
  const handleStop = () => {
    if (!playerRef.current) return;
    
    playerRef.current.stopVideo();
    setIsPlaying(false);
  };
  */

  // Save memory text
  const handleSubmit = async () => {
    if (!selectedVideo || !memoryText.trim() || isSaving) return;

    try {
      setIsSaving(true);
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

      setMemoryText('');
    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle interactions from controller
  const handleInteraction = (message: { [key: string]: boolean }) => {
    const [[instruction, state]] = Object.entries(message);
    if (!state) return;

    switch (instruction) {
      case 'green':
        handlePlayPause();
        break;
      // Red button (stop) functionality commented out
      // case 'red':
      //   handleStop();
      //   break;
      case 'yellow':
        handleSubmit();
        break;
      case 'blue':
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
        break;
    }
  };

  if (!selectedVideo) {
    return null;
  }

  return (
    <div className="container">
      <WebSocketListener onMessage={handleInteraction} />
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-center mb-4">Now Playing: {selectedVideo.title}</h2>
          <p className="text-center text-muted">Video state: {isPlaying ? 'Playing' : 'Paused'}</p>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="d-flex justify-content-center gap-2 mb-4">
            <Button 
              variant="primary" 
              onClick={handlePlayPause}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            {/* Stop button still visible but functionality commented out */}
            <Button 
              variant="secondary" 
              disabled={true} // Disabled as requested
            >
              Stop
            </Button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <InputGroup>
            <Form.Control
              ref={textInputRef}
              as="textarea"
              placeholder="What memory does this song bring up for you?"
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              style={{ height: '100px' }}
              disabled={isSaving}
            />
            <Button 
              variant="primary"
              onClick={handleSubmit}
              disabled={isSaving || !memoryText.trim()}
            >
              {isSaving ? 'Saving...' : 'Submit'}
            </Button>
          </InputGroup>
        </div>
      </div>
      
      <div className="row justify-content-center mb-4">
        <div className="col-12 d-flex justify-content-center">
          <Button 
            className="btn btn-primary"
            onClick={() => router.push('/memory-listening/song-select')}
          >
            Back to Song Select
          </Button>
        </div>
      </div>

      {/* Video player - moved to be smaller and under the back button */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="youtube-player-container" style={{ width: '100%', height: '360px' }}>
            <YouTubePlayer
              videoId={selectedVideo.id}
              onPlayerReady={handlePlayerReady}
              onStateChange={handleStateChange}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .youtube-player-container {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
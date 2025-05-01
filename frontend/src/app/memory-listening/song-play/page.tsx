'use client'

import { useRouter } from 'next/navigation';
import { useVideo } from '../../../contexts/VideoContext';
import { useEffect, useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import YouTubePlayer from '../../../components/YouTubePlayer';
import WebSocketListener from '../../../components/WebSocketListener';
import type { Player } from '../../../types/youtube.ts';

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
  const { selectedVideo, saveMemory } = useVideo();
  const [isPlaying, setIsPlaying] = useState(false); // Start with false until player is ready
  const [memoryText, setMemoryText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const playerRef = useRef<Player | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Add a ref for tracking button press time
  const redButtonPressTimeRef = useRef<number | null>(null);
  const redButtonTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Redirect if no video is selected
    if (!selectedVideo) {
      router.push('/memory-listening/song-select');
    }
  }, [selectedVideo, router]);

  // Handle when player is ready
  const handlePlayerReady = (player: Player) => {
    console.log("🎮 song-play: handlePlayerReady called with player:", player);
    playerRef.current = player;
    
    // Ensure video starts playing when player is ready
    console.log("🎮 song-play: Calling player.playVideo() from handlePlayerReady");
    player.playVideo();
    setIsPlaying(true);
  };

  // Handle player state changes
  const handleStateChange = (state: number) => {
    console.log("🎮 song-play: handleStateChange called with state:", state);
    if (state === PlayerState.PLAYING) {
      console.log("🎮 song-play: Setting isPlaying to true");
      setIsPlaying(true);
    } else if (state === PlayerState.PAUSED || state === PlayerState.ENDED) {
      console.log("🎮 song-play: Setting isPlaying to false");
      setIsPlaying(false);
    }
  };

  // Play or pause the video
  const handlePlayPause = () => {
    console.log("🎮 song-play: handlePlayPause called, playerRef.current:", playerRef.current, "isPlaying:", isPlaying);
    if (!playerRef.current) {
      console.error("🎮 song-play: Can't play/pause - playerRef.current is null");
      return;
    }
    
    if (isPlaying) {
      // Pause the video if currently playing
      console.log("🎮 song-play: Calling pauseVideo()");
      playerRef.current.pauseVideo();
    } else {
      // Play the video if currently paused
      console.log("🎮 song-play: Calling playVideo()");
      playerRef.current.playVideo();
    }
  };

  
  const handleStop = () => {
    console.log("🎮 song-play: handleStop called, playerRef.current:", playerRef.current);
    if (!playerRef.current) return;
    
    console.log("🎮 song-play: Calling stopVideo()");
    playerRef.current.stopVideo();
    setIsPlaying(false);
  };
  

  // Save memory text
  const handleSubmit = async () => {
    if (!selectedVideo || !memoryText.trim() || isSaving) return;

    try {
      setIsSaving(true);
      await saveMemory(memoryText.trim());
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
    
    // Special handling for red button
    if (instruction === 'red') {
      if (state) {
        // Button pressed down - start tracking time
        redButtonPressTimeRef.current = Date.now();
        
        // Set a timer for 2 seconds - if it completes, navigate to song-select
        redButtonTimerRef.current = setTimeout(() => {
          console.log("Red button held for 2+ seconds - returning to song select");
          router.push('/memory-listening/song-select');
        }, 2000);
      } else {
        // Button released
        const pressTime = redButtonPressTimeRef.current;
        
        // Clear the long-press timer
        if (redButtonTimerRef.current) {
          clearTimeout(redButtonTimerRef.current);
          redButtonTimerRef.current = null;
        }
        
        // If we have a press start time, calculate duration
        if (pressTime) {
          const pressDuration = Date.now() - pressTime;
          redButtonPressTimeRef.current = null;
          
          // If pressed for less than 1 second, trigger stop
          if (pressDuration < 1000) {
            console.log("Red button quick press - stopping video");
            handleStop();
          } else if (pressDuration >= 1000 && pressDuration < 2000) {
            // Do nothing for presses between 1-2 seconds
            console.log("Red button held between 1-2 seconds - no action");
          }
          // For presses >= 2 seconds, the timeout will handle navigation
        }
      }
      return; // Skip the standard switch for red button
    }
    
    // Only process other instructions if their state is true
    if (!state) return;

    switch (instruction) {
      case 'green':
        handlePlayPause();
        break;
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
    <div className="container-fluid" style={{
        minHeight: "100vh",
        backgroundColor: "#cccfcb"
    }}>
    <div className="container">
      <WebSocketListener onMessage={handleInteraction} />
      <div className="row mb-">
        <div className="col-12">
          <h2 className="text-center m-5">Now Playing: {selectedVideo.title}</h2>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="d-flex justify-content-center gap-2 mb-4">
            <button className='green-interact'
              onClick={handlePlayPause}
            >
                <h5>{isPlaying ? 'Pause' : 'Play'}</h5>
              
            </button>
            {/* Stop button still visible but functionality commented out */}
            <button 
              className='red-interact'
              onClick={handleStop}
            >
                <h5>
                    Stop
                </h5>
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
      <div className="col-1 mt-4">
                    <div className="blue-interact rounded-circle" style={{ width: '50px', height: '50px'}}></div>
                </div>
        <div className="col-11 col-md-8 col-lg-6">
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
            <InputGroup.Text>
                <button 
                className='yellow-interact'
                onClick={handleSubmit}
                disabled={isSaving || !memoryText.trim()}
                >
                    <h5 style={{color: "black"}}>
                    {isSaving ? 'Saving...' : 'Submit'}
                    </h5>
                </button>
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      
      <div className="row justify-content-center mb-4">
        <div className="col-12 d-flex justify-content-center">
          <button 
            className="red-interact"
            onClick={() => router.push('/memory-listening/song-select')}
          >
            <h5>HOLD the red button to go back to song select</h5>
          </button>
        </div>
      </div>

      {/* Video player - moved to be smaller and under the back button */}
      <div className="row justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <div className="youtube-player-container" style={{ width: '690px', height: '400px' }}>
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
          margin: 0 auto;
        }
      `}</style>
    </div>
    </div>
  );
}
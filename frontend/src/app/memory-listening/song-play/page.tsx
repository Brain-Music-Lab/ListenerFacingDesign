'use client'

import { useRouter } from 'next/navigation';
import { useVideo } from '../../../contexts/VideoContext';
import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import YouTubePlayer from '../../../components/YouTubePlayer';
import WebSocketListener from '../../../components/WebSocketListener';

const PlayerState = {
    PLAYING: 1,
    PAUSED: 2,
};

export default function SongPlay() {
    const router = useRouter();
    const { selectedVideo, sessionId } = useVideo();
    const [isPlaying, setIsPlaying] = useState(true);
    const [memoryText, setMemoryText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const playerInstanceRef = useRef<any>(null);
    const textInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!selectedVideo) {
            router.push('/memory-listening/song-select');
        }
    }, [selectedVideo, router]);

    const handlePlayerReady = (player: any) => {
        playerInstanceRef.current = player;
    };

    const handleStateChange = (state: number) => {
        if (state === PlayerState.PLAYING) {
            setIsPlaying(true);
        } else if (state === PlayerState.PAUSED) {
            setIsPlaying(false);
        }
    };

    const handlePlayPause = () => {
        if (!playerInstanceRef.current) return;
        
        if (isPlaying) {
            playerInstanceRef.current.pauseVideo();
        } else {
            playerInstanceRef.current.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        if (!playerInstanceRef.current) return;
        playerInstanceRef.current.stopVideo();
        setIsPlaying(false);
    };

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
            // Optionally show success message or notification here
        } catch (error) {
            console.error('Error saving memory:', error);
            // Optionally show error message to user here
        } finally {
            setIsSaving(false);
        }
    };

    const handleInteraction = (message: string) => {
        switch (message) {
            case 'green':
                handlePlayPause();
                break;
            case 'red':
                handleStop();
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
        <div className="container">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-center mb-4">Now Playing: {selectedVideo.title}</h2>
                    <div className="audio-container mb-4">
                        <YouTubePlayer
                            videoId={selectedVideo.id}
                            onPlayerReady={handlePlayerReady}
                            onStateChange={handleStateChange}
                        />
                        <div className="d-flex justify-content-center gap-2 mb-4">
                            <Button 
                                variant="primary" 
                                onClick={handlePlayPause}
                            >
                                {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={handleStop}
                            >
                                Stop
                            </Button>
                        </div>
                    </div>

                    <div className="memory-input mb-4">
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
            </div>
            
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <Button 
                        className="btn btn-primary"
                        onClick={() => router.push('/memory-listening/song-select')}
                    >
                        Back to Song Select
                    </Button>
                </div>
            </div>
        </div>
    );
}
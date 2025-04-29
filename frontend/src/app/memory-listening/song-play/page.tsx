'use client'

import { useRouter } from 'next/navigation';
import { useVideo } from '../../../contexts/VideoContext';
import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import YouTubePlayer from '../../../components/YouTubePlayer';

const PlayerState = {
    PLAYING: 1,
    PAUSED: 2,
};

export default function SongPlay() {
    const router = useRouter();
    const { selectedVideo } = useVideo();
    const [isPlaying, setIsPlaying] = useState(true);
    const [memoryText, setMemoryText] = useState('');
    const playerInstanceRef = useRef<any>(null);

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

    const handleSubmit = () => {
        // TODO: Add logic to save the memory text
        console.log('Memory submitted:', memoryText);
        setMemoryText(''); // Clear the input after submission
    };

    if (!selectedVideo) {
        return null;
    }

    return (
        <div className="container">
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
                                as="textarea"
                                placeholder="What memory does this song bring up for you?"
                                value={memoryText}
                                onChange={(e) => setMemoryText(e.target.value)}
                                style={{ height: '100px' }}
                            />
                            <Button 
                                variant="primary"
                                onClick={handleSubmit}
                            >
                                Submit
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
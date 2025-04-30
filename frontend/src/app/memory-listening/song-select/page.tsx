'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import YouTubeSearch from '../../../components/YouTubeSearch';
import WebSocketListener from '../../../components/WebSocketListener';

export default function SongSelect() {
    const router = useRouter();
    const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(-1);
    const searchRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        // Focus search input when component mounts
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    const handleInteraction = (message: string) => {
        if (message === 'blue') {
            // Trigger search button click
            const searchButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (searchButton) {
                searchButton.click();
                // After search, select the first video
                setSelectedVideoIndex(0);
            }
        } else if (message === 'red') {
            router.push('/dashboard');
        } else if (message === 'green' && selectedVideoIndex >= 0) {
            // Trigger click on selected video
            const selectedVideo = searchResultsRef.current[selectedVideoIndex];
            if (selectedVideo) {
                selectedVideo.click();
            }
        } else if (message === 'up' && selectedVideoIndex > 0) {
            setSelectedVideoIndex(prev => prev - 1);
        } else if (message === 'down' && selectedVideoIndex < searchResultsRef.current.length - 1) {
            setSelectedVideoIndex(prev => prev + 1);
        }
    };

    return (
        <div className="container">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-center mb-4">Select a Song</h2>
                    <YouTubeSearch 
                        searchRef={searchRef}
                        videoRefs={searchResultsRef}
                        selectedVideoIndex={selectedVideoIndex}
                    />
                </div>
            </div>
            
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <Button 
                        className="btn btn-primary"
                        onClick={() => router.push('/dashboard')}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}
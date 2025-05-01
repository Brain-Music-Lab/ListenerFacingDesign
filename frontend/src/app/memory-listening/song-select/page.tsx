'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import YouTubeSearch from '../../../components/YouTubeSearch';
import WebSocketListener from '../../../components/WebSocketListener';

export default function SongSelect() {
    const router = useRouter();
    const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(-1);
    const [searchCompleted, setSearchCompleted] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searchResultsRef = useRef<HTMLDivElement[]>([]);
    const indicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Focus search input when component mounts
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    // Effect to set the first video as selected when search completes
    useEffect(() => {
        if (searchCompleted && searchResultsRef.current.length > 0) {
            setSelectedVideoIndex(0);
            setSearchCompleted(false); // Reset for future searches
        }
    }, [searchCompleted]);

    // Effect to position the green indicator
    useEffect(() => {
        if (selectedVideoIndex >= 0 && indicatorRef.current && searchResultsRef.current[selectedVideoIndex]) {
            const videoElement = searchResultsRef.current[selectedVideoIndex];
            const videoRect = videoElement.getBoundingClientRect();
            
            // Get the position relative to the viewport
            const topPosition = videoRect.top + window.scrollY + videoRect.height / 2 - 25;
            
            // Update the indicator position
            indicatorRef.current.style.position = 'absolute';
            indicatorRef.current.style.top = `${topPosition}px`;
        }
    }, [selectedVideoIndex]);

    const handleSearchComplete = () => {
        setSearchCompleted(true);
    };

    const handleInteraction = (message: {[key: string]: boolean}) => {
        const [[instruction, state]] = Object.entries(message);

        if (!state) return;

        console.log(instruction);

        if (instruction === 'yellow') {
            // Trigger search button click
            const searchButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (searchButton) {
                searchButton.click();
            }
        } else if (instruction === 'red') {
            router.push('/dashboard');
        } else if (instruction === 'green' && selectedVideoIndex >= 0) {
            // Trigger click on selected video
            const selectedVideo = searchResultsRef.current[selectedVideoIndex];
            if (selectedVideo) {
                console.log("Trying to click video element:", selectedVideoIndex);
                // Try multiple approaches to ensure the click event fires
                try {
                    // Method 1: Direct click
                    selectedVideo.click();
                    
                    // Method 2: Create and dispatch a MouseEvent
                    setTimeout(() => {
                        if (selectedVideo) {
                            const clickEvent = new MouseEvent('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true
                            });
                            selectedVideo.dispatchEvent(clickEvent);
                        }
                    }, 0);
                    
                    // Method 3: Find and click the card element
                    const card = selectedVideo.querySelector('.card') || selectedVideo.firstElementChild;
                    if (card) {
                        (card as HTMLElement).click();
                    }
                } catch (e) {
                    console.error("Error clicking element:", e);
                }
            }
        } else if (instruction === 'up' && selectedVideoIndex > 0) {
            setSelectedVideoIndex(prev => prev - 1);
        } else if (instruction === 'down' && selectedVideoIndex < searchResultsRef.current.length - 1) {
            setSelectedVideoIndex(prev => prev + 1);
        }
    };

    return (
        <div className="container position-relative">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="text-center mb-4">Select a Song</h2>
                </div>
                <div className="col-1 mt-4">
                    <div className="blue-interact rounded-circle" style={{ width: '50px', height: '50px'}}></div>
                </div>
                <div className="col-11">
                    <YouTubeSearch 
                        searchRef={searchRef}
                        videoRefs={searchResultsRef}
                        selectedVideoIndex={selectedVideoIndex}
                        onSearchComplete={handleSearchComplete}
                    />
                </div>
            </div>
            
            {/* Green circle indicator that aligns with the selected video */}
            {selectedVideoIndex >= 0 && (
                <div 
                    ref={indicatorRef}
                    className="green-interact rounded-circle" 
                    style={{ 
                        width: '50px', 
                        height: '50px',
                        position: 'absolute',
                        left: '15px',
                        transition: 'top 0.2s ease-in-out'
                    }}
                ></div>
            )}
            
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <button 
                        className="red-interact w-25"
                        onClick={() => router.push('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
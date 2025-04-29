'use client'

import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
    videoId: string;
    onPlayerReady?: (player: any) => void;
    onStateChange?: (state: number) => void;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        YT?: {
            Player: new (
                elementId: string,
                config: {
                    videoId: string;
                    playerVars?: Record<string, any>;
                    events?: Record<string, (event: any) => void>;
                }
            ) => any;
        };
    }
}

let apiLoaded = false;

export default function YouTubePlayer({
    videoId,
    onPlayerReady,
    onStateChange,
}: YouTubePlayerProps) {
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const playerInstanceRef = useRef<any>(null);
    const currentVideoIdRef = useRef<string>(videoId);
    const elementId = 'youtube-player';

    // Function to initialize the player
    const initPlayer = () => {
        if (!window.YT || !playerContainerRef.current) return;

        playerInstanceRef.current = new window.YT.Player(elementId, {
            videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                origin: window.location.origin,
                widget_referrer: window.location.origin,
                nocookie: 1,
                rel: 0,
                modestbranding: 1,
                fs: 0,
            },
            events: {
                onReady: (event) => {
                    currentVideoIdRef.current = videoId;
                    onPlayerReady?.(event.target);
                },
                onStateChange: (event) => onStateChange?.(event.data)
            }
        });
    };

    useEffect(() => {
        // Load the API if it hasn't been loaded yet
        if (!apiLoaded) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            apiLoaded = true;

            // Set up the global callback
            window.onYouTubeIframeAPIReady = () => {
                initPlayer();
            };
        } else if (window.YT) {
            // If API is already loaded, initialize player directly
            initPlayer();
        }

        return () => {
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
            }
        };
    }, []); // Only run once on mount

    // Handle video changes without recreating the player
    useEffect(() => {
        if (playerInstanceRef.current && currentVideoIdRef.current !== videoId) {
            playerInstanceRef.current.loadVideoById(videoId);
            currentVideoIdRef.current = videoId;
        }
    }, [videoId]);

    return (
        <div ref={playerContainerRef}>
            <div id={elementId} style={{ width: '1px', height: '1px', opacity: 0 }} />
        </div>
    );
}
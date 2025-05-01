'use client'

import { useEffect, useRef, useCallback } from 'react';
import type { YT } from '../types/youtube';

interface YouTubePlayerProps {
    videoId: string;
    onPlayerReady?: (player: YT.Player) => void;
    onStateChange?: (state: number) => void;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        YT?: {
            Player: new (
                elementId: string,
                config: YT.PlayerConfig
            ) => YT.Player;
        };
    }
}

let apiLoaded = false;

export default function YouTubePlayer({
    videoId,
    onPlayerReady,
    onStateChange,
}: YouTubePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YT.Player | null>(null);
    const elementId = 'youtube-player';
    const isPlayerReady = useRef<boolean>(false);

    const createPlayer = useCallback(() => {
        if (!window.YT || !containerRef.current) return;

        const origin = window.location.origin;
        const hostname = window.location.hostname;

        playerRef.current = new window.YT.Player(elementId, {
            videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                origin: origin,
                host: hostname === 'localhost' ? 'https://www.youtube.com' : undefined,
                playsinline: 1,
                modestbranding: 1,
                fs: 0,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                cc_load_policy: 0
            },
            events: {
                onReady: (event: YT.PlayerEvent) => {
                    isPlayerReady.current = true;
                    event.target.setVolume(100);
                    onPlayerReady?.(event.target);
                },
                onStateChange: (event: YT.PlayerEvent) => {
                    if (onStateChange) {
                        onStateChange(event.data);
                    }
                },
                onError: (event: YT.PlayerEvent) => {
                    console.error('YouTube Player Error:', event.data);
                }
            }
        });
    }, [videoId, onPlayerReady, onStateChange]);

    // Load YouTube API and initialize player
    useEffect(() => {
        if (!apiLoaded) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            tag.async = true;
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode?.insertBefore(tag, firstScript);
            apiLoaded = true;

            window.onYouTubeIframeAPIReady = createPlayer;
        } else if (window.YT) {
            createPlayer();
        }

        return () => {
            if (playerRef.current) {
                try {
                    isPlayerReady.current = false;
                    playerRef.current.destroy();
                } catch (e) {
                    console.error('Error destroying YouTube player:', e);
                }
            }
        };
    }, [createPlayer]);

    // Handle video ID changes
    useEffect(() => {
        const loadVideo = () => {
            if (!playerRef.current || !isPlayerReady.current) return;
            
            try {
                playerRef.current.loadVideoById({
                    videoId,
                    startSeconds: 0,
                });
            } catch (e) {
                console.error('Error loading video:', e);
                if (e instanceof Error && e.toString().includes('150')) {
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                }
            }
        };

        loadVideo();
    }, [videoId]);

    return (
        <div ref={containerRef} className="w-100 h-100">
            <div id={elementId} className="w-100 h-100" />
        </div>
    );
}
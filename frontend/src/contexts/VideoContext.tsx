'use client'

import React, { createContext, useContext, useState } from 'react';
import { YouTubeSearchResult } from '../lib/youtube';

interface VideoContextType {
    selectedVideo: YouTubeSearchResult | null;
    setSelectedVideo: (video: YouTubeSearchResult | null) => void;
    sessionId: string;
    resetSession: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
    const [selectedVideo, setSelectedVideo] = useState<YouTubeSearchResult | null>(null);
    const [sessionId, setSessionId] = useState<string>(Date.now().toString());

    const resetSession = () => {
        setSessionId(Date.now().toString());
        setSelectedVideo(null);
    };

    return (
        <VideoContext.Provider value={{ 
            selectedVideo, 
            setSelectedVideo, 
            sessionId,
            resetSession 
        }}>
            {children}
        </VideoContext.Provider>
    );
}

export function useVideo() {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
}
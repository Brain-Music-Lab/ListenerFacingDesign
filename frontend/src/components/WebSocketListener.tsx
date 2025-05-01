'use client'

import { useEffect, useRef } from 'react';

interface WebSocketListenerProps {
    onMessage: (message: string) => void;
}

export default function WebSocketListener({ onMessage }: WebSocketListenerProps) {
    const ws = useRef<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);

    // Keep the callback ref updated
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        // Only create a new WebSocket if we don't already have one
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            console.log("Creating new WebSocket connection...");
            ws.current = new WebSocket("ws://localhost:8765");
            
            ws.current.onopen = () => console.log("Web socket opened");
            ws.current.onmessage = (event) => {
                console.log(event)
                if (onMessageRef.current) {
                    onMessageRef.current(event.data);
                }
            };
            ws.current.onclose = () => console.log("Web socket closed");
            ws.current.onerror = (error) => console.error("WebSocket error:", error);
        }

        return () => {
            // Only close if we're actually connected
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        }
    }, []); // Empty dependency array since we use refs

    return null;
}
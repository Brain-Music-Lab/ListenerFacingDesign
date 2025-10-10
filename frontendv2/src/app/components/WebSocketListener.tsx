'use client'

import { useEffect, useRef } from 'react';

interface WebSocketListenerProps {
    onMessage: (message: { [key: string]: boolean }) => void;
}

export default function WebSocketListener({ onMessage }: WebSocketListenerProps) {
    const ws = useRef<WebSocket | null>(null);
    const onMessageRef = useRef(onMessage);

    // Keep the callback ref updated
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8765");
        
        ws.current.onopen = () => console.log("Web socket opened");
        ws.current.onmessage = (event) => {
            if (onMessageRef.current) {
                try {
                    const parsedData = JSON.parse(event.data);
                    onMessageRef.current(parsedData);
                } catch (e) {
                    console.error("Failed to parse WebSocket message:", e);
                }
            }
        };
        ws.current.onclose = () => console.log("Web socket closed");

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        }
    }, []); // Empty dependency array since we use refs

    return null;
}
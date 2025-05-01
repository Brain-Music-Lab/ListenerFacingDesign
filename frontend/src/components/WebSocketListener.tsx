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
        if (ws.current?.readyState === WebSocket.OPEN) {
            return; // Connection already exists and is open
        }

        console.log("Creating new WebSocket connection...");
        ws.current = new WebSocket("ws://localhost:8765");
        
        ws.current.onopen = () => {
            console.log("Web socket opened");
            // Send a test message to confirm two-way communication
            ws.current?.send(JSON.stringify({ type: "ping" }));
        };

        ws.current.onmessage = (event) => {
            console.log("Received:", event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.status === "connected") {
                    console.log("Connection confirmed by server");
                }
                if (onMessageRef.current) {
                    onMessageRef.current(event.data);
                }
            } catch (e) {
                console.log("Raw message:", event.data);
                if (onMessageRef.current) {
                    onMessageRef.current(event.data);
                }
            }
        };

        ws.current.onclose = () => console.log("Web socket closed");
        ws.current.onerror = (error) => console.error("WebSocket error:", error);

        const wsCurrent = ws.current;
        return () => {
            if (wsCurrent && wsCurrent.readyState === WebSocket.OPEN) {
                wsCurrent.close();
            }
        }
    }, []); // Empty dependency array since we use refs

    return null;
}
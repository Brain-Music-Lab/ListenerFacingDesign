'use client'

import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useRef, useCallback } from 'react';
import WebSocketListener from '../../components/WebSocketListener';

export default function MemoryListening() {
    const router = useRouter();
    const [selectedButton, setSelectedButton] = useState<number>(1); // 0 for back, 1 for song select
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([null, null]);

    const setButtonRef = useCallback((index: number) => (el: HTMLButtonElement | null) => {
        buttonRefs.current[index] = el;
    }, []);

    const handleInteraction = (message: {[key: string]: boolean}) => {
        const [[instruction, state]] = Object.entries(message);

        if (!state) return;

        if (instruction === 'left' && selectedButton === 1) {
            setSelectedButton(0);
        } else if (instruction === 'right' && selectedButton === 0) {
            setSelectedButton(1);
        }
        else if (instruction === 'green') {
            buttonRefs.current[selectedButton]?.click();
        }
    };

    useEffect(() => {
        const currentButton = buttonRefs.current[selectedButton];
        if (currentButton) {
            currentButton.focus();
        }
    }, [selectedButton]);

    const buttonStyle = (index: number) => ({
        outlineOffset: '3px',
        transition: 'all 0.2s ease-in-out',
        outline: selectedButton === index ? '3px solid #007bff' : 'none',
        transform: selectedButton === index ? 'scale(1.05)' : 'scale(1)',
        margin: '0 10px'
    });

    return (
        <div className="container">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Button 
                    ref={setButtonRef(0)}
                    className="btn btn-secondary" 
                    onClick={() => router.push('/dashboard')}
                    style={buttonStyle(0)}
                >
                    Back to Dashboard
                </Button>
                <Button 
                    ref={setButtonRef(1)}
                    className="btn btn-primary" 
                    onClick={() => router.push('/memory-listening/song-select')}
                    style={buttonStyle(1)}
                >
                    Go to Song Select
                </Button>
            </div>
        </div>
    );
}
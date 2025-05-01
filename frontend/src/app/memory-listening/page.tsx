'use client'

import { useRouter } from 'next/navigation';
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

        else if (instruction === 'green') {
            buttonRefs.current[1]?.click();
        }
        else if (instruction === 'red') {
            buttonRefs.current[0]?.click();
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
        // transition: 'all 0.2s ease-in-out',
        // outline: selectedButton === index ? '3px solid #007bff' : 'none',
        // transform: selectedButton === index ? 'scale(1.05)' : 'scale(1)',
        margin: '0 10px'
    });

    return (
        <div className="container">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className='col-3'></div>
                <div className="col-3">
                    <button 
                        ref={setButtonRef(0)}
                        className="red-interact" 
                        onClick={() => router.push('/dashboard')}
                        style={buttonStyle(0)}
                    >
                        Back to Dashboard
                    </button>
                </div>
                <div className="col-3">
                    <button 
                        ref={setButtonRef(1)}
                        className="green-interact" 
                        onClick={() => router.push('/memory-listening/song-select')}
                        style={buttonStyle(1)}
                    >
                        Go to Song Select
                    </button>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    );
}
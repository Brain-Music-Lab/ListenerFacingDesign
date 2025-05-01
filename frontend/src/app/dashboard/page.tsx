'use client'

import { useRouter } from "next/navigation"
import { useState, useCallback, useRef, useEffect } from 'react';
import WebSocketListener from '../../components/WebSocketListener';
import { useVideo } from '../../contexts/VideoContext';

// Grid positions for navigation
const GRID = [
    [0, 1, 2]  // top row
];

export default function Dashboard() {
    const router = useRouter();
    const { resetSession } = useVideo();
    const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]); // [row, col]
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>(Array(6).fill(null));

    // Reset session when dashboard mounts
    useEffect(() => {
        console.log("New session")
        resetSession();
    }, [resetSession]);

    const setButtonRef = useCallback((index: number) => (el: HTMLButtonElement | null) => {
        buttonRefs.current[index] = el;
    }, []);

    // Find current index in flat array from grid position
    const getCurrentIndex = useCallback(() => {
        return GRID[currentPosition[0]][currentPosition[1]];
    }, [currentPosition]);

    // Update focus when position changes
    useEffect(() => {
        const index = GRID[currentPosition[0]][currentPosition[1]];
        const currentButton = buttonRefs.current[index];
        if (currentButton) {
            currentButton.focus();
        }
    }, [currentPosition]); // Removed getCurrentIndex from dependencies

    const handleInteraction = useCallback((message: { [key: string]: boolean }) => {
        const [[instruction, state]] = Object.entries(message);
        
        // Only process the instruction if its state is true
        if (!state) return;
        
        console.log("Received instruction:", instruction, "with state:", state);
        setCurrentPosition(([row, col]) => {
            const newRow = row;
            let newCol = col;

            switch (instruction) {
                case 'left':
                    if (col > 0) newCol = col - 1;
                    break;
                case 'right':
                    if (col < GRID[row].length - 1) newCol = col + 1;
                    break;
                case 'green':
                    // Handle button click
                    const currentButton = buttonRefs.current[GRID[row][col]];
                    currentButton?.click();
                    break;
            }

            return [newRow, newCol];
        });
    }, []);

    const buttonStyle = useCallback((index: number) => ({
        width: '200px',
        height: '100px',
        outlineOffset: '3px',
        transition: 'all 0.2s ease-in-out',
        outline: getCurrentIndex() === index ? '3px solid #007bff' : 'none',
        transform: getCurrentIndex() === index ? 'scale(1.05)' : 'scale(1)'
    }), [getCurrentIndex]);

    return (
        <div className="container-fluid" style={{
            minHeight: "100vh",
            backgroundColor: "#cccfcb"
        }}>
        <div className="container">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="row">
                <div className="col-12">
                    <h1 className="m-4 text-center">Brain Music Lab Dashboard</h1>
                    <h3 className="text-center m-5">
                        Navigate between selections with the joystick, and press the green button to select one!
                    </h3>
                </div>
            </div>
            <div className="row row-cols-2 row-cols-md-3 g-4 justify-content-center">
                <div className="col d-flex justify-content-center">
                    <button 
                        ref={setButtonRef(0)}
                        className="green-interact"
                        onClick={() => router.push('/memory-listening/')}
                        style={buttonStyle(0)}
                    >
                        <h5>Memorable Music</h5>
                    </button>
                </div>
                <div className="col d-flex justify-content-center">
                    <button 
                        ref={setButtonRef(1)}
                        className="green-interact"
                        onClick={() => {router.push("/data-station")}}
                        style={buttonStyle(1)}
                    >
                        <h5>About this Device</h5>
                        
                    </button>
                </div>
                {/* <div className="col d-flex justify-content-center">
                    <button 
                        ref={setButtonRef(2)}
                        className="green-interact"
                        onClick={() => {}}
                        style={buttonStyle(2)}
                    >
                        <h5>About the Lab</h5>
                        
                    </button>
                </div> */}
            </div>
        </div>
        </div>
    )
}

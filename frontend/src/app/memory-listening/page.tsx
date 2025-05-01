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

        if (instruction === 'left' && selectedButton > 0) {
            setSelectedButton(0); // Select the back button
        }
        else if (instruction === 'right' && selectedButton < 1) {
            setSelectedButton(1); // Select the song select button
        }
        else if (instruction === 'green') {
            buttonRefs.current[selectedButton]?.click(); // Click the currently selected button
        }
        else if (instruction === 'red') {
            // Directly go back to dashboard regardless of selection
            buttonRefs.current[0]?.click();
        }
    };

    useEffect(() => {
        const currentButton = buttonRefs.current[selectedButton];
        if (currentButton) {
            currentButton.focus();
        }
    }, [selectedButton]);

    return (
        <div className="container-fluid" style={{
            minHeight: "100vh",
            backgroundColor: "#cccfcb"
        }}>
        <div className="container">
            <WebSocketListener onMessage={handleInteraction} />
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12">
                    <h1 className='text-center'>Memorable Music</h1>
                    <p style={{fontSize: "20px"}}>
                        This is a sample project that demonstrates a portion of the use cases of this device. Music is well-known for being able to elicit nostalgia in listeners, and this is tied to the memories that we have relating to our favorite (or not favorite) songs. This sample project simply asks you to search for any song that brings back a memory, and then we ask you to share that memory.
                    </p>

                    <p style={{fontSize: "20px"}}>
                        Specifically, this relates to Brain Music Lab Member Daniel&apos;s research where he is interested in studying musically induced emotion via large scale data mining techniques. Prior research in the field largely utilizes traditional statical methods to analyze data. However, the ways in which music induces emotion in us is 
                    </p>
                </div>
                <div className='col-3'></div>
                <div className="col-3">
                    <button 
                        ref={setButtonRef(0)}
                        className="red-interact" 
                        onClick={() => router.push('/dashboard')}
                    >
                        <h5>Back to Dashboard</h5>
                    </button>
                </div>
                <div className="col-3">
                    <button 
                        ref={setButtonRef(1)}
                        className="green-interact" 
                        onClick={() => router.push('/memory-listening/song-select')}
                    >
                        <h5>Go to Song Select</h5>
                    </button>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
        </div>
    );
}
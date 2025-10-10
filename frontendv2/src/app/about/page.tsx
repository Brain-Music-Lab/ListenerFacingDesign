'use client'

import { useRouter } from "next/navigation";
import { useRef } from "react";
import WebSocketListener from "../components/WebSocketListener";

export default function Home() {
  const router = useRouter();
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const handleInteraction = (message: {[key: string]: boolean}) => {
    const [[instruction, state]] = Object.entries(message);

    if (!state) return;

    if (instruction === "red") {
      backButtonRef.current?.click();
    }
  }   

  return (
    <div className="container-fluid" style={{
            backgroundColor: "#CCCFCB",
            minHeight: "100vh"
        }}> 
            <WebSocketListener onMessage={handleInteraction} />
            <div className="container pt-5">
                <h1 className="text-center">The Data Station</h1>
                <h2>Background</h2>
                <p>
                    Research in the Brain Music Lab typically involves collecting data from human participants. Individuals who come into the lab typically complete computer-based tasks that involve listening to music, answering some questions, and sometimes &quot;game-like&quot; activities. Frequently we also record brain or body signals from them as well (ex. brain waves, pulse, respiration, etc). 
                </p>
                <p>
                    Unfortunately, these types of studies take <b>a lot of time</b> to run, and open hours are limited by the researchers&apos; schedules. If we could make this data collection self-guided for the participants, we would be able to collect a lot more data.
                </p>

                <h2>Aims</h2>
                <p>
                    Our goal was to develop a physical data collection system that could be deployed semi-permanently in a public space. Individuals may interact with the system independently and on their own time to participate in research. To attract interest and increase familiarity with the interface, we were inspired by a classic arcade game design. For more information on the design and fabrication process, please see our poster on this topic and chat with the project&apos;s lead designer, CTD undergraduate student Sophia Montie!
                </p>

                <h2>Future Developments</h2>
                <p>
                    There is currently one demo study running on this device&mdash; feel free to try it out! In the coming months, we will expand this system to host more of our lab&apos;s research, and install it in it&apos;s semi-permanent home!
                </p>

                <div className="text-center">
                    <button className="red-interact"
                        onClick={() => router.push('/dashboard')}
                        ref={backButtonRef}>
                        <h5>Return to Dashboard (B3)</h5>
                    </button>
                </div>
            </div>
            
        </div>

  );
}

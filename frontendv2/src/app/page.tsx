'use client'

import { useRouter } from "next/navigation";
import { useRef } from "react";
import WebSocketListener from "./components/WebSocketListener";

export default function Home() {
  const router = useRouter();
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  const handleInteraction = (message: {[key: string]: boolean}) => {
    const [[instruction, state]] = Object.entries(message);

    if (!state) return;

    if (instruction === "green") {
      acceptButtonRef.current?.click();
    }
  }    

  return (
    <div className="container-fluid" style={{
            backgroundColor: "#CCCFCB",
            minHeight: "100vh"
        }}> 
      <WebSocketListener onMessage={handleInteraction} />  
      <div className="min-vh-100 d-flex align-items-center">
        <div className="row row-cols-1">
        {/* Header */}
          <div className="col text-center mb-5">
            <h1>Welcome to the Brain Music Lab Data Station</h1>
          </div>

          {/* Paragraphs of text*/}
          <div className="col">
            <p className="mb-4">
              This system was developed to allow members of the brain music lab to pursue a more unsupervised form of data collection for research. There are various applications that have been developed and uploaded onto this device for this purpose.
            </p>
            <p>
              By utilizing this device, you are consenting to the use of your anonymized data for academic research purposes. Your data will not be traceable back to you. 
            </p>
          </div>

          {/* Button to go to the dashboard */}
          <div className="col text-center">
            <button className="green-interact w-25"
              onClick={() => router.push("/dashboard")}
              ref={acceptButtonRef}>
              Accept (B4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

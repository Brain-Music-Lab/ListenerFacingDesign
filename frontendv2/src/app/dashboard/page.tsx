'use client'

import { useRouter } from "next/navigation";
import WebSocketListener from "../components/WebSocketListener";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const aboutThisDeviceButton = useRef<HTMLButtonElement>(null);
  const experimentButton = useRef<HTMLButtonElement>(null);

  const handleInteraction = (message: {[key: string]: boolean}) => {
    const [[instruction, state]] = Object.entries(message);

    if (!state) return;

    if (instruction === "red") {
      aboutThisDeviceButton.current?.click();
    }
    if (instruction === "green") {
      experimentButton.current?.click();
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

          {/* Header and instructions */}
          <div className="col">
            <div className="row row-cols-1">

              <div className="col text-center mb-5">
                <h1>Dashboard</h1>
              </div>

              <div className="col text-center mb-5">
                <h3>Navigate between selections with the joystick, and press the green button (B1) to select one.</h3>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="col">
            <div className="row row-cols-2">

              {/* Button 1 */}
              <div className="col text-center">
                <button className="red-interact w-50"
                  onClick={() => router.push("/about")}
                  ref={aboutThisDeviceButton}>
                  <h5>About this Device (B3)</h5>
                </button>
              </div>

              {/* Button 2 */}
              <div className="col text-center">
                <button className="green-interact w-50"
                  onClick={() => router.push("/music-and-emotion")}
                  ref={experimentButton}>
                    <h5>Music and Emotion (B4)</h5>
                </button>
              </div>

            </div>
          </div>
          {/* End Buttons */}

        </div>
      </div>
    </div>

  );
}

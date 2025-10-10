'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container-fluid" style={{
            backgroundColor: "#CCCFCB",
            minHeight: "100vh"
        }}> 
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
                <button className="green-interact w-50"
                  onClick={() => router.push("/about")}>
                  <h5>About this Device</h5>
                </button>
              </div>

              {/* Button 2 */}
              <div className="col text-center">
                <button className="green-interact w-50"
                  onClick={() => router.push("/music-and-emotion")}>
                    <h5>Music and Emotion</h5>
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

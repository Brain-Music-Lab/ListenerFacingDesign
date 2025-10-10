'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container-fluid" style={{
            backgroundColor: "#CCCFCB",
            minHeight: "100vh"
        }}> 
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="row row-cols-1">

          {/* Header and instructions */}
          <div className="col text-center mb-5">
                <h1>Music and Emotion</h1>
              </div>

              <div className="col text-center mb-5">
                <h3>Music makes you feel things? But how? Why?</h3>
              </div>

          {/* Buttons */}
          <div className="col">
            <div className="row row-cols-2">

              {/* Button 1 */}
              <div className="col text-center">
                <button className="red-interact w-50"
                  onClick={() => router.push("/dashboard")}>
                  <h5>Go Back (B3)</h5>
                </button>
              </div>

              {/* Button 2 */}
              <div className="col text-center">
                <button className="green-interact w-50"
                  onClick={() => router.push("/music-and-emotion/song-search")}>
                    <h5>Continue (B4)</h5>
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

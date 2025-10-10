'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import YTMusic from "ytmusic-api";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchQuery = useRef<string>('');
  const ytMusic = new YTMusic();

  async function searchYTMusic(searchQuery: string) {
    setLoading(true);

    try {
      const response = await axios.get('/api/scrape', {
        params: {
          q: searchQuery
        }
      });

      console.log(response.data.songId);
      
      if (response.data.success && response.data.songId) {

        // Navigate to the song-play page with the songId as a parameter
        router.push(`/music-and-emotion/song-play?songId=${response.data.songId}`);
      } else {
        console.log("No song found");
      }
    } catch (err) {
      console.log("sadness");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid" style={{
            backgroundColor: "#CCCFCB",
            minHeight: "100vh"
        }}> 
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="row row-cols-1">

          {/* Header and instructions */}
          <div className="col text-center mb-5">
            <h1>Song Search</h1>
          </div>

          <div className="col text-center mb-5">
            <h3>Music makes you feel things. But how? Why?</h3>
          </div>

          <div className="col text-center mb-5">
            <input
              type="text"
              className="form-control w-50 mx-auto"
              placeholder="Search for a song and artist that make you feel something."
              onChange={((e) => (searchQuery.current = e.target.value))}
            />
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
                  onClick={() => searchYTMusic(searchQuery.current)}>
                    <h5>{loading ? "Loading..." : "Continue (B4)"}</h5>
                </button>
                </div>
            </div>

            </div>
          </div>
          {/* End Buttons */}

        </div>
      </div>

  );
}

'use client'

import WebSocketListener from "@/app/components/WebSocketListener";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";

interface MusicEmotionData {
  emotion: {
    [key: string]: boolean
  },
  reason: {
    [key: string]: boolean
  },
  free_text: string
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLIFrameElement>(null);
  const checkBoxRef1 = useRef<(HTMLInputElement | null)[]>([null]);
  const checkBoxRef2 = useRef<(HTMLInputElement | null)[]>([null]);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([null]);
  const textBoxRef = useRef<HTMLTextAreaElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCheckboxQ1, setSelectedCheckboxQ1] = useState<number>(0);
  const [selectedCheckboxQ2, setSelectedCheckboxQ2] = useState<number>(0);

  const [questionNumber, setQuestionNumber] = useState(1);

  const setCheckBoxesQ1 = useCallback((index: number) => (el: (HTMLInputElement | null)) => {
    checkBoxRef1.current[index] = el;
  }, []);

  const setCheckBoxesQ2 = useCallback((index: number) => (el: (HTMLInputElement | null)) => {
    checkBoxRef2.current[index] = el;
  }, []);

  const setButtons = useCallback((index: number) => (el: HTMLButtonElement | null) => {
    buttonsRef.current[index] = el;
  }, []);

  const setTextArea = useCallback(() => (el: (HTMLTextAreaElement)) => {
    textBoxRef.current = el;
  }, []);

  const [doubleCalled, setDoubleCalled] = useState(false);

  const handleInteraction = (message: {[key: string]: boolean}) => {
        const [[instruction, state]] = Object.entries(message);

        if (!state) return;

        switch(questionNumber) {
          case 1:
            if (instruction === 'left' && selectedCheckboxQ1 != 0 && selectedCheckboxQ1 != 6) {
              setSelectedCheckboxQ1(selectedCheckboxQ1 - 1);
            }
            else if (instruction === 'right' && selectedCheckboxQ1 != 5 && selectedCheckboxQ1 != 11) {
              setSelectedCheckboxQ1(selectedCheckboxQ1 + 1);
            }
            else if (instruction === 'down' && selectedCheckboxQ1 <= 5) {
              setSelectedCheckboxQ1(selectedCheckboxQ1 + 6);
            }
            else if (instruction === 'up' && selectedCheckboxQ1 >= 6) {
              setSelectedCheckboxQ1(selectedCheckboxQ1 - 6);
            }

            if (instruction === 'red') {
              buttonsRef.current[0]?.click();
            }
            if (instruction === 'green') {
              buttonsRef.current[1]?.click();
            }
            if (instruction === 'yellow') {
              if (!doubleCalled) {
                setDoubleCalled(true);
              } else {
                buttonsRef.current[2]?.click();
              }
            }
            if (instruction === 'blue') {
              checkBoxRef1.current[selectedCheckboxQ1]?.click();
            }
           
          
          case 2:
            if (instruction === 'left' && ![0, 4, 8, 12].includes(selectedCheckboxQ2)) {
              setSelectedCheckboxQ2(selectedCheckboxQ2 - 1);
            } else if (instruction === 'right' && ![3, 7, 11, 15].includes(selectedCheckboxQ2)) {
              setSelectedCheckboxQ2(selectedCheckboxQ2 + 1);
            } else if (instruction === 'up' && selectedCheckboxQ2 >= 4) {
              setSelectedCheckboxQ2(selectedCheckboxQ2 - 4);
            } else if (instruction === 'down' && selectedCheckboxQ2 <= 11) {
              setSelectedCheckboxQ2(selectedCheckboxQ2 + 4);
            }

            if (instruction === 'red') {
              buttonsRef.current[3]?.click()
            }
            if (instruction === 'green') {
              buttonsRef.current[4]?.click()
            }
            if (instruction === 'yellow') {
              console.log("print");
              buttonsRef.current[5]?.click()
            }
            
            if (instruction === 'blue') {
              checkBoxRef2.current[selectedCheckboxQ2]?.click();
            }

            break;

          case 3:
            if (instruction === 'red') {
              buttonsRef.current[6]?.click()
            }
            if (instruction === 'green') {
              buttonsRef.current[7]?.click()
            }
            if (instruction === 'yellow') {
              buttonsRef.current[8]?.click()
            }
            if (instruction === 'blue') {
              textBoxRef.current?.focus();
            }
            break;

          case 4:
            if (instruction === 'red') {
              buttonsRef.current[10]?.click()
            }
            if (instruction === 'green') {
              buttonsRef.current[11]?.click()
            }
            if (instruction === 'blue') {
              buttonsRef.current[9]?.click()
            }
            break;

          default:
            break;
        }
    };

    const saveResponse = () => {

      const data: MusicEmotionData = {
        emotion: {},
        reason: {},
        free_text: ''
      };

      checkBoxRef1.current.forEach((checkbox) => {
        if (checkbox) {
          const label = checkbox.nextElementSibling?.textContent?.trim() as string;
          if (label) {
            data.emotion[label] = checkbox.checked;
            checkbox.checked = false;
          }
        }
      });

      checkBoxRef2.current.forEach((checkbox) => {
        if (checkbox) {
          const label = checkbox.nextElementSibling?.textContent?.trim() as string;
          if (label) {
            data.reason[label] = checkbox.checked;
            checkbox.checked = false;
          }
        }
      });

      data.free_text = textBoxRef.current!.value;
      textBoxRef.current!.value = "";
      
      fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(error => console.error('Error saving data:', error));
    };
  
  // Get the songId from URL parameters
  const songId = searchParams.get('songId'); // Default if no songId provided
  
  function togglePlayback() {
    if (videoRef.current && videoRef.current.contentWindow) {
      if (isPlaying) {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div className="container-fluid" style={{
            backgroundColor: "#CCCFCB",
            minHeight: "100vh"
        }}> 
      <WebSocketListener onMessage={handleInteraction} />
      <div className="container-lg">
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        
        <div className="row">
          <div className="col-12 text-center">
          <iframe 
          ref={videoRef}
          width="300" 
          height="200"
          src={`https://www.youtube.com/embed/${songId}?enablejsapi=1`}
          title="YouTube video player">
        </iframe>
        </div>
        <div className="col-12">
        {/* All of Part 1 */}
        <div className="row"
          style={{
            visibility: questionNumber == 1 ? "visible" : "hidden",
            display: questionNumber == 1 ? "flex" : "none"
          }}>
          <div className="col-12 text-center">
            <h1>Part 1</h1>
          </div>
          <div className="col-12 text-center">
            <h1>Press the Green Buton </h1>
          </div>
          <div className="col-12 text-center">
            <div>
              <h2>Use the joystick to change your selection and the Blue <div className="dot blue-dot">B1</div> button to check and uncheck boxes. Check each box that describes an emotion you feel while listening.</h2>
            </div>
          </div>
          
            <div className="col-6">
            <div className="mt-3 text-center">
            <button
              onClick={() => router.push("/music-and-emotion/song-search")}
              className="red-interact w-50"
              ref={setButtons(0)}
              >
              <h5>Return to Song Search (B3)</h5>
            </button>
            </div>
            </div>
            <div className="col-6">
            <div className="mt-3 text-center">
              <button 
            onClick={togglePlayback}
            className="green-interact w-50"
            ref={setButtons(1)}
            >
              <h5>{isPlaying ? 'Pause' : 'Play'} (B4)</h5>
              </button>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 0 ? 'checkbox-selected' : ''}`}>
              <input
              ref={setCheckBoxesQ1(0)}
              type="checkbox"
              className="form-check-input" 
              style={{width: '20px', height: '20px'}}
              />
              <label className="form-check-label ps-2">
              <h5>Tension</h5>
              </label>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 1 ? 'checkbox-selected' : ''}`}>
              <input
              ref={setCheckBoxesQ1(1)}
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              />
              <label className="form-check-label ps-2">
              <h5>Transcendence</h5>
              </label>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 2 ? 'checkbox-selected' : ''}`}>
              <input
              ref={setCheckBoxesQ1(2)}
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              />
              <label className="form-check-label ps-2">
              <h5>Peace</h5>
              </label>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 3 ? 'checkbox-selected' : ''}`}>
              <input
              ref={setCheckBoxesQ1(3)}
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              />
              <label className="form-check-label ps-2">
              <h5>Joy</h5>
              </label>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 4 ? 'checkbox-selected' : ''}`}>
              <input
              ref={setCheckBoxesQ1(4)}
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              />
              <label className="form-check-label ps-2">
              <h5>Sadness</h5>
              </label>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 5 ? 'checkbox-selected' : ''}`}>
              <input
              ref={setCheckBoxesQ1(5)}
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              />
              <label className="form-check-label ps-2">
                <h5>Power</h5>
              </label>
            </div>
            </div>

            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 6 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ1(6)}
              />
              <label className="form-check-label ps-2">
              <h5>Bitterness</h5>
              </label>
            </div>
            </div>
            
            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 7 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ1(7)}
              />
              <label className="form-check-label ps-2">
              <h5>Anger</h5>
              </label>
            </div>
            </div>
            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 8 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ1(8)}
              />
              <label className="form-check-label ps-2">
              <h5>Surprise</h5>
              </label>
            </div>
            </div>
            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 9 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ1(9)}
              />
              <label className="form-check-label ps-2">
              <h5>Tenderness</h5>
              </label>
            </div>
            </div>
            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 10 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ1(10)}
              />
              <label className="form-check-label ps-2">
              <h5>Fear</h5>
              </label>
            </div>
            </div>
            <div className="col-2">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ1 == 11 ? 'checkbox-selected' : ''}`}>
                <input
                type="checkbox"
                className="form-check-input"
                style={{ width: '20px', height: '20px' }}
                ref={setCheckBoxesQ1(11)}
                />
                <label className="form-check-label ps-2">
                <h5>Nostalgia</h5>
                </label>
              </div>
          </div>
          <div className="col-12 mt-5 text-center">
            <button className="yellow-interact"
              style={{
                color: "black"
              }}
              onClick={() => {
                setQuestionNumber(2);
              }}
              ref={setButtons(2)}
              >
              <h3>Submit (B2)</h3>
            </button>
          </div>
        </div>

        {/* All of part 2 */}
        <div className="row"
          style={{
            visibility: questionNumber == 2 ? "visible" : "hidden",
            display: questionNumber == 2 ? "flex" : "none"
          }}>
          <div className="col-12 text-center">
            <h1>Part 2</h1>
          </div>
          <div className="col-12 text-center">
            <div>
              <h2>Use the joystick to change your selection and the Blue <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "blue",
              borderRadius: "50%",
              margin: "0 5px",
              display: "inline-block",
              color: "white",
              alignContent: "center"
              }}>B1</div> button to (un)check boxes. Now, check each box that represents a reason why the song makes you feel the way it does.</h2>
            </div>
          </div>
          
            <div className="col-6">
            <div className="mt-3 text-center">
            <button
              onClick={() => router.push("/music-and-emotion/song-search")}
              ref={setButtons(3)}
              className="red-interact w-50">
              <h5>Return to Song Search (B3)</h5>
            </button>
            </div>
            </div>
            <div className="col-6">
            <div className="mt-3 text-center">
              <button 
            onClick={togglePlayback}
            ref={setButtons(4)}
            className="green-interact w-50">
              <h5>{isPlaying ? 'Pause' : 'Play'} (B4)</h5>
              </button>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 0 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(0)}
              />
              <label className="form-check-label ps-2">
              <h4>Harmonies</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 1 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(1)}
              />
              <label className="form-check-label ps-2">
              <h4>Melody</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 2 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(2)}
              />
              <label className="form-check-label ps-2">
              <h4>Lyrics</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 3 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(3)}
              />
              <label className="form-check-label ps-2">
              <h4>It's like the song was written about me</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 4 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(4)}
              />
              <label className="form-check-label ps-2">
              <h4>Recall a Memory</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 5 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(5)}
              />
              <label className="form-check-label ps-2">
              <h4>Sharing the song with someone</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 6 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(6)}
              />
              <label className="form-check-label ps-2">
              <h4>Time felt slower</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 7 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(7)}
              />
              <label className="form-check-label ps-2">
              <h4>Transported somewhere else</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 8 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(8)}
              />
              <label className="form-check-label ps-2">
              <h4>Heart Racing</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 9 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(9)}
              />
              <label className="form-check-label ps-2">
              <h4>Want to Close Eyes</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 10 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(10)}
              />
              <label className="form-check-label ps-2">
              <h4>Music is Beautiful</h4>
              </label>
            </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 11 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(11)}
              />
              <label className="form-check-label ps-2">
              <h4>Tempo</h4>
              </label>
              </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 12 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(12)}
              />
              <label className="form-check-label ps-2">
              <h4>Goosebumps or chills</h4>
              </label>
              </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 13 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(13)}
              />
              <label className="form-check-label ps-2">
              <h4>Visualize a mental image</h4>
              </label>
              </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 14 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(14)}
              />
              <label className="form-check-label ps-2">
              <h4>Associations to a thought</h4>
              </label>
              </div>
            </div>
            <div className="col-3">
            <div className={`form-check mt-3 d-flex justify-content-center ${selectedCheckboxQ2 == 15 ? 'checkbox-selected' : ''}`}>
              <input
              type="checkbox"
              className="form-check-input"
              style={{ width: '20px', height: '20px' }}
              ref={setCheckBoxesQ2(15)}
              />
              <label className="form-check-label ps-2">
              <h4>Keep beat with fingers or feet</h4>
              </label>
              </div>
            </div>
          <div className="col-12 mt-5 text-center">
            <button className="yellow-interact"
              style={{
                color: "black"
              }}
              onClick={() => setQuestionNumber(3)}
              ref={setButtons(5)}
              >
              <h3>Submit (B2)</h3>
            </button>
          </div>
        </div>

        {/* Part 3 */}
        <div className="row"
          style={{
            visibility: questionNumber == 3 ? "visible" : "hidden",
            display: questionNumber == 3 ? "flex" : "none"
          }}>
          <div className="col-12 text-center">
            <h1>Part 3</h1>
          </div>
          <div className="col-12 text-center">
            <div>
              <h2>Press the Blue <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "blue",
              borderRadius: "50%",
              margin: "0 5px",
              display: "inline-block",
              color: "white",
              alignContent: "center"
              }}>B1</div> button to activate the text box. Share anything else you'd like to about how and why the song makes you feel the way it does.</h2>
            </div>
          </div>
          
          <div className="col-6">
            <div className="mt-3 text-center">
            <button
              onClick={() => router.push("/music-and-emotion/song-search")}
              className="red-interact w-50"
              ref={setButtons(6)}

              >
              <h5>Return to Song Search (B3)</h5>
            </button>
            </div>
          </div>
          <div className="col-6">
            <div className="mt-3 text-center">
              <button 
            onClick={togglePlayback}
            className="green-interact w-50"
            ref={setButtons(7)}
>
              <h5>{isPlaying ? 'Pause' : 'Play'} (B4)</h5>
              </button>
            </div>
          </div>
            <div className="col-12">
            <div className="d-flex justify-content-center">
              <textarea
              className="form-control w-75"
              rows={4}
              placeholder="Enter your thoughts here..."
              ref={setTextArea()}
              />
            </div>
            </div>
            <div className="col-12 mt-5 text-center">
            <button className="yellow-interact"
              style={{
                color: "black"
              }}
              ref={setButtons(8)}
              onClick={() => {
                setQuestionNumber(4);
                // setCheckBoxesQ1(0);
                saveResponse();
              }}
              >
              <h3>Submit (B2)</h3>
            </button>
          </div>
          </div>
          
          {/* Part 4 */}
          <div className="row"
          style={{
            visibility: questionNumber == 4 ? "visible" : "hidden",
            display: questionNumber == 4 ? "flex" : "none"
          }}>
          <div className="col-12 text-center">
            <h1>Thank you!!</h1>
          </div>
          <div className="col-12 text-center">
              <h2>To return to the main dashboard, press the Blue <div className="dot blue-dot">B1</div> button.</h2>
          </div>
          <div className="col-12 text-center">
              <h2>To return to song search, press the Red <div className="dot red-dot">B3</div> button.</h2>
          </div>
          <div className="col-12 text-center">
              <h2>To play and pause the song, press the Green <div className="dot green-dot">B4</div> button.</h2>
          </div>
          
          <div className="col-4">
            <div className="mt-3 text-center">
            <button
              onClick={() => router.push("/music-and-emotion/song-search")}
              className="blue-interact w-50"
              ref={setButtons(9)}>
              <h5>Return to Dashboard (B1)</h5>
            </button>
            </div>
          </div>
          <div className="col-4">
            <div className="mt-3 text-center">
            <button
              onClick={() => router.push("/music-and-emotion/song-search")}
              className="red-interact w-50"
              ref={setButtons(10)}>
              <h5>Return to Song Search (B3)</h5>
            </button>
            </div>
          </div>
          <div className="col-4">
            <div className="mt-3 text-center">
              <button 
            onClick={togglePlayback}
            className="green-interact w-50"
            ref={setButtons(11)}>
              <h5>Play and Pause Music (B4)</h5>
              </button>
            </div>
          </div>
            
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

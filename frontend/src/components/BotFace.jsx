// the below componnet working fine
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./BotFace.css";

// const BotFace = () => {
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("");
//   const [listening, setListening] = useState(false);
//   const leftPupilRef = useRef(null);
//   const rightPupilRef = useRef(null);

//   useEffect(() => {
//     if (listening) {
//       handleSpeechRecognition();
//     }
//   }, [listening]);

//   const handleSendMessage = async () => {
//     try {
//       console.log("Sending message:", message);
//       const res = await axios.post("http://localhost:5000/gemini", {
//         history: [], // Adjust history if needed
//         message,
//       });
//       console.log("Received response:", res.data);
//       setResponse(res.data);
//       speakResponse(res.data);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       console.error(
//         "Error details:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleSpeechRecognition = () => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.start();

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setMessage(transcript);
//       setListening(false);
//       handleSendMessage();
//     };

//     recognition.onend = () => {
//       setListening(false);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event);
//       setListening(false);
//     };
//   };

//   const speakResponse = (text) => {
//     const speech = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(speech);
//   };

//   const startListening = () => {
//     setListening(true);
//   };

//   const moveEyes = (e) => {
//     const movePupil = (pupil, offsetX, offsetY) => {
//       const rect = pupil.getBoundingClientRect();
//       const x = rect.left + rect.width / 2;
//       const y = rect.top + rect.height / 2;
//       const rad = Math.atan2(e.clientX - x - offsetX, e.clientY - y - offsetY);
//       const rot = rad * (180 / Math.PI) * -1 + 180;
//       pupil.style.transform = `rotate(${rot}deg)`;
//     };

//     movePupil(leftPupilRef.current, -30, 0);
//     movePupil(rightPupilRef.current, 30, 0);
//   };

//   return (
//     <div id="main" onMouseMove={moveEyes}>
//       <div id="eyes">
//         <div id="left">
//           <div id="lirs">
//             <div id="pupil" ref={leftPupilRef}></div>
//           </div>
//           <div id="eyelid"></div>
//         </div>
//         <div id="right">
//           <div id="lirs">
//             <div id="pupil" ref={rightPupilRef}></div>
//           </div>
//           <div id="eyelid"></div>
//         </div>
//       </div>
//       <div id="input-field">
//         <button id="start-btn" onClick={startListening}>
//           Start Talking
//         </button>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message here"
//         />
//         <button id="submit-btn" onClick={handleSendMessage}>
//           Send
//         </button>
//         <button id="submit-btn" onClick={handleSendMessage}>
//           Stop
//         </button>
//       </div>
//       <p style={{ color: "white", textAlign: "center" }}>
//         Response: {response}
//       </p>
//     </div>
//   );
// };

// export default BotFace;

// -- testing component

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./BotFace.css";

const BotFace = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands: [
      {
        command: "* *",
        callback: (command, spokenPhrase) => {
          console.log("Spoken phrase:", spokenPhrase);
          setMessage(spokenPhrase);
          if (!listening && isListening) {
            handleSendMessage(spokenPhrase);
          }
        },
      },
    ],
  });

  useEffect(() => {
    console.log("Listening status changed:", listening);
    if (!listening && isListening && transcript) {
      handleSendMessage(transcript);
      setIsListening(false);
    }
  }, [listening, isListening, transcript]);

  const handleSendMessage = async (msg = message) => {
    if (!msg.trim()) return;

    try {
      console.log("Sending message:", msg);
      const res = await axios.post("http://localhost:5000/gemini", {
        history: [], // Adjust history if needed
        message: msg,
      });
      console.log("Received response:", res.data);
      setResponse(res.data);
      speakResponse(res.data);
      setMessage("");
      resetTranscript();
    } catch (error) {
      console.error("Error sending message:", error);
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const speakResponse = (text) => {
    console.log("Speaking response:", text);
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {
    console.log("Start listening clicked.");
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    } else {
      console.warn("Browser does not support speech recognition.");
    }
  };

  const stopListening = () => {
    console.log("Stop listening clicked.");
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  const moveEyes = (e) => {
    const movePupil = (pupil, offsetX, offsetY) => {
      const rect = pupil.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const rad = Math.atan2(e.clientX - x - offsetX, e.clientY - y - offsetY);
      const rot = rad * (180 / Math.PI) * -1 + 180;
      pupil.style.transform = `rotate(${rot}deg)`;
    };
    movePupil(leftPupilRef.current, -30, 0);
    movePupil(rightPupilRef.current, 30, 0);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div id="main" onMouseMove={moveEyes}>
      <div id="eyes">
        <div id="left">
          <div id="lirs">
            <div id="pupil" ref={leftPupilRef}></div>
          </div>
          <div id="eyelid"></div>
        </div>
        <div id="right">
          <div id="lirs">
            <div id="pupil" ref={rightPupilRef}></div>
          </div>
          <div id="eyelid"></div>
        </div>
      </div>
      <div id="input-field">
        <button id="start-btn" onClick={startListening} disabled={isListening}>
          Start Talking
        </button>
        <button id="stop-btn" onClick={stopListening} disabled={!isListening}>
          Stop Talking
        </button>
        <button id="reset-btn" onClick={resetTranscript}>
          Reset
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button id="submit-btn" onClick={() => handleSendMessage()}>
          Send
        </button>
      </div>
      <p style={{ color: "white", textAlign: "center" }}>
        Microphone: {listening ? "on" : "off"}
      </p>
      <p style={{ color: "white", textAlign: "center" }}>
        Transcript: {transcript}
      </p>
      <p style={{ color: "white", textAlign: "center" }}>
        Response: {response}
      </p>
    </div>
  );
};

export default BotFace;

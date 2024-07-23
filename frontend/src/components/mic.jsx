// import React, { useState, useRef, useEffect } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// const Mic = () => {
//   const { transcript, resetTranscript } = useSpeechRecognition();
//   const [isListening, setIsListening] = useState(false);
//   const [speakResponse, setSpeakResponse] = useState(false); // Change default to false
//   const microphoneRef = useRef(null);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       console.log("Browser does not support Speech Recognition.");
//     }
//     if (!window.speechSynthesis) {
//       console.log("Browser does not support Voice speaking.");
//     }
//   }, []);

//   useEffect(() => {
//     if (speakResponse && transcript) {
//       const synthesis = window.speechSynthesis;
//       const utterance = new SpeechSynthesisUtterance(transcript);
//       synthesis.speak(utterance);
//     }
//   }, [speakResponse, transcript]);

//   const handleListening = () => {
//     setIsListening(true);
//     microphoneRef.current.classList.add("listening");
//     SpeechRecognition.startListening({
//       continuous: true,
//     });
//   };

//   const stopHandle = () => {
//     setIsListening(false);
//     microphoneRef.current.classList.remove("listening");
//     SpeechRecognition.stopListening();
//   };

//   const handleReset = () => {
//     stopHandle();
//     resetTranscript();
//   };

//   // Function to speak the response
//   const speakResponseNow = () => {
//     setSpeakResponse(true);
//   };

//   return (
//     <div>
//       <div ref={microphoneRef}>
//         {isListening ? "Listening..." : "Click to start listening"}
//       </div>
//       <button onClick={handleListening}>Start Listening</button>
//       <button onClick={stopHandle}>Stop Listening</button>
//       <button onClick={handleReset}>Reset</button>
//       <button onClick={speakResponseNow}>Speak Response</button>{" "}
//       {/* Add this button */}
//     </div>
//   );
// };

// export default Mic;

import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Mic = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [speakResponse, setSpeakResponse] = useState(false);
  const microphoneRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.log("Browser does not support Speech Recognition.");
    }
    if (!window.speechSynthesis) {
      console.log("Browser does not support Voice speaking.");
    }
  }, []);

  useEffect(() => {
    if (speakResponse && transcript) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(transcript);
      synthesis.speak(utterance);
    }
  }, [speakResponse, transcript]);

  const handleListening = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  return (
    <div>
      {/* <div ref={microphoneRef}>
        {isListening ? "Listening..." : "Click to start listening"}
      </div> */}
      {/* <button onClick={handleListening}>Start Listening</button>
      <button onClick={stopHandle}>Stop Listening</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={() => setSpeakResponse(!speakResponse)}>
        {speakResponse ? "Stop Speaking Response" : "Speak Response"}
      </button> */}
    </div>
  );
};

export default Mic;

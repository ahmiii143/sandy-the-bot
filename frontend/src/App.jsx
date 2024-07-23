// import "./App.css";
// import { useRef, useState, useEffect } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import { FaMicrophone } from "react-icons/fa";

// function App() {
//   // State for user input, error messages, chat history, and listening status
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const { transcript, resetTranscript } = useSpeechRecognition();
//   const [isListening, setIsListening] = useState(false);
//   const [speakResponse, setSpeakResponse] = useState(true);

//   // Reference to the microphone icon container
//   const microphoneRef = useRef(null);

//   // Function to handle speech synthesis for the response
//   const speakResponseText = (text) => {
//     const synthesis = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synthesis.speak(utterance);
//   };

//   // Add this useEffect to update the input value when speech is transcribed
//   useEffect(() => {
//     setValue(transcript);
//   }, [transcript]);

//   // Check if the browser supports speech recognition
//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return (
//       <div className="microphone-container">
//         Browser does not support Speech Recognition.
//       </div>
//     );
//   }
//   if (!window.speechSynthesis) {
//     return (
//       <div className="microphone-container">
//         Browser does not support Voice speaking.
//       </div>
//     );
//   }
//   // Start listening to speech
//   const handleListing = () => {
//     setIsListening(true);
//     microphoneRef.current.classList.add("listening");
//     SpeechRecognition.startListening({
//       continuous: true,
//     });
//   };

//   // Stop listening to speech
//   const stopHandle = () => {
//     setIsListening(false);
//     microphoneRef.current.classList.remove("listening");
//     SpeechRecognition.stopListening();
//   };

//   // Reset the speech transcript
//   const handleReset = () => {
//     stopHandle();
//     resetTranscript();
//   };

//   // Array of surprise options for user queries
//   const surpriseOptions = [
//     "Write a short story about a character who discovers a mysterious portal in their backyard.",
//     "Imagine a world where animals can communicate with humans. Describe a day in the life of a person navigating this unique reality.",
//     "Create a dialogue between two unlikely companions—an alien and a medieval knight—discussing their perspectives on life.",
//     "Explore the concept of time travel in a poem. How does it feel to move between different eras?",
//     "Write a letter from a character to their future self, reflecting on their current aspirations and dreams.",
//     "Describe an abandoned amusement park at night. What secrets does it hold, and who might visit such a place?",
//     "Invent a new technology that dramatically changes the way people interact with nature. How does it impact society?",
//     "Craft a scene set in a bustling, futuristic city where everyone wears masks. What purpose do these masks serve, and what happens when someone breaks the norm?",
//     "Develop a monologue for a character who wakes up with the ability to read minds. How do they navigate this newfound power?",
//     "Create a short dialogue between a wise old tree and a curious child. What lessons does the tree share with the young visitor?",
//   ];

//   // Generate a random surprise query
//   const surprise = async () => {
//     const randomValue = await surpriseOptions[
//       Math.floor(Math.random() * surpriseOptions.length)
//     ];
//     setValue(randomValue);
//   };

//   // Fetch response from the backend based on user input
//   const getResponse = async () => {
//     if (!value) {
//       setError("Please ask something");
//       return;
//     }

//     try {
//       // Prepare options for the fetch request
//       const options = {
//         method: "POST",
//         body: JSON.stringify({
//           history: chatHistory,
//           message: value,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       // Send a request to the backend
//       const response = await fetch("http://localhost:5000/gemini", options);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Get the response text from the backend
//       const data = await response.text();

//       // Show loading spinner in chat history
//       setChatHistory((oldChatHistory) => [
//         ...oldChatHistory,
//         { role: "user", parts: value },
//         { role: "model", parts: "Loading..." },
//       ]);

//       // Update the chat history with the actual response
//       setChatHistory((oldChatHistory) => [
//         ...oldChatHistory.slice(0, -1), // Remove the loading message
//         { role: "model", parts: data },
//       ]);

//       // Speak the response
//       if (speakResponse) {
//         speakResponseText(data);
//       }

//       // Clear the input field
//       setValue("");
//     } catch (error) {
//       console.log(error.message, "error in get response");
//       setError(
//         "It seems like your message is incomplete. Could you please provide more details or clarify your request? I'm here to help!"
//       );
//     }
//   };

//   // Clear the chat history, input field, and error message
//   const clearChat = () => {
//     setError("");
//     setValue("");
//     setChatHistory([]);
//   };

//   return (
//     <div className="app">
//       {/* Microphone section */}
//       <div className="microphone-wrapper">
//         <div
//           className="microphone-icon-container"
//           ref={microphoneRef}
//           onClick={handleListing}
//         >
//           <FaMicrophone className="microphone-icon" alt="" />
//         </div>
//         <div className="microphone-status">
//           {isListening ? "Listening..." : "Click to start listening"}
//         </div>
//         {isListening && (
//           <button className="microphone-stop btn" onClick={stopHandle}>
//             Stop
//           </button>
//         )}
//         {transcript && (
//           <div className="microphone-result-container">
//             <div className="microphone-result-text">{transcript}</div>
//             <button className="microphone-reset btn" onClick={handleReset}>
//               Reset
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Chat and user input section */}
//       <h1>Brilliant Brainiac Bot</h1>
//       <h1 className="headingText">What do you want to know?</h1>
//       <button
//         className="button"
//         onClick={surprise}
//         disabled={!chatHistory.length}
//       >
//         Surprise Me
//       </button>

//       <div className="input-container">
//         <input
//           value={value}
//           type="text"
//           placeholder="Ask me anything..."
//           onChange={(e) => setValue(e.target.value)}
//         />
//         {!error && <button onClick={getResponse}>Ask Me</button>}
//         {error && <button onClick={clearChat}>Clear</button>}

//         <button onClick={() => setSpeakResponse(!speakResponse)}>
//           {speakResponse ? "Turn off Speaking" : "Turn on Speaking"}
//         </button>

//         {/* Button to speak response */}
//         {chatHistory.length > 0 && (
//           <button
//             onClick={() =>
//               speakResponseText(chatHistory[chatHistory.length - 1].parts)
//             }
//           >
//             Speak Response
//           </button>
//         )}
//       </div>

//       {/* Display chat history */}
//       {error && <p>{error}</p>}
//       <div className="search-results">
//         {chatHistory.map((chatItem, index) => (
//           <div key={index}>
//             <p className="answer">
//               {chatItem.role}: {chatItem.parts}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

// import "./App.css";
// import { useRef, useState, useEffect } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import { FaMicrophone } from "react-icons/fa";
// import Mic from "./components/mic";
// import BotFace from "./components/BotFace";
// import axios from "axios";

// function App() {
//   // State for user input, error messages, chat history, and listening status
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const { transcript, resetTranscript } = useSpeechRecognition();

//   // Function to speak the response
//   const speakResponseText = (text) => {
//     const synthesis = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synthesis.speak(utterance);
//   };

//   // Add this useEffect to update the input value when speech is transcribed
//   useEffect(() => {
//     setValue(transcript);
//   }, [transcript]);

//   // Fetch response from the backend based on user input
//   const getResponse = async () => {
//     if (!value) {
//       setError("Please ask something");
//       return;
//     }

//     try {
//       // Prepare options for the fetch request
//       const options = {
//         method: "POST",
//         body: JSON.stringify({
//           history: chatHistory,
//           message: value,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       // Send a request to the backend
//       const response = await fetch("http://localhost:5000/gemini", options);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Get the response text from the backend
//       const data = await response.text();

//       // Show loading spinner in chat history
//       setChatHistory((oldChatHistory) => [
//         ...oldChatHistory,
//         { role: "user", parts: value },
//         { role: "model", parts: "Loading..." },
//       ]);

//       // Update the chat history with the actual response
//       setChatHistory((oldChatHistory) => [
//         ...oldChatHistory.slice(0, -1), // Remove the loading message
//         { role: "model", parts: data },
//       ]);

//       // Clear the input field
//       setValue("");
//     } catch (error) {
//       console.log(error.message, "error in get response");
//       setError(
//         "It seems like your message is incomplete. Could you please provide more details or clarify your request? I'm here to help!"
//       );
//     }
//   };

//   // Clear the chat history, input field, and error message
//   const clearChat = () => {
//     setError("");
//     setValue("");
//     setChatHistory([]);
//   };

//   return (
//     <div className="app">
//       {/* Microphone section */}
//       <Mic />
//       <BotFace />

//       {/* Chat and user input section */}
//       <h1>Brilliant Brainiac Bot</h1>
//       <h1 className="headingText">What do you want to know?</h1>
//       <div className="input-container">
//         <input
//           value={value}
//           type="text"
//           placeholder="Ask me anything..."
//           onChange={(e) => setValue(e.target.value)}
//         />
//         {!error && <button onClick={getResponse}>Ask Me</button>}
//         {error && <button onClick={clearChat}>Clear</button>}
//       </div>

//       {/* Display chat history */}
//       {error && <p>{error}</p>}
//       <div className="search-results">
//         {chatHistory.map((chatItem, index) => (
//           <div key={index}>
//             <p className="answer">
//               {chatItem.role}: {chatItem.parts}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

// import "./App.css";
// import { useRef, useState, useEffect } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import { FaMicrophone } from "react-icons/fa";
// import Mic from "./components/mic";
// import BotFace from "./components/BotFace";
// import axios from "axios";

// function App() {
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const { transcript, resetTranscript } = useSpeechRecognition();

//   const speakResponseText = (text) => {
//     const synthesis = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     synthesis.speak(utterance);
//   };

//   useEffect(() => {
//     setValue(transcript);
//   }, [transcript]);

//   const getResponse = async () => {
//     if (!value) {
//       setError("Please ask something");
//       return;
//     }

//     try {
//       console.log("Sending request with value:", value);
//       const options = {
//         method: "POST",
//         body: JSON.stringify({
//           history: chatHistory,
//           message: value,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };

//       const response = await fetch("http://localhost:5000/gemini", options);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.text();
//       console.log("Received response:", data);

//       setChatHistory((oldChatHistory) => [
//         ...oldChatHistory,
//         { role: "user", parts: value },
//         { role: "model", parts: "Loading..." },
//       ]);

//       setChatHistory((oldChatHistory) => [
//         ...oldChatHistory.slice(0, -1),
//         { role: "model", parts: data },
//       ]);

//       setValue("");
//     } catch (error) {
//       console.log(error.message, "error in get response");
//       setError(
//         "It seems like your message is incomplete. Could you please provide more details or clarify your request? I'm here to help!"
//       );
//     }
//   };

//   const clearChat = () => {
//     setError("");
//     setValue("");
//     setChatHistory([]);
//   };

//   return (
//     <div className="app">
//       <Mic />
//       {/* <BotFace /> */}

//       <h1>Brilliant Brainiac Bot</h1>
//       <h1 className="headingText">What do you want to know?</h1>
//       <div className="input-container">
//         <input
//           value={value}
//           type="text"
//           placeholder="Ask me anything..."
//           onChange={(e) => setValue(e.target.value)}
//         />
//         {!error && <button onClick={getResponse}>Ask Me</button>}
//         {error && <button onClick={clearChat}>Clear</button>}
//       </div>

//       {error && <p>{error}</p>}
//       <div className="search-results">
//         {chatHistory.map((chatItem, index) => (
//           <div key={index}>
//             <p className="answer">
//               {chatItem.role}: {chatItem.parts}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

import "./App.css";
import { useState } from "react";
import Mic from "./components/mic";
import BotFace from "./components/BotFace";
import ChatInput from "./components/ChatInput";
import ChatHistory from "./components/ChatHistory";
import soundwave from "./assets/soundwave.jpg";
import BasicSpeechRecognition from "./components/BasicSpeechRecognition";

function App() {
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div className="app">
      <Mic />
      <BotFace />
      {/* <BasicSpeechRecognition /> */}

      {/* <h1>Brilliant Brainiac Bot</h1>
      <h1 className="headingText">What do you want to know?</h1> */}
      {/* <ChatInput
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        setError={setError}
      />
      {error && <p>{error}</p>}
      <ChatHistory chatHistory={chatHistory} /> */}
      <img
        src={soundwave}
        alt="soundwave"
        style={{
          height: "100px", // Adjust the height as needed
          objectFit: "cover", // Ensures the image covers the container
          width: "100%", // Ensures the image width matches the container
          overflow: "hidden", // Hides any overflow if the image is larger than the container
        }}
      />
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import axios from "axios";
import { useSpeechRecognition } from "react-speech-recognition";

const ChatInput = ({
  chatHistory,
  setChatHistory,
  setError,
  setValue,
  error,
}) => {
  const [value, setValueState] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();

  const speakResponseText = (text) => {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.speak(utterance);
  };

  useEffect(() => {
    setValueState(transcript);
  }, [transcript]);

  const getResponse = async () => {
    if (!value) {
      setError("Please ask something");
      return;
    }

    try {
      console.log("Sending request with value:", value);
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:5000/gemini", options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      console.log("Received response:", data);

      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        { role: "user", parts: value },
        { role: "model", parts: "Loading..." },
      ]);

      setChatHistory((oldChatHistory) => [
        ...oldChatHistory.slice(0, -1),
        { role: "model", parts: data },
      ]);

      setValueState("");
    } catch (error) {
      console.log(error.message, "error in get response");
      setError(
        "It seems like your message is incomplete. Could you please provide more details or clarify your request? I'm here to help!"
      );
    }
  };

  const clearChat = () => {
    setError("");
    setValueState("");
    setChatHistory([]);
  };

  return (
    <div className="input-container">
      <input
        value={value}
        type="text"
        placeholder="Ask me anything..."
        onChange={(e) => setValueState(e.target.value)}
      />
      {!error && <button onClick={getResponse}>Ask Me</button>}
      {error && <button onClick={clearChat}>Clear</button>}
    </div>
  );
};

export default ChatInput;

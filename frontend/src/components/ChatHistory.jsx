const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="search-results">
      {chatHistory.map((chatItem, index) => (
        <div key={index}>
          <p className="answer">
            {chatItem.role}: {chatItem.parts}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;

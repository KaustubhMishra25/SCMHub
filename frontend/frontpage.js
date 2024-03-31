import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleMessageSend = async () => {
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { text: inputValue, user: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    // Send user message to backend and receive response
    try {
      const response = await fetch('backend_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });
      const data = await response.json();
      setMessages([...newMessages, { text: data.message, user: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
}

export default App;

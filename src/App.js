// App.js
import React, { useState, useEffect } from 'react';
import ChatRoom from './components/ChatRoom';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Simulating loading data from a CSV file
    // In a real application, you'd replace this with actual CSV parsing logic
    const mockMessages = [
      { user_id: 'user1', turn_id: '1', turn_text: 'Hello, how are you?', reply_to_turn: null, thread: '' },
      { user_id: 'user2', turn_id: '2', turn_text: "I'm doing well, thanks!", reply_to_turn: '1', thread: '' },
      { user_id: 'user1', turn_id: '3', turn_text: 'Great! What are your plans for today?', reply_to_turn: '2', thread: '' },
      { user_id: 'user2', turn_id: '4', turn_text: "I'm going to work on a project. How about you?", reply_to_turn: '3', thread: '' },
      { user_id: 'user1', turn_id: '5', turn_text: 'I have a meeting later, but otherwise just coding.', reply_to_turn: '4', thread: '' },
    ];

    setMessages(mockMessages);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Annotation Chatroom</h1>
      </header>
      <main>
        <ChatRoom messages={messages} />
      </main>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import FileLoader from './components/FileLoader';
import ThreadMenu from './components/ThreadMenu';
import csvUtils from './utils/csvUtils';

function App() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('fileLoader');
    const [tags, setTags] = useState({});

    const handleFileSelect = async (file) => {
        console.log('File selected in App.js:', file.name);
        setIsLoading(true);
        setError(null);
        try {
            const csvData = await csvUtils.loadCsv(file);
            console.log('CSV data loaded:', csvData);
            setMessages(csvData.data);
            console.log('Messages set:', csvData.data);
            setView('chatRoom');
        } catch (err) {
            console.error('Error loading file:', err);
            setError('Failed to load the file. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBackToFileLoader = () => {
        setView('fileLoader');
        setMessages([]);
        setTags({});
      };

    const handleAnnotation = (turnId, annotation) => {
        setMessages((prevMessages) => {
            return prevMessages.map((message) =>
                message.turn_id === turnId
                    ? { ...message, thread: `${message.thread} ${annotation}`.trim() }
                    : message
            );
        });
        setTags((prevTags) => ({
            ...prevTags,
            [turnId]: annotation,
        }));
    };

    const handleTagEdit = (tagName) => {
        // Implement tag editing logic here
        console.log('Editing tag:', tagName);
    };

    return (
        <div className="App">
          <header className="App-header">
            <h1>Chat Room</h1>
          </header>
          <main className="App-main">
            {view === 'fileLoader' ? (
              <>
                <FileLoader onFileSelect={handleFileSelect} />
                {isLoading && <p className="loading-message">Loading file...</p>}
                {error && <p className="error-message">{error}</p>}
              </>
            ) : (
              <div className="chat-view">
                <button className="back-button" onClick={handleBackToFileLoader}>Back</button>
                <ChatRoom messages={messages} onAnnotation={handleAnnotation} />
                <ThreadMenu tags={tags} onTagEdit={handleTagEdit} />
              </div>
            )}
          </main>
        </div>
      );
}

export default App;
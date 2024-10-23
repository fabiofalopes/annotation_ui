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

    const handleAnnotation = (turnId, tagName) => {
        if (tagName.trim() === '') return;

        setMessages((prevMessages) => {
            return prevMessages.map((message) =>
                message.turn_id === turnId
                    ? { ...message, thread: tagName.trim() }
                    : message
            );
        });

        setTags((prevTags) => {
            const updatedTags = { ...prevTags };
            if (!updatedTags[tagName]) {
                updatedTags[tagName] = {
                    name: tagName,
                    color: getRandomColor(),
                    references: [turnId],
                    created: new Date().toISOString()
                };
            } else {
                updatedTags[tagName].references.push(turnId);
            }
            return updatedTags;
        });
    };

    const handleTagEdit = (oldTagName, newTagName, newColor) => {
        if (newTagName.trim() === '') return;

        setTags((prevTags) => {
            const updatedTags = { ...prevTags };
            if (oldTagName !== newTagName) {
                updatedTags[newTagName] = {
                    ...updatedTags[oldTagName],
                    name: newTagName,
                    color: newColor || updatedTags[oldTagName].color
                };
                delete updatedTags[oldTagName];
            } else {
                updatedTags[oldTagName].color = newColor;
            }
            return updatedTags;
        });

        setMessages((prevMessages) => {
            return prevMessages.map((message) =>
                message.thread === oldTagName
                    ? { ...message, thread: newTagName }
                    : message
            );
        });
    };

    const getRandomColor = () => {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
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
                        <ChatRoom messages={messages} onAnnotation={handleAnnotation} tags={tags} />
                        <ThreadMenu tags={tags} onTagEdit={handleTagEdit} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
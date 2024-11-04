import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import ChatRoom from './components/ChatRoom';
import FileLoader from './components/FileLoader';
import ThreadMenu from './components/ThreadMenu';
import csvUtils from './utils/csvUtils';
import AuthMenu from './components/AuthMenu';

function App() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState({});
    //const [theme, setTheme] = useState('light'); // Make the default theme 'light'
    const [theme, setTheme] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [currentFileName, setCurrentFileName] = useState('');
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const saveState = (state) => {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem('chatAppState', serializedState);
        } catch (err) {
            console.error('Could not save state', err);
        }
    };

    const loadState = () => {
        try {
            const serializedState = localStorage.getItem('chatAppState');
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (err) {
            console.error('Could not load state', err);
            return undefined;
        }
    };

    useEffect(() => {
        const savedState = loadState();
        if (savedState) {
            setMessages(savedState.messages);
            setTags(savedState.tags);
            setFileUploaded(savedState.fileUploaded);
            setCurrentFileName(savedState.currentFileName);
        }
    }, []);

    useEffect(() => {
        saveState({ messages, tags, fileUploaded, currentFileName });
    }, [messages, tags, fileUploaded, currentFileName]);

    const handleFileSelect = async (file, isWorkspaceFile = false) => {
        console.log('File selected in App.js:', file.name);
        setIsLoading(true);
        setError(null);
        
        try {
            let csvData;
            
            if (isWorkspaceFile) {
                // Load directly from workspace using the same parsing logic
                csvData = await csvUtils.loadCsv(file);
            } else {
                // External file - copy to workspace first
                await csvUtils.copyToFiles(file, file.name);
                csvData = await csvUtils.loadCsv(file);
            }
    
            const messagesWithTags = csvData.data.map((message) => ({
                ...message,
                thread: message.thread !== '' ? String(message.thread) : '',
            }));
            setMessages(messagesWithTags);
    
            // Process tags from the loaded data
            const initialTags = {};
            csvData.uniqueTags.forEach(tagName => {
                if (tagName !== '') {
                    initialTags[tagName] = {
                        name: tagName,
                        color: getRandomColor(),
                        references: messagesWithTags.filter(message => String(message.thread) === tagName).map(message => message.turn_id),
                        created: new Date().toISOString()
                    };
                }
            });
            setTags(initialTags);
    
            setCurrentFileName(file.name);
            setFileUploaded(true);
            navigate('/chat');
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setFileUploaded(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnnotation = async (turnId, tagName) => {
        if (!isAuthenticated) {
            alert('Please login to add annotations');
            return;
        }
    
        if (tagName.trim() === '') return;
    
        const updatedMessages = messages.map((message) =>
            message.turn_id === turnId
                ? { 
                    ...message, 
                    thread: tagName.trim(),
                    annotator: currentUser // Add annotator information
                  }
                : message
        );
    
        setMessages(updatedMessages);
    
        const updatedTags = { ...tags };
        if (!updatedTags[tagName]) {
            updatedTags[tagName] = {
                name: tagName,
                color: getRandomColor(),
                references: [turnId],
                created: new Date().toISOString(),
                creator: currentUser // Add creator information
            };
        } else {
            if (!updatedTags[tagName].references.includes(turnId)) {
                updatedTags[tagName].references.push(turnId);
            }
        }
    
        setTags(updatedTags);
    
        // Save changes to CSV file
        await csvUtils.saveChangesToCsv(updatedMessages, updatedTags, currentFileName);
    };

    const handleTagEdit = async (oldTagName, newTagName, newColor, newDescription) => {
        if (newTagName.trim() === '') return;

        const updatedTags = { ...tags };
        if (oldTagName !== newTagName) {
            updatedTags[newTagName] = {
                ...updatedTags[oldTagName],
                name: newTagName,
                color: newColor || updatedTags[oldTagName].color,
                description: newDescription
            };
            delete updatedTags[oldTagName];
        } else {
            updatedTags[oldTagName].color = newColor;
            updatedTags[oldTagName].description = newDescription;
        }

        setTags(updatedTags);

        const updatedMessages = messages.map((message) =>
            message.thread === oldTagName
                ? { ...message, 
                    thread: newTagName ,
                    annotator: currentUser
                }
                : message
        );

        setMessages(updatedMessages);

        // Save changes to CSV file
        await csvUtils.saveChangesToCsv(updatedMessages, updatedTags, currentFileName);
    };

    const getRandomColor = () => {
        //return '#' + Math.floor(Math.random() * 16777215).toString(16);
        return getRandomBalancedColor();
    };
    
    const hslToHex = (h, s, l) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };
    
    const getRandomBalancedColor = () => {
        const hue = Math.floor(Math.random() * 360);        // Full random hue
        const saturation = Math.floor(Math.random() * 20) + 50;  // Saturation between 50-80%
        const lightness = Math.floor(Math.random() * 30) + 40;   // Lightness between 40-70%
        return hslToHex(hue, saturation, lightness);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleLogin = async (email, password) => {
        // For this simple implementation, we'll just store in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (!users[email] || users[email].password !== password) {
            throw new Error('Invalid email or password');
        }
    
        setIsAuthenticated(true);
        setCurrentUser(email);
        localStorage.setItem('currentUser', email);
    };
    
    const handleRegister = async (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[email]) {
            throw new Error('Email already registered');
        }
    
        users[email] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login after registration
        await handleLogin(email, password);
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };
    
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setIsAuthenticated(true);
            setCurrentUser(savedUser);
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Disentanglement Chat Room</h1>
                <nav className="nav-menu">
                    <Link to="/" className="nav-button">Home</Link>
                    <Link to="/upload" className="nav-button">Upload CSV</Link>
                    <Link to="/chat" className="nav-button">Disentanglement Chat Room</Link>
                </nav>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <AuthMenu
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onLogout={handleLogout}
                />
            </header>
            <main className="App-main">
                <Routes>
                    <Route path="/" element={<Home fileUploaded={fileUploaded} />} />
                    <Route path="/upload" element={<FileLoader onFileSelect={handleFileSelect} />} />
                    <Route
                        path="/chat"
                        element={
                            fileUploaded ? (
                                <div className="chat-view">
                                    <ChatRoom messages={messages} onAnnotation={handleAnnotation} tags={tags} />
                                    <ThreadMenu tags={tags} onTagEdit={handleTagEdit} />
                                </div>
                            ) : (
                                <Navigate to="/upload" replace />
                            )
                        }
                    />
                </Routes>
            </main>
            {isLoading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

function Home({ fileUploaded }) {
    return (
        <div>
            <h2>Welcome to the Disentanglement Chat Room App</h2>
            {fileUploaded ? (
                <p>You have uploaded a CSV file. You can now go to the <Link to="/chat">Disentanglement Chat Room</Link>.</p>
            ) : (
                <p>Please <Link to="/upload">upload a CSV file</Link> to start or resume a chat session.</p>
            )}
        </div>
    );
}

export default App;
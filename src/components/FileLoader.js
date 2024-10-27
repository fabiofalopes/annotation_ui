import React, { useState, useRef } from 'react';
import Workspace from './Workspace';
import './FileLoader.css';

const FileLoader = ({ onFileSelect }) => {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        setDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            console.log('File dropped:', file.name);
            onFileSelect(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="file-loader">
            <h2>Select a CSV file</h2>
            <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
            >
                <p>Drag and drop a CSV file here, or click to select a file</p>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
            </div>
            <Workspace onFileSelect={onFileSelect} />
        </div>
    );
};

export default FileLoader;
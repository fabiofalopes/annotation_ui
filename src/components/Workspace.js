import React, { useState, useEffect } from 'react';
import './Workspace.css';

const Workspace = ({ onFileSelect }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWorkspaceFiles();
    }, []);

    const fetchWorkspaceFiles = async () => {
        try {
            const response = await fetch('/api/workspace-files');
            if (!response.ok) {
                throw new Error('Failed to fetch workspace files');
            }
            const data = await response.json();
            setFiles(data.files);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFolder = () => {
        fetch('/api/open-workspace-folder', { method: 'POST' });
    };

    const handleFileClick = async (fileName) => {
        try {
            const response = await fetch(`/api/workspace-file/${fileName}`);
            if (!response.ok) {
                throw new Error('Failed to load workspace file');
            }
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: 'text/csv' });
            onFileSelect(file, true);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="workspace-loading">Loading workspace...</div>;
    if (error) return <div className="workspace-error">{error}</div>;

    return (
        <div className="workspace">
            <div className="workspace-header">
                <h2>Workspace</h2>
                <button onClick={handleOpenFolder} className="open-folder-btn">
                    Open Folder
                </button>
            </div>
            <div className="files-list">
                {files.length === 0 ? (
                    <p className="no-files">No files in workspace</p>
                ) : (
                    files.map((file) => (
                        <div key={file.name} className="file-item">
                            <span className="file-name" onClick={() => handleFileClick(file.name)}>
                                {file.name}
                            </span>
                            <span className="file-info">
                                Last modified: {new Date(file.lastModified).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Workspace;
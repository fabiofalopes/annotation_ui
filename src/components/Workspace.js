import React, { useState, useEffect } from 'react';
import './Workspace.css';

const Workspace = ({ onFileSelect }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingFile, setEditingFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        fetchWorkspaceFiles();
    }, []);

    const fetchWorkspaceFiles = async () => {
        try {
            const response = await fetch('/api/workspace-files');
            if (!response.ok) throw new Error('Failed to fetch workspace files');
            const data = await response.json();
            setFiles(data.files);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFolder = async () => {
        try {
            console.log('Attempting to open workspace folder...');
            const response = await fetch('/api/open-workspace-folder', { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            });
        
            // Log the raw response for debugging
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Raw response:', responseText);
        
            // Try to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error('Server returned invalid JSON');
            }
        
            console.log('Parsed server response:', data);
        
            if (!response.ok) {
                throw new Error(data.error || 'Failed to open folder');
            }
        
            if (!data.success) {
                throw new Error('Server indicated failure to open folder');
            }
        
            console.log('Successfully opened folder at:', data.path);
        } catch (err) {
            console.error('Error details:', err);
            setError(`Failed to open workspace folder: ${err.message}`);
        }
    };
    
    const handleFileClick = async (fileName) => {
        try {
            const response = await fetch(`/api/workspace-file/${fileName}`);
            if (!response.ok) throw new Error('Failed to load workspace file');
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: 'text/csv' });
            onFileSelect(file, true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRename = async (oldName) => {
        try {
            // Ensure new filename has .csv extension
            let finalNewName = newFileName;
            if (!finalNewName.endsWith('.csv')) {
                finalNewName += '.csv';
            }
    
            const response = await fetch('/api/workspace-file/rename', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    oldName, 
                    newName: finalNewName 
                })
            });
            
            // First check if the response is ok
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to rename file');
            }
    
            // Try to parse the response as JSON
            const data = await response.json();
            
            if (data.success) {
                setEditingFile(null);
                setNewFileName('');
                await fetchWorkspaceFiles(); // Refresh the file list
            } else {
                throw new Error('Failed to rename file');
            }
        } catch (err) {
            console.error('Error renaming file:', err);
            setError(err.message || 'Failed to rename file');
            // Optionally reset the editing state on error
            // setEditingFile(null);
            // setNewFileName('');
        }
    };

    const handleDelete = async (fileName) => {
        if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;
        
        try {
            const response = await fetch(`/api/workspace-file/${fileName}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete file');
            
            fetchWorkspaceFiles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDuplicate = async (fileName) => {
        try {
            const response = await fetch('/api/workspace-file/duplicate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: fileName })
            });
            
            if (!response.ok) throw new Error('Failed to duplicate file');
            
            fetchWorkspaceFiles();
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
                            <div className="file-content">
                                {editingFile === file.name ? (
                                    <div className="file-edit">
                                        <input
                                            type="text"
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleRename(file.name);
                                            }}
                                        />
                                        <button onClick={() => handleRename(file.name)}>Save</button>
                                        <button onClick={() => setEditingFile(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="file-name" onClick={() => handleFileClick(file.name)}>
                                            {file.name}
                                        </span>
                                        <span className="file-info">
                                            Last modified: {new Date(file.lastModified).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="file-actions">
                                <button onClick={() => {
                                    setEditingFile(file.name);
                                    setNewFileName(file.name);
                                }}>Edit</button>
                                <button onClick={() => handleDuplicate(file.name)}>Duplicate</button>
                                <button onClick={() => handleDelete(file.name)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Workspace;
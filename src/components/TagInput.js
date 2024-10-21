import React, { useState } from 'react';
import './TagInput.css';

const TagInput = ({ tag, onTagUpdate, onTagHover }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(tag || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onTagUpdate(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="tag-input">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            placeholder="Enter tag"
          />
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
          </button>
        </form>
      ) : (
        // In the TagInput component
        <div
        className={`tag ${tag ? 'has-tag' : 'no-tag'}`}
        onClick={() => setIsEditing(true)}
        onMouseEnter={(event) => onTagHover(tag, event)}
        onMouseLeave={() => onTagHover(null)}
        >
        {tag || 'Add tag'}
        <span className="edit-icon">✎</span>
        </div>
      )}
    </div>
  );
};

export default TagInput;
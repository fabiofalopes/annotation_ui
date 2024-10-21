// TagHoverMenu.js
import React from 'react';
import './TagHoverMenu.css';

const TagHoverMenu = ({ tag, position }) => {
  return (
    <div className="tag-hover-menu" style={position}>
      <h3>Tag: {tag}</h3>
      <p>Description: This is a placeholder description for tag {tag}.</p>
      <ul>
        <li>Created: {new Date().toLocaleDateString()}</li>
        <li>Used in: 5 messages</li>
        <li>Category: General</li>
      </ul>
    </div>
  );
};

export default TagHoverMenu;
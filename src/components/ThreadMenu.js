import React, { useState } from 'react';
import './ThreadMenu.css';

const ThreadMenu = ({ tags, onTagEdit }) => {
  const [editingTag, setEditingTag] = useState(null);

  const handleEditSubmit = (e, tagName) => {
    e.preventDefault();
    const newName = e.target.tagName.value;
    const newColor = e.target.tagColor.value;
    const newDescription = e.target.tagDescription.value;
    onTagEdit(tagName, newName, newColor, newDescription);
    setEditingTag(null);
  };

  return (
    <div className="thread-menu">
      <h2>Thread Tags</h2>
      {Object.entries(tags).map(([tagName, data]) => (
        <div 
          key={tagName} 
          className="tag-item" 
          style={{ borderLeft: `4px solid ${data.color}` }}
        >
          {editingTag === tagName ? (
            <form onSubmit={(e) => handleEditSubmit(e, tagName)}>
              <input type="text" name="tagName" defaultValue={tagName} />
              <input type="color" name="tagColor" defaultValue={data.color} />
              <textarea name="tagDescription" defaultValue={data.description || ''} placeholder="Enter tag description" />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingTag(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <h3>{tagName}</h3>
              <p>{data.description || 'No description'}</p>
              <ul>
                <li>Used in: {data.references.length} messages</li>
                <li><small>Created: {new Date(data.created).toLocaleString()}</small></li>
              </ul>
              <button onClick={() => setEditingTag(tagName)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThreadMenu;
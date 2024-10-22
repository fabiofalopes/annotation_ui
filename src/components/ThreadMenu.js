import React from 'react';
import './ThreadMenu.css';

const ThreadMenu = ({ tags, onTagEdit }) => {
  const uniqueTags = Object.values(tags).reduce((acc, tag) => {
    if (!acc[tag.name]) {
      acc[tag.name] = { ...tag, totalUsage: 1 };
    } else {
      acc[tag.name].totalUsage++;
    }
    return acc;
  }, {});

  return (
    <div className="thread-menu">
      <h2>Thread Tags</h2>
      {Object.entries(uniqueTags).map(([tagName, data]) => (
        <div key={tagName} className="tag-item">
          <h3>{tagName}</h3>
          <p>{data.description}</p>
          <ul>
            <li>Created: {data.created}</li>
            <li>Used in: {data.totalUsage} messages</li>
          </ul>
          <button onClick={() => onTagEdit(tagName)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default ThreadMenu;
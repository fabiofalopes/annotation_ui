import React, { useState } from 'react';
import TagInput from './TagInput';
import './MessageBubble.css';

const MessageBubble = ({ message, tag, onTagUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const displayText = message && message.turn_text
    ? (expanded || message.turn_text.length <= maxLength
      ? message.turn_text
      : `${message.turn_text.slice(0, maxLength)}...`)
    : 'No message content';

  return (
    <div className="message-bubble" style={tag ? { borderLeft: `4px solid ${tag.color}` } : {}}>
      <div className="message-header">
        <span className="turn-id">{message?.turn_id || 'Unknown'}</span>
        <span className="user-id">{message?.user_id || 'Unknown'}</span>
      </div>
      <div className="message-content">
        {displayText}
        {message?.turn_text && message.turn_text.length > maxLength && (
          <button className="see-all-button" onClick={toggleExpand}>
            {expanded ? 'See less' : 'See all'}
          </button>
        )}
      </div>
      <TagInput
        tag={tag}
        onTagUpdate={onTagUpdate}
      />
    </div>
  );
};

export default MessageBubble;
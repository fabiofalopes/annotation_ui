import React, { useState } from 'react';
import TagInput from './TagInput';
import './MessageBubble.css';

const MessageBubble = ({ message, tag, onTagUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const displayText = message && message.turn_text
    ? (expanded ? message.turn_text : message.turn_text.slice(0, maxLength))
    : 'No message content';

  const shouldShowExpandButton = message?.turn_text && message.turn_text.length > maxLength;

  return (
    <div className={`message-bubble ${expanded ? 'expanded' : ''}`} style={tag ? { borderLeft: `4px solid ${tag.color}` } : {}}>
      <div className="message-header">
        <span className="turn-id">{message?.turn_id || 'Unknown'}</span>
        <span className="user-id">{message?.user_id || 'Unknown'}</span>
      </div>
      <div className="message-content">
        {displayText}
        {!expanded && shouldShowExpandButton && '...'}
      </div>
      {shouldShowExpandButton && (
        <div className="see-more-container">
          <button className="see-all-button" onClick={toggleExpand}>
            {expanded ? 'See less' : 'See more'}
          </button>
        </div>
      )}
      <div className="tag-container">
        <TagInput
          tag={tag}
          onTagUpdate={onTagUpdate}
        />
      </div>
    </div>
  );
};

export default MessageBubble;
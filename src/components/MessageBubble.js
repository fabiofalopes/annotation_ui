import React, { useState } from 'react';
import TagInput from './TagInput';
import './MessageBubble.css';

const MessageBubble = ({ message, tag, onTagUpdate, isUserSelected, onUserClick }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 300; // Tamanho maximo do texto mostrado, sem ter que clicar "see more"

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const displayText = message && message.turn_text
    ? (expanded ? message.turn_text : message.turn_text.slice(0, maxLength))
    : 'No message content';

  const shouldShowExpandButton = message?.turn_text && message.turn_text.length > maxLength;

  return (
    <div className={`message-bubble ${expanded ? 'expanded' : ''} ${isUserSelected ? 'user-selected' : ''}`} 
         style={{
           ...tag ? { borderLeft: `4px solid ${tag.color}` } : {},
         }}>
      <div className="message-header">
        <span className="turn-id">
          <span className="turn-id-label">Turn_Id</span>
          <span className="turn-id-value">{message.turn_id}</span>
        </span>
        <span className="user-id" onClick={() => onUserClick(message.user_id)}>
          <span className="user-id-label">User_Id</span>
          <span className="user-id-value">{message.user_id}</span>
        </span>
        <span>
        {message.annotator && (
          <span className="annotator-container">
              <span className="annotator-label">Annotated by: </span>
              <span className="annotator-value">{message.annotator}</span>
          </span>
        )}
        </span>
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
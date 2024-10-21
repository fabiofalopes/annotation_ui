// MessageBubble.js
import React from 'react';
import TagInput from './TagInput';
import './MessageBubble.css';

const MessageBubble = ({ message, tag, onTagUpdate, onTagHover }) => {
  return (
    <div className="message-bubble">
      <div className="message-header">
        <span className="turn-id">{message.turn_id}</span>
        <span className="user-id">{message.user_id}</span>
      </div>
      <div className="message-content">{message.turn_text}</div>
      <TagInput
        tag={tag}
        onTagUpdate={(newTag) => onTagUpdate(message.turn_id, newTag)}
        onTagHover={(tag, event) => onTagHover(tag, event)}
      />
    </div>
  );
};

export default MessageBubble;
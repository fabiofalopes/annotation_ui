import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import './ChatRoom.css';

const ChatRoom = ({ messages, onAnnotation }) => {
  const [tags, setTags] = useState({});

  const handleTagUpdate = (turnId, tagName) => {
    setTags(prevTags => {
      const updatedTags = { ...prevTags };
      if (tagName === '') {
        delete updatedTags[turnId];
      } else {
        updatedTags[turnId] = tagName;
      }
      return updatedTags;
    });
    onAnnotation(turnId, tagName);
  };

  return (
    <div className="chat-room">
      {messages.map((message) => (
        <MessageBubble
          key={message.turn_id}
          message={message}
          tag={tags[message.turn_id]}
          onTagUpdate={(tagName) => handleTagUpdate(message.turn_id, tagName)}
        />
      ))}
    </div>
  );
};

export default ChatRoom;
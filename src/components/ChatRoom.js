import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import './ChatRoom.css';

const ChatRoom = ({ messages, onAnnotation, tags }) => {
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = 0;
    }
  }, [messages]);

  return (
    <div className="chat-room">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message) => (
          <MessageBubble
            key={message.turn_id}
            message={message}
            tag={tags[message.thread]}
            onTagUpdate={(tagName) => onAnnotation(message.turn_id, tagName)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
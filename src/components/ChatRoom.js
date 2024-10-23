import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import './ChatRoom.css';

const ChatRoom = ({ messages, onAnnotation, tags }) => {
  const chatBoxRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (chatBoxRef.current) {
      if (isInitialLoad) {
        chatBoxRef.current.scrollTop = 0;
        setIsInitialLoad(false);
      }
    }
  }, [messages, isInitialLoad]);

  const handleAnnotation = (turnId, tagName) => {
    const currentScrollPosition = chatBoxRef.current.scrollTop;
    onAnnotation(turnId, tagName);
    setTimeout(() => {
      chatBoxRef.current.scrollTop = currentScrollPosition;
    }, 0);
  };

  return (
    <div className="chat-room">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message) => (
          <MessageBubble
            key={message.turn_id}
            message={message}
            tag={tags[message.thread]}
            onTagUpdate={(tagName) => handleAnnotation(message.turn_id, tagName)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
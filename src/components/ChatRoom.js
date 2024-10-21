import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TagHoverMenu from './TagHoverMenu';
import './ChatRoom.css';

const ChatRoom = ({ messages }) => {
  const [tags, setTags] = useState({});
  const [hoveredTag, setHoveredTag] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTagUpdate = (turnId, tag) => {
    setTags(prevTags => ({ ...prevTags, [turnId]: tag }));
  };

  const handleTagHover = (tag, event) => {
    if (tag) {
      const chatBoxRect = chatBoxRef.current.getBoundingClientRect();
      const targetRect = event.target.getBoundingClientRect();
      
      let top = targetRect.top - chatBoxRect.top;
      let left = targetRect.left - chatBoxRect.left - 320; // 300px width + 20px margin

      // If there's not enough space on the left, position it on the right
      if (left < 0) {
        left = targetRect.right - chatBoxRect.left + 20;
      }

      // If it would appear below the viewport, position it above the tag
      if (top + 200 > chatBoxRect.height) { // Assuming menu height is about 200px
        top = top - 220; // 200px height + 20px margin
      }

      setMenuPosition({ top, left });
    }
    setHoveredTag(tag);
  };

  return (
    <div className="chat-room" ref={chatBoxRef}>
      <div className="chat-box">
        {messages.map((message) => (
          <MessageBubble
            key={message.turn_id}
            message={message}
            tag={tags[message.turn_id] || message.thread}
            onTagUpdate={handleTagUpdate}
            onTagHover={handleTagHover}
          />
        ))}
      </div>
      {hoveredTag && (
        <TagHoverMenu tag={hoveredTag} position={menuPosition} />
      )}
    </div>
  );
};

export default ChatRoom;
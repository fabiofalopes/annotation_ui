import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ThreadMenu from './ThreadMenu';
import './ChatRoom.css';

const ChatRoom = ({ messages }) => {
    const [tags, setTags] = useState({});
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleTagUpdate = (turnId, tagName) => {
        setTags(prevTags => {
            const newTags = { ...prevTags };
            if (tagName) {
                if (!newTags[turnId]) {
                    newTags[turnId] = {
                        name: tagName,
                        description: '',
                        created: new Date().toLocaleString(),
                        usageCount: 1
                    };
                } else {
                    newTags[turnId].name = tagName;
                    newTags[turnId].usageCount++;
                }
            } else {
                delete newTags[turnId];
            }
            return newTags;
        });
    };

    const handleTagEdit = (tag) => {
        // Implement tag editing logic here
        console.log(`Editing tag: ${tag}`);
    };

    return (
        <div className="chat-room-container">
            <div className="chat-room" ref={chatBoxRef}>
                <div className="chat-box">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.turn_id}
                            message={message}
                            tag={tags[message.turn_id] ? tags[message.turn_id].name : ''}
                            onTagUpdate={handleTagUpdate}
                        />
                    ))}
                </div>
            </div>
            <ThreadMenu tags={tags} onTagEdit={handleTagEdit} />
        </div>
    );
};

export default ChatRoom;
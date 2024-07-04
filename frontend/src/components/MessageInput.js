import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';
import { FiPaperclip, FiSmile, FiSend } from 'react-icons/fi';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && currentChat && currentUser) {
            const messageData = {
                content: message,
                chatId: currentChat.id,
                userId: currentUser.id,
                timestamp: new Date().toISOString(),
            };

            // Send message via WebSocket
            WebSocketService.sendMessage('/app/message', messageData);

            // Clear input field
            setMessage('');
        }
    };

    const addEmoji = (emoji) => {
        setMessage(message + emoji.native);
    };

    if (!currentChat) {
        return null;
    }

    return (
        <div className="relative">
            <form className="flex items-center p-4 bg-gray-900 border-t border-gray-700" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex space-x-4 items-center ml-4">
                    <FiPaperclip className="text-2xl cursor-pointer text-gray-400" />
                    <FiSmile
                        className="text-2xl cursor-pointer text-gray-400"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    <button type="submit" className="focus:outline-none">
                        <FiSend className="text-2xl cursor-pointer text-gray-400" />
                    </button>
                </div>
            </form>
            {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-16 right-0">
                    <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
            )}
        </div>
    );
};

export default MessageInput;

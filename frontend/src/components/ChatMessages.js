import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage } from '../actions/messageActions';
import WebSocketService from '../services/WebSocketService';

const ChatMessages = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector((state) => state.chat.currentChat);
    const messages = useSelector((state) => state.message.messages);
    const currentUser = useSelector((state) => state.auth.user);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentChat) {
            dispatch(fetchMessages(currentChat.id));

            WebSocketService.connect(() => {
                WebSocketService.subscribe(`/group/${currentChat.id}`, (message) => {
                    dispatch(addMessage(message));
                });
            });

            return () => {
                WebSocketService.disconnect();
            };
        }
    }, [currentChat, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const isCurrentUserMessage = (message) => {
        return message.user?.id === currentUser?.id || message.userId === currentUser?.id;
    };

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
            <div className="flex flex-col space-y-2">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        id={`message-${message.id}`}
                        className={`${
                            isCurrentUserMessage(message) ? 'self-end bg-green-600' : 'self-start bg-gray-800'
                        } text-white p-3 rounded-lg max-w-xs`}
                    >
                        <p>{message.content}</p>
                        <span className="text-xs text-gray-400 block mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessages;

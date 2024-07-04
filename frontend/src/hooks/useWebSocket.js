import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';

export const useWebSocket = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector((state) => state.chat.currentChat);

    useEffect(() => {
        WebSocketService.connect(() => {
            console.log('Connected to WebSocket');
        });

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (currentChat) {
            console.log(`Subscribing to /group/${currentChat.id}`);
            WebSocketService.subscribe(`/group/${currentChat.id}`, (message) => {
                console.log('Received message via WebSocket:', message);
                dispatch({ type: 'ADD_MESSAGE', payload: message });
            });

            return () => {
                console.log(`Unsubscribing from /group/${currentChat.id}`);
                WebSocketService.unsubscribe(`/group/${currentChat.id}`);
            };
        }
    }, [currentChat, dispatch]);
};
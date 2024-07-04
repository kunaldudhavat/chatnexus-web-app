import { messageApi } from '../api/api';
import { handleApiError } from '../api/api';
import { updateChatLatestMessage } from './chatActions';

export const SET_MESSAGES = 'SET_MESSAGES';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export const fetchMessages = (chatId) => async (dispatch) => {
    try {
        const response = await messageApi.getMessages(chatId);
        dispatch({ type: SET_MESSAGES, payload: response.data });
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error fetching messages:', errorMessage);
    }
};

export const sendMessage = (data) => async (dispatch) => {
    try {
        const response = await messageApi.sendMessage(data);
        dispatch({ type: ADD_MESSAGE, payload: response.data });
        dispatch(updateChatLatestMessage(data.chatId, response.data));
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error sending message:', errorMessage);
    }
};

export const addMessage = (message) => (dispatch) => {
    dispatch({ type: ADD_MESSAGE, payload: message });
    dispatch(updateChatLatestMessage(message.chatId, message));
};
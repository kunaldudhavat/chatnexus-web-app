import { chatApi } from '../api/api';
import { handleApiError } from '../api/api';

export const SET_CHATS = 'SET_CHATS';
export const ADD_CHAT = 'ADD_CHAT';
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
export const UPDATE_CHAT_LATEST_MESSAGE = 'UPDATE_CHAT_LATEST_MESSAGE';
export const UPDATE_CHAT = 'UPDATE_CHAT';

export const fetchChats = () => async (dispatch, getState) => {
    try {
        const response = await chatApi.getUserChats();

        if (!Array.isArray(response.data)) {
            throw new Error('Invalid response format');
        }

        const currentUser = getState().auth.user;

        if (!currentUser) {
            console.error('Current user is not defined');
            return;
        }

        const chatsWithLatestMessages = response.data.map(chat => ({
            ...chat,
            isGroup: chat.group,
            chatName: chat.group ? (chat.chatName || 'Unnamed Group') : chat.users.find(user => user.id !== currentUser.id)?.name || 'User',
            latestMessage: chat.messages && chat.messages.length > 0
                ? { ...chat.messages[chat.messages.length - 1], timestamp: new Date(chat.messages[chat.messages.length - 1].timestamp) }
                : null
        }));

        dispatch({ type: SET_CHATS, payload: chatsWithLatestMessages });
        return chatsWithLatestMessages;
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error fetching chats:', errorMessage);
        throw error;
    }
};

export const createChat = (userId) => async (dispatch) => {
    try {
        const response = await chatApi.createChat(userId);
        const newChat = { ...response.data, latestMessage: null, isGroup: false };
        dispatch({ type: ADD_CHAT, payload: newChat });
        dispatch({ type: SET_CURRENT_CHAT, payload: newChat });
        return newChat;
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error creating chat:', errorMessage);
        throw error;
    }
};

export const createGroupChat = (groupData) => async (dispatch, getState) => {
    try {
        const currentUser = getState().auth.user;
        if (!currentUser) {
            throw new Error('Current user not found');
        }

        // Ensure the current user is included in the group
        const userIds = new Set([...groupData.userIds, currentUser.id]);

        const payload = {
            ...groupData,
            userIds: Array.from(userIds)
        };

        const response = await chatApi.createGroupChat(payload);
        const newGroupChat = {
            ...response.data,
            latestMessage: null,
            isGroup: true,
            chatName: groupData.chatName || response.data.chatName || 'Unnamed Group',
            chatImage: groupData.chatImage || response.data.chatImage,
            users: [
                currentUser,
                ...response.data.users.filter(user => user.id !== currentUser.id)
            ]
        };
        dispatch({ type: ADD_CHAT, payload: newGroupChat });
        dispatch({ type: SET_CURRENT_CHAT, payload: newGroupChat });
        return newGroupChat;
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error creating group chat:', errorMessage);
        throw error;
    }
};

export const setCurrentChat = (chatId) => async (dispatch, getState) => {
    try {
        const { chats } = getState().chat;
        let currentChat = chats.find(chat => chat.id === chatId);

        if (!currentChat) {
            const response = await chatApi.getChatById(chatId);
            currentChat = response.data;
        }

        dispatch({ type: SET_CURRENT_CHAT, payload: currentChat });
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error setting current chat:', errorMessage);
    }
};

export const updateChatLatestMessage = (chatId, message) => ({
    type: UPDATE_CHAT_LATEST_MESSAGE,
    payload: { chatId, message }
});

export const updateChat = (chatId, updatedData) => ({
    type: UPDATE_CHAT,
    payload: { chatId, updatedData }
});
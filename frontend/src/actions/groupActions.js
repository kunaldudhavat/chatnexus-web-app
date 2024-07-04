import { groupApi } from '../api/api';
import { handleApiError } from '../api/api';
import { SET_CHATS, SET_CURRENT_CHAT } from './chatActions';

export const FETCH_GROUP_PROFILE = 'FETCH_GROUP_PROFILE';
export const UPDATE_GROUP_PROFILE = 'UPDATE_GROUP_PROFILE';

export const fetchGroupProfile = (groupId) => async (dispatch) => {
    try {
        const response = await groupApi.getGroupProfile(groupId);
        dispatch({ type: FETCH_GROUP_PROFILE, payload: response.data });
    } catch (error) {
        console.error('Error fetching group profile:', error);
    }
};

export const updateGroupProfile = (groupId, data) => async (dispatch, getState) => {
    try {
        await groupApi.updateGroupProfile(groupId, data);
        const response = await groupApi.getGroupProfile(groupId);
        const updatedGroup = response.data;

        dispatch({ type: UPDATE_GROUP_PROFILE, payload: updatedGroup });

        // Update the chats and current chat in the Redux store
        const { chats, currentChat } = getState().chat;
        const updatedChats = chats.map(chat =>
            chat.id === groupId ? { ...chat, ...updatedGroup, isGroup: true } : chat
        );
        dispatch({ type: SET_CHATS, payload: updatedChats });

        if (currentChat && currentChat.id === groupId) {
            dispatch({ type: SET_CURRENT_CHAT, payload: { ...currentChat, ...updatedGroup, isGroup: true } });
        }
    } catch (error) {
        const errorMessage = handleApiError(error);
        console.error('Error updating group profile:', errorMessage);
        throw error;
    }
};

export const addUserToGroup = (groupId, userId) => async (dispatch) => {
    try {
        const response = await groupApi.addUserToGroup(groupId, userId);
        dispatch({ type: UPDATE_GROUP_PROFILE, payload: response.data });
    } catch (error) {
        console.error('Error adding user to group:', error);
    }
};

export const removeUserFromGroup = (groupId, userId) => async (dispatch) => {
    try {
        const response = await groupApi.removeUserFromGroup(groupId, userId);
        dispatch({ type: UPDATE_GROUP_PROFILE, payload: response.data });
    } catch (error) {
        console.error('Error removing user from group:', error);
    }
};
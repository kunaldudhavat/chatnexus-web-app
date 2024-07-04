import { userApi } from '../api/api';

export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';
export const FETCH_COMMON_GROUPS = 'FETCH_COMMON_GROUPS';

export const fetchUserProfile = (userId) => async (dispatch) => {
    try {
        const response = await userApi.getUserProfile(userId);
        dispatch({ type: FETCH_USER_PROFILE, payload: response.data });
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};

export const fetchCommonGroups = (userId) => async (dispatch) => {
    try {
        const response = await userApi.getCommonGroups(userId);
        dispatch({ type: FETCH_COMMON_GROUPS, payload: response.data });
    } catch (error) {
        console.error('Error fetching common groups:', error);
    }
};
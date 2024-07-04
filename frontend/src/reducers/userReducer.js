import { FETCH_USER_PROFILE, FETCH_COMMON_GROUPS } from '../actions/userActions';

const initialState = {
    userProfile: null,
    commonGroups: [],
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_PROFILE:
            return {
                ...state,
                userProfile: action.payload,
            };
        case FETCH_COMMON_GROUPS:
            return {
                ...state,
                commonGroups: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
import { FETCH_GROUP_PROFILE, UPDATE_GROUP_PROFILE } from '../actions/groupActions';

const initialState = {
    groupProfile: null,
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GROUP_PROFILE:
        case UPDATE_GROUP_PROFILE:
            return {
                ...state,
                groupProfile: action.payload,
            };
        default:
            return state;
    }
};

export default groupReducer;
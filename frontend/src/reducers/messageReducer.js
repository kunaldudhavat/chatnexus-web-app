import { SET_MESSAGES, ADD_MESSAGE } from '../actions/messageActions';

const initialState = {
    messages: [],
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MESSAGES:
            return { ...state, messages: action.payload };
        case ADD_MESSAGE:
            const messageExists = state.messages.some(msg => msg.id === action.payload.id);
            if (messageExists) {
                return state;
            }
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        default:
            return state;
    }
};

export default messageReducer;
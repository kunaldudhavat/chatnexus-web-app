import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from '../reducers/authReducer';
import chatReducer from '../reducers/chatReducer';
import messageReducer from "../reducers/messageReducer";
import searchReducer from "../reducers/searchReducer";
import userReducer from "../reducers/userReducer";
import groupReducer from "../reducers/groupReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    search: searchReducer,
    user: userReducer,
    group:  groupReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

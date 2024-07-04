const initialState = {
    results: [],
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SEARCH_RESULTS':
            return {
                ...state,
                results: action.payload,
            };
        default:
            return state;
    }
};

export default searchReducer;

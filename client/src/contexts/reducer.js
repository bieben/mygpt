export const initialState = {
    cart: [],
    user: null,
    conversations: [],
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user,
            };

        case 'SET_CONVERSATIONS':
            return {
                ...state,
                conversations: action.conversations,
            }
        case 'ADD_CONVERSATION':
            return {
                ...state,
                conversations: [action.conversation, ...state.conversations],
            };

        case 'DELETE_CONVERSATION':
            return {
                ...state,
                conversations: state.conversations.filter(conversation => conversation.id !== action.id),
            };

        default:
            return state;
    }
};

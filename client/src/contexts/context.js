import React, { useEffect, useReducer, createContext, useContext } from 'react';
import { auth } from '../firebase/firebaseConfig';

const StateContext = createContext();

export const initialState = {
    user: null,
    conversations: [],
    isAdmin: false,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user,
                isAdmin: action.user ? action.user.admin || false : false,
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

export const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const tokenResult = await authUser.getIdTokenResult();
                dispatch({
                    type: 'SET_USER',
                    user: {
                        uid: authUser.uid,
                        email: authUser.email,
                        admin: tokenResult.claims.admin,
                    },
                });
            } else {
                dispatch({
                    type: 'SET_USER',
                    user: null,
                });
            }
        });
    }, []);
    return (
        <StateContext.Provider value={[state, dispatch]}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);
import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  error: null
};

// Action types
const ADD_MESSAGE = 'ADD_MESSAGE';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const CREATE_CONVERSATION = 'CREATE_CONVERSATION';
const SELECT_CONVERSATION = 'SELECT_CONVERSATION';
const CLEAR_CONVERSATION = 'CLEAR_CONVERSATION';

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CREATE_CONVERSATION:
      const newConversation = {
        id: Date.now().toString(),
        title: `Conversation ${state.conversations.length + 1}`,
        timestamp: new Date().toISOString()
      };
      return {
        ...state,
        conversations: [...state.conversations, newConversation],
        currentConversationId: newConversation.id,
        messages: []
      };
    case SELECT_CONVERSATION:
      return {
        ...state,
        currentConversationId: action.payload,
        messages: [] // Ideally, we would load messages for the selected conversation
      };
    case CLEAR_CONVERSATION:
      return {
        ...state,
        messages: []
      };
    default:
      return state;
  }
};

// Create context
const ChatContext = createContext();

// Context provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Actions
  const addMessage = (message) => {
    dispatch({ type: ADD_MESSAGE, payload: message });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: SET_ERROR, payload: error });
  };

  const createConversation = () => {
    dispatch({ type: CREATE_CONVERSATION });
  };

  const selectConversation = (conversationId) => {
    dispatch({ type: SELECT_CONVERSATION, payload: conversationId });
  };

  const clearConversation = () => {
    dispatch({ type: CLEAR_CONVERSATION });
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        addMessage,
        setLoading,
        setError,
        createConversation,
        selectConversation,
        clearConversation
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
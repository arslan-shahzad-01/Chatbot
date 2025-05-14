import { useState, useCallback } from 'react';
import { useChat } from '../context/ChatContext';
import { sendMessage, streamMessage } from '../utils/api';

export const useMessageHandler = () => {
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { 
    messages, 
    addMessage, 
    setLoading, 
    setError, 
    currentConversationId 
  } = useChat();
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Send message with streaming response
  const handleSendMessageStreaming = useCallback(async () => {
    if (!inputValue.trim() || isStreaming) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
    };
    
    // Add user message to the chat
    addMessage(userMessage);
    setInputValue('');
    
    // Create a temporary bot message that will be updated during streaming
    const botMessageId = Date.now().toString() + '-bot';
    const botMessage = {
      id: botMessageId,
      content: '',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
      isStreaming: true
    };
    
    addMessage(botMessage);
    setIsStreaming(true);
    
    try {
      let accumulatedResponse = '';
      
      // Stream the response
      await streamMessage([...messages, userMessage], (chunk) => {
        accumulatedResponse += chunk;
        
        addMessage({
          ...botMessage,
          content: accumulatedResponse,
          isStreaming: true
        });
      });
      
      // Complete the streaming
      addMessage({
        ...botMessage,
        content: accumulatedResponse,
        isStreaming: false
      });
      
      setIsStreaming(false);
    } catch (error) {
      setError(error.message);
      setIsStreaming(false);
      
      // Update the bot message to show error
      addMessage({
        ...botMessage,
        content: 'Sorry, I encountered an error. Please try again.',
        isError: true,
        isStreaming: false
      });
    }
  }, [inputValue, isStreaming, messages, addMessage, setError, currentConversationId]);
  
  // Send message without streaming
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
    };
    
    // Add user message to the chat
    addMessage(userMessage);
    setInputValue('');
    
    // Set loading state
    setLoading(true);
    
    try {
      // Get all messages for context
      const allMessages = [...messages, userMessage];
      
      // Send the message to API
      const response = await sendMessage(allMessages);
      
      // Add the bot's response to the chat
      const botMessage = {
        id: Date.now().toString() + '-bot',
        content: response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        conversationId: currentConversationId,
      };
      
      addMessage(botMessage);
    } catch (error) {
      setError(error.message);
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString() + '-error',
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        conversationId: currentConversationId,
        isError: true
      };
      
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [inputValue, messages, addMessage, setLoading, setError, currentConversationId]);
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Using streaming by default
      handleSendMessageStreaming();
    }
  };
  
  return {
    inputValue,
    setInputValue,
    handleInputChange,
    handleSendMessage,
    handleSendMessageStreaming,
    handleKeyPress,
    isStreaming
  };
};
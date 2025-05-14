import React, { useEffect, useRef } from 'react';
import Message from './Message';
import InputArea from './InputArea';
import { useChat } from '../context/ChatContext';
import './ChatWindow.css';

const ChatWindow = () => {
  const { messages, isLoading, error, createConversation, currentConversationId } = useChat();
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start a new conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      createConversation();
    }
  }, [currentConversationId, createConversation]);

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <h2>Welcome to ChatBot!</h2>
              <p>Start a conversation by typing a message below.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}

        {isLoading && !messages.some(msg => msg.isStreaming) && (
          <div className="loading-indicator">
            <div className="dot-pulse"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <InputArea />
    </div>
  );
};

export default ChatWindow;
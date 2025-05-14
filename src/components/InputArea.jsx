import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useMessageHandler } from '../hooks/useChat';
import './InputArea.css';

const InputArea = () => {
  const {
    inputValue,
    handleInputChange,
    handleSendMessageStreaming,
    handleKeyPress,
    isStreaming
  } = useMessageHandler();

  return (
    <div className="input-area">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSendMessageStreaming();
      }}>
        <textarea
          className="message-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={isStreaming}
          rows={1}
        />
        <button
          type="submit"
          className={`send-button ${!inputValue.trim() || isStreaming ? 'disabled' : ''}`}
          disabled={!inputValue.trim() || isStreaming}
        >
          <FaPaperPlane />
        </button>
      </form>
      <div className="input-info">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default InputArea;
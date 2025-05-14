import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
import CodeBlock from './CodeBlock';
import { extractCodeBlocks, parseMarkdown } from '../utils/formatters';
import './Message.css';

const Message = ({ message }) => {
  const { sender, content, timestamp, isStreaming, isError } = message;
  
  // Process the message content to extract code blocks and parse markdown
  const renderMessageContent = () => {
    if (!content) return null;

    // Extract code blocks
    const { text, codeBlocks } = extractCodeBlocks(content);
    
    // Parse the remaining text for markdown
    const parts = text.split(/(\[CODE_BLOCK_\d+\])/);
    
    return (
      <div className="message-text">
        {parts.map((part, i) => {
          // Check if this part is a code block placeholder
          const codeBlockMatch = part.match(/\[CODE_BLOCK_(\d+)\]/);
          
          if (codeBlockMatch) {
            const index = parseInt(codeBlockMatch[1], 10);
            const { language, code } = codeBlocks[index];
            return <CodeBlock key={i} language={language} code={code} />;
          }
          
          // Otherwise, parse markdown
          return (
            <div 
              key={i} 
              dangerouslySetInnerHTML={{ __html: parseMarkdown(part) }} 
            />
          );
        })}
        
        {isStreaming && (
          <span className="cursor-blink">|</span>
        )}
      </div>
    );
  };

  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'bot-message'} ${isError ? 'error' : ''}`}>
      <div className="message-icon">
        {sender === 'user' ? <FaUser /> : <FaRobot />}
      </div>

      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {sender === 'user' ? 'You' : 'ChatBot'}
          </span>
          <span className="message-time">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>

        {renderMessageContent()}
      </div>
    </div>
  );
};

export default Message;
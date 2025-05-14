import React from 'react';
import { FaPlus, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useChat } from '../context/ChatContext';
import { truncateMessage, formatTimestamp } from '../utils/formatters';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { 
    conversations, 
    currentConversationId, 
    createConversation, 
    selectConversation, 
    clearConversation 
  } = useChat();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : 'closed'}`} 
        onClick={toggleSidebar}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={createConversation}>
            <FaPlus /> New Chat
          </button>
        </div>

        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="no-conversations">
              No conversations yet. Start a new chat!
            </div>
          ) : (
            conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={`conversation-item ${conversation.id === currentConversationId ? 'active' : ''}`}
                onClick={() => selectConversation(conversation.id)}
              >
                <div className="conversation-details">
                  <span className="conversation-title">{conversation.title}</span>
                  <span className="conversation-preview">
                    {truncateMessage(conversation.title)}
                  </span>
                  <span className="conversation-time">
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>
                <button 
                  className="clear-conversation-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearConversation();
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
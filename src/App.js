import React from 'react';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Sidebar />
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import './CodeBlock.css';

const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        {language && <span className="code-language">{language}</span>}
        <button 
          className="copy-button"
          onClick={handleCopyCode}
          aria-label="Copy code"
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>
      <pre className={`language-${language || 'plaintext'}`}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
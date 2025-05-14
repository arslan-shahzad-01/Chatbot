// Helper functions for formatting text and handling code blocks

// Extract code blocks from markdown
export const extractCodeBlocks = (text) => {
  const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  let lastIndex = 0;
  let result = '';

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before the code block
    result += text.substring(lastIndex, match.index);
    
    // Store code block information
    const language = match[1] || 'plaintext';
    const code = match[2];
    
    // Add a placeholder for the code block
    const placeholder = `[CODE_BLOCK_${blocks.length}]`;
    result += placeholder;
    
    blocks.push({ language, code });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  result += text.substring(lastIndex);
  
  return { text: result, codeBlocks: blocks };
};

// Format timestamps
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Parse markdown (simplified version - real implementation would use a markdown library)
export const parseMarkdown = (text) => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Headers (h1, h2, h3)
  text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Lists
  text = text.replace(/^\s*\* (.*$)/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Ordered lists
  text = text.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
  
  // Line breaks
  text = text.replace(/\n/g, '<br />');
  
  return text;
};

// Truncate long message previews
export const truncateMessage = (message, maxLength = 50) => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};
import axios from 'axios';

// You would typically store this in an environment variable
const API_KEY = 'your_openai_api_key'; // Replace with your actual key

const apiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

// Standard fetch approach
export const sendMessage = async (messages) => {
  try {
    const response = await apiClient.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      temperature: 0.7
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to get response from API');
  }
};

// Stream response (for streaming mode)
export const streamMessage = async (messages, onChunk) => {
  try {
    const response = await apiClient.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      temperature: 0.7,
      stream: true
    }, {
      responseType: 'stream'
    });
    
    const reader = response.data.getReader();
    const decoder = new TextDecoder('utf-8');
    
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const parsedData = JSON.parse(data);
            const content = parsedData.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing chunk', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('API Streaming Error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to stream response from API');
  }
};

// Alternative API implementations
// Uncomment and modify as needed for your chosen API

/*
// Hugging Face Inference API
export const sendMessageHuggingFace = async (message) => {
  const HF_API_KEY = 'your_huggingface_api_key';
  
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      { inputs: message },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.generated_text;
  } catch (error) {
    console.error('HuggingFace API Error:', error);
    throw new Error('Failed to get response from Hugging Face API');
  }
};

// Ollama (local) API
export const sendMessageOllama = async (message) => {
  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama3',
        prompt: message,
        stream: false
      }
    );
    
    return response.data.response;
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw new Error('Failed to get response from Ollama API');
  }
};

// DeepSeek API
export const sendMessageDeepSeek = async (message) => {
  const DEEPSEEK_API_KEY = 'your_deepseek_api_key';
  
  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: message }]
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw new Error('Failed to get response from DeepSeek API');
  }
};
*/
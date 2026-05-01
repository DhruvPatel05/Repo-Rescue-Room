import { useState, useRef, useEffect } from 'react';
import './BobChat.css';

function BobChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm Bob, your AI coding assistant. Ask me anything about your repository issues, errors, or dependencies!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate Bob's response
    setTimeout(() => {
      const botResponse = getBobResponse(inputValue);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const getBobResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('sql injection') || lowerQuestion.includes('security')) {
      return "SQL injection occurs when user input is directly concatenated into SQL queries. To fix this:\n\n1. Use parameterized queries or prepared statements\n2. Sanitize all user inputs\n3. Use an ORM that handles escaping\n4. Never trust user input\n\nI've identified this issue in your login.js file and can fix it for you!";
    }
    
    if (lowerQuestion.includes('dependency') || lowerQuestion.includes('package')) {
      return "Dependency issues can cause security vulnerabilities and compatibility problems. I recommend:\n\n1. Run 'npm audit' to check for vulnerabilities\n2. Update packages with 'npm update'\n3. Check for breaking changes in major version updates\n4. Use 'npm outdated' to see what needs updating\n\nWould you like me to analyze your package.json?";
    }
    
    if (lowerQuestion.includes('performance') || lowerQuestion.includes('slow')) {
      return "Performance issues often come from:\n\n1. Inefficient algorithms (O(n²) complexity)\n2. Memory leaks from uncleaned event listeners\n3. Large bundle sizes\n4. Unnecessary re-renders in React\n5. Blocking operations on the main thread\n\nI can help optimize your code. Which file is causing performance issues?";
    }
    
    if (lowerQuestion.includes('error') || lowerQuestion.includes('bug')) {
      return "I can help debug that! To better assist you:\n\n1. Share the error message\n2. Tell me which file it's in\n3. Describe what you were trying to do\n4. Let me know if it's consistent or intermittent\n\nI'll analyze the code and suggest a fix!";
    }
    
    if (lowerQuestion.includes('thank') || lowerQuestion.includes('thanks')) {
      return "You're welcome! I'm here to help rescue your repository. Feel free to ask me anything else! 🚀";
    }
    
    return "I understand you're asking about: \"" + question + "\"\n\nI can help with:\n• Explaining errors and bugs\n• Fixing security vulnerabilities\n• Optimizing performance\n• Updating dependencies\n• Code quality improvements\n\nCould you provide more details about what you'd like to know?";
  };
  
  const quickQuestions = [
    "What does this error mean?",
    "Why is this dependency broken?",
    "How do I fix the SQL injection?",
    "What's causing the performance issue?",
  ];
  
  const handleQuickQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };
  
  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#x-close-icon"></use>
          </svg>
        ) : (
          <>
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#message-circle-icon"></use>
            </svg>
            <span className="chat-badge">Ask Bob</span>
          </>
        )}
      </button>
      
      {/* Chat Panel */}
      <div className={`bob-chat ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="bob-avatar">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#code-icon"></use>
              </svg>
            </div>
            <div className="chat-header-text">
              <h3>Bob Assistant</h3>
              <span className="status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              {message.type === 'bot' && (
                <div className="message-avatar">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#code-icon"></use>
                  </svg>
                </div>
              )}
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot typing">
              <div className="message-avatar">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#code-icon"></use>
                </svg>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {messages.length === 1 && (
          <div className="quick-questions">
            <p className="quick-questions-label">Quick questions:</p>
            <div className="quick-questions-grid">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Ask Bob anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#send-icon"></use>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

export default BobChat;

// Made with Bob

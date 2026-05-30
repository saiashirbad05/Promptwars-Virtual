import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minus, Maximize2, RefreshCw, Languages, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: string[];
}

const SUGGESTED_PROMPTS = [
  "How do I register to vote?",
  "When is the next polling phase?",
  "What is the Model Code of Conduct?",
  "How to find my polling booth?",
  "Voter ID correction process"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! I am your ECI AI Assistant powered by Gemini. How can I help you navigate the 2026 Elections today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Map history to Gemini format
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date(),
        sources: ["Official ECI Data", "Gemini 1.5 Flash"]
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  return (
    <div className="chatbot-wrapper">
      <motion.button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="chatbot-badge">ECI AI</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`chatbot-panel ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="chatbot-header">
              <div className="header-info">
                <div className="ai-avatar">ECI</div>
                <div>
                  <div className="ai-name">Bharat Nirwachan AI</div>
                  <div className="ai-status">Online • Powered by Gemini</div>
                </div>
              </div>
              <div className="header-actions">
                <button onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')} className="icon-btn">
                  <Languages size={18} />
                </button>
                <button onClick={() => setIsMinimized(!isMinimized)} className="icon-btn">
                  {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
                </button>
                <button onClick={toggleChat} className="icon-btn">
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="chatbot-messages" ref={scrollRef}>
                  <div className="welcome-banner">
                    <Info size={14} />
                    <span>Official ECI Assistant (Gemini v1.5)</span>
                  </div>
                  
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                      <div className="message-bubble">
                        {msg.text}
                        {msg.sources && (
                          <div className="message-sources">
                            {msg.sources.map(s => <span key={s} className="source-pill">{s}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="message-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="message-row ai">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="chatbot-suggestions">
                  <div className="suggestions-scroll">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button 
                        key={prompt} 
                        className="suggestion-chip"
                        onClick={() => handleSend(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <form 
                  className="chatbot-input-area"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                >
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask ECI Assistant..."
                    className="chat-input"
                  />
                  <button type="button" className="icon-btn" onClick={() => setMessages([messages[0]])}>
                    <RefreshCw size={18} />
                  </button>
                  <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

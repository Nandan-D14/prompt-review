import React, { useState } from 'react';
import { Mic, Paperclip, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm the Prompt Professor. Submit a prompt, and I'll analyze its structure, safety, and clarity for you. Let's get started!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've analyzed your prompt. It seems to contain some risky phrases and unprofessional language. I've highlighted the issues and provided a safer alternative in the analysis panel.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700/50 light:border-gray-300/50 flex-shrink-0">
        <span className="font-semibold px-3 py-1 rounded-full text-sm bg-indigo-500/30 text-indigo-200 light:text-indigo-700">
          🎓 Prompt Professor
        </span>
        <span className="text-sm text-gray-400 ml-2">Guiding you to better prompts.</span>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' ? (
                <>
                  <div className="p-2 bg-indigo-500 rounded-full h-fit flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-white rounded-sm" />
                  </div>
                  <div className="max-w-md">
                    <div className="glass-panel p-4 rounded-xl rounded-bl-none">
                      <p className="text-base">{message.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-800/40 light:bg-gray-200/40 rounded">
                      <b>Analysis:</b> Detected high-risk phrase & slang. Score: 42. Suggesting rewrite.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="group relative">
                    <div className="glass-panel p-4 rounded-xl rounded-br-none bg-indigo-500/20 border-indigo-500/50">
                      <p className="text-base">{message.content}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    U
                  </div>
                </>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="p-2 bg-indigo-500 rounded-full h-fit flex-shrink-0 mt-1">
                <div className="w-5 h-5 bg-white rounded-sm" />
              </div>
              <div className="glass-panel p-4 rounded-xl rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t border-gray-700/50 light:border-gray-300/50 flex-shrink-0">
        <div className="glass-panel p-2 rounded-xl">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-transparent dark:text-white light:text-black placeholder-gray-400 text-base resize-none focus:outline-none p-2"
            rows={2}
            placeholder="Enter your prompt..."
          />
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50 transition-colors">
                <Mic className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50 transition-colors">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

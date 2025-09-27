import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, Code, Palette, MessageCircle, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

interface RecommendedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: React.ReactNode;
}

const RECOMMENDED_PROMPTS: RecommendedPrompt[] = [
  {
    id: '1',
    title: 'Creative Writing',
    prompt: 'Write a creative short story about a robot learning human emotions',
    category: 'Creative',
    icon: <Palette className="w-4 h-4" />
  },
  {
    id: '2', 
    title: 'Educational Content',
    prompt: 'Explain quantum physics concepts in simple terms for high school students',
    category: 'Education',
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: '3',
    title: 'Code Review',
    prompt: 'Review this Python code for best practices and suggest improvements',
    category: 'Programming',
    icon: <Code className="w-4 h-4" />
  },
  {
    id: '4',
    title: 'Business Analysis',
    prompt: 'Analyze the pros and cons of remote work for tech companies',
    category: 'Business',
    icon: <Brain className="w-4 h-4" />
  },
  {
    id: '5',
    title: 'Learning Guide',
    prompt: 'Create a step-by-step learning plan for mastering machine learning',
    category: 'Education',
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    id: '6',
    title: 'Professional Communication',
    prompt: 'Help me write a professional email to propose a new project to my manager',
    category: 'Communication',
    icon: <MessageCircle className="w-4 h-4" />
  }
];

interface RecommendedPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

export const RecommendedPrompts: React.FC<RecommendedPromptsProps> = ({ onPromptSelect }) => {
  const { analysis } = useAnalysis();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Show recommended prompts when there's no analysis or when content was blocked
  const shouldShow = !analysis || analysis.verdict === 'BLOCK';

  if (!shouldShow) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 border-t border-gray-700/50 light:border-gray-300/50 flex-shrink-0"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-semibold text-gray-300 light:text-gray-700">
            {analysis?.verdict === 'BLOCK' ? 'Try these appropriate prompts instead:' : 'Recommended Prompts:'}
          </h3>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-gray-700/50 light:hover:bg-gray-300/50 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 scroll-smooth">
          {RECOMMENDED_PROMPTS.map((rec, index) => (
          <motion.button
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPromptSelect(rec.prompt)}
            className="text-left p-3 rounded-lg glass-panel hover:bg-indigo-500/10 transition-colors group flex-shrink-0 w-64 min-w-64 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-full bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500/30 transition-colors flex-shrink-0">
                {rec.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white light:text-black truncate">
                    {rec.title}
                  </h4>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-600/50 text-gray-300 light:bg-gray-300/50 light:text-gray-700 flex-shrink-0">
                    {rec.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 light:text-gray-600 overflow-hidden"
                   style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical' as const
                   }}>
                  {rec.prompt}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
        </div>
      )}
      
      {analysis?.verdict === 'BLOCK' && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30">
          <p className="text-sm text-red-300 light:text-red-700">
            ⚠️ Your previous prompt contained inappropriate content. Please use professional, educational, or creative prompts instead.
          </p>
        </div>
      )}
    </motion.div>
  );
};

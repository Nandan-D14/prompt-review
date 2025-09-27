import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Star, Sparkles, RefreshCw, Brain, Check } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

export const AnalysisPanel: React.FC = () => {
  const { analysis, isLoading, error, applyRewrite } = useAnalysis();
  const [rewriteSuccess, setRewriteSuccess] = useState<string | null>(null);

  const handleRewrite = async (mode: 'normal' | 'rap' | 'poem' | 'meme' = 'normal') => {
    if (!analysis) return;
    
    try {
      let rewrittenText = analysis.suggested_rewrite;
      
      if (mode !== 'normal') {
        // For fun modes, create simple variations of the safe rewrite
        const baseRewrite = analysis.suggested_rewrite;
        
        switch (mode) {
          case 'rap':
            rewrittenText = `Yo, could you break down ${baseRewrite.toLowerCase().replace('could you help me', '').replace('?', '')} in a fresh way?`;
            break;
          case 'poem':
            rewrittenText = `Please explain with eloquence and grace, ${baseRewrite.toLowerCase().replace('could you help me', '').replace('?', '')}, in this academic space.`;
            break;
          case 'meme':
            rewrittenText = `Help me understand ${baseRewrite.toLowerCase().replace('could you help me', '').replace('?', '')} - make it clear and fun! 😊`;
            break;
          default:
            rewrittenText = baseRewrite;
        }
      }
      
      // Apply the rewrite to the input field
      applyRewrite(rewrittenText);
      
      // Show success feedback
      setRewriteSuccess(mode === 'normal' ? 'Rewrite applied!' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} version applied!`);
      setTimeout(() => setRewriteSuccess(null), 3000); // Clear after 3 seconds
      
      console.log(`${mode} rewrite applied successfully:`, rewrittenText);
    } catch (error) {
      console.error('Rewrite failed:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl shadow-xl text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your prompt...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl shadow-xl text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Analysis Failed</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!analysis) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-8 rounded-2xl shadow-xl text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No Analysis Yet</p>
          <p className="text-gray-500 text-sm">Submit a prompt to see the analysis</p>
        </div>
      </div>
    );
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'ALLOW':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'NEEDS_FIX':
        return <AlertTriangle className="w-8 h-8 text-amber-400" />;
      case 'BLOCK':
        return <XCircle className="w-8 h-8 text-red-400" />;
      default:
        return null;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'ALLOW':
        return 'text-green-400';
      case 'NEEDS_FIX':
        return 'text-amber-400';
      case 'BLOCK':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const costarColors = {
    context: 'bg-sky-500/20 text-sky-300 light:text-sky-700',
    objective: 'bg-teal-500/20 text-teal-300 light:text-teal-700',
    style: 'bg-fuchsia-500/20 text-fuchsia-300 light:text-fuchsia-700',
    tone: 'bg-purple-500/20 text-purple-300 light:text-purple-700',
    audience: 'bg-orange-500/20 text-orange-300 light:text-orange-700',
    response: 'bg-pink-500/20 text-pink-300 light:text-pink-700',
  };

  return (
    <div className="space-y-6">
      {/* Verdict Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-2xl shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-${analysis.verdict === 'ALLOW' ? 'green' : analysis.verdict === 'NEEDS_FIX' ? 'amber' : 'red'}-500/20`}>
            {getVerdictIcon(analysis.verdict)}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${getVerdictColor(analysis.verdict)}`}>
              {analysis.verdict.replace('_', ' ')}
            </h3>
            <p className="text-xs text-gray-400">
              {analysis.verdict === 'ALLOW' ? 'Prompt is safe to use' : 
               analysis.verdict === 'NEEDS_FIX' ? 'Prompt has moderate issues' : 
               'Prompt contains critical issues'}
            </p>
          </div>
          <div className="ml-auto text-center">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}
            </div>
            <div className="text-xs font-semibold text-gray-500">Health Score</div>
          </div>
        </div>
        
        {/* Score visualization */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(analysis.score / 20)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* COSTAR Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-5 rounded-2xl shadow-xl"
      >
        <h3 className="text-lg font-bold mb-3 dark:text-white light:text-black">
          COSTAR Breakdown
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(analysis.costar).map(([key, value]) => (
            <span
              key={key}
              className={`font-semibold text-sm px-3 py-1 rounded-full ${
                costarColors[key.toLowerCase() as keyof typeof costarColors] || 'bg-gray-500/20 text-gray-300'
              }`}
            >
              {key}: {value}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Safety Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-5 rounded-2xl shadow-xl"
      >
        <h3 className="text-lg font-bold mb-3 dark:text-white light:text-black">
          Safety Log
        </h3>
        <ul className="space-y-2 text-sm">
          {analysis.reasons.map((reason, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-gray-300">{reason}</span>
            </li>
          ))}
          {analysis.highlights.map((highlight, index) => (
            <li key={`highlight-${index}`} className="flex items-start">
              <span className="mr-2">⚠️</span>
              <span className="text-gray-300">
                {highlight.type}: {highlight.token || highlight.reason || JSON.stringify(highlight.match)}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-5 rounded-2xl shadow-xl"
      >
        <h3 className="text-lg font-bold mb-3 dark:text-white light:text-black">
          One-Click Rewrite
        </h3>
        <p className="text-sm p-3 rounded-lg bg-gray-800/50 light:bg-gray-200/50 font-mono">
          {analysis.suggested_rewrite}
        </p>
        <button 
          onClick={() => handleRewrite('normal')}
          className="mt-4 w-full bg-indigo-600/80 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Use Fixed Version
        </button>
        
        {/* Success feedback */}
        {rewriteSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-2 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{rewriteSuccess}</span>
          </motion.div>
        )}
        
        {/* Fun mode toggle */}
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => handleRewrite('rap')}
            className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Rap Mode
          </button>
          <button 
            onClick={() => handleRewrite('poem')}
            className="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition-colors"
          >
            Poem Mode
          </button>
          <button 
            onClick={() => handleRewrite('meme')}
            className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors"
          >
            Meme Mode
          </button>
        </div>
      </motion.div>

      {/* History Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-5 rounded-2xl shadow-xl"
      >
        <h3 className="text-lg font-bold mb-3 dark:text-white light:text-black">
          Recent History
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/30 light:bg-gray-200/30">
            <span className="truncate">"Previous analysis..."</span>
            <span className="text-amber-400 text-xs">{analysis.score}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

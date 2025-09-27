import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

export const ToastNotification: React.FC = () => {
  const { analysis } = useAnalysis();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (analysis?.verdict === 'BLOCK') {
      // Create more specific messages based on the type of issues detected
      const highlights = analysis.highlights || [];
      const hasExplicit = highlights.some(h => h.type === 'explicit');
      const hasHarmful = highlights.some(h => h.type === 'harmful');
      const hasInjection = highlights.some(h => h.type === 'injection');
      
      let message = '⚠️ Your prompt was blocked. ';
      
      if (hasExplicit) {
        message += 'It contained explicit or sexual content. ';
      } else if (hasHarmful) {
        message += 'It contained harmful or violent content. ';
      } else if (hasInjection) {
        message += 'It appeared to be a system manipulation attempt. ';
      } else {
        message += 'It contained inappropriate language. ';
      }
      
      message += 'Please use professional, educational, or creative prompts instead.';
      
      setToastMessage(message);
      setShowToast(true);
      
      // Auto-hide after 10 seconds for blocked content
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [analysis]);

  const handleClose = () => {
    setShowToast(false);
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="glass-panel p-4 rounded-lg bg-red-900/20 border border-red-500/50 shadow-lg backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-red-300 light:text-red-700 leading-relaxed">
                  {toastMessage}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-red-800/30 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4 text-red-400 hover:text-red-300" />
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-1 bg-red-500/30 rounded-full mt-3"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-red-400 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

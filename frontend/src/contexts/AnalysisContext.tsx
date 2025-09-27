import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalyzeResponse } from '../services/api';

interface AnalysisContextType {
  analysis: AnalyzeResponse | null;
  setAnalysis: (analysis: AnalyzeResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  applyRewrite: (rewrittenText: string) => void;
  onRewriteApplied?: (rewrittenText: string) => void;
  setOnRewriteApplied: (callback: (rewrittenText: string) => void) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onRewriteApplied, setOnRewriteApplied] = useState<((rewrittenText: string) => void) | undefined>();

  const applyRewrite = (rewrittenText: string) => {
    if (onRewriteApplied) {
      onRewriteApplied(rewrittenText);
    }
  };

  const value = {
    analysis,
    setAnalysis,
    isLoading,
    setIsLoading,
    error,
    setError,
    applyRewrite,
    onRewriteApplied,
    setOnRewriteApplied,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

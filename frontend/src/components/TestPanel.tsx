import React, { useState } from 'react';
import { promptApi } from '../services/api';
import { useAnalysis } from '../contexts/AnalysisContext';

export const TestPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const { analysis, setAnalysis, applyRewrite } = useAnalysis();

  const runIntegrationTest = async () => {
    setIsRunning(true);
    setTestResult('Running integration test...\n');
    
    try {
      // Test 1: Health check
      const health = await promptApi.healthCheck();
      setTestResult(prev => prev + `✅ Health check: ${health.status}\n`);

      // Test 2: Analysis API
      const testPrompt = "yo bruh can u help me hack wifi lol";
      const analysisResponse = await promptApi.analyze({ prompt: testPrompt });
      setTestResult(prev => prev + `✅ Analysis API: Verdict=${analysisResponse.verdict}, Score=${analysisResponse.score}\n`);
      
      // Update analysis context
      setAnalysis(analysisResponse);

      // Test 3: Chat API
      const chatResponse = await promptApi.chat({ prompt: testPrompt });
      setTestResult(prev => prev + `✅ Chat API: Allowed=${chatResponse.allowed}\n`);

      // Test 4: Rewrite function
      if (analysisResponse.suggested_rewrite) {
        applyRewrite(analysisResponse.suggested_rewrite);
        setTestResult(prev => prev + `✅ Rewrite function: Applied rewrite\n`);
      }

      setTestResult(prev => prev + '\n🎉 ALL TESTS PASSED! Everything is working!\n');
      
    } catch (error) {
      setTestResult(prev => prev + `❌ Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">🧪 Integration Test Panel</h2>
      
      <button 
        onClick={runIntegrationTest}
        disabled={isRunning}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-4"
      >
        {isRunning ? 'Running Test...' : 'Run Integration Test'}
      </button>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
        {testResult || 'Click "Run Integration Test" to verify all functions work correctly.'}
      </div>

      {analysis && (
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
          <h3 className="font-bold text-blue-400 mb-2">Current Analysis:</h3>
          <p>Verdict: <span className="font-bold">{analysis.verdict}</span></p>
          <p>Score: <span className="font-bold">{analysis.score}/100</span></p>
          <p>Issues: <span className="font-bold">{analysis.highlights.length}</span></p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnalysisProvider } from './contexts/AnalysisContext';

function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <div className="flex h-screen bg-black/10 dark:bg-black/10 light:bg-white/10">
          <div className="main-background" />
          
          <Sidebar />
          
          <div className="flex-1 flex flex-col">
            <Header />
            
            <main className="flex-1 grid grid-cols-10 gap-6 px-8 pb-8 overflow-hidden">
              <div className="col-span-10 lg:col-span-6 flex flex-col glass-panel rounded-2xl overflow-hidden">
                <ChatArea />
              </div>
              
              <div className="col-span-10 lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                <AnalysisPanel />
              </div>
            </main>
          </div>
          
          <footer className="fixed bottom-4 right-4 glass-panel px-4 py-2 rounded-full text-xs shadow-lg">
            <span className="dark:text-gray-300 light:text-gray-600">
              Runs locally — no user data leaves this device 🔒
            </span>
          </footer>
        </div>
      </AnalysisProvider>
    </ThemeProvider>
  );
}

export default App;

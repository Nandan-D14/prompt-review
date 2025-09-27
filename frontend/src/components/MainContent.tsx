import React from 'react';
import { useApp } from '../contexts/AppContext';
import { ChatArea } from './ChatArea';
import { AnalysisPanel } from './AnalysisPanel';
import { HistoryPage } from '../pages/HistoryPage';
import { ExportsPage } from '../pages/ExportsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const MainContent: React.FC = () => {
  const { activePage } = useApp();

  const renderContent = () => {
    switch (activePage) {
      case 'chat':
        return (
          <main className="flex-1 grid grid-cols-10 gap-6 px-8 pb-8 overflow-hidden">
            <div className="col-span-10 lg:col-span-6 flex flex-col glass-panel rounded-2xl overflow-hidden">
              <ChatArea />
            </div>
            
            <div className="col-span-10 lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              <AnalysisPanel />
            </div>
          </main>
        );
      
      case 'history':
        return (
          <main className="flex-1 overflow-hidden">
            <div className="h-full glass-panel rounded-2xl mx-8 mb-8 overflow-hidden">
              <HistoryPage />
            </div>
          </main>
        );
      
      case 'exports':
        return (
          <main className="flex-1 overflow-hidden">
            <div className="h-full glass-panel rounded-2xl mx-8 mb-8 overflow-hidden">
              <ExportsPage />
            </div>
          </main>
        );
      
      case 'settings':
        return (
          <main className="flex-1 overflow-hidden">
            <div className="h-full glass-panel rounded-2xl mx-8 mb-8 overflow-hidden">
              <SettingsPage />
            </div>
          </main>
        );
      
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

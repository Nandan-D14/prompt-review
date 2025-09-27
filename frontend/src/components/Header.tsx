import React from 'react';
import { Moon, Sun, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex-shrink-0 h-20 flex items-center justify-between px-8">
      <h1 className="text-2xl font-extrabold tracking-tight dark:text-white light:text-black">
        Prompt Review Engine
      </h1>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full dark:bg-gray-800/50 light:bg-gray-200/50 dark:hover:bg-gray-700 light:hover:bg-gray-300 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
        </button>
        
        <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-500 transition-all transform hover:scale-105 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>
    </header>
  );
};

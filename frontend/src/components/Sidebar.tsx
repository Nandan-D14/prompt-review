import React, { useState } from 'react';
import { Shield, BookOpen, Building2, History, Download, Settings, Menu } from 'lucide-react';

const personas = [
  { id: 'professor', name: 'Prompt Professor', icon: '🎓', description: 'Guiding you to better prompts' },
  { id: 'guardian', name: 'Brand Guardian', icon: '🏢', description: 'Protecting brand voice and tone' },
  { id: 'shield', name: 'Prompt Shield', icon: '🛡️', description: 'Advanced security and safety' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePersona, setActivePersona] = useState('professor');

  return (
    <aside 
      className={`${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} glass-panel flex-shrink-0 flex flex-col p-4 transition-all duration-300`}
    >
      <div className="flex items-center justify-between flex-shrink-0 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <Shield className="text-indigo-400 flex-shrink-0 w-8 h-8" />
          {!isCollapsed && (
            <span className="text-xl font-bold dark:text-white light:text-black sidebar-label">
              PromptGuard
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <nav className="mt-8 flex flex-col gap-2 flex-1">
        {!isCollapsed && (
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2 sidebar-label">
            Personas
          </p>
        )}
        
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setActivePersona(persona.id)}
            className={`persona-btn flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 w-full text-left ${
              activePersona === persona.id
                ? 'bg-indigo-500/30 shadow-lg dark:text-white light:text-black'
                : 'dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{persona.icon}</span>
            {!isCollapsed && (
              <span className="font-semibold sidebar-label">{persona.name}</span>
            )}
          </button>
        ))}
        
        {!isCollapsed && <hr className="my-6 border-gray-700/50 light:border-gray-300/50" />}
        
        {[
          { icon: History, label: 'History' },
          { icon: Download, label: 'Exports' },
          { icon: Settings, label: 'Settings' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 w-full text-left dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50"
          >
            <Icon className="w-6 h-6 text-gray-400 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-semibold sidebar-label">{label}</span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto flex-shrink-0 flex items-center gap-4 p-2 rounded-lg dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          U
        </div>
        {!isCollapsed && (
          <div className="sidebar-label">
            <p className="font-semibold dark:text-white light:text-black">User</p>
            <p className="text-xs text-gray-400">user@email.com</p>
          </div>
        )}
      </div>
    </aside>
  );
};

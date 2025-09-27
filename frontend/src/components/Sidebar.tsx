import React from 'react';
import { Shield, History, Download, Settings, Menu, MessageCircle } from 'lucide-react';
import { useApp, PersonaType, PageType } from '../contexts/AppContext';

const personas = [
  { id: 'professor' as PersonaType, name: 'Prompt Professor', icon: '🎓', description: 'Guiding you to better prompts' },
  { id: 'guardian' as PersonaType, name: 'Brand Guardian', icon: '🏢', description: 'Protecting brand voice and tone' },
  { id: 'shield' as PersonaType, name: 'Prompt Shield', icon: '🛡️', description: 'Advanced security and safety' },
];

const navigationItems = [
  { id: 'chat' as PageType, icon: MessageCircle, label: 'Chat', description: 'Analyze prompts and chat' },
  { id: 'history' as PageType, icon: History, label: 'History', description: 'View past analyses' },
  { id: 'exports' as PageType, icon: Download, label: 'Exports', description: 'Download your data' },
  { id: 'settings' as PageType, icon: Settings, label: 'Settings', description: 'Configure preferences' },
];

export const Sidebar: React.FC = () => {
  const { 
    activePersona, 
    setActivePersona, 
    activePage, 
    setActivePage, 
    sidebarCollapsed, 
    setSidebarCollapsed 
  } = useApp();

  return (
    <aside 
      className={`${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} glass-panel flex-shrink-0 flex flex-col p-4 transition-all duration-300`}
    >
      <div className="flex items-center justify-between flex-shrink-0 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <Shield className="text-indigo-400 flex-shrink-0 w-8 h-8" />
          {!sidebarCollapsed && (
            <span className="text-xl font-bold dark:text-white light:text-black sidebar-label">
              PromptGuard
            </span>
          )}
        </div>
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-full dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <nav className="mt-8 flex flex-col gap-2 flex-1">
        {!sidebarCollapsed && (
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
            {!sidebarCollapsed && (
              <span className="font-semibold sidebar-label">{persona.name}</span>
            )}
          </button>
        ))}
        
        {!sidebarCollapsed && <hr className="my-6 border-gray-700/50 light:border-gray-300/50" />}
        
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 w-full text-left ${
              activePage === item.id
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50'
            }`}
          >
            <item.icon className="w-6 h-6 text-gray-400 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="font-semibold sidebar-label">{item.label}</span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto flex-shrink-0 flex items-center gap-4 p-2 rounded-lg dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          U
        </div>
        {!sidebarCollapsed && (
          <div className="sidebar-label">
            <p className="font-semibold dark:text-white light:text-black">User</p>
            <p className="text-xs text-gray-400">user@email.com</p>
          </div>
        )}
      </div>
    </aside>
  );
};

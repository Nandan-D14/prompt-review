import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PersonaType = 'professor' | 'guardian' | 'shield';
export type PageType = 'chat' | 'history' | 'exports' | 'settings';

interface AppContextType {
  activePersona: PersonaType;
  setActivePersona: (persona: PersonaType) => void;
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<PersonaType>('professor');
  const [activePage, setActivePage] = useState<PageType>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const value = {
    activePersona,
    setActivePersona,
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

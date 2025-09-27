import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { ToastNotification } from './components/ToastNotification';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AnalysisProvider>
          <div className="flex h-screen bg-black/10 dark:bg-black/10 light:bg-white/10">
            <div className="main-background" />
            
            <Sidebar />
            
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContent />
            </div>
            
            <footer className="fixed bottom-4 right-4 glass-panel px-4 py-2 rounded-full text-xs shadow-lg">
              <span className="dark:text-gray-300 light:text-gray-600">
                Runs locally — no user data leaves this device 🔒
              </span>
            </footer>
            
            {/* Toast notifications */}
            <ToastNotification />
          </div>
        </AnalysisProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

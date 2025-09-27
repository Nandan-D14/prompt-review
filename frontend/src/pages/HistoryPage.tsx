import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Search, Filter, Trash2, Download, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  verdict: 'ALLOW' | 'NEEDS_FIX' | 'BLOCK';
  score: number;
  persona: string;
  rewritten?: boolean;
}

// Mock history data
const mockHistory: HistoryItem[] = [
  {
    id: '1',
    prompt: 'Explain quantum physics concepts in simple terms for high school students',
    timestamp: new Date('2024-01-20T14:30:00'),
    verdict: 'ALLOW',
    score: 95,
    persona: 'Professor',
  },
  {
    id: '2', 
    prompt: 'yo bruh can u help me with coding stuff',
    timestamp: new Date('2024-01-20T14:25:00'),
    verdict: 'NEEDS_FIX',
    score: 65,
    persona: 'Professor',
    rewritten: true,
  },
  {
    id: '3',
    prompt: 'fuck you ass',
    timestamp: new Date('2024-01-20T14:20:00'),
    verdict: 'BLOCK',
    score: 15,
    persona: 'Professor',
  },
  {
    id: '4',
    prompt: 'Create a comprehensive lesson plan for teaching machine learning',
    timestamp: new Date('2024-01-20T14:15:00'),
    verdict: 'ALLOW',
    score: 98,
    persona: 'Professor',
  },
  {
    id: '5',
    prompt: 'Tell me how to hack wifi passwords',
    timestamp: new Date('2024-01-20T14:10:00'),
    verdict: 'BLOCK',
    score: 25,
    persona: 'Shield',
  }
];

export const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterVerdict === 'all' || item.verdict === filterVerdict;
    return matchesSearch && matchesFilter;
  });

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'ALLOW':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'NEEDS_FIX':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'BLOCK':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'ALLOW':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'NEEDS_FIX':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'BLOCK':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    // In a real app, this would call an API to delete items
    console.log('Deleting items:', selectedItems);
    setSelectedItems([]);
  };

  const handleExportSelected = () => {
    // In a real app, this would generate and download a CSV/JSON file
    console.log('Exporting items:', selectedItems);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 light:border-gray-300/50 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold dark:text-white light:text-black">
            Prompt History
          </h1>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50 bg-transparent dark:text-white light:text-black placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="px-4 py-2 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50 bg-transparent dark:text-white light:text-black focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Results</option>
              <option value="ALLOW">Allowed</option>
              <option value="NEEDS_FIX">Needs Fix</option>
              <option value="BLOCK">Blocked</option>
            </select>
            
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={handleExportSelected}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export ({selectedItems.length})
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedItems.length})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel p-4 rounded-lg border ${
                selectedItems.includes(item.id) 
                  ? 'border-indigo-500/50 bg-indigo-500/10' 
                  : 'border-gray-700/50 light:border-gray-300/50'
              } transition-all duration-200`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="mt-1 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getVerdictIcon(item.verdict)}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getVerdictColor(item.verdict)}`}>
                      {item.verdict}
                    </span>
                    <span className="text-xs text-gray-400">
                      Score: {item.score}/100
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.persona}
                    </span>
                    {item.rewritten && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Rewritten
                      </span>
                    )}
                  </div>
                  
                  <p className="dark:text-white light:text-black mb-2 break-words">
                    {item.prompt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No history found</p>
              <p className="text-sm text-gray-500">
                {searchTerm || filterVerdict !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Your prompt history will appear here'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

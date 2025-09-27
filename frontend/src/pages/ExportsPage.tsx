import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Clock } from 'lucide-react';

interface ExportTask {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'pdf';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  fileSize?: string;
  downloadUrl?: string;
}

// Mock export tasks
const mockExports: ExportTask[] = [
  {
    id: '1',
    name: 'Prompt Analysis Report - January 2024',
    type: 'pdf',
    status: 'completed',
    progress: 100,
    createdAt: new Date('2024-01-20T15:30:00'),
    fileSize: '2.4 MB',
    downloadUrl: '#',
  },
  {
    id: '2',
    name: 'History Export - All Data',
    type: 'csv',
    status: 'processing',
    progress: 65,
    createdAt: new Date('2024-01-20T15:25:00'),
  },
  {
    id: '3',
    name: 'COSTAR Analysis Data',
    type: 'json',
    status: 'completed',
    progress: 100,
    createdAt: new Date('2024-01-20T14:45:00'),
    fileSize: '856 KB',
    downloadUrl: '#',
  },
];

export const ExportsPage: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [includeScores, setIncludeScores] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);

  const handleCreateExport = () => {
    // In a real app, this would call an API to create the export
    console.log('Creating export with settings:', {
      dateRange: selectedDateRange,
      format: selectedFormat,
      includeAnalysis,
      includeScores,
      includeTimestamps,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-blue-400';
      case 'pending':
        return 'text-amber-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'csv':
        return '📊';
      case 'json':
        return '🔧';
      default:
        return '📁';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 light:border-gray-300/50 flex-shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold dark:text-white light:text-black">
            Data Exports
          </h1>
        </div>

        {/* Export Creation Form */}
        <div className="glass-panel p-6 rounded-lg">
          <h2 className="text-lg font-semibold dark:text-white light:text-black mb-4">
            Create New Export
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 light:text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-2 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50 bg-transparent dark:text-white light:text-black focus:outline-none focus:border-indigo-500"
              >
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-90-days">Last 90 days</option>
                <option value="all-time">All time</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-gray-300 light:text-gray-700 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50 bg-transparent dark:text-white light:text-black focus:outline-none focus:border-indigo-500"
              >
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="json">JSON (Data)</option>
                <option value="pdf">PDF (Report)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium dark:text-gray-300 light:text-gray-700 mb-2">
                Include Data
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeAnalysis}
                    onChange={(e) => setIncludeAnalysis(e.target.checked)}
                    className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-2"
                  />
                  <span className="text-sm dark:text-gray-300 light:text-gray-700">Analysis Results</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeScores}
                    onChange={(e) => setIncludeScores(e.target.checked)}
                    className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-2"
                  />
                  <span className="text-sm dark:text-gray-300 light:text-gray-700">Safety Scores</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeTimestamps}
                    onChange={(e) => setIncludeTimestamps(e.target.checked)}
                    className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-2"
                  />
                  <span className="text-sm dark:text-gray-300 light:text-gray-700">Timestamps</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateExport}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Create Export
          </button>
        </div>
      </div>

      {/* Export History */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <h2 className="text-lg font-semibold dark:text-white light:text-black mb-4">
          Recent Exports
        </h2>
        
        <div className="space-y-4">
          {mockExports.map((exportTask, index) => (
            <motion.div
              key={exportTask.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-4 rounded-lg border border-gray-700/50 light:border-gray-300/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {getFileIcon(exportTask.type)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold dark:text-white light:text-black">
                      {exportTask.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span className={`capitalize ${getStatusColor(exportTask.status)}`}>
                        {exportTask.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exportTask.createdAt.toLocaleString()}
                      </span>
                      {exportTask.fileSize && (
                        <span>{exportTask.fileSize}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {exportTask.status === 'processing' && (
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${exportTask.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{exportTask.progress}%</span>
                    </div>
                  )}
                  
                  {exportTask.status === 'completed' && exportTask.downloadUrl && (
                    <button
                      onClick={() => window.open(exportTask.downloadUrl, '_blank')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                  
                  {exportTask.status === 'failed' && (
                    <button
                      onClick={() => console.log('Retry export:', exportTask.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {mockExports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No exports yet</p>
              <p className="text-sm text-gray-500">
                Create your first export using the form above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

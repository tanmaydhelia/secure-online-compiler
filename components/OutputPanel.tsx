'use client';

import { useEffect, useRef } from 'react';
import { Terminal, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  language: string;
}

export default function OutputPanel({ output, isRunning, language }: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const getStatusIcon = () => {
    if (isRunning) {
      return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
    if (output.includes('successful')) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (output.includes('error') || output.includes('Error')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <Terminal className="w-4 h-4 text-slate-400" />;
  };

  const getStatusText = () => {
    if (isRunning) return 'Executing...';
    if (output.includes('successful')) return 'Success';
    if (output.includes('error') || output.includes('Error')) return 'Error';
    return 'Ready';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm text-slate-300">{getStatusText()}</span>
        </div>
        <div className="text-xs text-slate-500">
          Container: {language}-runtime
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div 
          ref={outputRef}
          className="h-full bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-slate-100 overflow-auto border border-slate-700"
        >
          {output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="text-slate-500 italic">
              Click "Run Code" to see output here...
              <div className="mt-4 text-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Docker container ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{language.toUpperCase()} runtime initialized</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
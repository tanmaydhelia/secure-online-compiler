'use client';

import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  language: 'cpp' | 'python' | 'java';
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const lineNumbers = value.split('\n').map((_, index) => index + 1);

  return (
    <div className="h-full flex">
      {/* Line numbers */}
      <div className="bg-slate-900/30 border-r border-slate-700 px-3 py-4 text-slate-500 font-mono text-sm leading-6 select-none">
        {lineNumbers.map((lineNum) => (
          <div key={lineNum} className="text-right">
            {lineNum}
          </div>
        ))}
      </div>
      
      {/* Code input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent text-slate-100 font-mono text-sm resize-none outline-none leading-6 p-4 border-none"
          placeholder={`Write your ${language.toUpperCase()} code here...`}
          spellCheck={false}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
        />
      </div>
    </div>
  );
}
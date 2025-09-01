'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  selectedLanguage: 'cpp' | 'python' | 'java';
  onLanguageChange: (language: 'cpp' | 'python' | 'java') => void;
}

const languages = [
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-600">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            className="text-white hover:bg-slate-700 focus:bg-slate-700"
          >
            <div className="flex items-center space-x-2">
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
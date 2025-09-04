'use client';

import { useState } from 'react';
import { Play, Copy, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import LanguageSelector from '@/components/LanguageSelector';

const defaultCode = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `print("Hello, World!")

# Your Python code here
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Your Java code here
        String message = "Welcome to Java!";
        System.out.println(message);
    }
}`
};

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');
  const [code, setCode] = useState(defaultCode.cpp);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');

  const handleLanguageChange = (language: 'cpp' | 'python' | 'java') => {
    setSelectedLanguage(language);
    setCode(defaultCode[language]);
    setOutput('');
    setExecutionTime(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Compiling and executing...\n');
    setExecutionTime(null);
    
    try {
      // console.log(code);
      
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: code,
          input: userInput
        }),
      });

      const result = await response.json();
      console.log(result);
      
      
      if (result.success) {
        setOutput(`Compilation successful!\n\nOutput:\n${result.output}\n\nExecution completed successfully.`);
      } else {
        setOutput(`Compilation failed!\n\nError:\n${result.output || result.error}`);
      }
      
      setExecutionTime(result.executionTime || null);
    } catch (error:any) {
      setOutput(`Network Error: ${error.message}\n\nNote: Make sure the backend server is running on port 3001`);
    }
    
    setIsRunning(false);
  };

  // For development - simulate execution when backend is not available
  const handleRunCodeSimulated = async () => {
    setIsRunning(true);
    setOutput('Compiling and executing...\n');
    
    setTimeout(() => {
      const mockOutput = `Compilation successful!\n\nOutput:\nHello, World!\n${
        selectedLanguage === 'python' ? 'Hello, Developer!\n' : 
        selectedLanguage === 'java' ? 'Welcome to Java!\n' : ''
      }\nExecution completed successfully.`;
      
      setOutput(mockOutput);
      setExecutionTime(Math.random() * 2 + 0.5);
      setIsRunning(false);
    }, 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const extension = selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : 'java';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // return (
  //   <main className="container mx-auto px-4 py-6 h-[calc(100vh-140px)] overflow-hidden">
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
  //       {/* Code Editor Card */}
  //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  //       {/* Header */}
  //       <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
  //         <div className="container mx-auto px-4 py-4">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center space-x-4">
  //               <div className="flex items-center space-x-2">
  //                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
  //                   <Play className="w-4 h-4 text-white" />
  //                 </div>
  //                 <h1 className="text-xl font-bold text-white">CodeRunner</h1>
  //               </div>
  //               <LanguageSelector 
  //                 selectedLanguage={selectedLanguage}
  //                 onLanguageChange={handleLanguageChange}
  //               />
  //             </div>
              
  //             <div className="flex items-center space-x-2">
  //               <Button
  //                 variant="outline"
  //                 size="sm"
  //                 onClick={handleCopyCode}
  //                 className="border-slate-600 text-slate-300 hover:bg-slate-700"
  //               >
  //                 <Copy className="w-4 h-4 mr-2" />
  //                 Copy
  //               </Button>
  //               <Button
  //                 variant="outline"
  //                 size="sm"
  //                 onClick={handleDownloadCode}
  //                 className="border-slate-600 text-slate-300 hover:bg-slate-700"
  //               >
  //                 <Download className="w-4 h-4 mr-2" />
  //                 Download
  //               </Button>
  //               <Button
  //                 onClick={handleRunCode}
  //                 disabled={isRunning}
  //                 className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
  //               >
  //                 <Play className="w-4 h-4 mr-2" />
  //                 {isRunning ? 'Running...' : 'Run Code'}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </header>

  //       {/* Main Content */}
  //       <main className="container mx-auto px-4 py-6">
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
  //           {/* Code Editor */}
  //           <Card className="h-full flex flex-col bg-slate-800/50 border-slate-700 backdrop-blur-sm">
  //             <div className="p-4 border-b border-slate-700">
  //               <div className="flex items-center justify-between">
  //                 <h2 className="text-lg font-semibold text-white">Code Editor</h2>
  //                 <div className="flex items-center space-x-8">
  //                   {/* Shortcut hints */}
  //                   <div className="hidden md:flex items-center space-x-6 text-slate-400 text-xs font-mono">
  //                     <span className="flex items-center space-x-1">
  //                       <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">Ctrl</kbd>
  //                       <span>+</span>
  //                       <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">R</kbd>
  //                       <span>Run</span>
  //                     </span>
  //                     <span className="flex items-center space-x-1">
  //                       <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">Ctrl</kbd>
  //                       <span>+</span>
  //                       <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">D</kbd>
  //                       <span>Duplicate</span>
  //                     </span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             {/* Editor fills remaining space and scrolls */}
  //             <div className='flex-1 overflow-auto'>
  //               <CodeEditor
  //                 language={selectedLanguage}
  //                 value={code}
  //                 onChange={setCode}
  //                 onRun={handleRunCode}
  //               />
  //               {/* Input box fixed at bottom */}
  //               <div className="border-t border-slate-700 p-3 bg-slate-900/40">
  //                 <textarea
  //                   value={userInput}
  //                   onChange={(e) => setUserInput(e.target.value)}
  //                   placeholder="Enter input for your program here..."
  //                   className="w-full h-20 resize-none rounded-md bg-slate-800 text-slate-200 p-2 font-mono text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //                 />
  //               </div>

  //             </div>
  //           </Card>

  //           {/* Output Panel */}
  //           <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
  //             <div className="p-4 border-b border-slate-700">
  //               <div className="flex items-center justify-between">
  //                 <h2 className="text-lg font-semibold text-white">Output</h2>
  //                 {executionTime && (
  //                   <span className="text-sm text-slate-400">
  //                     Executed in {executionTime.toFixed(2)}s
  //                   </span>
  //                 )}
  //               </div>
  //             </div>
  //             <OutputPanel
  //               output={output}
  //               isRunning={isRunning}
  //               language={selectedLanguage}
  //             />
  //           </Card>
  //         </div>

  //         {/* Status Bar */}
  //         <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
  //           <div className="flex items-center space-x-4">
  //             <span>Language: {selectedLanguage.toUpperCase()}</span>
  //             <span>•</span>
  //             <span>Ready</span>
  //           </div>
  //           <div className="flex items-center space-x-2">
  //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
  //             <span>Online</span>
  //           </div>
  //         </div>
  //       </main>
  //       </div>
  //     </div>
  //   </main>
  // );
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    {/* Header */}
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">CodeRunner</h1>
            </div>
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="container mx-auto px-4 py-6 h-[calc(100vh-140px)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Code Editor Card */}
        <Card className="h-full flex flex-col bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          {/* Editor header */}
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Code Editor</h2>
            <div className="hidden md:flex items-center space-x-6 text-slate-400 text-xs font-mono">
              <span className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">'</kbd>
                <span>Run</span>
              </span>
              <span className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-200 border border-slate-600">D</kbd>
                <span>Duplicate</span>
              </span>
            </div>
          </div>

          {/* Scrollable code editor area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <CodeEditor
                language={selectedLanguage}
                value={code}
                onChange={setCode}
                onRun={handleRunCode}
              />
            </div>
          </div>

          {/* Fixed input bar */}
          <div className="border-t border-slate-700 p-3 bg-slate-900/40">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input for your program here..."
              className="w-full h-20 resize-none rounded-md bg-slate-800 text-slate-200 p-2 font-mono text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {/* Output Panel */}
        <Card className="h-full flex flex-col bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Output</h2>
            {executionTime && (
              <span className="text-sm text-slate-400">
                Executed in {executionTime.toFixed(2)}s
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-auto p-3 font-mono text-sm text-slate-200 bg-slate-900/40">
            <OutputPanel
              output={output}
              isRunning={isRunning}
              language={selectedLanguage}
            />
          </div>
        </Card>
      </div>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center space-x-4">
          <span>Language: {selectedLanguage.toUpperCase()}</span>
          <span>•</span>
          <span>Ready</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Online</span>
        </div>
      </div>
    </main>
  </div>
);

}
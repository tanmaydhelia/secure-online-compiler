"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { githubDark } from "@uiw/codemirror-theme-github";
import { Card, CardContent } from "@/components/ui/card";

interface CodeEditorProps {
  language: "cpp" | "python" | "java";
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const getExtensions = useCallback(() => {
    switch (language) {
      case "cpp":
        return [cpp()];
      case "java":
        return [java()];
      case "python":
        return [python()];
      default:
        return [];
    }
  }, [language]);

  return (
    <Card className="h-full w-full overflow-hidden bg-slate-950 border-slate-800 rounded-2xl shadow-md">
      <CardContent className="p-0 h-full">
        <CodeMirror
          value={value}
          height="100%"
          theme={githubDark}
          extensions={getExtensions()}
          onChange={(val) => onChange(val)}
          className="text-sm font-mono"
        />
      </CardContent>
    </Card>
  );
}

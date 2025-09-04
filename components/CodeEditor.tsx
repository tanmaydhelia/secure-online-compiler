"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { githubDark } from "@uiw/codemirror-theme-github";
import { keymap } from "@codemirror/view";
import { Card, CardContent } from "@/components/ui/card";

interface CodeEditorProps {
  language: "cpp" | "python" | "java";
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void; // optional run callback
}

export default function CodeEditor({ language, value, onChange, onRun }: CodeEditorProps) {
  const getExtensions = useCallback(() => {
    const languageExt = (() => {
      switch (language) {
        case "cpp": return [cpp()];
        case "java": return [java()];
        case "python": return [python()];
        default: return [];
      }
    })();

    const customKeymap = keymap.of([
      {
        key: "Ctrl-'",
        run: () => {
          console.log("Run triggered");
          if (onRun) onRun();
          return true;
        }
      },
      {
        key: "Ctrl-s",
        run: () => {
          console.log("Saved");
          
          return true;
        }
      },
      {
        key: "Ctrl-d",
        run: (view) => {
          const { state, dispatch } = view;
          const line = state.doc.lineAt(state.selection.main.head);
          const transaction = state.update({
            changes: { from: line.to, insert: "\n" + line.text },
            selection: { anchor: line.to + 1 } // place cursor at start of new line
          });
          dispatch(transaction);
          return true;
        }
      }
    ]);

    return [...languageExt, customKeymap];
  }, [language, onRun]);

  return (
    <div className="h-full">
        <CodeMirror
          value={value}
          height="100%"
          theme={githubDark}
          extensions={getExtensions()}
          onChange={(val) => onChange(val)}
          className="w-full h-full text-sm font-mono"
        />
    </div>
  );
}

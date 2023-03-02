import "./editor.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { useEffect, useRef } from "react";

export function useCodeEditor(theme: "show" | "vs") {
  monaco.editor.defineTheme("show", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.lineHighlightBackground": "#ddd",
    },
  });

  let dom = useRef<HTMLDivElement | null>(null);
  let editor = useRef<monaco.editor.IStandaloneCodeEditor>();

  let code = useRef<string>();

  function getCode() {
    code.current = editor.current?.getValue();
    return code.current;
  }

  function setCode(c: string) {
    code.current = c;
    editor.current?.setValue(code.current);
  }

  function setHeightLine(row: number) {
    editor.current?.setSelection(new monaco.Selection(row, 0, row, 0));
  }

  useEffect(() => {
    const d = dom.current;
    if (d) {
      let r = monaco.editor.create(d, {
        value: code.current,
        language: "javascript",
        theme: theme,
        readOnly: theme === "show",
      });
      editor.current = r;

      return () => {
        if (d) {
          while (d.children.length > 0) {
            d.removeChild(d.children[0]);
          }
        }
      };
    }
  }, [dom, theme]);

  return {
    el: <div className="codeEditor" ref={dom}></div>,
    getCode,
    setCode,
    setHeightLine,
  };
}

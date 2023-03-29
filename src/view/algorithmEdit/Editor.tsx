import "./editor.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/java/java.contribution";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution";
import { useEffect, useRef, useCallback } from "react";
import { ShowCodeLanguage } from "./type";

export function useCodeEditor(
  theme: "show" | "vs",
  language?: ShowCodeLanguage
) {
  monaco.editor.defineTheme("show", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.lineHighlightBackground": "#ddd",
    },
  });

  language = language ?? ShowCodeLanguage.JS;

  let dom = useRef<HTMLDivElement | null>(null);
  let editor = useRef<monaco.editor.IStandaloneCodeEditor>();

  let code = useRef<string>();

  useEffect(() => {
    const d = dom.current;
    if (d) {
      let r = monaco.editor.create(d, {
        value: code.current,
        language: language,
        theme: theme,
        readOnly: theme === "show",
      });
      editor.current = r;

      return () => {
        if (d) {
          editor.current?.dispose();
          while (d.children.length > 0) {
            d.removeChild(d.children[0]);
          }
        }
      };
    }
  }, [dom, dom.current, theme, language]);

  const getCode = useCallback(() => {
    code.current = editor.current?.getValue();
    return code.current ?? "";
  }, [code.current, editor.current]);

  const setCode = useCallback(
    (c: string) => {
      code.current = c;
      editor.current?.setValue(code.current);
    },
    [code.current, editor.current]
  );

  const setHeightLine = useCallback(
    (row: number) => {
      editor.current?.setSelection(new monaco.Selection(row, 0, row, 0));
    },
    [editor.current]
  );

  return {
    el: <div className="codeEditor" ref={dom}></div>,
    getCode,
    setCode,
    setHeightLine,
  };
}

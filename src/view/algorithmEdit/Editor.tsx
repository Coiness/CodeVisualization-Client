import "./editor.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { useEffect, useRef, useState } from "react";

export function useCodeEditor() {
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

  useEffect(() => {
    if (dom.current) {
      let r = monaco.editor.create(dom.current, {
        value: code.current,
        language: "javascript",
        theme: "vs",
      });
      editor.current = r;
      //  r.
      return () => {
        if (dom.current) {
          while (dom.current.children.length > 0) {
            dom.current.removeChild(dom.current.children[0]);
          }
        }
      };
    }
  }, [dom.current]);

  return { el: <div className="codeEditor" ref={dom}></div>, getCode, setCode };
}

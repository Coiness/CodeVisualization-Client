import "./editor.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { useEffect, useRef } from "react";

export function useCodeEditor() {
  let dom = useRef<HTMLDivElement | null>(null);
  let editor = useRef<monaco.editor.IStandaloneCodeEditor>();

  function getCode() {
    return editor.current?.getValue();
  }

  function setCode(code: string) {
    editor.current?.setValue(code);
  }

  useEffect(() => {
    if (dom.current) {
      let r = monaco.editor.create(dom.current, {
        value: "",
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

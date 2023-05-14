import "./editor.css";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/java/java.contribution";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution";
import { useEffect, useRef, useCallback, useState } from "react";
import { ShowCodeLanguage } from "./type";
import { observeDomSize } from "../../common/utils";

const EditerLineHeight = 20;
const ScrollJGRowCount = 1;

export function useCodeEditor(
  theme: "show" | "vs",
  language?: ShowCodeLanguage,
  minimapEnable?: boolean
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
  minimapEnable = minimapEnable ?? false;

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
        lineHeight: EditerLineHeight,
        automaticLayout: true,
        minimap: {
          enabled: minimapEnable,
          renderCharacters: false,
          scale: 2,
        },
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
      if (!dom.current || !editor.current) {
        return;
      }

      editor.current.setSelection(new monaco.Selection(row, 0, row, 0));
      let boxHeight = dom.current.offsetHeight;
      let nowScroll = editor.current.getScrollTop();
      let targetTop =
        Math.max(row - 1 - ScrollJGRowCount, 0) * EditerLineHeight;
      let targetBottom = (row + ScrollJGRowCount) * EditerLineHeight;
      let nowViewTop = nowScroll;
      let nowViewBottom = nowViewTop + boxHeight;

      let targetScroll: number = 0;

      if (targetTop < nowViewTop) {
        targetScroll = targetTop;
      } else if (targetBottom > nowViewBottom) {
        targetScroll = targetBottom - boxHeight;
      } else {
        targetScroll = nowScroll;
      }

      editor.current.setScrollTop(
        targetScroll,
        monaco.editor.ScrollType.Smooth
      );
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

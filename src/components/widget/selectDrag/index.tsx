import { useCallback, useRef } from "react";
import "./index.css";

export type SelectDragProps = {
  dragInfo: {
    x: number;
    y: number;
    onDrag: (x: number, y: number) => void;
  };
  resizeInfo: {
    width: number;
    height: number;
    onResize: (width: number, height: number) => void;
  };
};

export function SelectDrag(props: SelectDragProps) {
  const dom = useRef<HTMLDivElement | null>(null);
  const { dragInfo, resizeInfo } = props;
  const { x, y, onDrag } = dragInfo;
  const { width, height, onResize } = resizeInfo;
  const dragStart = useCallback(
    (e: MouseEvent) => {
      const parent = dom.current?.parentElement;
      if (!parent) {
        return;
      }
      const startX = e.clientX;
      const startY = e.clientY;
      const move = (e: MouseEvent) => {
        parent.style.transform = `translate(${e.clientX - startX}px, ${
          e.clientY - startY
        }px)`;
      };
      const up = (e: MouseEvent) => {
        parent.style.transform = "none";
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        onDrag(e.clientX - startX + x, e.clientY - startY + y);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [dom, onDrag, x, y]
  );

  const resizeStart = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const parent = dom.current?.parentElement;
      if (!parent) {
        return;
      }
      const startX = e.clientX;
      const startY = e.clientY;
      const getWH = (x: number, y: number) => {
        return {
          w: Math.max(x - startX + width, 50),
          h: Math.max(y - startY + height, 20),
        };
      };
      const move = (e: MouseEvent) => {
        const { w, h } = getWH(e.clientX, e.clientY);
        parent.style.width = w + "px";
        parent.style.height = h + "px";
      };
      const up = (e: MouseEvent) => {
        const { w, h } = getWH(e.clientX, e.clientY);
        parent.style.width = w + "px";
        parent.style.height = h + "px";
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        onResize(w, h);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [dom, onResize, width, height]
  );

  return (
    <div className="selectDrag" onMouseDown={dragStart as any} ref={dom}>
      <div className="resize" onMouseDown={resizeStart as any}></div>
    </div>
  );
}

import { useCallback, useRef } from "react";
import "./index.css";
import { MainCanvasData } from "../../mainCanvas/MainCanvas";

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
  isActive: boolean;
};

export function SelectDrag(props: SelectDragProps) {
  const dom = useRef<HTMLDivElement | null>(null);
  const { dragInfo, resizeInfo, isActive } = props;
  const { x, y, onDrag } = dragInfo;
  const { width, height, onResize } = resizeInfo;
  const dragStart = useCallback(
    (e: MouseEvent) => {
      const zoom = MainCanvasData.zoom;
      const parent = dom.current?.parentElement;
      if (!parent) {
        return;
      }
      const startX = e.clientX;
      const startY = e.clientY;
      const move = (e: MouseEvent) => {
        parent.style.transform = `translate(${(e.clientX - startX) / zoom}px, ${
          (e.clientY - startY) / zoom
        }px)`;
      };
      const up = (e: MouseEvent) => {
        parent.style.transform = "none";
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        onDrag(
          (e.clientX - startX) / zoom + x,
          (e.clientY - startY) / zoom + y
        );
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [dom, onDrag, x, y]
  );

  const resizeStart = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const zoom = MainCanvasData.zoom;
      const parent = dom.current?.parentElement;
      if (!parent) {
        return;
      }
      const startX = e.clientX;
      const startY = e.clientY;
      const getWH = (x: number, y: number) => {
        return {
          w: Math.max((x - startX) / zoom + width, 30),
          h: Math.max((y - startY) / zoom + height, 30),
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
    <div
      className="selectDrag"
      onMouseDown={dragStart as any}
      ref={dom}
      style={{ border: isActive ? '' : 'none'}}
    >
      <div
        className="resize"
        onMouseDown={resizeStart as any}
        style={{ display: isActive ? 'block' : 'none'}}
      ></div>
    </div>
  );
}

import { useCallback, useRef } from "react";
import "./index.css";

export type SelectDragProps = {
  onDrag: (x: number, y: number) => void;
};

export function SelectDrag(props: SelectDragProps) {
  const dom = useRef<HTMLDivElement | null>(null);
  const { onDrag } = props;
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
        onDrag(e.clientX - startX, e.clientY - startY);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    },
    [dom, onDrag]
  );

  return (
    <div className="selectDrag" onMouseDown={dragStart as any} ref={dom}>
      <div className="resize"></div>
    </div>
  );
}

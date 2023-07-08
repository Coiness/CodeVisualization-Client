import { useEffect, useRef, useState } from "react";
import { useUndo } from "../../core";
import { snapshot, activeWidget, useStore } from "../../store";
import { WidgetRenderer } from "../widget";

export const MainCanvasData = {
  zoom: 1,
};

export function MainCanvas(props: { editable: boolean; className: string }) {
  const [data] = useStore(snapshot);

  useUndo(props.editable);

  const [zoom, setZoom] = useState<number>(1);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    MainCanvasData.zoom = zoom;
  }, [zoom]);

  function handelMouseWhell(e: any) {
    if (e.deltaY > 0) {
      if (zoom > 0.2) {
        setZoom(zoom - 0.05);
      }
    } else {
      if (zoom < 2) {
        setZoom(zoom + 0.05);
      }
    }
  }

  return (
    <div
      className={props.className}
      onWheel={handelMouseWhell}
      ref={mainRef}
      onClick={(e) => {
        if(e.target === mainRef.current){
          activeWidget.set(null);
        }
      }}
    >
      <div className="zoom" style={{ transform: `scale(${zoom})` }}>
        {data && (
          <WidgetRenderer
            model={data.widgetManagerModel}
            editable={props.editable}
          ></WidgetRenderer>
        )}
      </div>
    </div>
  );
}

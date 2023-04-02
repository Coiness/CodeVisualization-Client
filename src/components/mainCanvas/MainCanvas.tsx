import { useEffect, useState } from "react";
import { useUndo } from "../../core";
import { snapshot, useStore } from "../../store";
import { WidgetRenderer } from "../widget";

export const MainCanvasData = {
  zoom: 1,
};

export function MainCanvas(props: { editable: boolean; className: string }) {
  const [data] = useStore(snapshot);

  useUndo(props.editable);

  const [zoom, setZoom] = useState<number>(1);

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
    <div className={props.className} onWheel={handelMouseWhell}>
      <div className="zoom" style={{ zoom }}>
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

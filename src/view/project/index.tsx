import { useState } from "react";
import { sleep } from "../../common/utils";
import { WidgetManagerModel, WidgetManager } from "../../components/widget";
import { initUndo, useUndo } from "../../core/undo";
import { snapshot } from "../../store";
import { ControlPanel } from "./controlPanel";
import "./index.css";

async function getData(): Promise<CanvasData> {
  await sleep(1000);
  return {
    widgetManagerModel: {
      width: 700,
      height: 700,
      widgets: [
        {
          id: "1",
          type: "Number",
          x: 100,
          y: 100,
          width: 100,
          height: 30,
          color: "pink",
          value: 18,
        },
        {
          id: "2",
          type: "Number",
          x: 300,
          y: 100,
          width: 120,
          height: 20,
          color: "skyblue",
          value: 20,
        },
        {
          id: "3",
          type: "String",
          x: 400,
          y: 500,
          width: 100,
          height: 30,
          color: "yellow",
          value: "qwe",
        },
      ],
      color: "#666",
    },
  } as CanvasData;
}

export interface CanvasData {
  widgetManagerModel: WidgetManagerModel;
}

function MainCanvas() {
  const [data, setData] = useState<CanvasData | null>(null);

  useUndo();

  if (data == null) {
    (async () => {
      let d = await getData();
      snapshot.set(d);
      initUndo();
      setData(d);
    })();
  }

  return (
    <div className="main">
      MainCanvas
      {data && <WidgetManager model={data.widgetManagerModel}></WidgetManager>}
    </div>
  );
}

export function Project() {
  return (
    <div className="project">
      project
      <MainCanvas></MainCanvas>
      <ControlPanel></ControlPanel>
    </div>
  );
}

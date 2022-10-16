import { useState } from "react";
import { sleep } from "../../common/utils";
import { WidgetManagerModel, WidgetManager } from "../../components/widget";
import { ControlPanel } from "./controlPanel";

async function getData(): Promise<CanvasData> {
  await sleep(1000);
  return {
    widgetManagerModel: {
      width: 500,
      height: 500,
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
          width: 50,
          height: 20,
          color: "skyblue",
          value: 20,
        },
      ],
      color: "#666",
    },
  } as CanvasData;
}

interface CanvasData {
  widgetManagerModel: WidgetManagerModel;
}

function MainCanvas() {
  const [data, setData] = useState<CanvasData | null>(null);

  if (data == null) {
    (async () => {
      let d = await getData();
      setData(d);
    })();
  }

  return (
    <div>
      MainCanvas
      {data && <WidgetManager model={data.widgetManagerModel}></WidgetManager>}
    </div>
  );
}

export function Project() {
  return (
    <div>
      project
      <MainCanvas></MainCanvas>
      <ControlPanel></ControlPanel>
    </div>
  );
}

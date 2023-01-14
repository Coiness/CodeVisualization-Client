import { sleep } from "../../common/utils";
import { WidgetRendererModel, WidgetRenderer } from "../../components/widget";
import { modelSwitcher } from "../../core";
import { initUndo, useUndo } from "../../core/undo";
import { snapshot, useStore } from "../../store";
import { ControlPanel } from "./controlPanel";
import { WidgetPanel } from "./widgetPanel";
import "./index.css";

async function getData(): Promise<Snapshot> {
  await sleep(1000);
  const res = {
    widgetManagerModel: {
      id: "widgetRenderer",
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
  } as Snapshot;
  return res;
}

export interface Snapshot {
  widgetManagerModel: WidgetRendererModel;
}

function MainCanvas() {
  const [data] = useStore(snapshot);

  useUndo();

  if (data == null) {
    (async () => {
      let d = await getData();
      modelSwitcher.pushModel(d);
      initUndo();
    })();
  }

  return (
    <div className="main">
      MainCanvas
      {data && (
        <WidgetRenderer model={data.widgetManagerModel}></WidgetRenderer>
      )}
    </div>
  );
}

export function Project() {
  return (
    <div className="project">
      <WidgetPanel></WidgetPanel>
      <MainCanvas></MainCanvas>
      <ControlPanel></ControlPanel>
    </div>
  );
}

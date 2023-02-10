import { getLocationQuery, sleep } from "../../common/utils";
import { WidgetRendererModel, WidgetRenderer } from "../../components/widget";
import { modelSwitcher } from "../../core";
import { useUndo } from "../../core/undo";
import { snapshot, useStore } from "../../store";
import { ControlPanel } from "./controlPanel";
import { WidgetPanel } from "./widgetPanel";
import "./index.css";
import { getInitSnapshot } from "../../common/const";
import { Header } from "../../components/header";
import { Button } from "antd";

function getProjectId() {
  return getLocationQuery("id");
}

async function getData(id: string | null): Promise<Snapshot> {
  if (id === null) {
    return getInitSnapshot();
  } else {
    // 请求
    await sleep(1000);
    return getInitSnapshot();
  }
}

export interface Snapshot {
  widgetManagerModel: WidgetRendererModel;
}

type MainCanvasProps = {
  projectId: string | null;
};

function MainCanvas(props: MainCanvasProps) {
  const id = props.projectId;
  const [data] = useStore(snapshot);

  useUndo();

  if (data == null) {
    (async () => {
      let d = await getData(id);
      modelSwitcher.pushModel(d);
    })();
  }

  return (
    <div className="main">
      {data && (
        <WidgetRenderer model={data.widgetManagerModel}></WidgetRenderer>
      )}
    </div>
  );
}

export function Project() {
  const id = getProjectId();

  return (
    <div className="projectDS">
      <Header content={<HeaderToolBar projectId={id}></HeaderToolBar>}></Header>
      <div className="projectDSContent">
        <WidgetPanel></WidgetPanel>
        <MainCanvas projectId={id}></MainCanvas>
        <ControlPanel></ControlPanel>
      </div>
    </div>
  );
}

type HeaderToolBarProps = {
  projectId: string | null;
};

export function HeaderToolBar(props: HeaderToolBarProps) {
  const id = props.projectId;

  return (
    <div>
      {id === null ? (
        <div className="save">
          <Button type="default">保存</Button>
        </div>
      ) : (
        <div className="projectName">演示名</div>
      )}
    </div>
  );
}

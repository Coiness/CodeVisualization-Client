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
import * as projectAPI from "../../net/projectAPI";
import { useEffect, useState } from "react";

function getProjectId() {
  return getLocationQuery("id");
}

async function getProjectData(id: string | null): Promise<ProjectInfo> {
  if (id === null) {
    return {
      id: "",
      account: "",
      name: "",
      snapshot: getInitSnapshot(),
    };
  } else {
    let p = await projectAPI.getProjectInfo(id);
    return {
      id: p.id,
      name: p.name,
      account: p.account,
      snapshot: p.snapshot,
    };
  }
}

export interface Snapshot {
  widgetManagerModel: WidgetRendererModel;
}

type MainCanvasProps = {
  snapshot: Snapshot;
};

function MainCanvas(props: MainCanvasProps) {
  const [data] = useStore(snapshot);

  useUndo();

  if (data === null) {
    modelSwitcher.pushModel(props.snapshot);
  }

  return (
    <div className="main">
      {data && (
        <WidgetRenderer model={data.widgetManagerModel}></WidgetRenderer>
      )}
    </div>
  );
}

type ProjectInfo = {
  id: string;
  account: string;
  name: string;
  snapshot: Snapshot;
};

export function Project() {
  const id = getProjectId();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);

  useEffect(() => {
    if (projectInfo === null) {
      getProjectData(id).then((info) => {
        if (projectInfo === null) {
          setProjectInfo(info);
        }
      });
    }
  }, [projectInfo, setProjectInfo]);

  return (
    projectInfo && (
      <div className="projectDS">
        <Header
          content={<HeaderToolBar {...projectInfo}></HeaderToolBar>}
        ></Header>
        <div className="projectDSContent">
          <WidgetPanel></WidgetPanel>
          <MainCanvas snapshot={projectInfo.snapshot}></MainCanvas>
          <ControlPanel></ControlPanel>
        </div>
      </div>
    )
  );
}

export function HeaderToolBar(props: ProjectInfo) {
  const id = props.id;

  function save() {
    // projectAPI.createProject()
  }

  return (
    <div>
      {id === "" ? (
        <div className="save">
          <Button type="default" onClick={save}>
            保存
          </Button>
        </div>
      ) : (
        <div className="projectName">{props.name}</div>
      )}
    </div>
  );
}

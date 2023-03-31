import { getLocationQuery } from "../../common/utils";
import { actionIO, modelSwitcher } from "../../core";
import { activeWidget, initProjectInfo, useStore } from "../../store";
import { ControlPanel } from "./controlPanel";
import { WidgetPanel } from "./widgetPanel";
import "./index.css";
import { getInitSnapshot } from "../../common/const";
import { Header } from "../../components/header";
import * as projectAPI from "../../net/projectAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeaderToolBar } from "./headerToolBar";
import { ProjectInfo, ProjectInfoKey } from "./types";
import { useLocation } from "react-router-dom";
import { useAccount } from "../../components/header/userInfo";
import { WidgetInfo } from "../../components/widget/widgets";
import { createWS, WSType } from "../../net";
import { MainCanvas } from "../../components/mainCanvas/MainCanvas";
export * from "./types";

function getProjectId(search: string) {
  return getLocationQuery("id", search);
}

export async function getProjectData(id: string | null): Promise<ProjectInfo> {
  if (id === null) {
    let info = initProjectInfo.get();
    return (
      info ?? {
        id: "",
        account: "",
        name: "",
        snapshot: getInitSnapshot(),
        permission: 0,
        descrition: "",
      }
    );
  } else {
    let p = await projectAPI.getProjectInfo(id);
    return {
      id: p.id,
      name: p.name,
      account: p.account,
      snapshot: JSON.parse(p.snapshot),
      historyInfo: p.historyInfo ? JSON.parse(p.historyInfo) : undefined,
      permission: p.permission,
      descrition: p.descrition,
    };
  }
}

export function Project() {
  const location = useLocation();
  const id = getProjectId(location.search);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const account = useAccount();
  const editable =
    (projectInfo && projectInfo?.name === "") ||
    (account !== null && projectInfo?.account === account);
  const [, setActiveWidget] = useStore<WidgetInfo>(activeWidget);
  const inited = useRef<boolean>(false);

  useEffect(() => {
    if (!inited.current) {
      inited.current = true;
      setActiveWidget(null);
    }
  }, [inited, setActiveWidget]);

  useEffect(() => {
    let close: () => void = () => {};
    let closed = false;
    getProjectData(id).then(async (info) => {
      if (id !== null) {
        let ws = await createWS(WSType.Project, { id });
        if (closed) {
          ws.close();
          return;
        }
        actionIO.setWS(ws);
        close = () => {
          ws.close();
        };
      }
      setProjectInfo(info);
      modelSwitcher.setModel(info.snapshot, info.historyInfo);
    });
    return () => {
      closed = true;
      close();
    };
  }, [id]);

  const change = useCallback(
    (key: ProjectInfoKey, value: any) => {
      let newInfo = {
        ...projectInfo,
        [key]: value,
      };
      setProjectInfo(newInfo as ProjectInfo);
    },
    [projectInfo, setProjectInfo]
  );

  return (
    projectInfo && (
      <div className="projectDS">
        <Header
          content={
            <HeaderToolBar
              info={projectInfo}
              change={change}
              editable={editable}
            ></HeaderToolBar>
          }
        ></Header>
        <div className="projectDSContent">
          {editable && <WidgetPanel></WidgetPanel>}
          <MainCanvas className="main" editable={editable}></MainCanvas>
          {editable && <ControlPanel></ControlPanel>}
        </div>
      </div>
    )
  );
}

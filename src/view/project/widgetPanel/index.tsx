import { Button } from "antd";
import { type } from "os";
import { useCallback } from "react";
import {
  BaseModel,
  numberWidgetDefaultInfo,
} from "../../../components/widget/widgets";
import { stackWidgetDefaultInfo } from "../../../components/widget/widgets/stackWidget";
import { stringWidgetDefaultInfo } from "../../../components/widget/widgets/stringWidget";
import { commitAction, WidgetRendererAction } from "../../../core";
import { snapshot } from "../../../store";
import "./widgetPanel.css";
import { cloneDeep } from "lodash";

export interface WidgetDefaultInfo {
  defaultData: BaseModel;
  name: string;
}

const widgetDefaultInfos: WidgetDefaultInfo[] = [
  numberWidgetDefaultInfo,
  stringWidgetDefaultInfo,
  stackWidgetDefaultInfo,
];

export function WidgetPanel() {
  const createWidget = useCallback((info: WidgetDefaultInfo) => {
    const model = cloneDeep(info.defaultData);
    const widgetManagerModel = snapshot.get()!.widgetManagerModel;
    model.x = (widgetManagerModel.width - model.width) / 2;
    model.y = (widgetManagerModel.height - model.height) / 2;
    const action = WidgetRendererAction.create(
      snapshot.get()!.widgetManagerModel,
      {
        type: "create",
        model,
      }
    );
    commitAction(action);
  }, []);

  return (
    <div className="widgetPanel">
      <div className="list">
        {widgetDefaultInfos.map((info) => (
          <div className="widgetItem" key={info.name}>
            <Button
              onClick={() => {
                createWidget(info);
              }}
            >
              {info.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

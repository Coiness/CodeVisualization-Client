import { Button } from "antd";
import { useCallback } from "react";
import {
  BaseModel,
  numberWidgetDefaultInfo,
  WidgetType,
} from "../../../components/widget/widgets";
import { stringWidgetDefaultInfo } from "../../../components/widget/widgets/stringWidget";
import { commitAction, WidgetRendererAction } from "../../../core";
import { snapshot } from "../../../store";
import "./widgetPanel.css";

export interface WidgetDefaultInfo {
  defaultData: BaseModel;
  name: string;
}

const widgetDefaultInfos: WidgetDefaultInfo[] = [
  numberWidgetDefaultInfo,
  stringWidgetDefaultInfo,
];

export function WidgetPanel() {
  const createWidget = useCallback((info: WidgetDefaultInfo) => {
    const action = WidgetRendererAction.create(
      snapshot.get()!.widgetManagerModel,
      {
        model: info.defaultData,
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

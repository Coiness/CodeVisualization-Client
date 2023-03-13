import { Button } from "antd";
import { useState } from "react";
import { widgetModelManager } from "../..";
import { activeWidget, useStore } from "../../../../store";
import { Empty } from "../../../empty";
import { IWidget, WidgetType } from "../../widgets";
import { StackWidget } from "../../widgets/stackWidget";
import { SelectWidget } from "../SelectWidget";
import "./stackControl.css";

export function WidgetContainer(props: { widget: IWidget | null }) {
  return (
    <div className="widgetContainer">
      {props.widget && (
        <div className="content">{props.widget.toStringValue()}</div>
      )}
      {!props.widget && <div className="empty">null</div>}
    </div>
  );
}

export function StackControl() {
  const [activeWidgetValue] = useStore(activeWidget);
  const [pushWidget, setPushWidget] = useState<IWidget | null>(null);
  const [popWidget, setPopWidget] = useState<IWidget | null>(null);
  if (!activeWidgetValue) {
    return null;
  }
  const type = activeWidgetValue.type;
  const widget = activeWidgetValue.widget as StackWidget;

  if (type !== WidgetType.Stack) {
    return null;
  }

  return (
    <div className="stackControl">
      <div className="push">
        <Button
          disabled={pushWidget === null}
          style={{ width: "60px" }}
          onClick={() => {
            if (pushWidget !== null) {
              widget.push(pushWidget.getModel());
              setPushWidget(null);
            }
          }}
        >
          push
        </Button>
        {pushWidget !== null && (
          <WidgetContainer widget={pushWidget}></WidgetContainer>
        )}
        {pushWidget === null && (
          <SelectWidget setWidget={setPushWidget}></SelectWidget>
        )}
      </div>
      <div className="pop">
        <Button
          style={{ width: "60px" }}
          onClick={() => {
            let m = widget.pop();
            if (m === null) {
              return;
            }
            let w = widgetModelManager.getWidget(m);
            if (w !== null) {
              setPopWidget(w);
            }
          }}
        >
          pop
        </Button>
        <WidgetContainer widget={popWidget}></WidgetContainer>
      </div>
      {/* <Button
        onClick={() => {
          (widget as StackWidget).pop();
        }}
      ></Button> */}
    </div>
  );
}

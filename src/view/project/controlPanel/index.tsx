import { Empty } from "antd";
import { getWidgetControlPanel } from "../../../components/widget/widgets";
import { activeWidget, useStore } from "../../../store";
import "./controlPanel.css";

export function ControlPanel() {
  let [widget] = useStore(activeWidget);

  if (widget) {
    let Comp = getWidgetControlPanel(widget.type);
    return (
      <div className="controlPanel">
        <div className="controlPanelContent">
          <Comp></Comp>
        </div>
      </div>
    );
  } else {
    return (
      <div className="controlPanel">
        <div className="controlPanelContent">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={"未选择元素"}
          />
        </div>
      </div>
    );
  }
}

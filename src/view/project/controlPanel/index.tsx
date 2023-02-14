import { Empty } from "antd";
import { getWidgetControlPanel } from "../../../components/widget/widgets";
import { activeWidget, activeWidgetType, useStore } from "../../../store";
import "./controlPanel.css";

export function ControlPanel() {
  let [widget, setWidget] = useStore(activeWidget);

  if (widget) {
    let Comp = getWidgetControlPanel(widget.type);
    return (
      <div className="controlPanel">
        <Comp></Comp>
      </div>
    );
  } else {
    return (
      <div className="controlPanel">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={"未选择元素"}
        />
      </div>
    );
  }
}

import { WidgetInfoView } from "./WidgetInfoView";
import "./controlPanel.css";
import { ValueEdit } from "./ValueEdit";

export function ControlPanel() {
  return (
    <div className="controlPanel">
      <WidgetInfoView></WidgetInfoView>
      <ValueEdit></ValueEdit>
    </div>
  );
}

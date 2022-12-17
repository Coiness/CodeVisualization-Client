import { WidgetInfoView } from "./WidgetInfoView";
import "./controlPanel.css";
import { ValueEdit } from "./ValueEdit";
import { VideoControl } from "./VideoControl";

export function ControlPanel() {
  return (
    <div className="controlPanel">
      <VideoControl></VideoControl>
      <WidgetInfoView></WidgetInfoView>
      <ValueEdit></ValueEdit>
    </div>
  );
}

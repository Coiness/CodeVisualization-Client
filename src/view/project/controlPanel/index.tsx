import { WidgetInfoView } from "./WidgetInfoView";
import "./controlPanel.css";
import { ValueEdit } from "./ValueEdit";
import { VideoControl } from "./VideoControl";
import { ApiControl } from "./APIControl";

export function ControlPanel() {
  return (
    <div className="controlPanel">
      <VideoControl></VideoControl>
      <WidgetInfoView></WidgetInfoView>
      <ValueEdit></ValueEdit>
      <ApiControl></ApiControl>
    </div>
  );
}

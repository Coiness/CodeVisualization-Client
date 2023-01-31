import { WidgetInfoView } from "./WidgetInfoView";
import "./controlPanel.css";
import { ValueEdit } from "./ValueEdit";
import { VideoControl } from "./VideoControl";
import { ApiDriver } from "../../../openAPI/driver";
import { code } from "../../../openAPI/test";

export function ControlPanel() {
  return (
    <div className="controlPanel">
      <VideoControl></VideoControl>
      <WidgetInfoView></WidgetInfoView>
      <ValueEdit></ValueEdit>
      <button
        onClick={() => {
          ApiDriver.start(code);
        }}
      >
        API
      </button>
    </div>
  );
}

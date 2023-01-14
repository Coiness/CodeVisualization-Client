import { WidgetType } from "../../../components/widget/widgets";
import { commitAction, WidgetRendererAction } from "../../../core";
import { snapshot } from "../../../store";
import "./widgetPanel.css";

export function WidgetPanel() {
  return (
    <div className="widgetPanel">
      <button
        onClick={() => {
          const action = WidgetRendererAction.create(
            snapshot.get()!.widgetManagerModel,
            {
              model: {
                id: "",
                type: WidgetType.Number,
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                color: "green",
                value: 0,
              },
            }
          );
          commitAction(action);
        }}
      >
        number
      </button>
      <button
        onClick={() => {
          console.log("DEBUG: ", "add string widget");
        }}
      >
        string
      </button>
    </div>
  );
}

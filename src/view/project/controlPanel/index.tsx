import { activeWidget, useStore } from "../../../store";
export function ControlPanel() {
  const [activeWidgetValue, setActiveWidget] = useStore(activeWidget);
  if (activeWidgetValue === null) {
    return null;
  }
  const { type, id } = activeWidgetValue;
  return (
    <div className="controlPanel">
      type: {type}
      <br />
      id: {id}
    </div>
  );
}

import { activeWidget, useStore } from "../../../store";

export function WidgetInfoView() {
  const [activeWidgetValue] = useStore(activeWidget);
  if (activeWidgetValue === null) {
    return <div>未选中元素</div>;
  }
  const { type, id } = activeWidgetValue;
  return (
    <div className="widgetInfoView">
      type: {type}
      <br />
      id: {id}
    </div>
  );
}

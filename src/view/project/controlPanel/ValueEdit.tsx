import { useEffect, useState } from "react";
import { activeWidget, useStore } from "../../../store";
export function ValueEdit() {
  const [activeWidgetValue] = useStore(activeWidget);
  const [value, setValue] = useState<any>(undefined);
  const widget = activeWidgetValue?.widget;

  useEffect(() => {
    if (!widget) {
      return;
    }
    setValue(activeWidgetValue?.widget.getValue());
    const sub = widget.value$.subscribe((v) => {
      setValue(v);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [activeWidgetValue, widget, setValue]);

  if (activeWidgetValue === null) {
    return null;
  }

  return (
    <div>
      <h1>ValueEdit</h1>
      <span>value: </span>
      <input
        type="text"
        onChange={(e) => {
          widget?.setValue(e.target.value);
        }}
        value={value as string}
      />
    </div>
  );
}

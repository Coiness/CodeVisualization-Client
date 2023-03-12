import "./valueEdit.css";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { activeWidget, useStore } from "../../../../store";
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

  function submit() {
    widget?.setValue(value);
  }

  return (
    <div className="valueEdit">
      <div className="text">当前值：</div>
      <Input.Group compact className="inputGroup">
        <Input
          className="input"
          value={value as string}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        ></Input>
        <Button className="submit" onClick={submit}>
          修改
        </Button>
      </Input.Group>
    </div>
  );
}

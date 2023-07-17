import "./index.css";
import { useCallback, useState, useEffect } from "react";
import { commitAction, WidgetActionChangeColor } from "../../../../core";
import { activeWidget, useStore } from "../../../../store";
import { SketchPicker } from "react-color";
import { Button } from "antd";
export function ColorEdit() {
  const [activeWidgetValue] = useStore(activeWidget);
  const [color, setColor] = useState<string>();
  const widget = activeWidgetValue?.widget;
  const model = widget?.getModel();

  const changeColor = useCallback(
    (color: string) => {
      if (model) {
        if (model.color === color) {
          return;
        }
        let action = WidgetActionChangeColor.create(model, color);
        commitAction(action);
      }
    },
    [model],
  );

  useEffect(() => {
    setColor(model?.color);
  }, [model]);

  const handleChange = useCallback(
    (color: any) => {
      setColor(color.hex);
    },
    [setColor],
  );

  const submit = useCallback(() => {
    if (color) {
      changeColor(color);
    }
  }, [changeColor, color]);

  if (activeWidgetValue === null || !model) {
    return null;
  }

  return (
    <div className="colorEdit">
      <div className="displayBox" style={{ backgroundColor: color }}>
        <div className="picker">
          <SketchPicker color={color} onChange={handleChange}></SketchPicker>
        </div>
      </div>
      <Button onClick={submit}>修改</Button>
    </div>
  );
}

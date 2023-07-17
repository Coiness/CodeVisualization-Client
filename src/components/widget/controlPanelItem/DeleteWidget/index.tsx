import { Button } from "antd";
import { useCallback, useEffect } from "react";
import { activeWidget, useStore } from "../../../../store";
import { commitAction, WidgetRendererActionDelete } from "../../../../core";
import { snapshot } from "../../../../store";
import { BaseModel } from "../../widgets";

export function deleteWidgetFun(model: BaseModel) {
  let action = WidgetRendererActionDelete.create(snapshot.get()!.widgetManagerModel, model);
  commitAction(action);
  activeWidget.set(null);
}

export function DeleteWidget() {
  const [activeWidgetValue] = useStore(activeWidget);
  const widget = activeWidgetValue?.widget;
  const model = widget?.getModel();

  const deleteWidget = useCallback(() => {
    if (model) {
      deleteWidgetFun(model);
    }
  }, [model]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Delete") {
        if (model) {
          deleteWidgetFun(model);
        }
      }
    }

    document.addEventListener("keyup", handler);
    return () => {
      document.removeEventListener("keyup", handler);
    };
  }, [model]);

  if (activeWidgetValue === null) {
    return null;
  }

  return (
    <div className="deleteWidget">
      <Button className="submit" onClick={deleteWidget} type="default" danger style={{ width: "100%" }}>
        删除元素
      </Button>
    </div>
  );
}

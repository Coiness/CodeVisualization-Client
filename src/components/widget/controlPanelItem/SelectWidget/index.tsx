import { Button } from "antd";
import { useEffect } from "react";
import { Subject } from "../../../../common/utils";
import { IWidget } from "../../widgets";

export let needSelectWidget = {
  v: false,
  get() {
    return this.v;
  },
  set(a: boolean) {
    this.v = a;
  },
};
export let selectWidget = new Subject<IWidget | null>();

export function SelectWidget(props: { setWidget: (widget: IWidget) => void }) {
  function select() {
    needSelectWidget.set(true);
  }

  useEffect(() => {
    let sub = selectWidget.subscribe((widget) => {
      if (widget === null) {
        return;
      }
      props.setWidget(widget);
      needSelectWidget.set(false);
    });
    return sub.unsubscribe;
  }, [props.setWidget, props]);

  return (
    <Button onClick={select} style={{ width: "100%" }}>
      选择元素
    </Button>
  );
}

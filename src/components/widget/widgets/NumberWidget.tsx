import { useEffect, useState } from "react";
import { Subject } from "../../../common/utils";
import { IWidget, WidgetModel, WidgetProps } from "./type";

type NWValue = number | null;

export interface NumberWidgetModel {
  value: NWValue;
}

type Model = NumberWidgetModel & WidgetModel;

export class NumberWidget implements IWidget {
  private value: NWValue;
  private value$: Subject<NWValue>;

  constructor() {
    this.value = null;
    this.value$ = new Subject<NWValue>();
    this.init();
  }

  init = () => {};

  setValue = (value: unknown) => {
    this.value = value as NWValue;
    this.value$.next(this.value);
  };

  getValue = () => {
    return this.value;
  };

  inc = () => {
    if (this.value !== null) {
      this.setValue(this.value + 1);
    }
  };

  dec = () => {
    if (this.value !== null) {
      this.setValue(this.value - 1);
    }
  };

  render = (props: WidgetProps) => {
    const { model } = props;
    const { x, y, width, height, color } = model as Model;
    this.value = model.value;
    const [value, setValue] = useState<NWValue>(this.value);

    useEffect(() => {
      const subscription = this.value$.subscribe((value) => {
        model.value = value;
        setValue(value);
      });
      return () => {
        subscription.unsubscribe();
      };
    }, []);

    return (
      <div
        className="widget"
        style={{ left: x, top: y, width, height, backgroundColor: color }}
      >
        {value}
      </div>
    );
  };
}

export function CreateNumberWidget() {
  const res = new NumberWidget();
  (window as any).nw = res;
  return res;
}

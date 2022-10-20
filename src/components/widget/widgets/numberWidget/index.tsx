import { useEffect, useState } from "react";
import { Subject } from "../../../../common/utils";
import { IWidget, WidgetModel, WidgetProps, WidgetRenderProps } from "../type";
import "./index.css";

type NWValue = number | null;

export interface NumberWidgetModel {
  value: NWValue;
}

type Model = NumberWidgetModel & WidgetModel;

export class NumberWidget implements IWidget {
  private value: NWValue;
  private model: Model;
  value$: Subject<NWValue>;

  constructor(model: Model) {
    this.value = model.value;
    this.value$ = new Subject<NWValue>();
    this.model = model;
    this.init();
  }

  init = () => {};

  setValue = (value: unknown) => {
    if (value !== null && isNaN(Number(value))) {
      return;
    }
    this.model.value = value as NWValue;
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
}

export function NumberWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = props.model;
  const v = widget.getValue() as NWValue;
  const [value, setValue] = useState<NWValue>(v);

  useEffect(() => {
    const subscription = widget.value$.subscribe((value) => {
      model.value = value;
      setValue(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [model, widget]);

  return <div className="numberWidget">{value}</div>;
}

export function CreateNumberWidget(model: Model) {
  const res = new NumberWidget(model);
  (window as any).nw = res;
  return res;
}

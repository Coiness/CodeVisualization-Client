import { useEffect, useState } from "react";
import { cls, Subject } from "../../../../common/utils";
import { IWidget, WidgetModel, WidgetRenderProps } from "../type";
import "./index.css";

type Value = number | null;

export interface NumberWidgetModel {
  value: Value;
}

type Model = WidgetModel & NumberWidgetModel;

export class NumberWidget implements IWidget {
  private value: Value;
  private model: Model;
  value$: Subject<Value>;

  constructor(model: Model) {
    this.value = model.value;
    this.value$ = new Subject<Value>();
    this.model = model;
    this.init();
  }

  init = () => {};

  setValue = (value: unknown) => {
    if (value !== null && isNaN(Number(value))) {
      return;
    }
    this.model.value = value as Value;
    this.value = value as Value;
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
  const v = widget.getValue() as Value;
  const [value, setValue] = useState<Value>(v);

  useEffect(() => {
    const subscription = widget.value$.subscribe((value) => {
      model.value = value;
      setValue(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [model, widget]);

  return (
    <div className={cls("numberWidget", props.className)}>number: {value}</div>
  );
}

export function CreateNumberWidget(model: WidgetModel) {
  return new NumberWidget(model as Model);
}

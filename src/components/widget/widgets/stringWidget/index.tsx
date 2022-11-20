import { useEffect, useState } from "react";
import { cls, Subject } from "../../../../common/utils";
import { xSet } from "../../../../core/undo";
import { IWidget, WidgetModel, WidgetRenderProps } from "../type";
import "./index.css";

type Value = string | null;

export interface StringWidgetModel {
  value: Value;
}

type Model = WidgetModel & StringWidgetModel;

export class StringWidget implements IWidget {
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
    // this.model.value = value as Value;
    xSet(this.model, "value", value, () => {
      this.value = this.model.value;
      this.value$.next(this.model.value);
    });
    this.value = value as Value;
    this.value$.next(this.value);
  };

  getValue = () => {
    return this.value;
  };

  reverse = () => {
    if (this.value) {
      this.setValue(this.value?.split("").reverse().join(""));
    }
  };
}

export function StringWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = props.model;
  const v = widget.getValue() as Value;
  const [value, setValue] = useState<Value>(v);

  useEffect(() => {
    const subscription = widget.value$.subscribe((value) => {
      setValue(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [model, widget]);

  return (
    <div className={cls("stringWidget", props.className)}>string: {value}</div>
  );
}

export function CreateStringWidget(model: WidgetModel) {
  return new StringWidget(model as Model);
}

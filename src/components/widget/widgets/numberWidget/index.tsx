import { useEffect, useState } from "react";
import { listenModelChange, useModelChange } from "../..";
import { cls, Subject } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { ValueAction } from "../../../../core/action/ValueAction";
import { IWidget, WidgetModel, WidgetRenderProps } from "../type";
import "./index.css";

type Value = number | null;

export interface NumberWidgetModel extends WidgetModel {
  value: Value;
}

export class NumberWidget implements IWidget {
  private value: Value;
  private model: NumberWidgetModel;
  private closeListen: () => void = () => {};
  value$: Subject<Value>;

  constructor(model: NumberWidgetModel) {
    this.value = model.value;
    this.value$ = new Subject<Value>();
    this.model = model;
    this.init();
  }

  init = () => {
    this.closeListen = listenModelChange(this.model, (m) => {
      this.model = m as NumberWidgetModel;
      this._updateValue();
    });
  };

  private _updateValue() {
    this.value = this.model.value;
    this.value$.next(this.value);
  }

  setValue = (value: unknown) => {
    const v = Number(value);
    if (v !== null && isNaN(v)) {
      return;
    }
    const action = ValueAction.create(this.model, { value: v });
    commitAction(action);
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

  // TODO 调用 destory
  destory() {
    this.closeListen();
  }
}

export function NumberWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = useModelChange(props.model);
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
  return new NumberWidget(model as NumberWidgetModel);
}

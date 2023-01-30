import { useEffect, useState } from "react";
import { listenModelChange } from "../..";
import { cls, Subject } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { ValueAction } from "../../../../core/action/ValueAction";
import { xSet } from "../../../../core/undo";
import { snapshot } from "../../../../store";
import { IWidget, WidgetModel, WidgetRenderProps } from "../type";
import { useValueWidget, ValueWidgetModel } from "../ValueWidget";
import "./index.css";

type Value = string | null;

export interface StringWidgetModel extends WidgetModel {
  value: Value;
}

export class StringWidget implements IWidget {
  private value: Value;
  private model: StringWidgetModel;
  private discard: () => void = () => {};
  private closeListen: () => void = () => {};
  value$: Subject<Value>;

  constructor(model: StringWidgetModel) {
    this.value = model.value;
    this.value$ = new Subject<Value>();
    this.model = model;
    this.init();
  }

  init = () => {
    this.closeListen = listenModelChange(this.model, (m) => {
      this.model = m as StringWidgetModel;
      this._updateValue();
    });
    let sub = snapshot.subscribe(() => {
      sub.unsubscribe();
      this.destory();
    });
  };

  setDiscard(discard: () => void) {
    this.discard = discard;
  }

  private _updateValue() {
    this.value = this.model.value;
    this.value$.next(this.value);
  }

  setValue = (value: unknown) => {
    const action = ValueAction.create(this.model, { value });
    commitAction(action);
  };

  getValue = () => {
    return this.value;
  };

  reverse = () => {
    if (this.value) {
      this.setValue(this.value?.split("").reverse().join(""));
    }
  };

  destory() {
    this.closeListen();
    this.discard();
  }
}

export function StringWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = props.model;
  const { value, dom } = useValueWidget(widget, model as ValueWidgetModel);

  return (
    <div className={cls("stringWidget", props.className)} ref={dom}>
      string: {value}
    </div>
  );
}

export function CreateStringWidget(model: WidgetModel) {
  return new StringWidget(model as StringWidgetModel);
}

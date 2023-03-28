import "./index.css";
import { listenModelChange, useModelChange } from "../..";
import { cls, Subject } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { ValueAction } from "../../../../core/action/ValueAction";
import { snapshot } from "../../../../store";
import { IncDec, ValueEdit, WidgetInfoView } from "../../controlPanelItem";
import { WidgetDefaultInfo } from "../../../../view/project/widgetPanel";
import { IWidget, WidgetModel, WidgetRenderProps, WidgetType } from "../type";
import { useValueWidget, ValueWidgetModel } from "../ValueWidget";
import { DeleteWidget } from "../../controlPanelItem/DeleteWidget";
import { ColorEdit } from "../../controlPanelItem/ColorEdit";

type Value = number | null;

export interface NumberWidgetModel extends WidgetModel {
  value: Value;
}

export const numberWidgetDefaultInfo: WidgetDefaultInfo = {
  defaultData: {
    id: "",
    type: WidgetType.Number,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: "rgb(252, 218, 255)",
    value: 0,
  },
  name: "数字",
};

export class NumberWidget implements IWidget {
  private value: Value;
  private model: NumberWidgetModel;
  private discard: () => void = () => {};
  private closeListen: () => void = () => {};
  value$: Subject<Value>;

  constructor(model: NumberWidgetModel) {
    this.value = model.value;
    this.value$ = new Subject<Value>();
    this.model = model;
    this.init();
  }

  getModel() {
    return this.model;
  }

  init = () => {
    this.closeListen = listenModelChange(this.model, (m) => {
      this.model = m as NumberWidgetModel;
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

  toStringValue() {
    return `${this.value}`;
  }

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

  destory() {
    this.closeListen();
    this.discard();
  }
}

export function NumberWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = useModelChange(props.model);
  const { value, dom } = useValueWidget(widget, model as ValueWidgetModel);

  return (
    <div className={cls("numberWidget", props.className)} ref={dom}>
      <div className="value">{value}</div>
    </div>
  );
}

export function CreateNumberWidget(model: WidgetModel) {
  return new NumberWidget(model as NumberWidgetModel);
}

export function NumberWidgetControlPanel() {
  return (
    <div className="numberControlPanel">
      <WidgetInfoView></WidgetInfoView>
      <ValueEdit></ValueEdit>
      <IncDec></IncDec>
      <ColorEdit></ColorEdit>
      <DeleteWidget></DeleteWidget>
    </div>
  );
}

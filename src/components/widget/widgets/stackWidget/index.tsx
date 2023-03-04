import { listenModelChange } from "../..";
import { cls, Subject } from "../../../../common/utils";
import { commitAction } from "../../../../core";
import { ValueAction } from "../../../../core/action/ValueAction";
import { snapshot } from "../../../../store";
import { WidgetDefaultInfo } from "../../../../view/project/widgetPanel";
import { ValueEdit, WidgetInfoView } from "../../controlPanelItem";
import { IWidget, WidgetModel, WidgetRenderProps, WidgetType } from "../type";
import { useValueWidget, ValueWidgetModel } from "../ValueWidget";
import "./index.css";

type Value = string | null;

export interface StackWidgetModel extends WidgetModel {
  value: Value;
}

export const stackWidgetDefaultInfo: WidgetDefaultInfo = {
  defaultData: {
    id: "",
    type: WidgetType.Stack,
    x: 0,
    y: 0,
    width: 100,
    height: 200,
    color: "rgb(255, 242, 213)",
    value: "",
  },
  name: "栈",
};

export class StackWidget implements IWidget {
  private value: Value;
  private model: StackWidgetModel;
  private discard: () => void = () => {};
  private closeListen: () => void = () => {};
  value$: Subject<Value>;

  constructor(model: StackWidgetModel) {
    this.value = model.value;
    this.value$ = new Subject<Value>();
    this.model = model;
    this.init();
  }

  init = () => {
    this.closeListen = listenModelChange(this.model, (m) => {
      this.model = m as StackWidgetModel;
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

export function StackWidgetRender(props: WidgetRenderProps) {
  const widget = props.widget;
  const model = props.model;
  const { value, dom } = useValueWidget(widget, model as ValueWidgetModel);

  return (
    <div className={cls("stackWidget", props.className)} ref={dom}>
      <div className="value">{value}</div>
    </div>
  );
}

export function CreateStackWidget(model: WidgetModel) {
  return new StackWidget(model as StackWidgetModel);
}

export function StackWidgetControlPanel() {
  return (
    <div className="stackControlPanel">
      <WidgetInfoView></WidgetInfoView>
      <ValueEdit></ValueEdit>
    </div>
  );
}
